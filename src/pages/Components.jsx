import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Box,
  Check,
  Code2,
  Copy,
  Download,
  Heart,
  Layers,
  LayoutGrid,
  Moon,
  RotateCcw,
  Rows3,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import { categories, componentsData } from '../data/componentsData'
import ComponentPreview from '../components/ComponentPreviews'
import ViewportResizer from '../components/ViewportResizer'
import CodeViewer from '../components/CodeViewer'
import Modal from '../components/Modal'
import { useClipboard } from '../hooks/useClipboard'
import { downloadTextFile, cn } from '../lib/utils'

const FAV_STORAGE = 'react-ui-studio-favorites'

function toPascal(name) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function toKebab(name) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

/* -------------------------------------------------------------------------- */
/*                      Multi-Framework Code Translator                       */
/* -------------------------------------------------------------------------- */

function generateMultiLangTabs(c) {
  const pascal = toPascal(c.name)
  const kebab = toKebab(c.name)

  // Extract JSX return block if available, otherwise provide clean structured markup
  const returnMatch = c.code.match(/return\s*\(([\s\S]*)\)\s*\}?\s*$/)
  const rawJsx = returnMatch ? returnMatch[1].trim() : `<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">\n  <h3 className="text-lg font-bold">${c.name}</h3>\n  <p className="mt-1 text-sm text-zinc-400">${c.description}</p>\n</div>`

  // Convert JSX attributes to standard HTML/Vue/Svelte attributes
  const htmlMarkup = rawJsx
    .replace(/className=/g, 'class=')
    .replace(/\{`([^`]*)`\}/g, '$1')
    .replace(/onClick=\{[^}]*\}/g, '')
    .replace(/onChange=\{[^}]*\}/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  const nextJsCode = `'use client'\n\n${c.code}`

  const tsxCode = `import React from 'react'\n\nexport interface ${pascal}Props {\n  className?: string\n}\n\n${c.code.replace(
    /export default function \w+\([^)]*\)/,
    `export default function ${pascal}({ className = '' }: ${pascal}Props)`
  )}`

  const vueCode = `<script setup lang="ts">\nimport { ref } from 'vue'\n\n// ${c.name} — Vue 3 Composition API + Tailwind CSS\nconst active = ref(false)\n</script>\n\n<template>\n  <div class="${kebab}-wrapper">\n${htmlMarkup
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n')}\n  </div>\n</template>`

  const svelteCode = `<script lang="ts">\n  // ${c.name} — Svelte 5 + Tailwind CSS\n  let active = $state(false)\n</script>\n\n<div class="${kebab}-wrapper">\n${htmlMarkup
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n</div>`

  const htmlCode = `<!-- ${c.name} — Plain HTML + Tailwind CSS -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-zinc-950 text-white flex items-center justify-center min-h-screen p-6">\n${htmlMarkup
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n</body>\n</html>`

  return [
    { label: 'React (JSX)', ext: '.jsx', code: c.code },
    { label: 'Next.js', ext: '.jsx', code: nextJsCode },
    { label: 'TypeScript', ext: '.tsx', code: tsxCode },
    { label: 'Vue 3', ext: '.vue', code: vueCode },
    { label: 'Svelte', ext: '.svelte', code: svelteCode },
    { label: 'HTML / CSS', ext: '.html', code: htmlCode },
  ]
}

/* -------------------------------------------------------------------------- */
/*                     8 Interactive Built-In 3D Components                   */
/* -------------------------------------------------------------------------- */

function Holo3DCardPreview() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), { stiffness: 220, damping: 18 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), { stiffness: 220, damping: 18 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div style={{ perspective: 900 }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative h-36 w-56 rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/25 via-surface to-accent/25 p-4 shadow-2xl"
      >
        <div style={{ transform: 'translateZ(28px)' }} className="flex h-full flex-col justify-between">
          <span className="w-fit rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-white">HOLO 3D</span>
          <div>
            <p className="text-xs font-extrabold">Spatial Depth Card</p>
            <p className="text-[10px] text-muted">Hover to tilt in 3D</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Flip3DVaultPreview() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ perspective: 1000 }} onClick={() => setFlipped((f) => !f)} className="h-36 w-56 cursor-pointer">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-lg"
        >
          <span className="text-[10px] font-bold text-primary">PASSKEY VAULT</span>
          <p className="text-xs font-extrabold">Click to Reveal Key →</p>
        </div>
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary to-accent p-4 text-white shadow-xl"
        >
          <span className="text-[10px] font-bold opacity-80">SECRET TOKEN</span>
          <code className="font-mono text-xs font-bold">sk_live_98xQ7mP2</code>
        </div>
      </motion.div>
    </div>
  )
}

