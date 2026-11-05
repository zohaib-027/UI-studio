const PALETTE = {
  purple: '#8b5cf6',
  violet: '#7c3aed',
  blue: '#3b82f6',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  green: '#22c55e',
  emerald: '#10b981',
  lime: '#84cc16',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  pink: '#ec4899',
  rose: '#f43f5e',
}

export const EXAMPLE_PROMPTS = [
  'A modern SaaS landing page for an AI note-taking app in purple',
  'A dark login screen for a crypto wallet with a green accent',
  'An analytics dashboard overview for an e-commerce store',
  'A pricing page for a developer API platform in blue',
  'A contact page for a creative design agency in orange',
]

export function detectAccent(prompt) {
  const p = prompt.toLowerCase()
  const hex = p.match(/#[0-9a-f]{6}\b/)
  if (hex) return hex[0]
  const found = Object.keys(PALETTE).find((name) => p.includes(name))
  return found ? PALETTE[found] : '#6366f1'
}

function guessBrand(prompt) {
  const m = prompt.match(/\bfor (?:an?|the)?\s*([A-Za-z0-9][A-Za-z0-9 \-]{2,28}?)(?: in | with | that | using |,|\.|$)/i)
  if (m) {
    const words = m[1].trim().split(/\s+/).slice(0, 2)
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
  return 'Nova'
}

function topicWord(prompt) {
  const p = prompt.toLowerCase()
  if (p.includes('crypto') || p.includes('wallet')) return 'crypto'
  if (p.includes('fitness') || p.includes('gym')) return 'fitness'
  if (p.includes('agency') || p.includes('design')) return 'agency'
  if (p.includes('ai') || p.includes('note')) return 'ai'
  if (p.includes('shop') || p.includes('store') || p.includes('commerce')) return 'shop'
  return 'product'
}

const COPY = {
  ai: { headline: 'Think faster with intelligent notes', sub: 'Capture ideas, let AI organize them, and find anything in seconds.' },
  crypto: { headline: 'Your keys. Your coins. Your future.', sub: 'A secure, self-custody wallet built for everyday use.' },
  fitness: { headline: 'Train smarter. Move better.', sub: 'Personalized plans that adapt to your progress every week.' },
  agency: { headline: 'We design brands people remember', sub: 'A small studio crafting identity, web and motion for ambitious teams.' },
  shop: { headline: 'Discover products you will love', sub: 'Curated collections delivered to your door in two days.' },
  product: { headline: 'Build something people love', sub: 'The simplest way to launch, grow and scale your next big idea.' },
}

export function generateLocal(prompt) {
  const p = prompt.toLowerCase()
  const accent = detectAccent(prompt)
  const brand = guessBrand(prompt)
  const copy = COPY[topicWord(prompt)]
  const sections = [{ type: 'navbar', brand, links: ['Features', 'Pricing', 'About'] }]

  const wantsLogin = /(login|log in|sign in|signin|sign-up|signup|register)/.test(p)
  const wantsDash = /(dashboard|analytics|admin|metrics|overview)/.test(p)
  const wantsPricing = /(pricing|plans|saas|subscription)/.test(p)
  const wantsContact = /(contact|get in touch|reach us)/.test(p)

  if (wantsLogin) {
    sections.push({ type: 'form', variant: 'login', title: 'Welcome back', sub: 'Sign in to continue to ' + brand + '.' })
  } else if (wantsDash) {
    sections.push({
      type: 'stats',
      title: 'Overview',
      items: [
        { label: 'Revenue', value: '$48.2k', delta: '+12.4%' },
        { label: 'Orders', value: '1,284', delta: '+8.1%' },
        { label: 'Visitors', value: '32.9k', delta: '+21.3%' },
        { label: 'Conversion', value: '4.8%', delta: '-0.4%' },
      ],
    })
    sections.push({ type: 'chart', title: 'Weekly activity', values: [40, 62, 48, 80, 58, 92, 70] })
  } else if (wantsContact) {
    sections.push({ type: 'hero', headline: copy.headline, sub: copy.sub, cta: 'Start a project', secondary: 'See our work' })
    sections.push({ type: 'form', variant: 'contact', title: 'Let us talk', sub: 'Tell us about your project and we will reply within a day.' })
  } else {
    sections.push({ type: 'hero', headline: copy.headline, sub: copy.sub, cta: 'Get started', secondary: 'Watch demo' })
    sections.push({
      type: 'features',
      title: 'Everything you need',
      items: [
        { title: 'Lightning fast', text: 'Optimized from the ground up so everything feels instant.' },
        { title: 'Secure by default', text: 'Enterprise-grade protection without the configuration.' },
        { title: 'Made for teams', text: 'Share, comment and ship together in real time.' },
      ],
    })
    if (wantsPricing) {
      sections.push({
        type: 'pricing',
        title: 'Simple, honest pricing',
        plans: [
          { name: 'Starter', price: '$0', features: ['1 project', 'Community support'], highlight: false },
          { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Priority support', 'Custom themes'], highlight: true },
          { name: 'Team', price: '$99', features: ['Everything in Pro', 'SSO', 'Audit logs'], highlight: false },
        ],
      })
    }
    sections.push({ type: 'cta', title: 'Ready to get started?', text: 'Join thousands of happy customers today.', button: 'Create free account' })
  }
  sections.push({ type: 'footer', brand })
  return { title: brand, accent, sections }
}

const SCHEMA_HELP = `Return ONLY valid JSON, no markdown, matching this schema:
{
  "title": string,
  "accent": string (hex color like #8b5cf6),
  "sections": array of objects, each one of:
    {"type":"navbar","brand":string,"links":[string]}
    {"type":"hero","headline":string,"sub":string,"cta":string,"secondary":string}
    {"type":"features","title":string,"items":[{"title":string,"text":string}]}
    {"type":"pricing","title":string,"plans":[{"name":string,"price":string,"features":[string],"highlight":boolean}]}
    {"type":"stats","title":string,"items":[{"label":string,"value":string,"delta":string}]}
    {"type":"chart","title":string,"values":[number 0-100]}
    {"type":"form","variant":"login"|"contact"|"newsletter","title":string,"sub":string}
    {"type":"cta","title":string,"text":string,"button":string}
    {"type":"footer","brand":string}
}
Use 3 to 8 sections, start with a navbar and end with a footer. Write realistic, specific copy.`

const ALLOWED = ['navbar', 'hero', 'features', 'pricing', 'stats', 'chart', 'form', 'cta', 'footer']

export function validateSpec(spec) {
  if (!spec || typeof spec !== 'object' || !Array.isArray(spec.sections)) throw new Error('Gemini returned an unexpected structure.')
  const sections = spec.sections.filter((s) => s && ALLOWED.includes(s.type))
  if (sections.length === 0) throw new Error('Gemini returned no usable sections.')
  const accent = typeof spec.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(spec.accent) ? spec.accent : '#6366f1'
  return { title: String(spec.title || 'Generated UI'), accent, sections }
}

export async function generateWithGemini(prompt, apiKey) {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
    encodeURIComponent(apiKey)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: SCHEMA_HELP + '\n\nUser request: ' + prompt }] }],
      generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
    }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      const j = await res.json()
      detail = j && j.error && j.error.message ? j.error.message : ''
    } catch (e) {
      /* ignore */
    }
    throw new Error('Gemini request failed (' + res.status + ')' + (detail ? ': ' + detail : ''))
  }
  const data = await res.json()
  const text =
    data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
      ? data.candidates[0].content.parts.map((p) => p.text || '').join('')
      : ''
  const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  return validateSpec(JSON.parse(cleaned))
}

