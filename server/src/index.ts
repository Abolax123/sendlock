import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });

import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { db } from './lib/db';
import {
  listBanks,
  lookupBankAccount,
  getFeeQuote,
  createCustomer,
  initiateCollection,
  initiatePayout,
  refund,
  verifyWebhook,
  getBlaaizStatus,
  mock
} from './lib/blaaiz';
import { assessRisk } from './lib/risk';

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT || 4000);

const logEvent = (transferId: string, type: string, message: string) =>
  db.event.create({
    data: { transferId, type, message }
  });

// 0. Blaaiz Configuration & Connectivity Diagnostics
app.get('/api/blaaiz/status', async (_req: Request, res: Response) => {
  try {
    const status = await getBlaaizStatus();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 1. Bank listing
app.get('/api/banks', async (_req: Request, res: Response) => {
  try {
    const banks = await listBanks();
    res.json(banks);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Failed to list banks' });
  }
});

// 2. Bank account lookup (NIBSS simulation / Blaaiz resolution)
app.post('/api/banks/lookup', async (req: Request, res: Response) => {
  try {
    const { account_number, bank_id } = req.body;
    const result = await lookupBankAccount({ account_number, bank_id });
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Bank lookup failed' });
  }
});

// 3. Fee quote & FX rates
app.post('/api/quote', async (req: Request, res: Response) => {
  try {
    const { amount, from_currency = 'GBP', to_currency = 'NGN' } = req.body;
    const quote = await getFeeQuote({
      amount: Number(amount) || 100,
      from_currency,
      to_currency
    });
    res.json(quote);
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Failed to calculate quote' });
  }
});

// 4. Pre-submission Risk Evaluation
app.post('/api/risk/evaluate', async (req: Request, res: Response) => {
  try {
    const { amount, accountNumber, recipientName, accountName } = req.body;
    const history = accountNumber ? await db.transfer.count({ where: { accountNumber } }) : 0;
    const assessment = assessRisk({
      amount: Number(amount) || 0,
      history,
      recipientName,
      accountName
    });
    res.json(assessment);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 5. List all transfers
app.get('/api/transfers', async (_req: Request, res: Response) => {
  try {
    const transfers = await db.transfer.findMany({
      include: { events: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(transfers);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 6. Get single transfer by ID or publicToken
app.get('/api/transfers/:id', async (req: Request, res: Response) => {
  try {
    const t = await db.transfer.findFirst({
      where: {
        OR: [{ id: req.params.id }, { publicToken: req.params.id }]
      },
      include: { events: { orderBy: { createdAt: 'asc' } } }
    });
    if (!t) return res.status(404).json({ error: 'Transfer not found' });
    res.json(t);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 7. Get transfer details by recipient confirmation token
app.get('/api/confirm/:token', async (req: Request, res: Response) => {
  try {
    const t = await db.transfer.findUnique({
      where: { confirmToken: req.params.token },
      include: { sender: { select: { name: true, email: true } } }
    });
    if (!t) return res.status(404).json({ error: 'Invalid or expired confirmation link' });
    res.json(t);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 8. Create a new transfer / P2P escrow lock
app.post('/api/transfers', async (req: Request, res: Response) => {
  try {
    const {
      recipientName,
      recipientPhone,
      bankId,
      bankName,
      accountNumber,
      verifiedAccountName,
      sendCurrency = 'GBP',
      sendAmount
    } = req.body;

    const numAmount = Number(sendAmount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid send amount' });
    }

    const q = await getFeeQuote({
      from_currency: sendCurrency,
      to_currency: 'NGN',
      amount: numAmount
    });

    const prior = await db.transfer.count({ where: { accountNumber } });
    const risk = assessRisk({
      amount: numAmount,
      history: prior,
      recipientName,
      accountName: verifiedAccountName
    });

    const sender = await db.user.upsert({
      where: { email: 'demo@sendlock.test' },
      update: {},
      create: {
        name: 'Demo Sender',
        email: 'demo@sendlock.test',
        country: 'GB',
        blaaizCustomerId: (await createCustomer({ email: 'demo@sendlock.test' })).id
      }
    });

    // 24 hour expiry safety window
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const t = await db.transfer.create({
      data: {
        publicToken: crypto.randomUUID(),
        confirmToken: crypto.randomBytes(18).toString('hex'),
        senderId: sender.id,
        recipientName: recipientName || verifiedAccountName || 'Recipient',
        recipientPhone: recipientPhone || '+234 800 000 0000',
        bankId: bankId || '058',
        bankName: bankName || 'GTBank',
        accountNumber: accountNumber || '0123456780',
        verifiedAccountName: verifiedAccountName || recipientName || 'Verified Account',
        sendCurrency: sendCurrency.toUpperCase(),
        sendAmount: numAmount,
        receiveAmountNgn: q.recipient_gets,
        fee: q.total_fees,
        rate: q.rate,
        riskLevel: risk.level,
        status: 'AWAITING_PAYMENT',
        expiresAt
      }
    });

    await logEvent(
      t.id,
      'TRANSFER_CREATED',
      `Transfer created for ${sendCurrency} ${numAmount.toFixed(2)} → ₦${q.recipient_gets.toLocaleString()}. Awaiting Blaaiz collection.`
    );

    const collection = await initiateCollection({ amount: numAmount, currency: sendCurrency });
    await db.transfer.update({
      where: { id: t.id },
      data: { blaaizCollectionId: collection.id }
    });

    res.json({
      ...t,
      paymentUrl: collection.payment_url,
      riskChips: risk.chips,
      riskScore: risk.score
    });
  } catch (e: any) {
    console.error('Create transfer error:', e);
    res.status(400).json({ error: e.message || 'Failed to create transfer' });
  }
});

// 9. Confirm recipient & execute Blaaiz payout (via ID or direct confirmToken)
app.post('/api/transfers/:id/confirm', async (req: Request, res: Response) => {
  try {
    const t = await db.transfer.findFirst({
      where: {
        OR: [{ id: req.params.id }, { confirmToken: req.params.id }]
      }
    });

    if (!t) return res.status(404).json({ error: 'Transfer not found' });
    if (t.status === 'PAID') return res.json(t);
    if (t.status !== 'HELD') {
      return res.status(400).json({
        error: `Cannot confirm payout while status is ${t.status}. Funds must be HELD in escrow first.`
      });
    }

    const payout = await initiatePayout({
      amount: t.receiveAmountNgn,
      bank: t.bankName,
      account: t.accountNumber
    });

    const updated = await db.transfer.update({
      where: { id: t.id },
      data: {
        status: 'PAID',
        blaaizPayoutId: payout.id
      }
    });

    await logEvent(
      t.id,
      'RECIPIENT_CONFIRMED',
      `Recipient confirmed destination bank details (${t.bankName} - ${t.accountNumber}).`
    );
    await logEvent(
      t.id,
      'PAYOUT_DISPATCHED',
      `Blaaiz instant NGN payout released (Ref: ${payout.id}). ₦${t.receiveAmountNgn.toLocaleString()} settled.`
    );

    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/confirm/:token', async (req: Request, res: Response) => {
  try {
    const t = await db.transfer.findUnique({
      where: { confirmToken: req.params.token }
    });

    if (!t) return res.status(404).json({ error: 'Confirmation token not found' });
    if (t.status === 'PAID') return res.json(t);
    if (t.status !== 'HELD') {
      return res.status(400).json({
        error: `Transfer is currently in ${t.status} state. Funds must be HELD in escrow first.`
      });
    }

    const payout = await initiatePayout({
      amount: t.receiveAmountNgn,
      bank: t.bankName,
      account: t.accountNumber
    });

    const updated = await db.transfer.update({
      where: { id: t.id },
      data: {
        status: 'PAID',
        blaaizPayoutId: payout.id
      }
    });

    await logEvent(
      t.id,
      'RECIPIENT_CONFIRMED',
      `Recipient verified ${t.bankName} (${t.accountNumber}) and approved payout.`
    );
    await logEvent(
      t.id,
      'PAYOUT_DISPATCHED',
      `Blaaiz settlement completed. ₦${t.receiveAmountNgn.toLocaleString()} paid.`
    );

    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 10. Webhooks for Blaaiz collection
app.post('/api/webhooks/blaaiz/collection', async (req: Request, res: Response) => {
  const secret = process.env.BLAAIZ_WEBHOOK_SECRET || '';
  const valid = verifyWebhook(
    req.body,
    req.headers['x-blaaiz-signature'] as string,
    req.headers['x-blaaiz-timestamp'] as string,
    secret
  );
  if (!valid) return res.status(401).json({ error: 'Invalid webhook signature' });

  const id = req.body.transferId || req.body.id;
  const t = await db.transfer.findFirst({
    where: { OR: [{ id }, { blaaizCollectionId: id }] }
  });

  if (t && t.status === 'AWAITING_PAYMENT') {
    await db.transfer.update({
      where: { id: t.id },
      data: { status: 'HELD' }
    });
    await logEvent(
      t.id,
      'FUNDS_HELD_IN_ESCROW',
      'Blaaiz collection confirmed. Funds safely locked in smart escrow pending recipient approval.'
    );
  }
  res.json({ ok: true });
});

// 11. Webhooks for Blaaiz payout
app.post('/api/webhooks/blaaiz/payout', async (req: Request, res: Response) => {
  const t = await db.transfer.findUnique({
    where: { id: req.body.transferId }
  });
  if (t && t.status !== 'PAID') {
    await db.transfer.update({
      where: { id: t.id },
      data: { status: 'PAID' }
    });
    await logEvent(t.id, 'PAYOUT_SETTLED', 'Blaaiz payout network confirmed final settlement.');
  }
  res.json({ ok: true });
});

// 12. Simulate payment (moves AWAITING_PAYMENT -> HELD)
app.post('/api/demo/pay/:id', async (req: Request, res: Response) => {
  try {
    const t = await db.transfer.findUnique({ where: { id: req.params.id } });
    if (!t) return res.status(404).json({ error: 'Transfer not found' });
    if (t.status === 'AWAITING_PAYMENT') {
      const updated = await db.transfer.update({
        where: { id: t.id },
        data: { status: 'HELD' }
      });
      await logEvent(
        t.id,
        'FUNDS_HELD_IN_ESCROW',
        'Payment simulated via Blaaiz sandbox. Funds locked safely in escrow.'
      );
      return res.json(updated);
    }
    res.json(t);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 13. On-demand refund for a specific transfer (great for demo testing)
app.post('/api/transfers/:id/refund', async (req: Request, res: Response) => {
  try {
    const t = await db.transfer.findUnique({ where: { id: req.params.id } });
    if (!t) return res.status(404).json({ error: 'Transfer not found' });
    if (t.status === 'PAID') {
      return res.status(400).json({ error: 'Cannot refund an already paid transfer' });
    }

    const updated = await db.transfer.update({
      where: { id: t.id },
      data: { status: 'REFUNDED' }
    });
    await refund(t.blaaizCollectionId || t.id);
    await logEvent(
      t.id,
      'REFUNDED',
      `Escrow protection activated. 100% of ${t.sendCurrency} ${t.sendAmount.toFixed(2)} returned to sender.`
    );
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 14. Cron expire runner
app.post('/api/cron/expire', async (_req: Request, res: Response) => {
  try {
    const ts = await db.transfer.findMany({
      where: {
        status: 'HELD',
        expiresAt: { lt: new Date() }
      }
    });

    for (const t of ts) {
      await db.transfer.update({
        where: { id: t.id },
        data: { status: 'REFUNDED' }
      });
      await refund(t.blaaizCollectionId || t.id);
      await logEvent(
        t.id,
        'REFUNDED',
        'Confirmation window expired without recipient approval. Sender funds refunded in full.'
      );
    }
    res.json({ expired: ts.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 15. P2P Marketplace Orders (offers for P2P trading radar)
app.get('/api/p2p/offers', async (_req: Request, res: Response) => {
  const p2pOffers = [
    {
      id: 'p2p_01',
      trader: 'Damilola FX (Pro Peer)',
      rating: '99.6%',
      trades: 412,
      sendCurrency: 'GBP',
      receiveCurrency: 'NGN',
      rate: 1985,
      minLimit: 50,
      maxLimit: 2500,
      bank: 'GTBank / Access',
      escrowState: 'VERIFIED_ESCROW',
      speed: 'Instant (~45s)'
    },
    {
      id: 'p2p_02',
      trader: 'Ilorin Liquidity Desk',
      rating: '100%',
      trades: 890,
      sendCurrency: 'USD',
      receiveCurrency: 'NGN',
      rate: 1565,
      minLimit: 100,
      maxLimit: 5000,
      bank: 'Zenith / Kuda',
      escrowState: 'VERIFIED_ESCROW',
      speed: '< 2 mins'
    },
    {
      id: 'p2p_03',
      trader: 'Global Diaspora Escrow',
      rating: '98.9%',
      trades: 260,
      sendCurrency: 'EUR',
      receiveCurrency: 'NGN',
      rate: 1745,
      minLimit: 80,
      maxLimit: 3000,
      bank: 'UBA / Moniepoint',
      escrowState: 'VERIFIED_ESCROW',
      speed: '~1 min'
    },
    {
      id: 'p2p_04',
      trader: 'Tether Stable Settlement',
      rating: '99.9%',
      trades: 1240,
      sendCurrency: 'USDT',
      receiveCurrency: 'NGN',
      rate: 1590,
      minLimit: 20,
      maxLimit: 10000,
      bank: 'All Nigerian Banks',
      escrowState: 'VERIFIED_ESCROW',
      speed: 'Instant (~30s)'
    },
    {
      id: 'p2p_05',
      trader: 'Maple Leaf P2P (CAD)',
      rating: '99.2%',
      trades: 184,
      sendCurrency: 'CAD',
      receiveCurrency: 'NGN',
      rate: 1145,
      minLimit: 100,
      maxLimit: 4000,
      bank: 'First Bank / GTB',
      escrowState: 'VERIFIED_ESCROW',
      speed: '< 3 mins'
    }
  ];
  res.json(p2pOffers);
});

app.listen(port, () => {
  console.log(`⚡ Sendlock API running on http://localhost:${port} ${mock ? '(MOCK_MODE)' : ''}`);
});
