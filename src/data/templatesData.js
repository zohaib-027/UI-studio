export const templatesData = [
  {
    id: 'saas',
    name: 'SaaS Landing Page',
    description: 'Hero, social proof, features grid and pricing for software products.',
    tags: ['Marketing', 'Pricing', 'Hero'],
    icon: 'Rocket',
    code: `export default function SaasLanding() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <header className="flex items-center justify-between px-8 py-5">
        <span className="text-xl font-extrabold">Flowly</span>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Start free</button>
      </header>
      <section className="px-8 py-24 text-center">
        <h1 className="text-5xl font-extrabold">Ship faster with <span className="text-gradient">Flowly</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">The workflow platform for modern product teams.</p>
        <button className="mt-8 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white">Get started</button>
      </section>
      <section className="grid gap-4 px-8 pb-24 md:grid-cols-3">
        {['Automate', 'Collaborate', 'Analyze'].map((f) => (
          <div key={f} className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-bold">{f}</h3>
            <p className="mt-1 text-sm text-muted">Everything you need to {f.toLowerCase()} with confidence.</p>
          </div>
        ))}
      </section>
    </main>
  )
}`,
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio with intro, project grid and contact strip.',
    tags: ['Personal', 'Gallery', 'Creative'],
    icon: 'User',
    code: `export default function Portfolio() {
  const projects = ['Aurora App', 'Nimbus UI', 'Pixel Forge', 'Orbit CMS']
  return (
    <main className="min-h-screen bg-bg px-8 py-16 text-fg">
      <p className="text-sm font-semibold text-primary">Hello, I am</p>
      <h1 className="mt-2 text-6xl font-extrabold">Sara Khan</h1>
      <p className="mt-3 max-w-lg text-muted">Product designer and front-end engineer crafting delightful interfaces.</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p} className="group h-40 rounded-2xl border border-line bg-gradient-to-br from-primary/30 to-accent/20 p-5 transition hover:-translate-y-1">
            <h3 className="font-bold">{p}</h3>
          </div>
        ))}
      </div>
    </main>
  )
}`,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Storefront with product grid, ratings and add-to-cart actions.',
    tags: ['Shop', 'Grid', 'Cart'],
    icon: 'ShoppingBag',
    code: `export default function Store() {
  const products = [
    { name: 'Aero Sneakers', price: 120 },
    { name: 'Nova Backpack', price: 85 },
    { name: 'Pulse Watch', price: 199 },
  ]
  return (
    <main className="min-h-screen bg-bg px-8 py-10 text-fg">
      <h1 className="text-3xl font-extrabold">New arrivals</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {products.map((p) => (
          <article key={p.name} className="rounded-2xl border border-line bg-surface p-4">
            <div className="h-40 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30" />
            <h3 className="mt-3 font-semibold">{p.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">{'$' + p.price}</span>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white">Add</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}`,
  },
  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    description: 'Sidebar layout with KPI cards, a bar chart and recent activity.',
    tags: ['Admin', 'Charts', 'KPIs'],
    icon: 'LayoutDashboard',
    code: `export default function Dashboard() {
  const stats = [
    { label: 'Revenue', value: '$48.2k' },
    { label: 'Users', value: '12,480' },
    { label: 'Conversion', value: '4.8%' },
  ]
  const bars = [40, 65, 50, 80, 60, 95, 70]
  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <aside className="w-56 border-r border-line bg-surface p-5 font-bold">Pulse</aside>
      <main className="flex-1 p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex h-48 items-end gap-3 rounded-2xl border border-line bg-surface p-5">
          {bars.map((h, i) => (
            <div key={i} style={{ height: h + '%' }} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-accent" />
          ))}
        </div>
      </main>
    </div>
  )
}`,
  },
]

export default templatesData
