import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Box,
  Check,
  Code2,
  Cpu,
  Layers,
  LayoutTemplate,
  Palette,
  Play,
  Sparkles,
  Terminal,
  Wand2,
  Zap,
} from 'lucide-react'
import { FloatingMeshBackground, TiltCard } from '../components/ThreeDCards'

const features = [
  {
    icon: Sparkles,
    badge: 'Gemini 3.8 Live',
    title: 'AI UI Chat Architect',
    text: 'Describe any interface in plain words and watch live responsive previews and clean React JSX materialize.',
    to: '/ai-studio',
  },
  {
    icon: Layers,
    badge: '17+ Primitives',
    title: 'Live Component Library',
    text: 'Production-ready glassmorphic components with contrast toggles, favorites, and instant JSX export.',
    to: '/components',
  },
  {
    icon: Zap,
    badge: '60 FPS Physics',
    title: 'Motion & WebGL Lab',
    text: 'Spring physics, magnetic buttons, border beams, and Three.js spatial cards with live speed tuning.',
    to: '/effects',
  },
  {
    icon: Palette,
    badge: '198+ Swatches',
    title: 'Color & Token Studio',
    text: 'Seven global themes, custom 11-step shade scale generator, WCAG contrast checker, and mesh gradients.',
    to: '/colors',
  },
  {
    icon: LayoutTemplate,
    badge: '12+ Blueprints',
    title: 'Full-Page Templates',
    text: 'AI SaaS, Fintech Vault, API Docs, Split Auth, and E-Commerce layouts ready to preview and ship.',
    to: '/templates',
  },
  {
    icon: Wand2,
    badge: 'Real-Time CSS/JSX',
    title: 'Visual Inspector Playground',
    text: 'Tweak glass blur, linear gradients, radius, typography, and shadows with instant code output.',
    to: '/playground',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

/* -------------------------------------------------------------------------- */
/*                       Interactive 3D Spatial Hero Deck                     */
/* -------------------------------------------------------------------------- */

function SpatialHeroStage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), { stiffness: 160, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), { stiffness: 160, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1300 }}
      className="mx-auto mt-14 max-w-5xl px-2"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass-strong relative rounded-3xl border border-primary/40 bg-surface/60 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
      >
        {/* Ambient 3D Back Glow */}
        <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-primary/30 via-accent/25 to-primary/30 blur-2xl" />

        {/* Top Window Chrome */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="flex items-center justify-between border-b border-line/60 pb-4"
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px] text-muted">UIStudio — Spatial Workspace v3.8</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> 3D Engine Active
          </span>
        </div>

        {/* Floating 3D Layer Cards Inside Stage */}
        <div
          style={{ transformStyle: 'preserve-3d' }}
          className="mt-6 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Floating Layer 1 */}
          <motion.div
            style={{ transform: 'translateZ(42px)' }}
            whileHover={{ scale: 1.04 }}
            className="rounded-2xl border border-primary/40 bg-bg/85 p-4 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Prompt</span>
              <Sparkles size={14} className="text-primary" />
            </div>
            <p className="mt-2 font-mono text-xs text-fg/90">&ldquo;Dark crypto vault with neon glow&rdquo;</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </motion.div>

          {/* Floating Layer 2 */}
          <motion.div
            style={{ transform: 'translateZ(58px)' }}
            whileHover={{ scale: 1.04 }}
            className="rounded-2xl border border-line/80 bg-bg/90 p-4 shadow-2xl backdrop-blur-xl"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Design Tokens</span>
            <div className="mt-3 flex items-center gap-2">
              {['#8b5cf6', '#06b6d4', '#10b981', '#f43f5e'].map((c) => (
                <span
                  key={c}
                  style={{ backgroundColor: c }}
                  className="h-6 w-6 rounded-lg shadow-md ring-2 ring-white/10"
                />
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted">--primary: 139 92 246</p>
          </motion.div>

          {/* Floating Layer 3 */}
          <motion.div
            style={{ transform: 'translateZ(48px)' }}
            whileHover={{ scale: 1.04 }}
            className="rounded-2xl border border-line/80 bg-bg/85 p-4 shadow-xl backdrop-blur-xl"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Live Physics</span>
            <div className="mt-3 flex items-center justify-center gap-2.5 py-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-primary to-accent shadow-md"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
                />
              ))}
            </div>
            <p className="mt-2 text-center font-mono text-[10px] text-muted">stiffness: 260 • 60fps</p>
          </motion.div>

          {/* Floating Layer 4 */}
          <motion.div
            style={{ transform: 'translateZ(36px)' }}
            whileHover={{ scale: 1.04 }}
            className="flex flex-col justify-between rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/20 to-accent/20 p-4 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fg">JSX Output</span>
              <Code2 size={14} className="text-primary" />
            </div>
            <p className="mt-2 font-mono text-[11px] text-fg/90">&lt;GlassCard glow /&gt;</p>
            <Link
              to="/ai-studio"
              className="mt-3 inline-flex items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-[11px] font-bold text-white shadow-md transition hover:bg-primary/90"
            >
              Launch Studio <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Spotlight 3D Feature Card                         */
/* -------------------------------------------------------------------------- */

