import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  useParams,
  Link,
  Routes,
  Route
} from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users,
  WalletCards,
  Zap
} from 'lucide-react';
import './styles.css';

// API Helper
const api = async (path: string, opts?: RequestInit) => {
  const r = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return r.json();
};

// Global Toast System
let showToastFn: ((msg: string) => void) | null = null;
export const triggerToast = (msg: string) => {
  if (showToastFn) showToastFn(msg);
};

function ToastContainer() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    showToastFn = (m: string) => {
      setMsg(m);
      setTimeout(() => setMsg(null), 3000);
    };
    return () => {
      showToastFn = null;
    };
  }, []);
  return <div className={`toast ${msg ? 'is-open' : ''}`}>{msg}</div>;
}

// Top FX Ticker Bar
function TickerBar() {
  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        <span className="dot dot--lime" style={{ marginRight: -18 }} />
        <span className="mono" style={{ color: 'var(--lime)', fontWeight: 600 }}>
          BLAAIZ SANDBOX
        </span>
        <span>
          GBP/NGN <b>1,980.00</b> <em>+1.2%</em>
        </span>
        <span>
          USD/NGN <b>1,560.00</b> <em>+0.8%</em>
        </span>
        <span>
          EUR/NGN <b>1,740.00</b> <em>+0.5%</em>
        </span>
        <span>
          USDT/NGN <b>1,585.00</b> <em>+0.3%</em>
        </span>
        <span>
          CAD/NGN <b>1,140.00</b> <em>+0.4%</em>
        </span>
        <span>
          24H PROTECTED: <b>₦2.48B</b>
        </span>
      </div>
      <div className="ticker-right">
        <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={14} color="var(--lime)" /> Safe by design
        </span>
      </div>
    </div>
  );
}

