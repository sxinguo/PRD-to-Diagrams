// Per-route static HTML generators for SEO prerendering
// These produce lightweight semantic HTML that Googlebot can parse
// Real users get the SPA takeover with full interactivity

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Shared navbar HTML
function navbar(t) {
  return `<nav style="position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(255,255,255,0.88);backdrop-filter:blur(20px);border-bottom:1px solid rgba(124,58,237,0.1)">
  <a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none">
    <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);display:flex;align-items:center;justify-content:center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
    </div>
    <span style="font-weight:700;letter-spacing:-0.02em"><span style="color:#7c3aed">PRD</span><span>-Chart</span></span>
  </a>
  <div style="display:flex;align-items:center;gap:32px">
    <a href="/#features" style="color:#4b5563;text-decoration:none;font-size:0.9rem">${esc(t.featuresH2a)}</a>
    <a href="/pricing" style="color:#4b5563;text-decoration:none;font-size:0.9rem">${esc(t.pricingBadge)}</a>
    <a href="/faq" style="color:#4b5563;text-decoration:none;font-size:0.9rem">${esc(t.navFAQ)}</a>
  </div>
  <div style="display:flex;align-items:center;gap:12px">
    <a href="/editor" style="padding:8px 18px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;font-weight:600;cursor:pointer;font-size:0.875rem;text-decoration:none;box-shadow:0 2px 12px rgba(124,58,237,0.3)">${esc(t.navGetStarted)}</a>
  </div>
</nav>`
}

// Shared footer HTML
function footer(t) {
  return `<footer style="padding:56px 32px 32px;background:#fff;border-top:1.5px solid rgba(124,58,237,0.08)">
  <div style="max-width:1152px;margin:0 auto">
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:32px;margin-bottom:40px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);display:flex;align-items:center;justify-content:center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
        </div>
        <span style="font-weight:700">PRD<span style="color:#7c3aed">-Chart</span></span>
      </div>
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:24px">
        <a href="/privacy-policy" style="font-size:0.75rem;color:#9ca3af;text-decoration:none">${esc(t.navPrivacyPolicy)}</a>
        <a href="/pricing" style="font-size:0.75rem;color:#9ca3af;text-decoration:none">${esc(t.pricingBadge)}</a>
        <a href="/refund-policy" style="font-size:0.75rem;color:#9ca3af;text-decoration:none">${esc(t.navRefundPolicy)}</a>
        <a href="/faq" style="font-size:0.75rem;color:#9ca3af;text-decoration:none">${esc(t.navFAQ)}</a>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:12px;padding-top:32px;border-top:1px solid rgba(124,58,237,0.08)">
      <p style="font-size:0.75rem;color:#d1d5db;margin:0">${esc(t.footerCopy)}</p>
      <p style="font-size:0.75rem;color:#9ca3af;margin:0">${esc(t.footerContact)}</p>
    </div>
  </div>
</footer>`
}