// ---------------------------------------------------------------------------
// Spec -> React code
// ---------------------------------------------------------------------------
const q = (v) => JSON.stringify(v == null ? '' : String(v))

function indent(str, n) {
  const pad = ' '.repeat(n)
  return str
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n')
}

function sectionCode(s) {
  switch (s.type) {
    case 'navbar':
      return `<header className="flex items-center justify-between border-b border-line px-6 py-4">
  <span className="text-lg font-extrabold">{${q(s.brand)}}</span>
  <nav className="hidden gap-6 text-sm text-muted sm:flex">
    {${JSON.stringify(s.links || [])}.map((l) => <a key={l} href="#">{l}</a>)}
  </nav>
  <button style={{ background: ACCENT }} className="rounded-lg px-4 py-2 text-sm font-semibold text-white">Sign up</button>
</header>`
    case 'hero':
      return `<section className="px-6 py-20 text-center">
  <h1 className="mx-auto max-w-2xl text-4xl font-extrabold sm:text-5xl">{${q(s.headline)}}</h1>
  <p className="mx-auto mt-4 max-w-xl text-muted">{${q(s.sub)}}</p>
  <div className="mt-8 flex justify-center gap-3">
    <button style={{ background: ACCENT }} className="rounded-xl px-6 py-3 font-semibold text-white">{${q(s.cta)}}</button>
    <button className="rounded-xl border border-line px-6 py-3 font-semibold">{${q(s.secondary)}}</button>
  </div>
</section>`
    case 'features':
      return `<section className="px-6 py-16">
  <h2 className="text-center text-3xl font-extrabold">{${q(s.title)}}</h2>
  <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
    {${JSON.stringify(s.items || [], null, 2)}.map((f) => (
      <div key={f.title} className="rounded-2xl border border-line bg-surface p-6">
        <div style={{ background: ACCENT }} className="mb-3 h-9 w-9 rounded-lg opacity-90" />
        <h3 className="font-bold">{f.title}</h3>
        <p className="mt-1 text-sm text-muted">{f.text}</p>
      </div>
    ))}
  </div>
</section>`
    case 'pricing':
      return `<section className="px-6 py-16">
  <h2 className="text-center text-3xl font-extrabold">{${q(s.title)}}</h2>
  <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
    {${JSON.stringify(s.plans || [], null, 2)}.map((p) => (
      <div key={p.name} style={p.highlight ? { borderColor: ACCENT } : undefined} className="rounded-2xl border-2 border-line bg-surface p-6">
        <p className="font-semibold">{p.name}</p>
        <p className="mt-2 text-4xl font-extrabold">{p.price}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {p.features.map((f) => <li key={f}>{'✓ ' + f}</li>)}
        </ul>
      </div>
    ))}
  </div>
</section>`
    case 'stats':
      return `<section className="px-6 py-10">
  <h2 className="text-2xl font-extrabold">{${q(s.title)}}</h2>
  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {${JSON.stringify(s.items || [], null, 2)}.map((i) => (
      <div key={i.label} className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm text-muted">{i.label}</p>
        <p className="mt-1 text-2xl font-extrabold">{i.value}</p>
        <p className="mt-1 text-xs font-semibold" style={{ color: ACCENT }}>{i.delta}</p>
      </div>
    ))}
  </div>
</section>`
    case 'chart':
      return `<section className="px-6 pb-10">
  <div className="rounded-2xl border border-line bg-surface p-5">
    <h3 className="font-bold">{${q(s.title)}}</h3>
    <div className="mt-4 flex h-40 items-end gap-3">
      {${JSON.stringify(s.values || [])}.map((v, i) => (
        <div key={i} style={{ height: v + '%', background: ACCENT }} className="flex-1 rounded-t-lg" />
      ))}
    </div>
  </div>
</section>`
    case 'form':
      if (s.variant === 'login')
        return `<section className="px-6 py-16">
  <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-sm space-y-3 rounded-2xl border border-line bg-surface p-6">
    <h2 className="text-xl font-extrabold">{${q(s.title)}}</h2>
    <p className="text-sm text-muted">{${q(s.sub)}}</p>
    <input type="email" placeholder="Email" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
    <input type="password" placeholder="Password" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
    <button style={{ background: ACCENT }} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white">Sign in</button>
  </form>
</section>`
      if (s.variant === 'newsletter')
        return `<section className="px-6 py-16">
  <form onSubmit={(e) => e.preventDefault()} className="mx-auto flex max-w-md gap-2 rounded-full border border-line bg-surface p-1.5 pl-4">
    <input type="email" placeholder="Your email" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
    <button style={{ background: ACCENT }} className="rounded-full px-5 py-2 text-sm font-semibold text-white">Subscribe</button>
  </form>
</section>`
      return `<section className="px-6 py-16">
  <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-lg space-y-3 rounded-2xl border border-line bg-surface p-6">
    <h2 className="text-xl font-extrabold">{${q(s.title)}}</h2>
    <p className="text-sm text-muted">{${q(s.sub)}}</p>
    <input placeholder="Your name" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
    <input type="email" placeholder="Email" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
    <textarea rows={4} placeholder="Message" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
    <button style={{ background: ACCENT }} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white">Send message</button>
  </form>
</section>`
    case 'cta':
      return `<section className="px-6 py-16">
  <div style={{ background: ACCENT }} className="mx-auto max-w-4xl rounded-3xl px-8 py-12 text-center text-white">
    <h2 className="text-3xl font-extrabold">{${q(s.title)}}</h2>
    <p className="mt-2 opacity-90">{${q(s.text)}}</p>
    <button className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black">{${q(s.button)}}</button>
  </div>
</section>`
    case 'footer':
      return `<footer className="border-t border-line px-6 py-8 text-center text-sm text-muted">
  {'© ' + new Date().getFullYear() + ' ' + ${q(s.brand)} + '. All rights reserved.'}
</footer>`
    default:
      return ''
  }
}

export function specToCode(spec) {
  const body = spec.sections.map((s) => indent(sectionCode(s), 6)).join('\n')
  return `// Generated by React UI Studio
// Requires Tailwind CSS with the theme colors (bg, surface, fg, muted, line) from tailwind.config.js
const ACCENT = ${q(spec.accent)}

export default function ${(spec.title || 'Generated').replace(/[^A-Za-z0-9]/g, '') || 'Generated'}Page() {
  return (
    <div className="min-h-screen bg-bg text-fg">
${body}
    </div>
  )
}
`
}