function Stacked3DLayersPreview() {
  const [open, setOpen] = useState(false)
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative grid h-36 w-56 place-items-center"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: open ? (i - 1) * -22 : (i - 1) * -6,
            scale: open ? 1 - (2 - i) * 0.04 : 1 - (2 - i) * 0.07,
            rotateX: open ? 18 : 0,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute flex h-24 w-48 items-center justify-between rounded-xl border border-primary/40 bg-surface/95 px-4 shadow-xl backdrop-blur-md"
          style={{ zIndex: i }}
        >
          <span className="text-xs font-bold">Layer 0{i + 1}</span>
          <span className="h-2 w-2 rounded-full bg-primary" />
        </motion.div>
      ))}
    </div>
  )
}

function Floating3DDockPreview() {
  const items = ['Home', '3D', 'AI', 'Code', 'Pro']
  return (
    <div className="flex items-end gap-2 rounded-2xl border border-line/80 bg-surface/80 px-3 py-2.5 shadow-xl backdrop-blur-xl">
      {items.map((label) => (
        <motion.button
          key={label}
          whileHover={{ y: -10, scale: 1.25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 16 }}
          className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-[10px] font-extrabold text-white shadow-md"
        >
          {label}
        </motion.button>
      ))}
    </div>
  )
}

function Isometric3DCubePreview() {
  return (
    <motion.div
      whileHover={{ rotateX: 22, rotateY: -22, scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="relative grid h-28 w-48 place-items-center rounded-2xl border border-accent/50 bg-gradient-to-tr from-accent/20 via-surface to-primary/20 shadow-2xl"
    >
      <div className="text-center">
        <Box size={24} className="mx-auto text-primary" />
        <p className="mt-1.5 text-xs font-extrabold">Isometric 3D Tile</p>
      </div>
    </motion.div>
  )
}

function Magnetic3DButtonPreview() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 14 })
  const sy = useSpring(y, { stiffness: 240, damping: 14 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.45)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.45)
  }

  return (
    <div onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }} className="grid h-full w-full place-items-center">
      <motion.button
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.94 }}
        className="rounded-2xl border-b-4 border-primary/60 bg-gradient-to-r from-primary to-accent px-6 py-3 text-xs font-extrabold text-white shadow-[0_12px_30px_rgb(var(--primary)/0.45)]"
      >
        3D Tactile Button
      </motion.button>
    </div>
  )
}

function Orbital3DRingPreview() {
  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-primary/60"
      >
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-lg" />
      </motion.div>
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-extrabold text-white shadow-xl">
        3D Core
      </div>
    </div>
  )
}

function Elevated3DPricingPreview() {
  return (
    <motion.div
      whileHover={{ y: -8, rotateX: 8 }}
      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      className="w-52 rounded-2xl border border-primary/50 bg-surface p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold">Pro 3D</span>
        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">POPULAR</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold">$29<span className="text-[10px] font-normal text-muted">/mo</span></p>
      <button className="mt-3 w-full rounded-lg bg-primary py-1.5 text-[11px] font-bold text-white">Upgrade</button>
    </motion.div>
  )
}