// Home page — reuse existing full landing page content
export function generateHomeHtml(t) {
  return `<div style="min-height:100vh;background:#f8f7ff;color:#1e0a3c;font-family:Inter,sans-serif">
  ${navbar(t)}

  <!-- HERO SECTION -->
  <section style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 16px 64px;text-align:center;position:relative;overflow:hidden">
    <div style="position:absolute;top:-10%;left:50%;transform:translateX(-50%);width:900px;height:700px;border-radius:50%;background:radial-gradient(ellipse,rgba(167,139,250,0.18) 0%,transparent 65%);pointer-events:none"></div>
    <div style="position:absolute;top:20%;left:-5%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(196,181,253,0.15) 0%,transparent 70%);pointer-events:none"></div>
    <div style="position:absolute;top:15%;right:-5%;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(147,197,253,0.12) 0%,transparent 70%);pointer-events:none"></div>
    <div style="position:absolute;inset:0;background-image:radial-gradient(circle,rgba(124,58,237,0.12) 1px,transparent 1px);background-size:36px 36px;pointer-events:none"></div>
    <div style="position:relative;z-index:10;max-width:800px">
      <h1 style="font-size:clamp(2.4rem,6vw,4.4rem);font-weight:800;line-height:1.1;letter-spacing:-0.04em;margin-bottom:20px">
        ${esc(t.heroH1a)}<br>
        <span style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${esc(t.heroH1b)}</span>
      </h1>
      <p style="color:#6b7280;line-height:1.75;font-size:1.1rem;max-width:540px;margin:0 auto 32px">${esc(t.heroDesc)}</p>
      <div style="width:100%;max-width:672px;margin:0 auto 24px">
        <textarea disabled style="width:100%;min-height:140px;padding:20px;border-radius:16px;background:#fff;border:1.5px solid rgba(124,58,237,0.15);box-shadow:0 4px 24px rgba(124,58,237,0.08);color:#1e0a3c;font-size:1rem;line-height:1.6;resize:none;font-family:Inter,sans-serif" placeholder="${esc(t.heroPlaceholder)}"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:12px">
          <a href="/editor" style="padding:10px 20px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;font-weight:600;font-size:0.95rem;text-decoration:none;box-shadow:0 4px 16px rgba(124,58,237,0.3)">${esc(t.heroCTA)} →</a>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;max-width:672px;margin:0 auto 32px">
        <div style="display:flex;align-items:center;gap:10px;padding:12px;border-radius:12px;background:#fff;border:1.5px solid rgba(124,58,237,0.1);box-shadow:0 2px 12px rgba(124,58,237,0.06)">
          <div style="width:32px;height:32px;border-radius:8px;background:rgba(124,58,237,0.1);display:flex;align-items:center;justify-content:center;color:#7c3aed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
          </div>
          <div style="text-align:left">
            <div style="font-weight:600;color:#1e0a3c;font-size:0.85rem">${esc(t.typeSequence)}</div>
            <div style="color:#9ca3af;font-size:0.75rem">${esc(t.typeSequenceDesc)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;padding:12px;border-radius:12px;background:#fff;border:1.5px solid rgba(124,58,237,0.1);box-shadow:0 2px 12px rgba(124,58,237,0.06)">
          <div style="width:32px;height:32px;border-radius:8px;background:rgba(99,102,241,0.1);display:flex;align-items:center;justify-content:center;color:#6366f1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
          </div>
          <div style="text-align:left">
            <div style="font-weight:600;color:#1e0a3c;font-size:0.85rem">${esc(t.typeFlowchart)}</div>
            <div style="color:#9ca3af;font-size:0.75rem">${esc(t.typeFlowchartDesc)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;padding:12px;border-radius:12px;background:#fff;border:1.5px solid rgba(124,58,237,0.06)">
          <div style="width:32px;height:32px;border-radius:8px;background:rgba(168,85,247,0.1);display:flex;align-items:center;justify-content:center;color:#a855f7">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          </div>
          <div style="text-align:left">
            <div style="font-weight:600;color:#1e0a3c;font-size:0.85rem">${esc(t.typeJourney)}</div>
            <div style="color:#9ca3af;font-size:0.75rem">${esc(t.typeJourneyDesc)}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SHOWCASE SECTION -->
  <section id="showcase" style="padding:48px 32px;background:#fff">
    <div style="max-width:1152px;margin:0 auto;text-align:center">
      <div style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:0.75rem;background:#ede9fe;border:1px solid rgba(124,58,237,0.2);color:#7c3aed;margin-bottom:16px">Mermaid Chart Showcase</div>
      <h2 style="color:#1e0a3c;letter-spacing:-0.03em;margin-bottom:10px">From PRD to Mermaid Charts, <span style="background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">One Click</span></h2>
      <p style="color:#9ca3af;max-width:460px;margin:0 auto 32px">Generate mermaid sequence diagrams, flowcharts, user journey maps and more</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        <div style="border-radius:16px;overflow:hidden;border:1.5px solid rgba(124,58,237,0.1);box-shadow:0 4px 20px rgba(124,58,237,0.07)">
          <div style="aspect-ratio:4/3;background:linear-gradient(135deg,#f8f7ff 0%,#fdf4ff 100%);display:flex;align-items:center;justify-content:center">
            <div style="text-align:center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" style="margin-bottom:8px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
              <span style="display:block;color:#1e0a3c;font-weight:600;font-size:0.9rem">Mermaid Sequence Diagram</span>
            </div>
          </div>
          <div style="padding:12px 16px;background:#fafbff;border-top:1px solid rgba(124,58,237,0.07)"><span style="font-size:0.875rem;color:#374151">User Login Sequence</span></div>
        </div>
        <div style="border-radius:16px;overflow:hidden;border:1.5px solid rgba(124,58,237,0.1);box-shadow:0 4px 20px rgba(124,58,237,0.07)">
          <div style="aspect-ratio:4/3;background:linear-gradient(135deg,#f8f7ff 0%,#fdf4ff 100%);display:flex;align-items:center;justify-content:center">
            <div style="text-align:center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="margin-bottom:8px"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
              <span style="display:block;color:#1e0a3c;font-weight:600;font-size:0.9rem">Mermaid Flowchart</span>
            </div>
          </div>
          <div style="padding:12px 16px;background:#fafbff;border-top:1px solid rgba(124,58,237,0.07)"><span style="font-size:0.875rem;color:#374151">Order Processing Flow</span></div>
        </div>
        <div style="border-radius:16px;overflow:hidden;border:1.5px solid rgba(124,58,237,0.1);box-shadow:0 4px 20px rgba(124,58,237,0.07)">
          <div style="aspect-ratio:4/3;background:linear-gradient(135deg,#f8f7ff 0%,#fdf4ff 100%);display:flex;align-items:center;justify-content:center">
            <div style="text-align:center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" style="margin-bottom:8px"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
              <span style="display:block;color:#1e0a3c;font-weight:600;font-size:0.9rem">Mermaid User Journey</span>
            </div>
          </div>
          <div style="padding:12px 16px;background:#fafbff;border-top:1px solid rgba(124,58,237,0.07)"><span style="font-size:0.875rem;color:#374151">New User Registration Journey</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES SECTION -->
  <section id="features" style="padding:80px 32px;background:#fff">
    <div style="max-width:1152px;margin:0 auto">
      <div style="text-align:center;margin-bottom:48px">
        <h2 style="color:#1e0a3c;letter-spacing:-0.03em;margin-bottom:10px">${esc(t.featuresH2a)}<br>
          <span style="background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${esc(t.featuresH2b)}</span>
        </h2>
        <p style="color:#9ca3af;max-width:460px;margin:0 auto">${esc(t.featuresDesc)}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:80px">
        <div style="padding:24px;border-radius:16px;background:#fafbff;border:1.5px solid rgba(124,58,237,0.08);box-shadow:0 2px 12px rgba(124,58,237,0.04)">
          <h3 style="color:#1e0a3c;margin-bottom:8px;font-size:1rem;font-weight:600">${esc(t.feat1Title)}</h3>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.75;margin:0">${esc(t.feat1Desc)}</p>
        </div>
        <div style="padding:24px;border-radius:16px;background:#fafbff;border:1.5px solid rgba(124,58,237,0.08);box-shadow:0 2px 12px rgba(124,58,237,0.04)">
          <h3 style="color:#1e0a3c;margin-bottom:8px;font-size:1rem;font-weight:600">${esc(t.feat2Title)}</h3>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.75;margin:0">${esc(t.feat2Desc)}</p>
        </div>
        <div style="padding:24px;border-radius:16px;background:#fafbff;border:1.5px solid rgba(124,58,237,0.08);box-shadow:0 2px 12px rgba(124,58,237,0.04)">
          <h3 style="color:#1e0a3c;margin-bottom:8px;font-size:1rem;font-weight:600">${esc(t.feat3Title)}</h3>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.75;margin:0">${esc(t.feat3Desc)}</p>
        </div>
        <div style="padding:24px;border-radius:16px;background:#fafbff;border:1.5px solid rgba(124,58,237,0.08);box-shadow:0 2px 12px rgba(124,58,237,0.04)">
          <h3 style="color:#1e0a3c;margin-bottom:8px;font-size:1rem;font-weight:600">${esc(t.feat4Title)}</h3>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.75;margin:0">${esc(t.feat4Desc)}</p>
        </div>
        <div style="padding:24px;border-radius:16px;background:#fafbff;border:1.5px solid rgba(124,58,237,0.08);box-shadow:0 2px 12px rgba(124,58,237,0.04)">
          <h3 style="color:#1e0a3c;margin-bottom:8px;font-size:1rem;font-weight:600">${esc(t.feat5Title)}</h3>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.75;margin:0">${esc(t.feat5Desc)}</p>
        </div>
        <div style="padding:24px;border-radius:16px;background:#fafbff;border:1.5px solid rgba(124,58,237,0.08);box-shadow:0 2px 12px rgba(124,58,237,0.04)">
          <h3 style="color:#1e0a3c;margin-bottom:8px;font-size:1rem;font-weight:600">${esc(t.feat6Title)}</h3>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.75;margin:0">${esc(t.feat6Desc)}</p>
        </div>
      </div>
    </div>
  </section>

  ${footer(t)}
</div>`
}

