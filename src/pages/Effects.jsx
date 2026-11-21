import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Box,
  Check,
  Code2,
  Copy,
  Download,
  Gauge,
  Hand,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Wand2,
} from 'lucide-react'
import ThreeDCards, { TiltCard } from '../components/ThreeDCards'
import CodeViewer from '../components/CodeViewer'
import Modal from '../components/Modal'
import { useClipboard } from '../hooks/useClipboard'
import { downloadTextFile, cn } from '../lib/utils'

function StageBox({ children, className = '' }) {
  return (
    <div
      className={
        'grid h-28 w-44 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg ' +
        className
      }
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Effect Demos                                 */
/* -------------------------------------------------------------------------- */

function FadeDemo({ run, speed }) {
  return (
    <motion.div
      key={run}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9 * speed, ease: 'easeOut' }}
    >
      <StageBox>Fade Reveal</StageBox>
    </motion.div>
  )
}

function SlideDemo({ run, speed }) {
  return (
    <motion.div
      key={run}
      initial={{ x: -110, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 130 / speed, damping: 16 }}
    >
      <StageBox>Spring Slide</StageBox>
    </motion.div>
  )
}

function BounceDemo({ run, speed }) {
  return (
    <motion.div
      key={run}
      initial={{ y: -85, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420 / speed, damping: 9, mass: 1 }}
    >
      <StageBox>Elastic Drop</StageBox>
    </motion.div>
  )
}

function StaggerWaveDemo({ run, speed }) {
  const items = ['Design', 'Motion', 'Ship']
  return (
    <motion.div
      key={run}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.14 * speed } },
      }}
      className="flex gap-2.5"
    >
      {items.map((label) => (
        <motion.div
          key={label}
          variants={{
            hidden: { opacity: 0, y: 22, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="rounded-xl border border-primary/40 bg-primary/15 px-3.5 py-2.5 text-xs font-bold text-primary shadow-sm"
        >
          {label}
        </motion.div>
      ))}
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
    x.set((e.clientX - (r.left + r.width / 2)) * 0.42)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.42)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div onMouseMove={onMove} onMouseLeave={reset} className="grid h-full w-full place-items-center">
      <motion.button
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/25"
      >
        Hover Near Me
      </motion.button>
    </div>
  )
}

function DraggableSpringDemo() {
  return (
    <div className="grid h-full w-full place-items-center">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.45}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.12, cursor: 'grabbing' }}
        className="flex cursor-grab select-none items-center gap-2 rounded-2xl border border-primary/50 bg-surface px-5 py-3 text-xs font-bold text-fg shadow-xl"
      >
        <Hand size={15} className="text-primary" />
        <span>Drag &amp; Release</span>
      </motion.div>
    </div>
  )
}

function SpotlightDemo() {
  const [pos, setPos] = useState({ x: 110, y: 70 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }
  return (
    <div
      onMouseMove={onMove}
      className="relative grid h-36 w-64 max-w-full place-items-center overflow-hidden rounded-2xl border border-line bg-surface shadow-inner"
      style={{
        backgroundImage: `radial-gradient(170px circle at ${pos.x}px ${pos.y}px, rgb(var(--primary) / 0.35), transparent 70%)`,
      }}
    >
      <span className="text-xs font-semibold text-fg/90">Move cursor inside</span>
    </div>
  )
}

function GlowDemo({ speed }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 12px rgb(var(--primary)/0.25)',
          '0 0 42px rgb(var(--primary)/0.85)',
          '0 0 12px rgb(var(--primary)/0.25)',
        ],
      }}
      transition={{ duration: 2.2 * speed, repeat: Infinity }}
      className="grid h-28 w-44 place-items-center rounded-2xl bg-primary text-sm font-bold text-white"
    >
      Ambient Pulse
    </motion.div>
  )
}

function ShimmerBorderDemo({ speed }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[2px] shadow-lg">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3.5 * speed, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0_280deg,rgb(var(--primary))_330deg,rgb(var(--accent))_360deg)]"
      />
      <div className="relative grid h-28 w-48 place-items-center rounded-[14px] bg-surface px-4 text-center">
        <div>
          <p className="text-xs font-bold text-fg">Border Beam</p>
          <p className="mt-0.5 text-[10px] text-muted">Conic sweep highlight</p>
        </div>
      </div>
    </div>
  )
}