const EXTRA_3D_COMPONENTS = [
  {
    id: '3d-holo-tilt-card',
    name: '3D Holographic Tilt Card',
    category: '3D Spatial',
    description: 'Pointer-tracked 3D perspective card with elevated Z-depth floating badge and specular glow.',
    tags: ['3d', 'tilt', 'perspective', 'card'],
    renderPreview: () => <Holo3DCardPreview />,
    code: `import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function Holo3DCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), { stiffness: 220, damping: 18 })

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div style={{ perspective: 900 }} onMouseMove={handleMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-44 w-72 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-cyan-500/20 p-6 text-white shadow-2xl"
      >
        <div style={{ transform: 'translateZ(30px)' }} className="flex h-full flex-col justify-between">
          <span className="w-fit rounded-full bg-indigo-500 px-2.5 py-0.5 text-xs font-bold">HOLO 3D</span>
          <div>
            <h3 className="text-lg font-extrabold">Spatial Depth Card</h3>
            <p className="text-xs text-zinc-400">Move cursor to tilt in 3D space</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}`,
  },
  {
    id: '3d-flip-vault',
    name: '3D Flip Vault Card',
    category: '3D Spatial',
    description: 'Interactive 180-degree Y-axis 3D flip card with hidden backface reveal for secrets or passes.',
    tags: ['3d', 'flip', 'vault', 'interactive'],
    renderPreview: () => <Flip3DVaultPreview />,
    code: `import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Flip3DVault() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)} className="h-44 w-72 cursor-pointer">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-xl">
          <span className="text-xs font-bold text-indigo-400">PASSKEY VAULT</span>
          <p className="text-base font-extrabold">Click to Reveal Key →</p>
        </div>
        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 p-6 text-white shadow-xl">
          <span className="text-xs font-bold opacity-80">SECRET TOKEN</span>
          <code className="font-mono text-sm font-bold">sk_live_98xQ7mP2</code>
        </div>
      </motion.div>
    </div>
  )
}`,
  },
  {
    id: '3d-stacked-layers',
    name: '3D Layered Glass Stack',
    category: '3D Spatial',
    description: 'Multi-plane 3D card stack that expands vertically along the Z-axis when hovered.',
    tags: ['3d', 'stack', 'glass', 'layers'],
    renderPreview: () => <Stacked3DLayersPreview />,
    code: `import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Stacked3DLayers() {
  const [open, setOpen] = useState(false)

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="relative grid h-48 w-64 place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: open ? (i - 1) * -28 : (i - 1) * -8, scale: open ? 1 : 1 - (2 - i) * 0.06 }}
          className="absolute flex h-28 w-56 items-center justify-between rounded-2xl border border-indigo-500/40 bg-zinc-900/90 px-5 text-white shadow-xl backdrop-blur-md"
          style={{ zIndex: i }}
        >
          <span className="font-bold">Layer 0{i + 1}</span>
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
        </motion.div>
      ))}
    </div>
  )
}`,
  },
  {
    id: '3d-floating-dock',
    name: '3D Floating App Dock',
    category: '3D Spatial',
    description: 'macOS-inspired spatial floating navigation dock with spring elevation on hover.',
    tags: ['3d', 'dock', 'navigation', 'macos'],
    renderPreview: () => <Floating3DDockPreview />,
    code: `import { motion } from 'framer-motion'

export default function Floating3DDock() {
  const items = ['Home', '3D', 'AI', 'Code', 'Pro']
  return (
    <div className="flex items-end gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
      {items.map((label) => (
        <motion.button
          key={label}
          whileHover={{ y: -12, scale: 1.25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 16 }}
          className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-extrabold text-white shadow-lg"
        >
          {label}
        </motion.button>
      ))}
    </div>
  )
}`,
  },
  {
    id: '3d-isometric-tile',
    name: '3D Isometric Feature Tile',
    category: '3D Spatial',
    description: 'Isometric 3D tilt container designed for architectural feature grids and spatial icons.',
    tags: ['3d', 'isometric', 'tile', 'grid'],
    renderPreview: () => <Isometric3DCubePreview />,
    code: `import { motion } from 'framer-motion'

export default function Isometric3DTile() {
  return (
    <motion.div
      whileHover={{ rotateX: 22, rotateY: -22, scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      className="grid h-36 w-56 place-items-center rounded-2xl border border-cyan-500/40 bg-gradient-to-tr from-cyan-500/20 via-zinc-900 to-indigo-500/20 text-white shadow-2xl"
    >
      <p className="text-sm font-extrabold">Isometric 3D Tile</p>
    </motion.div>
  )
}`,
  },
  {
    id: '3d-tactile-button',
    name: '3D Magnetic Tactile Button',
    category: '3D Spatial',
    description: 'Depth-extruded 3D button with magnetic cursor pull and tactile press compression.',
    tags: ['3d', 'button', 'magnetic', 'tactile'],
    renderPreview: () => <Magnetic3DButtonPreview />,
    code: `import { motion } from 'framer-motion'

export default function Tactile3DButton() {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ y: 2, scale: 0.96 }}
      className="rounded-2xl border-b-4 border-indigo-800 bg-gradient-to-r from-indigo-500 to-cyan-500 px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(99,102,241,0.45)]"
    >
      3D Tactile Button
    </motion.button>
  )
}`,
  },
  {
    id: '3d-orbital-core',
    name: '3D Orbital Status Core',
    category: '3D Spatial',
    description: 'Continuous 360-degree orbital ring around a glowing 3D core node for AI & system states.',
    tags: ['3d', 'orbit', 'loader', 'ai'],
    renderPreview: () => <Orbital3DRingPreview />,
    code: `import { motion } from 'framer-motion'

export default function Orbital3DCore() {
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/60"
      >
        <span className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-lg" />
      </motion.div>
      <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs font-extrabold text-white shadow-xl">
        3D Core
      </div>
    </div>
  )
}`,
  },
  {
    id: '3d-pricing-card',
    name: '3D Elevated Pricing Card',
    category: '3D Spatial',
    description: 'Perspective-elevated SaaS pricing card with floating tier badge and deep drop shadow.',
    tags: ['3d', 'pricing', 'card', 'saas'],
    renderPreview: () => <Elevated3DPricingPreview />,
    code: `import { motion } from 'framer-motion'

export default function Elevated3DPricing() {
  return (
    <motion.div
      whileHover={{ y: -10, rotateX: 8 }}
      className="w-64 rounded-2xl border border-indigo-500/50 bg-zinc-900 p-6 text-white shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Pro 3D</span>
        <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400">POPULAR</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold">$29<span className="text-xs font-normal text-zinc-400">/mo</span></p>
      <button className="mt-4 w-full rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white">Upgrade</button>
    </motion.div>
  )
}`,
  },
]

