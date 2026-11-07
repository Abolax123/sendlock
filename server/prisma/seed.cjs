const dotenv = require('dotenv');
dotenv.config({ path: 'server/.env' });
const { PrismaClient } = require('@prisma/client');
const crypto = require('node:crypto');
const p = new PrismaClient();

const mockRecipients = [
  { name: 'Tunde Adeyemi', phone: '+234 803 123 4567', bank: 'Guaranty Trust Bank (GTBank)', code: '058', acc: '0123456780' },
  { name: 'Bisi Okafor', phone: '+234 802 987 6543', bank: 'Access Bank', code: '044', acc: '0123456781' },
  { name: 'Amaka Nwosu', phone: '+234 814 555 1212', bank: 'Zenith Bank', code: '057', acc: '0123456782' },
  { name: 'Chidi Eze', phone: '+234 701 444 3322', bank: 'United Bank for Africa (UBA)', code: '033', acc: '0123456783' },
  { name: 'Sade Bello', phone: '+234 805 777 8899', bank: 'Kuda Bank', code: '50211', acc: '0123456784' },
  { name: 'Ifeoma Obi', phone: '+234 908 666 4433', bank: 'Moniepoint MFB', code: '50515', acc: '0123456785' },
  { name: 'Kunle Adebayo', phone: '+234 809 333 2211', bank: 'First Bank of Nigeria', code: '011', acc: '0123456786' },
  { name: 'Emeka Umeh', phone: '+234 813 222 1100', bank: 'OPay Digital Services', code: '999992', acc: '0123456787' }
];

async function main() {
  console.log('Seeding Sendlock database...');
  await p.event.deleteMany();
  await p.transfer.deleteMany();
  await p.user.deleteMany();

  const user = await p.user.create({
    data: {
      name: 'Demo Sender',
      email: 'demo@sendlock.test',
      country: 'GB',
      blaaizCustomerId: 'blaaiz_cus_demo_ilorin'
    }
  });

  const sampleTransfers = [
    {
      idx: 0,
      currency: 'GBP',
      amount: 100,
      rate: 1980,
      status: 'HELD',
      risk: 'SAFE',
      desc: 'Family Support - Locked in Escrow'
    },
    {
      idx: 1,
      currency: 'USD',
      amount: 450,
      rate: 1560,
      status: 'PAID',
      risk: 'SAFE',
      desc: 'Freelance Design Payout'
    },
    {
      idx: 2,
      currency: 'GBP',
      amount: 250,
      rate: 1980,
      status: 'AWAITING_PAYMENT',
      risk: 'SAFE',
      desc: 'Tuition Remittance'
    },
    {
      idx: 3,
      currency: 'EUR',
      amount: 320,
      rate: 1740,
      status: 'PAID',
      risk: 'SAFE',
      desc: 'Remote Developer Settle'
    },
    {
      idx: 4,
      currency: 'USDT',
      amount: 500,
      rate: 1585,
      status: 'HELD',
      risk: 'SAFE',
      desc: 'P2P Liquidity Escrow'
    },
    {
      idx: 5,
      currency: 'GBP',
      amount: 80,
      rate: 1980,
      status: 'REFUNDED',
      risk: 'REVIEW',
      desc: 'Unconfirmed Transfer - Safely Refunded'
    },
    {
      idx: 6,
      currency: 'USD',
      amount: 1200,
      rate: 1560,
      status: 'PAID',
      risk: 'SAFE',
      desc: 'Equipment Purchase Escrow'
    },
    {
      idx: 7,
      currency: 'CAD',
      amount: 350,
      rate: 1140,
      status: 'HELD',
      risk: 'SAFE',
      desc: 'Relocation Settling Funds'
    }
  ];

  for (const item of sampleTransfers) {
    const r = mockRecipients[item.idx % mockRecipients.length];
    const fee = Math.max(1.2, Number((item.amount * 0.015).toFixed(2)));
    const receiveNgn = Math.round((item.amount - fee) * item.rate);

    const t = await p.transfer.create({
      data: {
        publicToken: crypto.randomUUID(),
        confirmToken: crypto.randomBytes(18).toString('hex'),
        senderId: user.id,
        recipientName: r.name,
        recipientPhone: r.phone,
        bankId: r.code,
        bankName: r.bank,
        accountNumber: r.acc,
        verifiedAccountName: r.name,
        sendCurrency: item.currency,
        sendAmount: item.amount,
        receiveAmountNgn: receiveNgn,
        fee,
        rate: item.rate,
        riskLevel: item.risk,
        status: item.status,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    await p.event.create({
      data: {
        transferId: t.id,
        type: 'TRANSFER_CREATED',
        message: `Transfer created: ${item.currency} ${item.amount} → ₦${receiveNgn.toLocaleString()} for ${r.name}.`
      }
    });

    if (item.status === 'HELD' || item.status === 'PAID') {
      await p.event.create({
        data: {
          transferId: t.id,
          type: 'FUNDS_HELD_IN_ESCROW',
          message: 'Blaaiz collection confirmed. Funds safely held in escrow pending recipient confirmation.'
        }
      });
    }

    if (item.status === 'PAID') {
      await p.event.create({
        data: {
          transferId: t.id,
          type: 'RECIPIENT_CONFIRMED',
          message: `Recipient verified bank account details (${r.bank} · ${r.acc}) and approved release.`
        }
      });
      await p.event.create({
        data: {
          transferId: t.id,
          type: 'PAYOUT_DISPATCHED',
          message: `Instant Blaaiz NGN payout completed. ₦${receiveNgn.toLocaleString()} settled.`
        }
      });
    }

    if (item.status === 'REFUNDED') {
      await p.event.create({
        data: {
          transferId: t.id,
          type: 'REFUNDED',
          message: 'Recipient approval window expired. Escrow funds refunded 100% back to sender.'
        }
      });
    }
  }

  console.log('Seeded demo transfers with full audit trails.');
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
