import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Code2, Layers, LayoutTemplate, Palette, Sparkles, Wand2, Zap } from 'lucide-react'
import { FloatingMeshBackground, TiltCard } from '../components/ThreeDCards'

const features = [
  { icon: Layers, title: 'Live component library', text: '17 production-ready components with live previews and one-click code copy.', to: '/components' },
  { icon: Zap, title: 'Motion presets', text: 'Framer Motion effects: magnetic, spotlight, bounce, 3D tilt and more.', to: '/effects' },
  { icon: Palette, title: 'Seven themes', text: 'Dark, Light, Neon, Emerald, Purple, Midnight and Glass tokens.', to: '/colors' },
  { icon: LayoutTemplate, title: 'Page templates', text: 'SaaS, portfolio, store and dashboard layouts ready to ship.', to: '/templates' },
  { icon: Wand2, title: 'Visual playground', text: 'Tweak padding, radius, shadows and colors with live JSX output.', to: '/playground' },
  { icon: Sparkles, title: 'AI UI generator', text: 'Describe an interface in words and get a preview plus React code.', to: '/ai-studio' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

function MicroPreviews() {
  return (
    <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="glass flex items-center justify-center rounded-2xl p-6">
        <button className="btn-primary">Get started</button>
      </div>
      <div className="glass flex items-center justify-center gap-2 rounded-2xl p-6">
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">Active</span>
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">New</span>
      </div>
      <div className="glass flex flex-col justify-center gap-2 rounded-2xl p-6">
        <div className="h-2.5 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-line" />
        <div className="mt-1 h-8 rounded-lg bg-gradient-to-r from-primary to-accent" />
      </div>
      <div className="glass flex items-center justify-center rounded-2xl p-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="h-3 w-3 rounded-full bg-primary" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-20" />
        <FloatingMeshBackground className="absolute inset-0 -z-10 opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-5xl px-6 pb-24 pt-24 text-center sm:pt-32">
          <motion.span variants={item} className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles size={14} /> New: AI-powered UI generation
          </motion.span>
          <motion.h1 variants={item} className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            Design stunning React UIs <span className="text-gradient">in minutes</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Browse live components, remix themes, craft motion and generate whole interfaces from a sentence. Everything runs in your browser.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/ai-studio" className="btn-primary px-7 py-3.5 text-base">
              Try AI Studio <ArrowRight size={18} />
            </Link>
            <Link to="/components" className="btn-ghost px-7 py-3.5 text-base">
              <Code2 size={18} /> Browse components
            </Link>
          </motion.div>
          <motion.div variants={item}>
            <MicroPreviews />
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">
            Everything for <span className="text-gradient">modern interfaces</span>
          </h2>
          <p className="mt-3 text-muted">A complete toolkit for exploring, customizing and exporting UI.</p>
        </div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div key={f.title} variants={item}>
                <TiltCard className="h-full" intensity={8}>
                  <Link to={f.to} className="glass group block h-full rounded-2xl p-6 transition hover:border-primary/60">
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-muted">{f.text}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Open <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass glow-primary relative overflow-hidden rounded-3xl p-10 text-center sm:p-14"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <h2 className="section-title">Ready to build something beautiful?</h2>
            <ul className="mx-auto mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {['No sign-up', 'Runs fully in-browser', 'Copy-paste ready code'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={14} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
            <Link to="/playground" className="btn-primary mt-8 px-8 py-3.5 text-base">
              Open the Playground <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