/* -------------------------------------------------------------------------- */
/*                            Main Components Page                            */
/* -------------------------------------------------------------------------- */

export default function Components() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState(params.get('q') || '')
  const [selected, setSelected] = useState(null)
  const [activeLangIdx, setActiveLangIdx] = useState(0)
  const [mode, setMode] = useState('desktop')
  const [layoutView, setLayoutView] = useState('grid')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [previewSurface, setPreviewSurface] = useState('default')
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_STORAGE) || '[]')
    } catch {
      return []
    }
  })

  const { copiedKey, copy } = useClipboard()

  // Combine original componentsData with the 8 new interactive 3D components
  const allComponents = useMemo(() => [...EXTRA_3D_COMPONENTS, ...componentsData], [])
  const allCategories = useMemo(() => ['All', '3D Spatial', ...categories.filter((c) => c !== 'All')], [])

  useEffect(() => {
    try {
      localStorage.setItem(FAV_STORAGE, JSON.stringify(favorites))
    } catch {
      /* ignore storage errors */
    }
  }, [favorites])

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const categoryCounts = useMemo(() => {
    const counts = { All: allComponents.length }
    allComponents.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1
    })
    return counts
  }, [allComponents])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allComponents.filter((c) => {
      const inCat = category === 'All' || c.category === category
      const inFav = !onlyFavorites || favorites.includes(c.id)
      const inQuery =
        !q ||
        (c.name + ' ' + c.description + ' ' + c.category + ' ' + c.tags.join(' ')).toLowerCase().includes(q)
      return inCat && inFav && inQuery
    })
  }, [allComponents, category, query, onlyFavorites, favorites])

  const onQuery = (v) => {
    setQuery(v)
    if (params.get('q')) setParams({}, { replace: true })
  }

  const resetFilters = () => {
    setCategory('All')
    setOnlyFavorites(false)
    onQuery('')
  }

  const openInspector = (comp) => {
    setActiveLangIdx(0)
    setSelected(comp)
  }

  const selectedTabs = useMemo(() => (selected ? generateMultiLangTabs(selected) : []), [selected])

  const stageBgClass =
    previewSurface === 'dark'
      ? 'bg-zinc-950 text-zinc-100'
      : previewSurface === 'light'
      ? 'bg-zinc-100 text-zinc-900'
      : 'bg-bg/60'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Top Pro Studio Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-line/60 pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-inner">
            <Box size={13} />
            <span>3D &amp; Multi-Framework UI Primitives</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Component{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Library
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Interactive 3D &amp; theme-aware UI primitives. Export clean code in{' '}
            <span className="font-semibold text-fg">React, Next.js, TypeScript, Vue 3, Svelte,</span> or{' '}
            <span className="font-semibold text-fg">HTML/Tailwind</span>.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Sparkles size={14} className="text-primary" />
            <span className="font-semibold text-fg">{allComponents.length}</span>
            <span className="text-muted">Components</span>
          </div>
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Code2 size={14} className="text-accent" />
            <span className="font-semibold text-fg">6</span>
            <span className="text-muted">Languages</span>
          </div>
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Heart size={14} className="text-rose-500" />
            <span className="font-semibold text-fg">{favorites.length}</span>
            <span className="text-muted">Saved</span>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar Controls */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          {/* Search Input */}
          <div className="relative max-w-md flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search 3D cards, buttons, tags..."
              className="w-full rounded-xl border border-line/80 bg-surface/60 py-2.5 pl-10 pr-9 text-xs font-medium backdrop-blur-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25 sm:text-sm"
            />
            {query && (
              <button
                onClick={() => onQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted transition hover:bg-line/40 hover:text-fg"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right View & Contrast Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyFavorites((f) => !f)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
                onlyFavorites
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-400 shadow-sm'
                  : 'border-line/70 bg-surface/50 text-muted hover:border-line hover:text-fg'
              )}
            >
              <Heart size={13} className={cn(onlyFavorites && 'fill-rose-400')} />
              <span>Saved ({favorites.length})</span>
            </button>

            <div className="inline-flex items-center rounded-xl border border-line/70 bg-surface/50 p-1 backdrop-blur-md">
              {[
                { id: 'default', label: 'Theme', icon: SlidersHorizontal },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'light', label: 'Light', icon: Sun },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.id}
                    onClick={() => setPreviewSurface(s.id)}
                    title={`Preview stage: ${s.label}`}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition',
                      previewSurface === s.id ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                    )}
                  >
                    <Icon size={12} />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="inline-flex items-center rounded-xl border border-line/70 bg-surface/50 p-1 backdrop-blur-md">
              <button
                onClick={() => setLayoutView('grid')}
                className={cn(
                  'rounded-lg p-1.5 transition',
                  layoutView === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                )}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setLayoutView('list')}
                className={cn(
                  'rounded-lg p-1.5 transition',
                  layoutView === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                )}
                title="Wide showcase view"
              >
                <Rows3 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills with Counters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {allCategories.map((c) => {
            const active = category === c
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                  active
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                    : 'border-line/70 bg-surface/50 text-muted hover:border-primary/50 hover:text-fg'
                )}
              >
                <span>{c}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px]',
                    active ? 'bg-white/20 text-white' : 'bg-line/50 text-muted'
                  )}
                >
                  {categoryCounts[c] || 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Viewport Canvas */}
      <ViewportResizer className="mt-8" mode={mode} onModeChange={setMode}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line/70 bg-surface/60 text-muted">
              <SearchX size={28} />
            </div>
            <p className="mt-4 text-base font-bold text-fg">No matching components found</p>
            <p className="mt-1 max-w-sm text-xs text-muted">
              We could not find any UI primitives matching your current filter or search term.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-primary/90"
            >
              <RotateCcw size={13} /> Reset all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={cn(
              'grid gap-5 bg-bg/50 p-5',
              layoutView === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            )}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((c) => {
                const isFav = favorites.includes(c.id)
                const isCopied = copiedKey === c.id
                return (
                  <motion.article
                    layout
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="glass-strong group flex flex-col overflow-hidden rounded-2xl border border-line/70 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                  >
                    {/* Live Component Preview Stage */}
                    <div
                      className={cn(
                        'relative flex flex-1 items-center justify-center overflow-hidden p-6 transition-colors duration-300',
                        layoutView === 'grid' ? 'min-h-[215px]' : 'min-h-[260px]',
                        stageBgClass
                      )}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                        }}
                      />

                      {/* Floating Top-Left Multi-Lang Badge */}
                      <span className="absolute left-3 top-3 z-10 rounded-md border border-line/60 bg-surface/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted backdrop-blur-md">
                        React • Vue • Svelte • HTML
                      </span>

                      {/* Floating Top-Right Favorite */}
                      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => toggleFavorite(c.id, e)}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-md transition',
                            isFav
                              ? 'border-rose-500/40 bg-rose-500/20 text-rose-400'
                              : 'border-line/60 bg-surface/70 text-muted hover:text-fg'
                          )}
                          title={isFav ? 'Remove from saved' : 'Save component'}
                        >
                          <Heart size={13} className={cn(isFav && 'fill-rose-400')} />
                        </button>
                      </div>

                      <div className="relative z-0 flex w-full items-center justify-center">
                        {c.renderPreview ? c.renderPreview() : <ComponentPreview id={c.id} />}
                      </div>
                    </div>

                    {/* Card Details & Actions */}
                    <div className="flex flex-col justify-between border-t border-line/60 bg-surface/70 p-4 backdrop-blur-xl">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold tracking-tight text-fg transition-colors group-hover:text-primary">
                            {c.name}
                          </h3>
                          <span className="shrink-0 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {c.category}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{c.description}</p>

                        {c.tags && c.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {c.tags.slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => onQuery(tag)}
                                className="rounded-md border border-line/50 bg-bg/50 px-2 py-0.5 text-[10px] font-medium text-muted transition hover:border-primary/40 hover:text-fg"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center gap-2 border-t border-line/40 pt-2">
                        <button
                          onClick={() => openInspector(c)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/15 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          <Code2 size={14} /> Multi-Lang Code
                        </button>
                        <button
                          onClick={() => copy(c.code, c.id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line/70 bg-bg/60 px-3 py-2 text-xs font-semibold text-fg transition hover:border-primary/50"
                          title="Copy React JSX"
                        >
                          {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          <span>{isCopied ? 'Copied' : 'React'}</span>
                        </button>
                        <button
                          onClick={() => downloadTextFile(`${toPascal(c.name)}.jsx`, c.code)}
                          className="inline-flex items-center justify-center rounded-xl border border-line/70 bg-bg/60 p-2 text-muted transition hover:border-primary/50 hover:text-fg"
                          title="Download .jsx file"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </ViewportResizer>

      {/* Enhanced Multi-Language Code & 3D Preview Inspector Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.name : ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted sm:text-sm">{selected.description}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(selected.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition',
                    favorites.includes(selected.id)
                      ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                      : 'border-line bg-surface text-muted hover:text-fg'
                  )}
                >
                  <Heart size={13} className={cn(favorites.includes(selected.id) && 'fill-rose-400')} />
                  {favorites.includes(selected.id) ? 'Saved' : 'Save'}
                </button>
                {selectedTabs[activeLangIdx] && (
                  <button
                    onClick={() =>
                      downloadTextFile(
                        `${toPascal(selected.name)}${selectedTabs[activeLangIdx].ext}`,
                        selectedTabs[activeLangIdx].code
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
                  >
                    <Download size={13} /> Export {selectedTabs[activeLangIdx].ext}
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Modal Stage */}
            <div
              className={cn(
                'relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-2xl border border-line/80 p-8',
                stageBgClass
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="relative z-0 flex w-full items-center justify-center">
                {selected.renderPreview ? selected.renderPreview() : <ComponentPreview id={selected.id} />}
              </div>
            </div>

            {/* Language Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 p-1.5">
              {selectedTabs.map((t, idx) => (
                <button
                  key={t.label}
                  onClick={() => setActiveLangIdx(idx)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                    activeLangIdx === idx ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Active Language Code Viewer */}
            {selectedTabs[activeLangIdx] && (
              <CodeViewer
                tabs={[
                  {
                    label: `${toPascal(selected.name)}${selectedTabs[activeLangIdx].ext}`,
                    code: selectedTabs[activeLangIdx].code,
                  },
                ]}
                maxHeight={340}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}