// Navigation Bar
function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link to="/" className="logo">
          <span className="logo__mark">↗</span>
          <span className="logo__word">SENDLOCK</span>
          <span className="logo__lab">P2P</span>
        </Link>

        <div className="nav__links">
          {isHome ? (
            <>
              <a href="#forge" className="nav__link">
                Escrow Forge
              </a>
              <a href="#radar" className="nav__link">
                P2P Radar
              </a>
              <a href="#how" className="nav__link">
                How It Works
              </a>
              <a href="#safety" className="nav__link">
                Trust Layer
              </a>
              <a href="#compare" className="nav__link">
                Comparison
              </a>
              <a href="#faq" className="nav__link">
                FAQ
              </a>
            </>
          ) : (
            <>
              <Link to="/" className="nav__link">
                Home
              </Link>
              <Link
                to="/send"
                className={`nav__link ${location.pathname === '/send' ? 'active' : ''}`}
              >
                Send Money
              </Link>
            </>
          )}
          <Link
            to="/dashboard"
            className={`nav__link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </div>

        <div className="nav__right">
          <Link to="/send" className="btn btn--sm btn--primary">
            Launch App <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Layout Wrapper
function Layout({ children }: { children: React.ReactNode }) {
  // Spotlight mouse effect
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <>
      <div className="grain" />
      <div className="spotlight" />
      <TickerBar />
      <Navbar />
      {children}
      <Footer />
      <ToastContainer />
    </>
  );
}

// FOOTER
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="logo">
              <span className="logo__mark">↗</span>
              <span className="logo__word">SENDLOCK</span>
              <span className="logo__lab">LAB</span>
            </Link>
            <p>
              Trustless cross-border P2P escrow protocol built on Blaaiz infrastructure. Funds are
              held in multi-currency vaults and released only upon verified destination
              confirmation.
            </p>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h4>Protocol</h4>
              <Link to="/send">Send Money</Link>
              <a href="#forge">Escrow Simulator</a>
              <a href="#radar">P2P Radar</a>
              <Link to="/dashboard">Control Room</Link>
            </div>
            <div className="footer__col">
              <h4>Infrastructure</h4>
              <a href="https://docs.blaaiz.com" target="_blank" rel="noreferrer">
                Blaaiz API Docs
              </a>
              <a href="https://docs.blaaiz.com/docs/guides/use-cases/cross-border-remittances" target="_blank" rel="noreferrer">
                Cross-Border Rails
              </a>
              <a href="#safety">Trust Engine</a>
              <a href="#faq">Refund Guarantee</a>
            </div>
            <div className="footer__col">
              <h4>Hackathon</h4>
              <a href="https://gdg.community.dev" target="_blank" rel="noreferrer">
                GDG Ilorin
              </a>
              <a href="#compare">DevFest 2026</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub Repo
              </a>
              <span className="mono" style={{ fontSize: 11, color: 'var(--lime)' }}>
                ● Blaaiz Buildathon
              </span>
            </div>
          </div>
        </div>

        <div className="footer__word">SENDLOCK</div>

        <div className="footer__bottom">
          <span>Built with Blaaiz API for the GDG Ilorin Blaaiz Buildathon. Safe by design.</span>
          <a href="#" className="mono" style={{ color: 'var(--muted)' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

// -------------------------------------------------------------
// LANDING PAGE SECTIONS
// -------------------------------------------------------------

function Landing() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <ForgeSection />
      <RadarSection />
      <HowItWorksSection />
      <TrustSection />
      <CompareSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}

// 1. HERO SECTION
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__ambient" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <div className="chip">
            <span className="chip__tag">BLAAIZ BUILDATHON 2026</span>
            <span>GDG Ilorin · Cross-Border P2P Track</span>
          </div>

          <h1 className="hero__title">
            Cross-border P2P,
            <br />
            without the <span className="serif">counterparty risk.</span>
            <br />
            <span className="gradient-text">Safe by design.</span>
          </h1>

          <p className="hero__sub">
            Move money home safely across 180+ countries. Pay through Blaaiz, hold funds in smart
            escrow, verify destination bank records with real-time NIBSS lookup, and release the NGN
            payout only after recipient confirmation.
          </p>

          <div className="hero__cta">
            <Link to="/send" className="btn btn--lg btn--primary">
              Start P2P Escrow <ArrowUpRight size={17} />
            </Link>
            <a href="#forge" className="btn btn--lg btn--ghost">
              Interactive Simulator ↓
            </a>
          </div>

          <div className="hero__meta">
            <div>
              <b>₦2.4B+</b>
              <span>Protected volume</span>
            </div>
            <div>
              <b>180+</b>
              <span>Settled countries</span>
            </div>
            <div>
              <b>0.00%</b>
              <span>Wrong-account loss</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="orbit orbit--1" />
          <div className="orbit orbit--2" />

          {/* Glowing Terminal Monitor */}
          <div className="terminal">
            <div className="terminal__bar">
              <div className="terminal__dots">
                <i />
                <i />
                <i />
              </div>
              <span className="terminal__title">sendlock://p2p-escrow-core · LIVE</span>
              <span className="tag tag--lime">SANDBOX</span>
            </div>

            <div className="terminal__body">
              <div className="terminal__route">
                <div>
                  <small>ORIGIN CORRIDOR</small>
                  <b>🇬🇧 United Kingdom</b>
                </div>
                <ArrowUpRight size={18} color="var(--lime)" />
                <div style={{ textAlign: 'right' }}>
                  <small>DESTINATION</small>
                  <b>🇳🇬 Nigeria (NGN)</b>
                </div>
              </div>

              <div className="terminal__amount">
                <small>RECIPIENT RECEIVES (GUARANTEED)</small>
                <h3>₦990,000</h3>
                <span>GBP 500.00 · Locked at 1,980.00 NGN</span>
              </div>

              <div className="terminal__pipeline">
                <div className="terminal__step">
                  <small>BLAAIZ VAULT</small>
                  <b>HELD</b>
                </div>
                <div className="terminal__line" />
                <div className="terminal__step">
                  <small>RECIPIENT</small>
                  <b style={{ color: 'var(--mint)' }}>CONFIRMING</b>
                </div>
                <div className="terminal__line muted-line" />
                <div className="terminal__step">
                  <small>NGN PAYOUT</small>
                  <b style={{ color: 'var(--muted)' }}>LOCKED</b>
                </div>
              </div>
            </div>

            <div className="terminal__foot">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="dot dot--lime" /> Funds secured in smart escrow
              </span>
              <span>23:59:12 remaining</span>
            </div>
          </div>

          {/* Floating Glass Badges */}
          <div className="float-card float-card--a">
            <ShieldCheck size={20} />
            <div>
              <b>Verified Destination</b>
              <small>GTBank · Tunde Adeyemi</small>
            </div>
          </div>

          <div className="float-card float-card--b">
            <LockKeyhole size={19} />
            <div>
              <b>Blaaiz Escrow Active</b>
              <small>Zero wrong-account guarantee</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. STATS STRIP
function StatsSection() {
  return (
    <section className="stats-strip">
      <div className="container">
        <div className="stats__grid">
          <div className="stat">
            <div className="stat__num">
              ₦2.48<span>B+</span>
            </div>
            <div className="stat__label">Cross-border volume protected</div>
          </div>
          <div className="stat">
            <div className="stat__num">
              180<span>+</span>
            </div>
            <div className="stat__label">Global Blaaiz payout destinations</div>
          </div>
          <div className="stat">
            <div className="stat__num">
              0.00<span>%</span>
            </div>
            <div className="stat__label">Wrong-account fund losses</div>
          </div>
          <div className="stat">
            <div className="stat__num">
              1.4<span>s</span>
            </div>
            <div className="stat__label">Real-time account resolution</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. THE ESCROW FORGE (P2P CALCULATOR & SIMULATOR)
function ForgeSection() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('GBP');
  const [amount, setAmount] = useState('250');
  const [bankId, setBankId] = useState('058');
  const [accountNumber, setAccountNumber] = useState('0123456780');
  const [recipientName, setRecipientName] = useState('Tunde Adeyemi');
  const [banks, setBanks] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [lookup, setLookup] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api('/banks').then(setBanks).catch(() => {});
  }, []);

  useEffect(() => {
    const num = Number(amount);
    if (num > 0) {
      api('/quote', {
        method: 'POST',
        body: JSON.stringify({ amount: num, from_currency: currency })
      })
        .then(setQuote)
        .catch(() => {});
    }
  }, [amount, currency]);

  useEffect(() => {
    if (accountNumber.length >= 8 && bankId) {
      api('/banks/lookup', {
        method: 'POST',
        body: JSON.stringify({ account_number: accountNumber, bank_id: bankId })
      })
        .then(setLookup)
        .catch(() => {});
    } else {
      setLookup(null);
    }
  }, [accountNumber, bankId]);

  const handleLaunch = () => {
    setLoading(true);
    navigate(
      `/send?currency=${currency}&amount=${amount}&acc=${accountNumber}&bank=${bankId}&name=${encodeURIComponent(
        recipientName
      )}`
    );
  };

  return (
    <section id="forge" className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">
            <Sparkles size={13} /> ESCROW SIMULATOR
          </span>
          <h2>
            The Escrow Forge. <span className="serif">Try the math.</span>
          </h2>
          <p>
            Experience how Sendlock verifies recipient banking records in real-time and locks the
            exchange rate before a single penny moves.
          </p>
        </div>

        <div className="forge">
          <div className="forge-main">
            <div className="field">
              <div className="field__label">
                <span>You Send (Multi-Currency)</span>
                <span className="mono">BLAAIZ CORRIDOR</span>
              </div>
              <div className="amount-input-box">
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USDT">USDT (₮)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>

            <div className="forge-quote-strip">
              <div>
                <small>RECIPIENT RECEIVES</small>
                <strong>₦{quote ? quote.recipient_gets.toLocaleString() : '—'}</strong>
              </div>
              <div>
                <small>BLAAIZ FX RATE</small>
                <b>1 {currency} = ₦{quote ? quote.rate.toLocaleString() : '1,980'}</b>
              </div>
              <div>
                <small>NETWORK FEE</small>
                <b>{quote ? quote.total_fees.toFixed(2) : '1.50'} {currency}</b>
              </div>
            </div>

            <div className="field">
              <div className="field__label">
                <span>Destination Bank</span>
                <span className="mono">NIGERIA RAILS</span>
              </div>
              <select value={bankId} onChange={(e) => setBankId(e.target.value)}>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <div className="field__label">
                <span>10-Digit NUBAN Account Number</span>
                <span className="mono">INSTANT RESOLUTION</span>
              </div>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 0123456780"
              />
              {lookup?.account_name && (
                <div className="verified-badge">
                  <Check size={14} />
                  <span>
                    Verified Bank Record: <b>{lookup.account_name}</b> ({lookup.bank_name})
                  </span>
                </div>
              )}
            </div>

            <div className="field">
              <div className="field__label">
                <span>Recipient Name</span>
              </div>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Full name as recognized by recipient"
              />
              {lookup?.account_name &&
                recipientName &&
                !lookup.account_name.toLowerCase().includes(recipientName.toLowerCase().split(' ')[0]) && (
                  <div className="warning-badge">
                    <TriangleAlert size={14} />
                    <span>
                      Notice: Account name ({lookup.account_name}) differs from entered name. Review
                      flag will be visible on the transfer timeline.
                    </span>
                  </div>
                )}
            </div>

            <button
              onClick={handleLaunch}
              className="btn btn--primary btn--block btn--lg"
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              Lock & Escrow Transfer <ArrowUpRight size={17} />
            </button>
          </div>

          <aside className="forge-side">
            <span className="tag tag--lime" style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
              SAFETY GUARANTEE
            </span>
            <h4>Hold-Until-Confirmation</h4>
            <p>
              Your money is never sent blind. Blaaiz collects and safely vaults your deposit. The
              local NGN payout is dispatched only when the recipient confirms on their phone.
            </p>

            <div className="forge-perk">
              <ShieldCheck size={18} />
              <div>
                <b>Zero Wrong Accounts</b>
                <small>Bank record is verified before funds can be locked.</small>
              </div>
            </div>

            <div className="forge-perk">
              <Clock3 size={18} />
              <div>
                <b>24h Auto-Refund Window</b>
                <small>If recipient fails to confirm, 100% of your money returns.</small>
              </div>
            </div>

            <div className="forge-perk">
              <Zap size={18} />
              <div>
                <b>Sub-Second Blaaiz Settlement</b>
                <small>Once confirmed, local payout arrives in under 30 seconds.</small>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// 4. LIVE P2P RADAR / ORDERBOOK
function RadarSection() {
  const [filter, setFilter] = useState('ALL');
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    api('/p2p/offers').then(setOffers).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return offers;
    return offers.filter((o) => o.sendCurrency === filter);
  }, [offers, filter]);

  return (
    <section id="radar" className="section" style={{ paddingTop: 20 }}>
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">
            <Users size={13} /> P2P LIQUIDITY RADAR
          </span>
          <h2>
            Verified P2P Orderbook. <span className="serif">Zero counterparty risk.</span>
          </h2>
          <p>
            Browse live peer trade listings across major currencies. Every transaction is guarded
            by Sendlock's smart multi-currency escrow.
          </p>
        </div>

        <div className="radar-card">
          <div className="radar-tabs">
            {['ALL', 'GBP', 'USD', 'EUR', 'USDT', 'CAD'].map((c) => (
              <button
                key={c}
                className={`radar-tab ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c === 'ALL' ? 'All Corridors' : `${c} / NGN`}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="radar-table">
              <thead>
                <tr>
                  <th>VERIFIED PEER</th>
                  <th>CORRIDOR & RATE</th>
                  <th>LIMITS</th>
                  <th>SETTLEMENT RAILS</th>
                  <th>ESCROW STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="trader-name">
                        <span>{item.trader}</span>
                        <ShieldCheck size={14} color="var(--lime)" />
                      </div>
                      <div className="trader-sub">
                        {item.trades} trades · {item.rating} completion
                      </div>
                    </td>
                    <td>
                      <div className="rate-num">₦{item.rate.toLocaleString()}</div>
                      <div className="trader-sub">
                        {item.sendCurrency} → {item.receiveCurrency}
                      </div>
                    </td>
                    <td>
                      <span className="mono" style={{ color: 'var(--text)' }}>
                        {item.sendCurrency} {item.minLimit} – {item.maxLimit.toLocaleString()}
                      </span>
                      <div className="trader-sub">{item.speed}</div>
                    </td>
                    <td>
                      <span className="pill" style={{ height: 26, fontSize: 11 }}>
                        {item.bank}
                      </span>
                    </td>
                    <td>
                      <span className="tag tag--lime">HELD BY BLAAIZ</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/send?currency=${item.sendCurrency}&amount=${item.minLimit}`}
                        className="btn btn--sm btn--primary"
                      >
                        Trade <ArrowUpRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. HOW IT WORKS BENTO PIPELINE
function HowItWorksSection() {
  const steps = [
    {
      num: '01 / LOCK',
      title: 'Lock in Blaaiz Escrow',
      desc: 'Sender funds the transfer via Blaaiz virtual collection rails. Funds become safely HELD in smart escrow instead of moving blind.'
    },
    {
      num: '02 / VERIFY',
      title: 'Real-Time Bank Lookup',
      desc: 'Our engine resolves the Nigerian NUBAN bank account with NIBSS in 1.4s, checking for name similarity and high-risk flags.'
    },
    {
      num: '03 / APPROVE',
      title: 'Cryptographic Recipient Link',
      desc: 'The recipient receives a private phone link to review their verified destination account. Payout is blocked until approved.'
    },
    {
      num: '04 / SETTLE',
      title: 'Instant Payout or 100% Refund',
      desc: 'Once confirmed, Blaaiz executes the automated local NGN payout. If unconfirmed within the window, funds return to the sender.'
    }
  ];

  return (
    <section id="how" className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">
            <LockKeyhole size={13} /> HOW IT WORKS
          </span>
          <h2>
            Four steps to <span className="serif">absolute peace of mind.</span>
          </h2>
          <p>
            Traditional remittances send first and hope for the best. Sendlock verifies and secures
            the moment before payout.
          </p>
        </div>

        <div className="pipeline-grid">
          {steps.map((s) => (
            <div key={s.num} className="pipe-step">
              <span className="pipe-step__num">{s.num}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. TRUST & SAFETY LAYER (BENTO)
function TrustSection() {
  return (
    <section id="safety" className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">
            <ShieldCheck size={13} /> TRUST SENTINEL
          </span>
          <h2>
            AI can write the code. <span className="serif">Can you trust the transfer?</span>
          </h2>
          <p>
            Inspired by DevFest Ilorin's keynote, Sendlock introduces deterministic verification and
            plain-language risk intelligence for cross-border money movement.
          </p>
        </div>

        <div className="bento">
          <div className="bento-card bento-card--wide">
            <div className="bento-icon">
              <ShieldAlert size={22} />
            </div>
            <h3>Name-Mismatch Sentinel</h3>
            <p>
              When senders enter “Tunde Adeyemi” but the account resolves to someone else, Sendlock
              flags the anomaly immediately with plain-language risk alerts. No blind transfers to
              unintended third-party accounts.
            </p>
          </div>

          <div className="bento-card">
            <div className="bento-icon">
              <Clock3 size={22} />
            </div>
            <h3>Automated 24h Expiry</h3>
            <p>
              Funds do not get stuck in limbo. An automated countdown ensures that if the recipient
              does not approve, 100% of the funds return to the sender's account.
            </p>
          </div>

          <div className="bento-card">
            <div className="bento-icon">
              <WalletCards size={22} />
            </div>
            <h3>Multi-Currency Blaaiz Rails</h3>
            <p>
              Native infrastructure support for GBP, USD, EUR, CAD, and stablecoins (USDT/USDC)
              settling into Nigerian banks across 180+ global corridors.
            </p>
          </div>

          <div className="bento-card bento-card--wide">
            <div className="bento-icon">
              <LockKeyhole size={22} />
            </div>
            <h3>Zero-Trust Recipient Approval</h3>
            <p>
              The recipient must click a cryptographic confirmation link on their phone, visually
              verifying the bank name and account number before Blaaiz dispatches the payout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. COMPARISON SECTION
function CompareSection() {
  const rows = [
    {
      feature: 'Pre-flight bank account name resolution',
      sendlock: 'Instant (1.4s via NIBSS)',
      wire: 'None (Blind wire)',
      p2p: 'Manual screenshot'
    },
    {
      feature: 'Funds held in smart escrow before payout',
      sendlock: 'Held by default in Blaaiz',
      wire: 'Directly debited',
      p2p: 'Manual counterparty'
    },
    {
      feature: 'Recipient verifies account before release',
      sendlock: 'Cryptographic link required',
      wire: 'Impossible',
      p2p: 'No verification'
    },
    {
      feature: 'Automatic 100% refund upon expiry',
      sendlock: 'Guaranteed 24h window',
      wire: 'Months of bank dispute',
      p2p: 'High scam risk'
    },
    {
      feature: 'Real-time timeline & webhook audit',
      sendlock: 'Full live audit trail',
      wire: 'Opaque SWIFT tracking',
      p2p: 'Chat screenshots'
    }
  ];

  return (
    <section id="compare" className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">
            <Zap size={13} /> THE PROTOCOL ADVANTAGE
          </span>
          <h2>
            Why Sendlock <span className="serif">wins on safety.</span>
          </h2>
          <p>
            Comparing Sendlock’s hold-until-confirmation architecture against traditional remittance
            wires and unregulated P2P marketplaces.
          </p>
        </div>

        <div className="compare-box">
          <div className="compare-row compare-row--head">
            <div>FEATURE / CAPABILITY</div>
            <div className="compare-highlight">SENDLOCK P2P</div>
            <div>BANK WIRE (SWIFT)</div>
            <div>INFORMAL P2P</div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="compare-row">
              <div>{r.feature}</div>
              <div className="check-yes">
                <Check size={14} color="var(--mint)" /> {r.sendlock}
              </div>
              <div className="check-no">{r.wire}</div>
              <div className="check-no">{r.p2p}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 8. INTERACTIVE FAQ ACCORDION
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Sendlock prevent sending money to the wrong account?',
      a: 'Sendlock integrates directly with Nigerian bank databases via Blaaiz. The moment you enter a 10-digit account number, we resolve the official registered name. Furthermore, the transfer is held in escrow until the recipient opens their confirmation link and explicitly approves the destination.'
    },
    {
      q: 'What happens if the recipient does not confirm?',
      a: 'Every transfer comes with an automated 24-hour safety window. If the recipient does not approve the payout within that time, the transfer expires and the sender can trigger an automated 100% refund back to their account via Blaaiz.'
    },
    {
      q: 'How is Blaaiz infrastructure used in Sendlock?',
      a: 'Blaaiz powers the multi-currency collection, real-time FX conversion quotes, virtual accounts, and instant local NGN banking payouts across 180+ countries.'
    },
    {
      q: 'Can I use this for P2P trading as well as personal remittances?',
      a: 'Yes! Sendlock supports both direct peer-to-peer transfers (sending money home to family) and P2P orderbook settlements where traders exchange currencies with zero counterparty risk.'
    },
    {
      q: 'Is Sendlock live or in sandbox mode?',
      a: 'This demo is fully functional on the Blaaiz Dev sandbox (and local mock mode). You can simulate collections, payouts, recipient confirmations, and refunds end-to-end.'
    }
  ];

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">
            <ExternalLink size={13} /> FREQUENTLY ASKED
          </span>
          <h2>
            Answers to common <span className="serif">questions.</span>
          </h2>
          <p>Everything you need to know about Sendlock’s trustless cross-border escrow protocol.</p>
        </div>

        <div className="faq-grid">
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? 'is-open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                    color: open === i ? 'var(--lime)' : 'var(--muted)'
                  }}
                />
              </button>
              {open === i && <div className="faq-answer">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 9. GRAND CTA SECTION
function CtaSection() {
  return (
    <section className="container">
      <div className="cta-banner">
        <h2>
          Ready to move money with
          <br />
          <span className="serif gradient-text">zero counterparty risk?</span>
        </h2>
        <p>
          Experience the safest way to send money home or execute cross-border P2P trades on Blaaiz
          infrastructure.
        </p>
        <Link to="/send" className="btn btn--lg btn--primary">
          Start a Protected Transfer <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SEND / CREATE TRANSFER PAGE
// -------------------------------------------------------------

function Send() {
  const navigate = useNavigate();
  const location = useLocation();

  const [banks, setBanks] = useState<any[]>([]);
  const [form, setForm] = useState({
    sendAmount: '100',
    sendCurrency: 'GBP',
    recipientName: '',
    recipientPhone: '',
    bankId: '058',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: ''
  });
  const [quote, setQuote] = useState<any>(null);
  const [lookup, setLookup] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [blaaizStatus, setBlaaizStatus] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/blaaiz/status').then(setBlaaizStatus).catch(() => {});
  }, []);

  // Parse URL query params if prefilled from Forge or Radar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const curr = params.get('currency');
    const amt = params.get('amount');
    const acc = params.get('acc');
    const bId = params.get('bank');
    const name = params.get('name');

    if (curr || amt || acc || bId || name) {
      setForm((prev) => ({
        ...prev,
        sendCurrency: curr || prev.sendCurrency,
        sendAmount: amt || prev.sendAmount,
        accountNumber: acc || prev.accountNumber,
        bankId: bId || prev.bankId,
        recipientName: name || prev.recipientName
      }));
    }
  }, [location.search]);

  // Load banks
  useEffect(() => {
    api('/banks').then(setBanks).catch(() => {});
  }, []);

  // Update bank name when bankId changes
  useEffect(() => {
    const selected = banks.find((b) => b.id === form.bankId);
    if (selected) {
      setForm((f) => ({ ...f, bankName: selected.name }));
    }
  }, [form.bankId, banks]);

  // Fee quote calculation
  useEffect(() => {
    const t = setTimeout(() => {
      const amt = Number(form.sendAmount);
      if (amt > 0) {
        api('/quote', {
          method: 'POST',
          body: JSON.stringify({ amount: amt, from_currency: form.sendCurrency })
        })
          .then(setQuote)
          .catch(() => {});
      }
    }, 250);
    return () => clearTimeout(t);
  }, [form.sendAmount, form.sendCurrency]);

  // Real-time bank lookup
  useEffect(() => {
    if (form.accountNumber.length >= 8 && form.bankId) {
      api('/banks/lookup', {
        method: 'POST',
        body: JSON.stringify({ account_number: form.accountNumber, bank_id: form.bankId })
      })
        .then(setLookup)
        .catch(() => {});
    } else {
      setLookup(null);
    }
  }, [form.accountNumber, form.bankId]);

  // Live Risk Evaluation
  useEffect(() => {
    const amt = Number(form.sendAmount) || 0;
    if (amt > 0 && (form.recipientName || lookup?.account_name)) {
      api('/risk/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          amount: amt,
          accountNumber: form.accountNumber,
          recipientName: form.recipientName,
          accountName: lookup?.account_name
        })
      })
        .then(setRisk)
        .catch(() => {});
    }
  }, [form.sendAmount, form.recipientName, lookup, form.accountNumber]);

  const update = (key: string, val: string) => setForm((x) => ({ ...x, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup?.account_name) {
      triggerToast('Please provide a valid verified bank account');
      return;
    }
    setBusy(true);
    try {
      const transfer = await api('/transfers', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          sendAmount: Number(form.sendAmount),
          verifiedAccountName: lookup.account_name
        })
      });
      triggerToast('Escrow transfer created successfully!');
      navigate('/transfer/' + transfer.id);
    } catch (err: any) {
      alert(err.message || 'Transfer creation failed');
      setBusy(false);
    }
  };

  return (
    <main className="app-page">
      <div className="container" style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 14 }}>
          <Link
            to="/"
            className="mono"
            style={{ fontSize: 11.5, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            ← Back to Home
          </Link>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 24, letterSpacing: '-0.04em', margin: '0 0 4px' }}>Send Money Home</h1>
          <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: 0 }}>
            Funds locked safely in smart escrow. Released only when recipient confirms.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* YOU SEND */}
          <div className="field" style={{ margin: 0 }}>
            <div className="field__label">
              <span>You Send</span>
              <span className="mono">MULTI-CURRENCY</span>
            </div>
            <div className="amount-input-box">
              <input
                type="number"
                min="1"
                required
                value={form.sendAmount}
                onChange={(e) => update('sendAmount', e.target.value)}
              />
              <select
                value={form.sendCurrency}
                onChange={(e) => update('sendCurrency', e.target.value)}
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USDT">USDT (₮)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          {/* CONVERSION BAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--muted)'
            }}
          >
            <span className="mono">
              1 {form.sendCurrency} = ₦{quote ? quote.rate.toLocaleString() : '1,980'}
            </span>
            <span className="mono">Fee: {quote ? quote.total_fees.toFixed(2) : '1.50'} {form.sendCurrency}</span>
          </div>

          {/* RECIPIENT RECEIVES */}
          <div className="field" style={{ margin: 0 }}>
            <div className="field__label">
              <span>Recipient Gets (Guaranteed)</span>
              <span className="mono" style={{ color: 'var(--mint)' }}>NO SLIPPAGE</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--line-2)',
                borderRadius: 9
              }}
            >
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--lime)' }}>
                ₦{quote ? quote.recipient_gets.toLocaleString() : '—'}
              </span>
              <span className="tag tag--lime">NGN (₦)</span>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--line)', margin: '2px 0' }} />

          {/* DESTINATION BANK */}
          <div className="field" style={{ margin: 0 }}>
            <div className="field__label">
              <span>Destination Bank</span>
            </div>
            <select
              required
              value={form.bankId}
              onChange={(e) => update('bankId', e.target.value)}
            >
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* 10-DIGIT ACCOUNT */}
          <div className="field" style={{ margin: 0 }}>
            <div className="field__label">
              <span>10-Digit Account Number</span>
              <span className="mono">NUBAN</span>
            </div>
            <input
              required
              type="text"
              minLength={8}
              maxLength={10}
              placeholder="e.g. 0123456780"
              value={form.accountNumber}
              onChange={(e) => update('accountNumber', e.target.value)}
            />
            {lookup?.account_name && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 6,
                  fontSize: 11.5,
                  color: 'var(--mint)',
                  fontFamily: 'var(--mono)'
                }}
              >
                <Check size={13} />
                <span>Verified: <b>{lookup.account_name}</b> ({lookup.bank_name})</span>
              </div>
            )}
          </div>

          {/* RECIPIENT NAME & PHONE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="field" style={{ margin: 0 }}>
              <div className="field__label">
                <span>Recipient Name</span>
              </div>
              <input
                required
                placeholder="e.g. Tunde Adeyemi"
                value={form.recipientName}
                onChange={(e) => update('recipientName', e.target.value)}
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <div className="field__label">
                <span>Recipient Phone</span>
              </div>
              <input
                required
                placeholder="+234 800 000 0000"
                value={form.recipientPhone}
                onChange={(e) => update('recipientPhone', e.target.value)}
              />
            </div>
          </div>

          {lookup?.account_name &&
            form.recipientName &&
            !lookup.account_name.toLowerCase().includes(form.recipientName.toLowerCase().split(' ')[0]) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 12px',
                  background: 'rgba(255, 181, 71, 0.08)',
                  border: '1px solid rgba(255, 181, 71, 0.2)',
                  borderRadius: 6,
                  fontSize: 11.5,
                  color: 'var(--amber)'
                }}
              >
                <TriangleAlert size={14} />
                <span>Notice: Account belongs to {lookup.account_name}. Check before sending.</span>
              </div>
            )}

          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={busy || !lookup?.account_name}
            style={{ marginTop: 8 }}
          >
            {busy ? 'Initiating Escrow…' : 'Lock & Pay with Blaaiz'} <ArrowUpRight size={15} />
          </button>

          <div
            className="mono"
            style={{
              textAlign: 'center',
              fontSize: 10.5,
              color: 'var(--dim)',
              marginTop: 4
            }}
          >
            🔒 Funds held in Blaaiz escrow · 24h auto-refund guarantee
          </div>
        </form>
      </div>
    </main>
  );
}

// -------------------------------------------------------------
// TRANSFER STATUS & TRACKING VIEW
// -------------------------------------------------------------

function StatusView({ id }: { id: string }) {
  const [transfer, setTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadTransfer = () => {
    api('/transfers/' + id)
      .then(setTransfer)
      .catch(console.error);
  };

  useEffect(() => {
    loadTransfer();
    const interval = setInterval(loadTransfer, 2500);
    return () => clearInterval(interval);
  }, [id]);

  if (!transfer) {
    return (
      <main className="app-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <span className="dot dot--lime" />
          <p className="mono" style={{ marginTop: 14 }}>
            Loading secure escrow details…
          </p>
        </div>
      </main>
    );
  }

  // Simulations
  const simulatePayment = async () => {
    setLoading(true);
    await api('/demo/pay/' + transfer.id, { method: 'POST' });
    triggerToast('Payment simulated: Funds are now HELD in escrow!');
    loadTransfer();
    setLoading(false);
  };

  const simulateRefund = async () => {
    setLoading(true);
    await api('/transfers/' + transfer.id + '/refund', { method: 'POST' });
    triggerToast('Refund simulated: 100% returned to sender.');
    loadTransfer();
    setLoading(false);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/confirm/${transfer.confirmToken}`;
    navigator.clipboard?.writeText(url);
    triggerToast('Recipient confirmation link copied to clipboard!');
  };

  const states = ['AWAITING_PAYMENT', 'HELD', 'PAID'];
  const currentState =
    transfer.status === 'REFUNDED' || transfer.status === 'EXPIRED'
      ? 'REFUNDED'
      : transfer.status;

  return (
    <main className="app-page">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/dashboard"
            className="mono"
            style={{ fontSize: 12, color: 'var(--muted)', display: 'inline-flex', gap: 6 }}
          >
            ← Back to Control Room
          </Link>
        </div>

        <div className="page-header">
          <div>
            <span className="eyebrow">
              <LockKeyhole size={13} /> TRANSFER REF: {transfer.id.slice(-8).toUpperCase()}
            </span>
            <h1>{transfer.recipientName}</h1>
            <p className="mono">
              {transfer.sendCurrency} {transfer.sendAmount.toFixed(2)} →{' '}
              <b style={{ color: 'var(--lime)' }}>₦{transfer.receiveAmountNgn.toLocaleString()}</b>
            </p>
          </div>
          <div>
            <span
              className={`tag ${
                currentState === 'PAID'
                  ? 'tag--mint'
                  : currentState === 'HELD'
                  ? 'tag--lime'
                  : currentState === 'REFUNDED'
                  ? 'tag--red'
                  : 'tag--amber'
              }`}
            >
              {currentState.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="status-grid">
          <div className="clean-form-panel">
            {/* Visual Stepper */}
            <div className="stepper">
              <div
                className={`step-item ${
                  states.indexOf(transfer.status) >= 0 ? 'active' : ''
                }`}
              >
                <div className="step-circle">
                  {states.indexOf(transfer.status) > 0 ? <Check size={16} /> : '1'}
                </div>
                <span className="step-label">Awaiting Payment</span>
              </div>
              <div
                className={`step-item ${
                  states.indexOf(transfer.status) >= 1 ? 'active' : ''
                }`}
              >
                <div className="step-circle">
                  {states.indexOf(transfer.status) > 1 ? <Check size={16} /> : '2'}
                </div>
                <span className="step-label">Held in Escrow</span>
              </div>
              <div
                className={`step-item ${
                  transfer.status === 'PAID' ? 'active' : ''
                }`}
              >
                <div className="step-circle">
                  {transfer.status === 'PAID' ? <Check size={16} /> : '3'}
                </div>
                <span className="step-label">Payout Released</span>
              </div>
            </div>

            {/* Simulation Controls for Pitch Presentation */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '20px 24px',
                marginBottom: 28
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: 'var(--lime)',
                  fontWeight: 600,
                  marginBottom: 12
                }}
              >
                HACKATHON LIVE DEMO CONTROLS
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {transfer.status === 'AWAITING_PAYMENT' && (
                  <button
                    onClick={simulatePayment}
                    disabled={loading}
                    className="btn btn--primary"
                  >
                    Simulate Blaaiz Payment <ArrowUpRight size={15} />
                  </button>
                )}

                {transfer.status === 'HELD' && (
                  <>
                    <Link
                      to={'/confirm/' + transfer.confirmToken}
                      className="btn btn--primary"
                    >
                      Open Recipient Confirmation View <ArrowUpRight size={15} />
                    </Link>
                    <button
                      onClick={simulateRefund}
                      disabled={loading}
                      className="btn btn--ghost"
                      style={{ color: 'var(--red)', borderColor: 'rgba(255, 93, 93, 0.3)' }}
                    >
                      Simulate 24h Expiry & Refund
                    </button>
                  </>
                )}

                {transfer.status === 'PAID' && (
                  <span
                    className="tag tag--mint"
                    style={{ padding: '8px 14px', height: 'auto', fontSize: 12 }}
                  >
                    ✓ Payout settled to verified destination
                  </span>
                )}

                {transfer.status === 'REFUNDED' && (
                  <span
                    className="tag tag--red"
                    style={{ padding: '8px 14px', height: 'auto', fontSize: 12 }}
                  >
                    ↺ 100% Refunded back to sender account
                  </span>
                )}
              </div>
            </div>

            {/* Timeline Audit Events */}
            <h4 style={{ fontSize: 17, marginBottom: 18 }}>Timeline & Audit Events</h4>
            <div className="timeline-events">
              {transfer.events?.map((ev: any) => (
                <div key={ev.id} className="timeline-event">
                  <div className="event-dot" />
                  <div className="event-content">
                    <b>{ev.type.replaceAll('_', ' ')}</b>
                    <p>{ev.message}</p>
                    <small>{new Date(ev.createdAt).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Receipt Card */}
          <aside className="clean-aside-panel">
            <span className="tag tag--lime">SECURE RECEIPT</span>
            <div className="receipt-amount">₦{transfer.receiveAmountNgn.toLocaleString()}</div>

            <div className="receipt-row">
              <span>Destination Bank</span>
              <b>{transfer.bankName}</b>
            </div>
            <div className="receipt-row">
              <span>Account Number</span>
              <b className="mono">{transfer.accountNumber}</b>
            </div>
            <div className="receipt-row">
              <span>Verified Account Name</span>
              <b style={{ color: 'var(--mint)' }}>{transfer.verifiedAccountName}</b>
            </div>
            <div className="receipt-row">
              <span>Deposit Locked</span>
              <b>{transfer.sendCurrency} {transfer.sendAmount.toFixed(2)}</b>
            </div>
            <div className="receipt-row">
              <span>Blaaiz FX Rate</span>
              <b>₦{transfer.rate.toLocaleString()}</b>
            </div>
            <div className="receipt-row">
              <span>Network Fee</span>
              <b>{transfer.fee.toFixed(2)} {transfer.sendCurrency}</b>
            </div>
            <div className="receipt-row">
              <span>Risk Evaluation</span>
              <b
                style={{
                  color: transfer.riskLevel === 'SAFE' ? 'var(--mint)' : 'var(--amber)'
                }}
              >
                {transfer.riskLevel}
              </b>
            </div>
            {transfer.blaaizCollectionId && (
              <div className="receipt-row">
                <span>Blaaiz Collection</span>
                <b className="mono" style={{ fontSize: 11 }}>{transfer.blaaizCollectionId}</b>
              </div>
            )}
            {transfer.blaaizPayoutId && (
              <div className="receipt-row">
                <span>Blaaiz Payout Ref</span>
                <b className="mono" style={{ fontSize: 11, color: 'var(--mint)' }}>{transfer.blaaizPayoutId}</b>
              </div>
            )}

            <button
              onClick={copyLink}
              className="btn btn--ghost btn--block"
              style={{ marginTop: 20 }}
            >
              <Copy size={14} /> Copy Recipient Confirmation Link
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

// -------------------------------------------------------------
// RECIPIENT MOBILE-FIRST CONFIRMATION VIEW
// -------------------------------------------------------------

function ConfirmView() {
  const { token } = useParams();
  const [transfer, setTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      api('/confirm/' + token)
        .then((t) => {
          setTransfer(t);
          if (t.status === 'PAID') setDone(true);
        })
        .catch((err) => setError(err.message));
    }
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await api('/confirm/' + token, { method: 'POST' });
      setDone(true);
      triggerToast('Payout confirmed & released!');
    } catch (err: any) {
      alert(err.message || 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <main className="confirm-wrapper">
        <div className="confirm-box">
          <div className="confirm-icon-ring" style={{ color: 'var(--red)' }}>
            <TriangleAlert size={28} />
          </div>
          <h2>Invalid or Expired Link</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn--ghost">
            Return to Sendlock
          </Link>
        </div>
      </main>
    );
  }

  if (!transfer) {
    return (
      <main className="confirm-wrapper">
        <div className="confirm-box">
          <span className="dot dot--lime" />
          <p className="mono" style={{ marginTop: 14 }}>
            Verifying secure link…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="confirm-wrapper">
      <div className="confirm-box">
        <div className="confirm-icon-ring">
          <ShieldCheck size={26} />
        </div>

        <span className="eyebrow" style={{ fontSize: 9.5 }}>RECIPIENT CONFIRMATION</span>
        <h2 style={{ fontSize: 20, margin: '6px 0 4px' }}>{done ? 'Money is on the way!' : `${transfer.sender?.name || 'Sender'} sent you`}</h2>

        <div
          className="mono"
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--lime)',
            margin: '6px 0 14px',
            letterSpacing: '-0.04em'
          }}
        >
          ₦{transfer.receiveAmountNgn.toLocaleString()}
        </div>

        <p>
          {done
            ? 'Your bank account verification was recorded. The Blaaiz instant payout has been released to your verified bank account.'
            : 'Please confirm that the bank account below belongs to you. Your money is currently held in escrow and will only be released once you approve.'}
        </p>

        <div className="confirm-account-preview">
          <small>VERIFIED BANK DESTINATION</small>
          <b>{transfer.verifiedAccountName}</b>
          <span>
            {transfer.bankName} · {transfer.accountNumber}
          </span>
        </div>

        {!done ? (
          <button
            onClick={handleConfirm}
            disabled={loading || transfer.status !== 'HELD'}
            className="btn btn--primary btn--block btn--lg"
          >
            {loading ? 'Releasing Payout…' : 'Confirm & Receive Payout'} <Check size={18} />
          </button>
        ) : (
          <div
            className="verified-badge"
            style={{ justifyContent: 'center', padding: '14px 20px', fontSize: 13 }}
          >
            <Check size={16} /> PAID TO VERIFIED ACCOUNT
          </div>
        )}

        <div className="mono" style={{ fontSize: 10, color: 'var(--dim)', marginTop: 22 }}>
          🔒 Private single-use link. Sendlock will never ask for your PIN or OTP.
        </div>
      </div>
    </main>
  );
}

// -------------------------------------------------------------
// CONTROL ROOM DASHBOARD
// -------------------------------------------------------------

function Dashboard() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');

  const loadData = () => {
    api('/transfers').then(setTransfers).catch(console.error);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return transfers.filter((t) => {
      const matchFilter = filter === 'ALL' || t.status === filter;
      const matchQuery =
        !query ||
        t.recipientName?.toLowerCase().includes(query.toLowerCase()) ||
        t.accountNumber?.includes(query) ||
        t.id?.toLowerCase().includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [transfers, filter, query]);

  const totalVolume = transfers.reduce((acc, t) => acc + (t.receiveAmountNgn || 0), 0);
  const totalFees = transfers.reduce((acc, t) => acc + (t.fee || 0), 0);
  const paidCount = transfers.filter((t) => t.status === 'PAID').length;
  const rate = transfers.length ? Math.round((paidCount / transfers.length) * 100) : 0;

  return (
    <main className="app-page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">
              <Sparkles size={13} /> CONTROL ROOM
            </span>
            <h1>Operations & Escrow Dashboard</h1>
            <p>Every pound accounted for. Every destination verified in real time.</p>
          </div>
          <Link to="/send" className="btn btn--primary">
            New Escrow Transfer <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Dash Stat Cards */}
        <div className="stats__grid" style={{ marginBottom: 26, background: 'rgba(255, 255, 255, 0.015)', border: '1px solid var(--line)', borderRadius: 12, padding: '10px 6px' }}>
          <div className="stat">
            <div className="stat__num">₦{totalVolume.toLocaleString()}</div>
            <div className="stat__label">Total Volume Protected</div>
          </div>
          <div className="stat">
            <div className="stat__num">£{totalFees.toFixed(2)}</div>
            <div className="stat__label">Total Blaaiz Network Fees</div>
          </div>
          <div className="stat">
            <div className="stat__num">{rate}%</div>
            <div className="stat__label">Confirmation Success Rate</div>
          </div>
          <div className="stat">
            <div className="stat__num">{transfers.length}</div>
            <div className="stat__label">Total Escrows Tracked</div>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 20
          }}
        >
          <div className="radar-tabs" style={{ padding: 0, border: 0, background: 'none' }}>
            {['ALL', 'AWAITING_PAYMENT', 'HELD', 'PAID', 'REFUNDED'].map((s) => (
              <button
                key={s}
                className={`radar-tab ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'ALL' ? 'All Transfers' : s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '6px 14px',
              width: 280
            }}
          >
            <Search size={14} color="var(--dim)" />
            <input
              type="text"
              placeholder="Search recipient or account…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ background: 'none', border: 0, outline: 0, fontSize: 12, width: '100%' }}
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="radar-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="radar-table">
              <thead>
                <tr>
                  <th>RECIPIENT</th>
                  <th>AMOUNT</th>
                  <th>DESTINATION BANK</th>
                  <th>RISK</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <b>{t.recipientName}</b>
                      <div className="trader-sub">
                        {new Date(t.createdAt).toLocaleDateString()} · {t.id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div className="rate-num">₦{t.receiveAmountNgn.toLocaleString()}</div>
                      <div className="trader-sub">
                        {t.sendCurrency} {t.sendAmount.toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <div>{t.bankName}</div>
                      <div className="trader-sub mono">{t.accountNumber}</div>
                    </td>
                    <td>
                      <span
                        className={`tag ${
                          t.riskLevel === 'SAFE' ? 'tag--mint' : 'tag--amber'
                        }`}
                      >
                        {t.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`tag ${
                          t.status === 'PAID'
                            ? 'tag--mint'
                            : t.status === 'HELD'
                            ? 'tag--lime'
                            : t.status === 'REFUNDED'
                            ? 'tag--red'
                            : 'tag--amber'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/transfer/${t.id}`} className="btn btn--sm btn--ghost">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

// Scroll To Top on Route Change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// Router App
function TransferRoute() {
  const { id } = useParams();
  return <StatusView id={id || ''} />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/send" element={<Send />} />
          <Route path="/transfer/:id" element={<TransferRoute />} />
          <Route path="/confirm/:token" element={<ConfirmView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