function SpotlightFeatureCard({ feature }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const Icon = feature.icon

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <TiltCard className="h-full" intensity={10}>
      <Link
        to={feature.to}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="glass-strong group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line/70 p-6 shadow-lg transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10"
      >
        {/* Dynamic Cursor Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, rgb(var(--primary) / 0.18), transparent 75%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
              <Icon size={22} />
            </div>
            <span className="rounded-full border border-line/70 bg-bg/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              {feature.badge}
            </span>
          </div>

          <h3 className="mt-5 text-lg font-extrabold tracking-tight text-fg transition-colors group-hover:text-primary">
            {feature.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">{feature.text}</p>
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
          <span>Explore Module</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
        </div>
      </Link>
    </TiltCard>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Main Home Page                               */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION WITH FULL 3D WEBGL MESH & SPATIAL DECK */}
      <section className="relative isolate overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-20 opacity-70" />
        <FloatingMeshBackground className="absolute inset-0 -z-10 opacity-90" />

        {/* Ambient Radial Orbs */}
        <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-bg to-transparent" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-6xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28"
        >
          <motion.div variants={item}>
            <Link
              to="/ai-studio"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-lg backdrop-blur-md transition hover:border-primary hover:bg-primary/20"
            >
              <Sparkles size={14} />
              <span>Powered by Gemini 3.8 Neural UI Engine</span>
              <ArrowRight size={13} />
            </Link>
          </motion.div>

          <motion.h1
            variants={item}
            className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Craft Next-Gen{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              3D &amp; AI React UIs
            </span>{' '}
            in Seconds
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-lg"
          >
            Generate full interfaces from a prompt, inspect 3D WebGL motion primitives, customize 198+ Tailwind tokens,
            and export production JSX—all inside your browser.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/ai-studio"
              className="btn-primary inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold shadow-xl shadow-primary/25 sm:text-base"
            >
              <Sparkles size={18} /> Open AI UI Studio <ArrowRight size={18} />
            </Link>
            <Link
              to="/templates"
              className="glass-strong inline-flex items-center gap-2 rounded-2xl border border-line/80 px-7 py-3.5 text-sm font-bold text-fg transition hover:border-primary/60 sm:text-base"
            >
              <Play size={16} className="text-primary" /> Explore Templates
            </Link>
          </motion.div>

          {/* Interactive 3D Perspective Stage */}
          <motion.div variants={item}>
            <SpatialHeroStage />
          </motion.div>
        </motion.div>
      </section>

      {/* LIVE METRICS & CAPABILITIES STRIP */}
      <section className="border-y border-line/60 bg-surface/30 py-8 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {[
            { value: '198+', label: 'Tailwind Color Tokens' },
            { value: '12+', label: 'Full-Page Templates' },
            { value: '60 FPS', label: 'Three.js & Spring Motion' },
            { value: '100%', label: 'Client-Side & Exportable' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3D BENTO FEATURES GRID */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
            <Box size={13} /> Complete Design Engineering Suite
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Everything for{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              modern interfaces
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Six integrated workspaces engineered to take your React projects from rough idea to shipped product.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} className="h-full">
              <SpotlightFeatureCard feature={f} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3-STEP SPATIAL WORKFLOW SECTION */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="glass-strong rounded-3xl border border-line/70 p-8 shadow-xl sm:p-12">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">How It Works</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
              From prompt to production JSX in three steps
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Terminal,
                title: 'Prompt or Pick a Blueprint',
                desc: 'Chat with the AI UI Architect or choose from 12+ pre-built SaaS, Dashboard, and Store layouts.',
              },
              {
                step: '02',
                icon: Cpu,
                title: 'Tune Tokens & 3D Motion',
                desc: 'Test mobile/tablet/desktop viewports, customize glass blur, brand colors, and spring animations.',
              },
              {
                step: '03',
                icon: Code2,
                title: 'Copy or Download Clean JSX',
                desc: 'Export zero-bloat React + Tailwind CSS code with one click and drop it straight into your codebase.',
              },
            ].map((w) => {
              const Icon = w.icon
              return (
                <div
                  key={w.step}
                  className="relative rounded-2xl border border-line/60 bg-bg/60 p-6 transition hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                      <Icon size={18} />
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-line">{w.step}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-fg">{w.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{w.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3D CALL-TO-ACTION VAULT */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <TiltCard intensity={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong glow-primary relative overflow-hidden rounded-3xl border border-primary/40 p-10 text-center shadow-2xl sm:p-16"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/35 blur-3xl" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles size={13} /> Ready to Ship
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Build your next interface in 3D
              </h2>
              <ul className="mx-auto mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted sm:text-sm">
                {['No account required', 'Live Gemini 3.8 AI', 'Clean Tailwind + React JSX'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={15} className="text-emerald-400" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  to="/playground"
                  className="btn-primary inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold shadow-xl shadow-primary/30 sm:text-base"
                >
                  Open Visual Playground <ArrowRight size={18} />
                </Link>
                <Link
                  to="/components"
                  className="rounded-2xl border border-line bg-surface/80 px-8 py-4 text-sm font-bold text-fg transition hover:border-primary/60 sm:text-base"
                >
                  Browse Components
                </Link>
              </div>
            </div>
          </motion.div>
        </TiltCard>
      </section>
    </div>
  )
}