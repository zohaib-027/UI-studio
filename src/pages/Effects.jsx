import { useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Code2, RotateCcw } from 'lucide-react'
import ThreeDCards, { TiltCard } from '../components/ThreeDCards'
import CodeViewer from '../components/CodeViewer'

function Box({ children, className = '' }) {
  return (
    <div className={'grid h-28 w-44 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg ' + className}>
      {children}
    </div>
  )
}

function FadeDemo({ run }) {
  return (
    <motion.div key={run} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Box>Fade in</Box>
    </motion.div>
  )
}

function SlideDemo({ run }) {
  return (
    <motion.div key={run} initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
      <Box>Slide in</Box>
    </motion.div>
  )
}

function BounceDemo({ run }) {
  return (
    <motion.div key={run} initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 8, mass: 1 }}>
      <Box>Bounce</Box>
    </motion.div>
  )
}

function MagneticDemo() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <div onMouseMove={onMove} onMouseLeave={reset} className="grid h-full w-full place-items-center">
      <motion.button style={{ x: sx, y: sy }} className="rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-lg">
        Magnetic
      </motion.button>
    </div>
  )
}

function GlowDemo() {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 10px rgb(var(--primary)/0.3)', '0 0 45px rgb(var(--primary)/0.9)', '0 0 10px rgb(var(--primary)/0.3)'] }}
      transition={{ duration: 2.2, repeat: Infinity }}
      className="grid h-28 w-44 place-items-center rounded-2xl bg-primary text-sm font-bold text-white"
    >
      Pulsing glow
    </motion.div>
  )
}

function SpotlightDemo() {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }
  return (
    <div
      onMouseMove={onMove}
      className="relative grid h-36 w-64 max-w-full place-items-center overflow-hidden rounded-2xl border border-line bg-surface"
      style={{ backgroundImage: 'radial-gradient(180px circle at ' + pos.x + 'px ' + pos.y + 'px, rgb(var(--primary) / 0.35), transparent 70%)' }}
    >
      <span className="text-sm font-semibold">Move your cursor</span>
    </div>
  )
}

function TiltDemo() {
  return (
    <TiltCard className="h-32 w-52">
      <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent font-bold text-white shadow-xl">3D tilt</div>
    </TiltCard>
  )
}

const effects = [
  {
    id: 'fade',
    name: 'Fade In',
    text: 'Opacity transition for gentle reveals.',
    replay: true,
    Demo: FadeDemo,
    code: `<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
/>`,
  },
  {
    id: 'slide',
    name: 'Slide In',
    text: 'Spring-driven horizontal entrance.',
    replay: true,
    Demo: SlideDemo,
    code: `<motion.div
  initial={{ x: -120, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 120, damping: 16 }}
/>`,
  },
  {
    id: 'bounce',
    name: 'Bounce',
    text: 'Low damping spring for playful drops.',
    replay: true,
    Demo: BounceDemo,
    code: `<motion.div
  initial={{ y: -90, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 8 }}
/>`,
  },
  {
    id: 'magnetic',
    name: 'Magnetic Hover',
    text: 'Element is pulled toward the pointer.',
    Demo: MagneticDemo,
    code: `const x = useMotionValue(0)
const y = useMotionValue(0)
const sx = useSpring(x, { stiffness: 220, damping: 14 })
const sy = useSpring(y, { stiffness: 220, damping: 14 })

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  x.set((e.clientX - (r.left + r.width / 2)) * 0.4)
  y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
}

<div onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
  <motion.button style={{ x: sx, y: sy }}>Magnetic</motion.button>
</div>`,
  },
  {
    id: 'glow',
    name: 'Pulsing Glow',
    text: 'Looping box-shadow keyframes.',
    Demo: GlowDemo,
    code: `<motion.div
  animate={{
    boxShadow: [
      '0 0 10px rgb(var(--primary)/0.3)',
      '0 0 45px rgb(var(--primary)/0.9)',
      '0 0 10px rgb(var(--primary)/0.3)',
    ],
  }}
  transition={{ duration: 2.2, repeat: Infinity }}
/>`,
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    text: 'Radial gradient that follows the cursor.',
    Demo: SpotlightDemo,
    code: `const [pos, setPos] = useState({ x: 50, y: 50 })

<div
  onMouseMove={(e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }}
  style={{
    backgroundImage: 'radial-gradient(180px circle at ' + pos.x + 'px ' + pos.y + 'px, rgb(var(--primary) / 0.35), transparent 70%)',
  }}
/>`,
  },
  {
    id: 'tilt',
    name: '3D Tilt Card',
    text: 'Perspective rotation with a glare layer.',
    Demo: TiltDemo,
    code: `const rx = useMotionValue(0)
const ry = useMotionValue(0)
const springX = useSpring(rx, { stiffness: 200, damping: 18 })
const springY = useSpring(ry, { stiffness: 200, damping: 18 })

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  ry.set(((e.clientX - r.left) / r.width - 0.5) * 28)
  rx.set(-((e.clientY - r.top) / r.height - 0.5) * 28)
}

<div style={{ perspective: 900 }}>
  <motion.div
    onMouseMove={onMove}
    onMouseLeave={() => { rx.set(0); ry.set(0) }}
    style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
  />
</div>`,
  },
]

function EffectCard({ effect }) {
  const [run, setRun] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const Demo = effect.Demo
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="overflow-hidden rounded-2xl border border-line bg-surface/60"
    >
      <div className="relative grid min-h-[210px] place-items-center overflow-hidden bg-bg/50 p-6">
        <Demo run={run} />
      </div>
      <div className="border-t border-line p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold">{effect.name}</h3>
            <p className="text-xs text-muted">{effect.text}</p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {effect.replay && (
              <button onClick={() => setRun((r) => r + 1)} className="rounded-lg border border-line p-2 text-muted transition hover:border-primary/60 hover:text-fg" title="Replay" aria-label="Replay animation">
                <RotateCcw size={14} />
              </button>
            )}
            <button onClick={() => setShowCode((s) => !s)} className="rounded-lg border border-line p-2 text-muted transition hover:border-primary/60 hover:text-fg" title="Toggle code" aria-label="Toggle code">
              <Code2 size={14} />
            </button>
          </div>
        </div>
        {showCode && <CodeViewer className="mt-3" tabs={[{ label: 'Framer Motion', code: effect.code }]} maxHeight={260} />}
      </div>
    </motion.article>
  )
}

export default function Effects() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="section-title">
          Motion <span className="text-gradient">Effects</span>
        </h1>
        <p className="mt-3 text-muted">Interactive Framer Motion presets. Hover, replay and copy the code for each effect.</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {effects.map((e) => (
          <EffectCard key={e.id} effect={e} />
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold">WebGL tilt cards</h2>
        <p className="mt-1 text-sm text-muted">Real 3D cards rendered with React Three Fiber. They follow your pointer and grow on hover.</p>
        <div className="glass mt-5 overflow-hidden rounded-2xl">
          <ThreeDCards className="h-80 w-full" />
        </div>
      </section>
    </div>
  )
}