function FlipCardDemo() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ perspective: 1000 }} className="h-32 w-52 cursor-pointer" onClick={() => setFlipped((f) => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 grid place-items-center rounded-2xl border border-line bg-surface p-4 text-center shadow-lg"
        >
          <div>
            <p className="text-xs font-bold text-fg">3D Front Face</p>
            <p className="mt-1 text-[10px] text-primary">Click to flip 180°</p>
          </div>
        </div>
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent p-4 text-center text-white shadow-lg"
        >
          <div>
            <p className="text-xs font-bold">3D Back Face</p>
            <p className="mt-1 text-[10px] opacity-90">Click to flip back</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function TiltDemo() {
  return (
    <TiltCard className="h-32 w-52">
      <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-xl">
        3D Perspective Tilt
      </div>
    </TiltCard>
  )
}

function Cube3DGyroDemo({ speed }) {
  return (
    <div style={{ perspective: 800 }} className="grid h-32 w-32 place-items-center">
      <motion.div
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 8 * speed, repeat: Infinity, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-20 w-20"
      >
        {[
          'translateZ(40px)',
          'rotateY(180deg) translateZ(40px)',
          'rotateY(90deg) translateZ(40px)',
          'rotateY(-90deg) translateZ(40px)',
          'rotateX(90deg) translateZ(40px)',
          'rotateX(-90deg) translateZ(40px)',
        ].map((tf, idx) => (
          <div
            key={idx}
            style={{ transform: tf }}
            className="absolute inset-0 grid place-items-center rounded-xl border border-primary/60 bg-primary/25 text-[10px] font-extrabold text-fg backdrop-blur-sm"
          >
            3D
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Stacked3DFanDemo() {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: 900 }}
      className="relative grid h-36 w-56 cursor-pointer place-items-center"
    >
      {[-1, 0, 1].map((offset, idx) => (
        <motion.div
          key={idx}
          animate={{
            rotateZ: hovered ? offset * 14 : offset * 3,
            x: hovered ? offset * 28 : offset * 4,
            y: hovered ? Math.abs(offset) * 6 : 0,
            scale: idx === 1 ? 1 : 0.94,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="absolute flex h-24 w-36 flex-col justify-between rounded-2xl border border-primary/50 bg-surface p-3 shadow-xl"
          style={{ zIndex: idx === 1 ? 10 : idx }}
        >
          <span className="h-2 w-6 rounded-full bg-primary" />
          <span className="text-[11px] font-bold">Card 0{idx + 1}</span>
        </motion.div>
      ))}
    </div>
  )
}

function Parallax3DDepthDemo() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 200, damping: 18 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div style={{ perspective: 900 }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative grid h-32 w-52 place-items-center rounded-2xl border border-accent/50 bg-gradient-to-br from-surface to-bg shadow-2xl"
      >
        <div
          style={{ transform: 'translateZ(35px)' }}
          className="rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-extrabold text-white shadow-lg"
        >
          Z-Depth Layer
        </div>
      </motion.div>
    </div>
  )
}

function Orbital3DRingsDemo({ speed }) {
  return (
    <div style={{ perspective: 800 }} className="relative grid h-36 w-36 place-items-center">
      <motion.div
        animate={{ rotateX: 65, rotateZ: 360 }}
        transition={{ duration: 4 * speed, repeat: Infinity, ease: 'linear' }}
        className="absolute h-32 w-32 rounded-full border-2 border-primary/70"
      />
      <motion.div
        animate={{ rotateY: 65, rotateZ: -360 }}
        transition={{ duration: 5 * speed, repeat: Infinity, ease: 'linear' }}
        className="absolute h-28 w-28 rounded-full border-2 border-dashed border-accent/80"
      />
      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-primary to-accent text-[11px] font-extrabold text-white shadow-lg">
        3D
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                      Multi-Language Code Generator                         */
/* -------------------------------------------------------------------------- */

function buildMultiLangCode(effect) {
  const reactCode = effect.code

  const vueCode = `<script setup>
import { ref } from 'vue'
// ${effect.name} — Vue 3 + Tailwind CSS
const active = ref(true)
</script>

<template>
  <div class="effect-${effect.id} grid h-32 w-48 place-items-center rounded-2xl bg-indigo-600 font-bold text-white shadow-lg">
    ${effect.name}
  </div>
</template>

<style scoped>
.effect-${effect.id} {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  transform-style: preserve-3d;
}
.effect-${effect.id}:hover {
  transform: perspective(900px) rotateX(8deg) rotateY(-8deg) scale(1.04);
}
</style>`

  const svelteCode = `<script>
  import { spring } from 'svelte/motion'
  // ${effect.name} — Svelte 5 Spring Physics
  let coords = spring({ x: 0, y: 0 }, { stiffness: 0.15, damping: 0.4 })
</script>

<div
  on:mousemove={(e) => coords.set({ x: e.offsetX * 0.05, y: e.offsetY * 0.05 })}
  on:mouseleave={() => coords.set({ x: 0, y: 0 })}
  style="transform: perspective(900px) rotateX({$coords.y}deg) rotateY({$coords.x}deg)"
  class="grid h-32 w-48 place-items-center rounded-2xl bg-indigo-600 font-bold text-white shadow-lg"
>
  ${effect.name}
</div>`

  const vanillaJsCode = `// ${effect.name} — Zero-Dependency Web Animations API (WAAPI)
const el = document.querySelector('#${effect.id}-box')

el.animate(
  [
    { opacity: 0, transform: 'perspective(900px) translateY(20px) scale(0.95)' },
    { opacity: 1, transform: 'perspective(900px) translateY(0px) scale(1)' }
  ],
  {
    duration: 700,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards'
  }
)`

  const pureCssCode = `/* ${effect.name} — Hardware-Accelerated Pure CSS */
.${effect.id}-effect {
  perspective: 900px;
  transform-style: preserve-3d;
  animation: ${effect.id}Enter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.${effect.id}-effect:hover {
  transform: rotateX(10deg) rotateY(-10deg) translateY(-4px);
}

@keyframes ${effect.id}Enter {
  from { opacity: 0; transform: translateY(24px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}`

  return [
    { label: 'React (JSX)', ext: '.jsx', code: reactCode },
    { label: 'Vue 3', ext: '.vue', code: vueCode },
    { label: 'Svelte', ext: '.svelte', code: svelteCode },
    { label: 'Vanilla JS', ext: '.js', code: vanillaJsCode },
    { label: 'Pure CSS', ext: '.css', code: pureCssCode },
  ]
}

/* -------------------------------------------------------------------------- */
/*                             Effects Catalog                                */
/* -------------------------------------------------------------------------- */

const CATEGORIES = ['All', '3D', 'Entrance', 'Interactive', 'Ambient']

const effects = [
  {
    id: 'cube-3d',
    name: '3D Glass Cube Gyroscope',
    category: '3D',
    text: 'True 6-face CSS/Framer 3D cube rotating continuously in perspective space.',
    Demo: Cube3DGyroDemo,
    code: `<div style={{ perspective: 800 }}>
  <motion.div
    animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    style={{ transformStyle: 'preserve-3d' }}
    className="relative h-24 w-24"
  >
    {/* 6 Faces positioned with translateZ(48px) */}
  </motion.div>
</div>`,
  },
  {
    id: 'stacked-fan-3d',
    name: '3D Stacked Deck Fan',
    category: '3D',
    text: 'Multi-card 3D deck that fans out with Z-rotation and horizontal spread on hover.',
    Demo: Stacked3DFanDemo,
    code: `{[-1, 0, 1].map((offset, idx) => (
  <motion.div
    key={idx}
    whileHover={{ rotateZ: offset * 14, x: offset * 28 }}
    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    className="absolute rounded-2xl border bg-surface p-4 shadow-xl"
  >
    Card 0{idx + 1}
  </motion.div>
))}`,
  },
  {
    id: 'parallax-depth-3d',
    name: '3D Z-Depth Parallax Card',
    category: '3D',
    text: 'Floating inner layer elevated along translateZ(35px) over a perspective container.',
    Demo: Parallax3DDepthDemo,
    code: `<motion.div
  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
  className="rounded-2xl border bg-surface p-6"
>
  <div style={{ transform: 'translateZ(35px)' }} className="rounded-xl bg-primary px-4 py-2 text-white">
    Z-Depth Layer
  </div>
</motion.div>`,
  },
  {
    id: 'orbital-rings-3d',
    name: '3D Gyro Orbital Rings',
    category: '3D',
    text: 'Dual counter-rotating 3D orbital rings around a glowing central core node.',
    Demo: Orbital3DRingsDemo,
    code: `<div style={{ perspective: 800 }} className="relative grid place-items-center">
  <motion.div
    animate={{ rotateX: 65, rotateZ: 360 }}
    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    className="absolute h-32 w-32 rounded-full border-2 border-primary"
  />
  <div className="h-12 w-12 rounded-full bg-primary" />
</div>`,
  },
  {
    id: 'flip',
    name: '3D Flip Card',
    category: '3D',
    text: 'Interactive 180° Y-axis spring rotation with backface visibility.',
    Demo: FlipCardDemo,
    code: `const [flipped, setFlipped] = useState(false)

<div style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)}>
  <motion.div
    animate={{ rotateY: flipped ? 180 : 0 }}
    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div style={{ backfaceVisibility: 'hidden' }}>Front</div>
    <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>Back</div>
  </motion.div>
</div>`,
  },
  {
    id: 'tilt',
    name: '3D Perspective Tilt',
    category: '3D',
    text: 'Pointer-driven X/Y axis rotation with realistic depth glare.',
    Demo: TiltDemo,
    code: `<TiltCard className="h-32 w-52">
  <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
    3D Perspective Tilt
  </div>
</TiltCard>`,
  },
  {
    id: 'fade',
    name: 'Fade & Scale Reveal',
    category: 'Entrance',
    text: 'Smooth opacity + subtle scale transition for clean section reveals.',
    replay: true,
    Demo: FadeDemo,
    code: `<motion.div
  initial={{ opacity: 0, scale: 0.94 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.9, ease: 'easeOut' }}
>
  Fade Reveal
</motion.div>`,
  },
  {
    id: 'slide',
    name: 'Spring Slide In',
    category: 'Entrance',
    text: 'Physics-driven horizontal entrance with natural momentum.',
    replay: true,
    Demo: SlideDemo,
    code: `<motion.div
  initial={{ x: -110, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 130, damping: 16 }}
>
  Spring Slide
</motion.div>`,
  },
  {
    id: 'bounce',
    name: 'Elastic Drop',
    category: 'Entrance',
    text: 'Low-damping spring physics for playful callouts and badges.',
    replay: true,
    Demo: BounceDemo,
    code: `<motion.div
  initial={{ y: -85, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 420, damping: 9 }}
>
  Elastic Drop
</motion.div>`,
  },
  {
    id: 'stagger',
    name: 'Staggered Wave',
    category: 'Entrance',
    text: 'Cascading child entrance using staggerChildren orchestration.',
    replay: true,
    Demo: StaggerWaveDemo,
    code: `<motion.div
  initial="hidden"
  animate="visible"
  variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
  className="flex gap-2.5"
>
  {['Design', 'Motion', 'Ship'].map((item) => (
    <motion.div
      key={item}
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>`,
  },
  {
    id: 'magnetic',
    name: 'Magnetic Hover',
    category: 'Interactive',
    text: 'Cursor-attracted spring button that snaps back on leave.',
    Demo: MagneticDemo,
    code: `const x = useMotionValue(0)
const y = useMotionValue(0)
const sx = useSpring(x, { stiffness: 220, damping: 14 })
const sy = useSpring(y, { stiffness: 220, damping: 14 })

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  x.set((e.clientX - (r.left + r.width / 2)) * 0.42)
  y.set((e.clientY - (r.top + r.height / 2)) * 0.42)
}

<div onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
  <motion.button style={{ x: sx, y: sy }}>Magnetic</motion.button>
</div>`,
  },
  {
    id: 'drag',
    name: 'Elastic Drag Pebble',
    category: 'Interactive',
    text: 'Tactile draggable element with zero-constraint spring snap-back.',
    Demo: DraggableSpringDemo,
    code: `<motion.div
  drag
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  dragElastic={0.45}
  whileDrag={{ scale: 1.12 }}
>
  Drag & Release
</motion.div>`,
  },
  {
    id: 'spotlight',
    name: 'Cursor Spotlight',
    category: 'Interactive',
    text: 'Dynamic radial light gradient tracking pointer coordinates.',
    Demo: SpotlightDemo,
    code: `const [pos, setPos] = useState({ x: 110, y: 70 })

<div
  onMouseMove={(e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }}
  style={{
    backgroundImage: \`radial-gradient(170px circle at \${pos.x}px \${pos.y}px, rgb(var(--primary) / 0.35), transparent 70%)\`,
  }}
/>`,
  },
  {
    id: 'border-beam',
    name: 'Shimmer Border Beam',
    category: 'Ambient',
    text: 'Rotating conic-gradient highlight around a sleek card container.',
    Demo: ShimmerBorderDemo,
    code: `<div className="relative overflow-hidden rounded-2xl p-[2px]">
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
    className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0_280deg,rgb(var(--primary))_330deg,rgb(var(--accent))_360deg)]"
  />
  <div className="relative rounded-[14px] bg-surface p-6">Border Beam</div>
</div>`,
  },
  {
    id: 'glow',
    name: 'Ambient Pulse Glow',
    category: 'Ambient',
    text: 'Infinite breathing box-shadow keyframe loop for active states.',
    Demo: GlowDemo,
    code: `<motion.div
  animate={{
    boxShadow: [
      '0 0 12px rgb(var(--primary)/0.25)',
      '0 0 42px rgb(var(--primary)/0.85)',
      '0 0 12px rgb(var(--primary)/0.25)',
    ],
  }}
  transition={{ duration: 2.2, repeat: Infinity }}
/>`,
  },
]

/* -------------------------------------------------------------------------- */
/*                               Effect Card                                  */
/* -------------------------------------------------------------------------- */

function EffectCard({ effect, globalRun, speed, onInspect }) {
  const [localRun, setLocalRun] = useState(0)
  const { copied, copy } = useClipboard()
  const Demo = effect.Demo
  const runKey = `${globalRun}-${localRun}`

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="glass-strong group flex flex-col overflow-hidden rounded-2xl border border-line/70 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Interactive Stage */}
      <div className="relative grid min-h-[225px] place-items-center overflow-hidden bg-bg/60 p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Category Pill */}
        <span className="absolute left-3.5 top-3.5 z-10 rounded-md border border-line/60 bg-surface/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted backdrop-blur-md">
          {effect.category}
        </span>

        {/* Replay Button on Stage */}
        {effect.replay && (
          <button
            onClick={() => setLocalRun((r) => r + 1)}
            className="absolute right-3.5 top-3.5 z-10 inline-flex items-center gap-1 rounded-lg border border-line/70 bg-surface/85 px-2.5 py-1 text-[11px] font-semibold text-fg backdrop-blur-md transition hover:border-primary/60 hover:text-primary"
            title="Replay animation"
          >
            <RotateCcw size={12} /> Replay
          </button>
        )}

        <div className="relative z-0 flex w-full items-center justify-center">
          <Demo run={runKey} speed={speed} />
        </div>
      </div>

      {/* Info & Multi-Language Code Controls */}
      <div className="flex flex-1 flex-col justify-between border-t border-line/60 bg-surface/70 p-4 backdrop-blur-xl">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-fg transition-colors group-hover:text-primary">
            {effect.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{effect.text}</p>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-line/40 pt-3">
          <button
            onClick={() => onInspect(effect)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/15 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            <Code2 size={14} /> Multi-Lang Code
          </button>
          <button
            onClick={() => copy(effect.code)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line/70 bg-bg/60 px-3 py-2 text-xs font-semibold text-fg transition hover:border-primary/50"
            title="Copy React JSX"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'React'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Main Effects Page                              */
/* -------------------------------------------------------------------------- */

export default function Effects() {
  const [category, setCategory] = useState('All')
  const [globalRun, setGlobalRun] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [inspected, setInspected] = useState(null)
  const [langIdx, setLangIdx] = useState(0)

  const filtered = category === 'All' ? effects : effects.filter((e) => e.category === category)
  const langTabs = inspected ? buildMultiLangCode(inspected) : []

  const openModal = (eff) => {
    setLangIdx(0)
    setInspected(eff)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Pro Studio Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-line/60 pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-inner">
            <Wand2 size={13} />
            <span>3D Motion &amp; Multi-Framework Lab</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Motion{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Effects Studio
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            GPU-accelerated 3D spatial animations &amp; spring physics. Export ready-to-use code for{' '}
            <span className="font-semibold text-fg">React, Vue 3, Svelte, Vanilla JS,</span> and{' '}
            <span className="font-semibold text-fg">Pure CSS</span>.
          </p>
        </div>

        {/* Global Replay & Playback Speed Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1 rounded-xl border border-line/70 bg-surface/60 p-1 text-xs backdrop-blur-md">
            <span className="flex items-center gap-1 px-2 text-[11px] font-medium text-muted">
              <Gauge size={13} className="text-primary" /> Speed:
            </span>
            {[
              { label: 'Snappy', val: 0.65 },
              { label: '1x', val: 1 },
              { label: 'Slow-Mo', val: 1.8 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  setSpeed(s.val)
                  setGlobalRun((r) => r + 1)
                }}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-[11px] font-semibold transition',
                  speed === s.val ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setGlobalRun((r) => r + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90"
          >
            <Play size={13} className="fill-white" /> Replay All
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-7 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const count = cat === 'All' ? effects.length : effects.filter((e) => e.category === cat).length
          const active = category === cat
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                active
                  ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                  : 'border-line/70 bg-surface/50 text-muted hover:border-primary/50 hover:text-fg'
              )}
            >
              {cat === '3D' && <Box size={12} />}
              <span>{cat}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px]',
                  active ? 'bg-white/20 text-white' : 'bg-line/50 text-muted'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Motion Effects Grid */}
      <motion.div layout className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((e) => (
            <EffectCard key={e.id} effect={e} globalRun={globalRun} speed={speed} onInspect={openModal} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Interactive WebGL 3D Showcase Section */}
      <section className="mt-16">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-[11px] font-semibold text-accent">
              <Sparkles size={12} /> Interactive WebGL Canvas
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Three.js Spatial Tilt Cards</h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Hardware-accelerated 3D meshes rendered with React Three Fiber. Move your cursor across the canvas to
              control perspective depth.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <Layers size={14} className="text-primary" /> 60 FPS WebGL Renderer
          </span>
        </div>

        <div className="glass-strong relative mt-5 overflow-hidden rounded-3xl border border-line/70 shadow-2xl">
          <ThreeDCards className="h-96 w-full" />
        </div>
      </section>

      {/* Multi-Language Effect Inspector Modal */}
      <Modal open={!!inspected} onClose={() => setInspected(null)} title={inspected ? inspected.name : ''}>
        {inspected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted sm:text-sm">{inspected.text}</p>
              {langTabs[langIdx] && (
                <button
                  onClick={() =>
                    downloadTextFile(`${inspected.id}${langTabs[langIdx].ext}`, langTabs[langIdx].code)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                  <Download size={13} /> Export {langTabs[langIdx].ext}
                </button>
              )}
            </div>

            {/* Live Stage inside Modal */}
            <div className="relative grid min-h-[190px] place-items-center overflow-hidden rounded-2xl border border-line/80 bg-bg/70 p-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="relative z-10 flex w-full items-center justify-center">
                <inspected.Demo run={globalRun} speed={speed} />
              </div>
            </div>

            {/* Language Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 p-1.5">
              {langTabs.map((t, idx) => (
                <button
                  key={t.label}
                  onClick={() => setLangIdx(idx)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                    langIdx === idx ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {langTabs[langIdx] && (
              <CodeViewer
                tabs={[{ label: `${inspected.id}${langTabs[langIdx].ext}`, code: langTabs[langIdx].code }]}
                maxHeight={320}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}