import { Rocket, ShoppingBag, Star } from 'lucide-react'

function Saas() {
  const feats = ['Automate', 'Collaborate', 'Analyze']
  return (
    <main className="bg-bg text-fg">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="flex items-center gap-2 text-lg font-extrabold">
          <Rocket size={18} className="text-primary" /> Flowly
        </span>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Start free</button>
      </header>
      <section className="px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          Ship faster with <span className="text-gradient">Flowly</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">The workflow platform for modern product teams.</p>
        <button className="mt-8 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white">Get started</button>
      </section>
      <section className="grid gap-4 px-6 pb-12 sm:grid-cols-3">
        {feats.map((f) => (
          <div key={f} className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-bold">{f}</h3>
            <p className="mt-1 text-sm text-muted">Everything you need to {f.toLowerCase()} with confidence.</p>
          </div>
        ))}
      </section>
    </main>
  )
}

function Portfolio() {
  const projects = ['Aurora App', 'Nimbus UI', 'Pixel Forge', 'Orbit CMS']
  return (
    <main className="bg-bg px-6 py-12 text-fg">
      <p className="text-sm font-semibold text-primary">Hello, I am</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-6xl">Sara Khan</h1>
      <p className="mt-3 max-w-lg text-muted">Product designer and front-end engineer crafting delightful interfaces.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p} className="h-36 rounded-2xl border border-line bg-gradient-to-br from-primary/30 to-accent/20 p-5 transition hover:-translate-y-1">
            <h3 className="font-bold">{p}</h3>
            <p className="mt-1 text-xs text-muted">Case study</p>
          </div>
        ))}
      </div>
    </main>
  )
}

function Ecommerce() {
  const products = [
    { name: 'Aero Sneakers', price: 120 },
    { name: 'Nova Backpack', price: 85 },
    { name: 'Pulse Watch', price: 199 },
  ]
  return (
    <main className="bg-bg px-6 py-8 text-fg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">New arrivals</h1>
        <ShoppingBag size={20} className="text-primary" />
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {products.map((p) => (
          <article key={p.name} className="rounded-2xl border border-line bg-surface p-4">
            <div className="h-36 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30" />
            <h3 className="mt-3 font-semibold">{p.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-amber-400">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">{'$' + p.price}</span>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white">Add</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

function Dashboard() {
  const stats = [
    { label: 'Revenue', value: '$48.2k' },
    { label: 'Users', value: '12,480' },
    { label: 'Conversion', value: '4.8%' },
  ]
  const bars = [40, 65, 50, 80, 60, 95, 70]
  return (
    <div className="flex bg-bg text-fg">
      <aside className="hidden w-40 shrink-0 border-r border-line bg-surface p-5 sm:block">
        <p className="font-extrabold">Pulse</p>
        <ul className="mt-6 space-y-3 text-sm text-muted">
          <li className="font-semibold text-primary">Overview</li>
          <li>Reports</li>
          <li>Customers</li>
          <li>Settings</li>
        </ul>
      </aside>
      <main className="min-w-0 flex-1 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex h-44 items-end gap-3 rounded-2xl border border-line bg-surface p-5">
          {bars.map((h, i) => (
            <div key={i} style={{ height: h + '%' }} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-accent" />
          ))}
        </div>
      </main>
    </div>
  )
}

export const templatePreviews = {
  saas: Saas,
  portfolio: Portfolio,
  ecommerce: Ecommerce,
  dashboard: Dashboard,
}

export default function TemplatePreview({ id }) {
  const T = templatePreviews[id]
  return T ? <T /> : null
}
