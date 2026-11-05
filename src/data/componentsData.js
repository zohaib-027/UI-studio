export const categories = ['All', 'Buttons', 'Cards', 'Forms', 'Navbars', 'Modals', 'Loaders', 'Toasts', 'Badges']

export const componentsData = [
  {
    id: 'btn-gradient',
    name: 'Gradient Button',
    category: 'Buttons',
    description: 'Primary call-to-action with a gradient fill, lift and press feedback.',
    tags: ['cta', 'gradient', 'hover'],
    code: `export default function GradientButton({ children = 'Get Started' }) {
  return (
    <button className="rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-primary/40 active:scale-95">
      {children}
    </button>
  )
}`,
  },
  {
    id: 'btn-outline',
    name: 'Outline Button',
    category: 'Buttons',
    description: 'Secondary action with a border that fills on hover.',
    tags: ['secondary', 'outline'],
    code: `export default function OutlineButton({ children = 'Learn more' }) {
  return (
    <button className="rounded-xl border border-primary/60 px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white">
      {children}
    </button>
  )
}`,
  },
  {
    id: 'btn-glow',
    name: 'Glow Button',
    category: 'Buttons',
    description: 'Icon button with an animated glowing halo.',
    tags: ['glow', 'icon', 'framer-motion'],
    code: `import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function GlowButton({ children = 'Boost' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgb(var(--primary)/0.6)]"
    >
      <Zap size={18} />
      {children}
    </motion.button>
  )
}`,
  },
  {
    id: 'card-glass',
    name: 'Glass Card',
    category: 'Cards',
    description: 'Frosted card with an icon, copy and a call to action.',
    tags: ['glass', 'feature'],
    code: `import { Sparkles } from 'lucide-react'

export default function GlassCard() {
  return (
    <div className="glass w-72 rounded-2xl p-6">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/20 text-primary">
        <Sparkles size={22} />
      </div>
      <h3 className="text-lg font-bold">Smart Design</h3>
      <p className="mt-1 text-sm text-muted">Beautiful defaults that adapt to your theme automatically.</p>
      <a className="mt-4 inline-block text-sm font-semibold text-primary" href="#">Explore</a>
    </div>
  )
}`,
  },
  {
    id: 'card-pricing',
    name: 'Pricing Card',
    category: 'Cards',
    description: 'Highlighted plan card with feature checklist.',
    tags: ['pricing', 'saas'],
    code: `import { Check } from 'lucide-react'

export default function PricingCard() {
  const features = ['Unlimited projects', 'Priority support', 'Custom themes']
  return (
    <div className="w-64 rounded-2xl border-2 border-primary bg-surface p-6 shadow-xl">
      <p className="text-sm font-semibold text-primary">Pro</p>
      <p className="mt-2 text-4xl font-extrabold">$29<span className="text-base font-medium text-muted">/mo</span></p>
      <ul className="mt-4 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2"><Check size={16} className="text-primary" />{f}</li>
        ))}
      </ul>
      <button className="mt-6 w-full rounded-xl bg-primary py-2.5 font-semibold text-white">Choose plan</button>
    </div>
  )
}`,
  },
  {
    id: 'form-login',
    name: 'Login Form',
    category: 'Forms',
    description: 'Email and password form with focus rings.',
    tags: ['auth', 'inputs'],
    code: `export default function LoginForm() {
  return (
    <form className="w-72 space-y-3 rounded-2xl border border-line bg-surface p-6" onSubmit={(e) => e.preventDefault()}>
      <h3 className="text-lg font-bold">Welcome back</h3>
      <input type="email" placeholder="you@email.com" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
      <input type="password" placeholder="Password" className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
      <button className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white">Sign in</button>
    </form>
  )
}`,
  },
  {
    id: 'form-newsletter',
    name: 'Newsletter Input',
    category: 'Forms',
    description: 'Inline email capture with a submit state.',
    tags: ['email', 'inline'],
    code: `import { useState } from 'react'
import { Mail, Check } from 'lucide-react'

export default function Newsletter() {
  const [done, setDone] = useState(false)
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setDone(true) }}
      className="flex w-80 items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-4"
    >
      <Mail size={16} className="text-muted" />
      <input type="email" required placeholder="Your email" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
      <button className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
        {done ? <><Check size={14} /> Done</> : 'Join'}
      </button>
    </form>
  )
}`,
  },
  {
    id: 'nav-glass',
    name: 'Glass Navbar',
    category: 'Navbars',
    description: 'Floating blurred navigation bar with links and CTA.',
    tags: ['header', 'glass'],
    code: `export default function GlassNavbar() {
  return (
    <nav className="glass flex w-full max-w-md items-center justify-between rounded-2xl px-4 py-3">
      <span className="font-extrabold">Acme</span>
      <div className="hidden gap-4 text-sm text-muted sm:flex">
        <a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a>
      </div>
      <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white">Sign up</button>
    </nav>
  )
}`,
  },
  {
    id: 'nav-tabs',
    name: 'Animated Tabs',
    category: 'Navbars',
    description: 'Tab bar with a sliding highlight powered by layout animations.',
    tags: ['tabs', 'framer-motion'],
    code: `import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedTabs() {
  const tabs = ['Overview', 'Activity', 'Settings']
  const [active, setActive] = useState(tabs[0])
  return (
    <div className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
      {tabs.map((t) => (
        <button key={t} onClick={() => setActive(t)} className="relative px-4 py-2 text-sm font-medium">
          {active === t && (
            <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-lg bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          )}
          <span className={active === t ? 'relative text-white' : 'relative text-muted'}>{t}</span>
        </button>
      ))}
    </div>
  )
}`,
  },
  {
    id: 'modal-confirm',
    name: 'Confirm Modal',
    category: 'Modals',
    description: 'Animated dialog with backdrop and spring entrance.',
    tags: ['dialog', 'overlay'],
    code: `import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function ConfirmModal() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white">Delete project</button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold">Are you sure?</h3>
              <p className="mt-1 text-sm text-muted">This action cannot be undone.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setOpen(false)} className="rounded-lg border border-line px-4 py-2 text-sm">Cancel</button>
                <button onClick={() => setOpen(false)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}`,
  },
  {
    id: 'loader-spinner',
    name: 'Gradient Spinner',
    category: 'Loaders',
    description: 'Lightweight conic-gradient spinner.',
    tags: ['spinner', 'loading'],
    code: `export default function Spinner() {
  return (
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-line border-t-primary" role="status" aria-label="Loading" />
  )
}`,
  },
  {
    id: 'loader-dots',
    name: 'Bouncing Dots',
    category: 'Loaders',
    description: 'Three dots with staggered bounce animation.',
    tags: ['dots', 'framer-motion'],
    code: `import { motion } from 'framer-motion'

export default function BouncingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-3 w-3 rounded-full bg-primary"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  )
}`,
  },
  {
    id: 'loader-skeleton',
    name: 'Skeleton Card',
    category: 'Loaders',
    description: 'Shimmering placeholder for loading content.',
    tags: ['skeleton', 'shimmer'],
    code: `export default function SkeletonCard() {
  const shimmer = 'relative overflow-hidden bg-line/60 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'
  return (
    <div className="w-64 space-y-3 rounded-2xl border border-line bg-surface p-4">
      <div className={shimmer + ' h-24 rounded-xl'} />
      <div className={shimmer + ' h-4 w-3/4 rounded'} />
      <div className={shimmer + ' h-4 w-1/2 rounded'} />
    </div>
  )
}`,
  },
  {
    id: 'toast-success',
    name: 'Success Toast',
    category: 'Toasts',
    description: 'Auto-dismissing notification with slide-in motion.',
    tags: ['notification', 'success'],
    code: `import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessToast() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => setShow(false), 2500)
    return () => clearTimeout(t)
  }, [show])
  return (
    <div>
      <button onClick={() => setShow(true)} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white">Save changes</button>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-surface px-4 py-3 shadow-xl">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <span className="text-sm font-medium">Changes saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
  {
    id: 'toast-stack',
    name: 'Toast Stack',
    category: 'Toasts',
    description: 'Multiple stacked toasts with info, warning and success variants.',
    tags: ['stack', 'variants'],
    code: `import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, AlertTriangle, CheckCircle2, X } from 'lucide-react'

const variants = {
  info: { icon: Info, color: 'text-sky-400', text: 'New version available' },
  warn: { icon: AlertTriangle, color: 'text-amber-400', text: 'Storage almost full' },
  ok: { icon: CheckCircle2, color: 'text-emerald-400', text: 'Upload complete' },
}

export default function ToastStack() {
  const [items, setItems] = useState([])
  const push = (k) => setItems((l) => [...l, { id: Date.now() + Math.random(), k }])
  const remove = (id) => setItems((l) => l.filter((i) => i.id !== id))
  return (
    <div>
      <div className="flex gap-2">
        {Object.keys(variants).map((k) => (
          <button key={k} onClick={() => push(k)} className="rounded-lg border border-line px-3 py-1.5 text-sm capitalize">{k}</button>
        ))}
      </div>
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <AnimatePresence>
          {items.map((i) => {
            const V = variants[i.k]
            return (
              <motion.div layout key={i.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-xl">
                <V.icon size={18} className={V.color} />
                <span className="text-sm">{V.text}</span>
                <button onClick={() => remove(i.id)}><X size={14} /></button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'badge-status',
    name: 'Status Badges',
    category: 'Badges',
    description: 'Dot-prefixed status labels in four semantic colors.',
    tags: ['status', 'labels'],
    code: `export default function StatusBadges() {
  const items = [
    { label: 'Active', c: 'bg-emerald-500/15 text-emerald-400', d: 'bg-emerald-400' },
    { label: 'Pending', c: 'bg-amber-500/15 text-amber-400', d: 'bg-amber-400' },
    { label: 'Failed', c: 'bg-red-500/15 text-red-400', d: 'bg-red-400' },
    { label: 'Draft', c: 'bg-slate-500/15 text-slate-300', d: 'bg-slate-400' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i.label} className={'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ' + i.c}>
          <span className={'h-1.5 w-1.5 rounded-full ' + i.d} />{i.label}
        </span>
      ))}
    </div>
  )
}`,
  },
  {
    id: 'badge-pill',
    name: 'Gradient Pill',
    category: 'Badges',
    description: 'New-feature pill with a glowing border and icon.',
    tags: ['pill', 'new'],
    code: `import { Sparkles } from 'lucide-react'

export default function GradientPill({ children = 'New: AI Studio' }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-[0_0_20px_rgb(var(--primary)/0.3)]">
      <Sparkles size={14} />
      {children}
    </span>
  )
}`,
  },
]

export default componentsData