// Pricing page
export function generatePricingHtml(t) {
  const plans = [
    {
      name: t.planFree || 'Free',
      price: '$0',
      desc: t.planFreeDesc || 'Get started with 12 free credits',
      features: [t.f_6credits, t.f_3perGen, t.f_dailyBonus, t.f_allDiagrams].filter(Boolean),
      highlight: false,
    },
    {
      name: t.planStarter || 'Starter Pack',
      price: '$9.99',
      period: t.perMonth || '/mo',
      desc: t.planStarterDesc || '100 credits for casual use',
      features: [t.f_100credits, t.f_3perGen, t.f_allDiagrams, t.f_priorityQueue, t.f_noExpiry].filter(Boolean),
      highlight: false,
    },
    {
      name: t.planPro || 'Pro Pack',
      price: '$29.99',
      period: t.perMonth || '/mo',
      desc: t.planProDesc || '500 credits for power users',
      badge: t.mostPopular || 'Best Value',
      features: [t.f_500credits, t.f_3perGen, t.f_allDiagrams, t.f_priorityQueue, t.f_noExpiry, t.f_emailSupport, t.f_commercial].filter(Boolean),
      highlight: true,
    },
  ]

  return `<div style="min-height:100vh;background:linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 60%,#f0f4ff 100%);color:#1e0a3c;font-family:Inter,sans-serif;padding-top:64px">
  ${navbar(t)}

  <!-- Hero -->
  <div style="padding:80px 16px 40px;text-align:center;position:relative;overflow:hidden">
    <div style="position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:700px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(167,139,250,0.15) 0%,transparent 65%);pointer-events:none"></div>
    <div style="position:relative;z-index:10;max-width:640px;margin:0 auto">
      <div style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:0.75rem;background:#ede9fe;border:1px solid rgba(124,58,237,0.2);color:#7c3aed;margin-bottom:16px">${esc(t.pricingBadge)}</div>
      <h1 style="font-size:clamp(1.8rem,4vw,3rem);font-weight:800;letter-spacing:-0.04em;line-height:1.15;margin:0 0 14px">${esc(t.pricingH2)}</h1>
      <p style="color:#9ca3af;max-width:420px;margin:0 auto">${esc(t.pricingDesc)}</p>
    </div>
  </div>

  <!-- Cards -->
  <div style="max-width:1024px;margin:0 auto;padding:0 16px 80px">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
      ${plans.map(p => `
      <div style="position:relative;display:flex;flex-direction:column;padding:24px;border-radius:16px;background:${p.highlight ? 'linear-gradient(160deg,rgba(124,58,237,0.06),rgba(168,85,247,0.04))' : '#fff'};border:${p.highlight ? '2px solid rgba(124,58,237,0.35)' : '1.5px solid rgba(124,58,237,0.1)'};box-shadow:${p.highlight ? '0 8px 40px rgba(124,58,237,0.13)' : '0 2px 16px rgba(124,58,237,0.06)'}">
        ${p.badge ? `<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 12px;border-radius:999px;font-size:0.75rem;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:600;white-space:nowrap;box-shadow:0 2px 10px rgba(124,58,237,0.3)">${esc(p.badge)}</div>` : ''}
        <div style="margin-bottom:20px">
          <span style="display:block;font-size:0.75rem;color:${p.highlight ? '#7c3aed' : '#9ca3af'};text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:4px">${esc(p.name)}</span>
          <div style="display:flex;align-items:flex-end;gap:4px;margin-bottom:4px">
            <span style="font-size:2.2rem;font-weight:800;letter-spacing:-0.04em;color:#1e0a3c">${p.price}</span>
            ${p.period ? `<span style="font-size:0.875rem;color:#9ca3af;margin-bottom:6px">${esc(p.period)}</span>` : ''}
          </div>
          <p style="font-size:0.875rem;color:#9ca3af;margin:0">${esc(p.desc)}</p>
        </div>
        <ul style="display:flex;flex-direction:column;gap:10px;flex:1;margin:0;padding:0;list-style:none">
          ${p.features.map(f => `<li style="display:flex;align-items:start;gap:8px;font-size:0.875rem"><span style="color:${p.highlight ? '#7c3aed' : '#d1d5db'};margin-top:2px">✓</span><span style="color:#4b5563">${esc(f)}</span></li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>
    <p style="text-align:center;font-size:0.75rem;color:#c4b5fd;margin-top:32px">${esc(t.pricingNote)}</p>
  </div>

  ${footer(t)}
</div>`
}

// FAQ page — semantic Q&A pairs for Google rich results
export function generateFaqHtml(t) {
  const faqs = [
    { q: 'What types of diagrams are supported?', a: 'PRD Chart supports three major diagram types: Mermaid Sequence Diagrams (user-system interaction flows), Mermaid Flowcharts (business process visualization), and Mermaid User Journey Maps (customer experience mapping).' },
    { q: 'How do I generate a diagram?', a: "Simply describe your requirement in the input box on the homepage, select your preferred diagram type, then click 'Start Generating'. Our AI will analyze your PRD text and generate professional Mermaid code instantly." },
    { q: 'How many credits does one generation cost?', a: 'Each diagram generation costs 3 credits. You can preview the generated diagram and export it in PNG or SVG format.' },
    { q: 'What PRD formats are supported?', a: 'We support plain text, Markdown format, and structured PRD documents. Simply paste your PRD text or upload a .txt file to get started.' },
    { q: 'Can I export diagrams in other formats?', a: 'Yes, you can export your generated diagrams as PNG files.' },
    { q: 'How accurate are the generated diagrams?', a: 'Our AI is built with neural precision to extract user-system interactions, business processes, and customer journeys from your PRD. The diagrams are production-ready and suitable for professional documentation.' },
    { q: 'Do credits expire?', a: 'No, all purchased credits never expire. Pay as you go with no subscription required.' },
    { q: 'Is there a free trial?', a: 'Yes, you get 12 free credits upon registration. Plus, if you use the service daily, you\'ll receive 3 bonus credits every day.' },
  ]

  return `<div style="min-height:100vh;background:linear-gradient(180deg,#fafbff 0%,#fff 100%);color:#1e0a3c;font-family:Inter,sans-serif;padding-top:64px">
  ${navbar(t)}

  <div style="max-width:768px;margin:0 auto;padding:64px 16px">
    <div style="text-align:center;margin-bottom:40px">
      <div style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:0.75rem;background:#ede9fe;border:1px solid rgba(124,58,237,0.2);color:#7c3aed;margin-bottom:16px">FAQ</div>
      <h1 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:800;letter-spacing:-0.03em;margin:0 0 10px">Frequently Asked Questions</h1>
      <p style="color:#9ca3af;max-width:460px;margin:0 auto">Everything you need to know about diagram generation</p>
    </div>

    <div>
      ${faqs.map(faq => `
      <div style="border-radius:12px;overflow:hidden;border:1.5px solid rgba(124,58,237,0.1);background:#fff;margin-bottom:12px">
        <h3 style="font-weight:600;color:#1e0a3c;font-size:0.95rem;margin:0;padding:16px 20px">${esc(faq.q)}</h3>
        <div style="padding:0 20px 16px">
          <p style="color:#6b7280;font-size:0.875rem;line-height:1.7;margin:0">${esc(faq.a)}</p>
        </div>
      </div>`).join('')}
    </div>

    <p style="text-align:center;color:#9ca3af;font-size:0.875rem;margin-top:32px">
      Still have questions? <a href="mailto:support@chartprd.com" style="color:#7c3aed;text-decoration:none;font-weight:600">Contact us</a>
    </p>
  </div>

  ${footer(t)}
</div>`
}

// Privacy Policy page — static text content
export function generatePrivacyHtml() {
  return `<div style="min-height:100vh;background:#fafafa;color:#1e0a3c;font-family:Inter,sans-serif;padding:80px 20px 40px">
  <div style="max-width:768px;margin:0 auto;background:#fff;border-radius:16px;padding:48px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <h1 style="font-size:32px;font-weight:700;margin:0 0 8px">Privacy Policy</h1>
    <p style="color:#9ca3af;font-size:14px;margin:0 0 32px">Last Updated: May 20, 2026</p>
    <div style="color:#374151;font-size:15px;line-height:1.8">
      <p style="margin-bottom:24px">PRD Chart ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mermaid chart and diagram generation service.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Information We Collect</h2>
      <h3 style="font-size:16px;font-weight:600;color:#374151;margin-top:20px;margin-bottom:12px">Account Information</h3>
      <ul style="margin-left:24px;margin-bottom:16px;list-style:disc">
        <li>Email address (for authentication via Supabase)</li>
        <li>User ID (automatically generated)</li>
        <li>Subscription plan and credits information</li>
      </ul>
      <h3 style="font-size:16px;font-weight:600;color:#374151;margin-top:20px;margin-bottom:12px">Usage Data</h3>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li>PRD text content you input for diagram generation</li>
        <li>Generated diagrams (Mermaid code and SVG outputs)</li>
        <li>Transaction history and credit usage records</li>
        <li>Browser type, device information, and IP address</li>
      </ul>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">How We Use Your Information</h2>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li>To provide and maintain our diagram generation service</li>
        <li>To process your PRD documents and generate diagrams</li>
        <li>To manage your account, credits, and subscription</li>
        <li>To improve our AI models and service quality</li>
        <li>To send service-related notifications</li>
        <li>To prevent fraud and ensure platform security</li>
      </ul>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Data Storage and Security</h2>
      <p style="margin-bottom:16px">Your data is stored securely using Supabase infrastructure with industry-standard encryption:</p>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li>All data transmission is encrypted using HTTPS/TLS</li>
        <li>Database access is protected by authentication and authorization</li>
        <li>We implement regular security audits and updates</li>
        <li>Your PRD content is processed temporarily and not permanently stored unless you save it</li>
      </ul>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Data Sharing and Third Parties</h2>
      <p style="margin-bottom:16px">We do not sell your personal information. We may share data with:</p>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li><strong>Supabase:</strong> For authentication and database services</li>
        <li><strong>Payment processors:</strong> For handling subscription payments</li>
        <li><strong>AI service providers:</strong> For diagram generation (data is processed and not retained)</li>
        <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
      </ul>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Your Rights</h2>
      <p style="margin-bottom:16px">You have the right to:</p>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your account and data</li>
        <li>Export your data in a portable format</li>
        <li>Opt-out of marketing communications</li>
      </ul>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Data Retention</h2>
      <p style="margin-bottom:24px">We retain your account information and transaction history for as long as your account is active. After account deletion, we may retain certain data for legal compliance and fraud prevention purposes for up to 90 days.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Cookies and Tracking</h2>
      <p style="margin-bottom:24px">We use essential cookies for authentication and session management. We do not use third-party advertising cookies or tracking pixels.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Children's Privacy</h2>
      <p style="margin-bottom:24px">Our service is not intended for users under 13 years of age. We do not knowingly collect information from children.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Changes to This Policy</h2>
      <p style="margin-bottom:24px">We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our service.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Contact Us</h2>
      <p style="margin-bottom:8px">If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:</p>
      <p style="margin-bottom:4px"><strong>Email:</strong> feedback9980@163.com</p>
    </div>
  </div>
</div>`
}

// Refund Policy page — static text content
export function generateRefundHtml() {
  return `<div style="min-height:100vh;background:#fafafa;color:#1e0a3c;font-family:Inter,sans-serif;padding:80px 20px 40px">
  <div style="max-width:768px;margin:0 auto;background:#fff;border-radius:16px;padding:48px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <h1 style="font-size:32px;font-weight:700;margin:0 0 8px">Refund Policy</h1>
    <p style="color:#9ca3af;font-size:14px;margin:0 0 32px">Last Updated Date: April 22, 2025</p>
    <div style="color:#374151;font-size:15px;line-height:1.8">
      <p style="margin-bottom:24px">Thank you for choosing the subscription service of PRD Chart. Before making a purchase, please carefully read this refund policy.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">All Sales Are Final Transactions</h2>
      <p style="margin-bottom:16px">Due to the instant access nature of digital services, all subscription fees (including monthly/annual plans), once paid, are deemed final transactions and no refunds will be given. This includes but is not limited to the following situations:</p>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li>Unused subscription duration</li>
        <li>Insufficient use of the account</li>
        <li>Cancellation due to personal reasons of the user</li>
        <li>The service functions meet the description but do not meet the user's expectations</li>
      </ul>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Exception Handling for Service Interruptions</h2>
      <p style="margin-bottom:24px">If there is a major service interruption that lasts continuously for more than 72 hours and is not caused by force majeure, users can apply for compensation of equivalent service duration. This compensation is the sole remedy and does not involve cash refunds.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Dispute Resolution</h2>
      <p style="margin-bottom:16px">If you have any questions about the deduction, please contact feedback9980@163.com within 7 working days and provide:</p>
      <ul style="margin-left:24px;margin-bottom:24px;list-style:disc">
        <li>Transaction ID</li>
        <li>Deduction voucher</li>
        <li>Problem description</li>
      </ul>
      <p style="margin-bottom:24px">We will conduct an investigation and provide a written reply within 15 working days.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Right to Change the Policy</h2>
      <p style="margin-bottom:24px">PRD Chart reserves the right to modify this policy at any time. The revised policy will take effect immediately after being publicly announced on the website.</p>

      <h2 style="font-size:20px;font-weight:600;color:#1e0a3c;margin-top:32px;margin-bottom:16px">Recognition of Terms</h2>
      <p style="margin-bottom:8px">By paying the subscription fee, you:</p>
      <ul style="margin-left:24px;list-style:disc">
        <li>Have fully understood and accepted this policy</li>
        <li>Confirm the special nature of digital services</li>
        <li>Agree to waive any right to request a refund</li>
      </ul>
    </div>
  </div>
</div>`
}

// Map route path to generator function
export const routeGenerators = {
  '/': generateHomeHtml,
  '/pricing': generatePricingHtml,
  '/faq': generateFaqHtml,
  '/privacy-policy': generatePrivacyHtml,
  '/refund-policy': generateRefundHtml,
}
