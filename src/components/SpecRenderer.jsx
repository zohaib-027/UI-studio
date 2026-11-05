import { Check } from 'lucide-react'

function Section({ s, accent }) {
  switch (s.type) {
    case 'navbar':
      return (
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <span className="text-lg font-extrabold">{s.brand}</span>
          <nav className="hidden gap-6 text-sm text-muted sm:flex">
            {(s.links || []).map((l) => (
              <span key={l}>{l}</span>
            ))}
          </nav>
          <button style={{ background: accent }} className="rounded-lg px-4 py-2 text-sm font-semibold text-white">
            Sign up
          </button>
        </header>
      )
    case 'hero':
      return (
        <section className="px-6 py-16 text-center">
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-5xl">{s.headline}</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">{s.sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button style={{ background: accent }} className="rounded-xl px-6 py-3 font-semibold text-white">
              {s.cta}
            </button>
            <button className="rounded-xl border border-line px-6 py-3 font-semibold">{s.secondary}</button>
          </div>
        </section>
      )
    case 'features':
      return (
        <section className="px-6 py-12">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{s.title}</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
            {(s.items || []).map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-surface p-6">
                <div style={{ background: accent }} className="mb-3 h-9 w-9 rounded-lg opacity-90" />
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      )
    case 'pricing':
      return (
        <section className="px-6 py-12">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{s.title}</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
            {(s.plans || []).map((p) => (
              <div key={p.name} style={p.highlight ? { borderColor: accent } : undefined} className="rounded-2xl border-2 border-line bg-surface p-6">
                <p className="font-semibold">{p.name}</p>
                <p className="mt-2 text-4xl font-extrabold">{p.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {(p.features || []).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={14} style={{ color: accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )
    case 'stats':
      return (
        <section className="px-6 py-8">
          <h2 className="text-2xl font-extrabold">{s.title}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(s.items || []).map((i) => (
              <div key={i.label} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm text-muted">{i.label}</p>
                <p className="mt-1 text-2xl font-extrabold">{i.value}</p>
                <p className="mt-1 text-xs font-semibold" style={{ color: accent }}>
                  {i.delta}
                </p>
              </div>
            ))}
          </div>
        </section>
      )
    case 'chart':
      return (
        <section className="px-6 pb-8">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="font-bold">{s.title}</h3>
            <div className="mt-4 flex h-40 items-end gap-3">
              {(s.values || []).map((v, i) => (
                <div key={i} style={{ height: Math.max(4, Math.min(100, Number(v) || 0)) + '%', background: accent }} className="flex-1 rounded-t-lg" />
              ))}
            </div>
          </div>
        </section>
      )
    case 'form':
      if (s.variant === 'login')
        return (
          <section className="px-6 py-12">
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-sm space-y-3 rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-xl font-extrabold">{s.title}</h2>
              <p className="text-sm text-muted">{s.sub}</p>
              <input type="email" placeholder="Email" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
              <input type="password" placeholder="Password" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
              <button style={{ background: accent }} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white">
                Sign in
              </button>
            </form>
          </section>
        )
      if (s.variant === 'newsletter')
        return (
          <section className="px-6 py-12">
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto flex max-w-md gap-2 rounded-full border border-line bg-surface p-1.5 pl-4">
              <input type="email" placeholder="Your email" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              <button style={{ background: accent }} className="rounded-full px-5 py-2 text-sm font-semibold text-white">
                Subscribe
              </button>
            </form>
          </section>
        )
      return (
        <section className="px-6 py-12">
          <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-lg space-y-3 rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-xl font-extrabold">{s.title}</h2>
            <p className="text-sm text-muted">{s.sub}</p>
            <input placeholder="Your name" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
            <input type="email" placeholder="Email" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
            <textarea rows={4} placeholder="Message" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none" />
            <button style={{ background: accent }} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white">
              Send message
            </button>
          </form>
        </section>
      )
    case 'cta':
      return (
        <section className="px-6 py-12">
          <div style={{ background: accent }} className="mx-auto max-w-4xl rounded-3xl px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{s.title}</h2>
            <p className="mt-2 opacity-90">{s.text}</p>
            <button className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black">{s.button}</button>
          </div>
        </section>
      )
    case 'footer':
      return (
        <footer className="border-t border-line px-6 py-8 text-center text-sm text-muted">
          {'© ' + new Date().getFullYear() + ' ' + s.brand + '. All rights reserved.'}
        </footer>
      )
    default:
      return null
  }
}

export default function SpecRenderer({ spec }) {
  return (
    <div className="bg-bg text-fg">
      {spec.sections.map((s, i) => (
        <Section key={i} s={s} accent={spec.accent} />
      ))}
    </div>
  )
}
