import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  BookOpen,
  Box,
  Briefcase,
  Check,
  Code2,
  Copy,
  Cpu,
  CreditCard,
  Download,
  Eye,
  FileText,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  Maximize2,
  Minimize2,
  Orbit,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Terminal,
  User,
  Wallet,
  X,
} from 'lucide-react'
import { templatesData } from '../data/templatesData'
import TemplatePreview from '../components/TemplatePreviews'
import ViewportResizer from '../components/ViewportResizer'
import CodeViewer from '../components/CodeViewer'
import { useClipboard } from '../hooks/useClipboard'
import { downloadTextFile, cn } from '../lib/utils'

const icons = {
  Rocket,
  User,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
  Wallet,
  Terminal,
  Lock,
  CreditCard,
  Briefcase,
  BookOpen,
  FileText,
  Box,
  Orbit,
  Cpu,
  Globe,
}

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
/*                     3D Spatial Interactive Card Wrapper                    */
/* -------------------------------------------------------------------------- */

function Spatial3DBlock({ children, className = '', intensity = 12 }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div style={{ perspective: 1100 }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className={className}>
        {children}
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                  Multi-Language Code Compiler for Templates                */
/* -------------------------------------------------------------------------- */

function generateTemplateMultiLangTabs(tpl) {
  const pascal = toPascal(tpl.name)
  const kebab = toKebab(tpl.name)

  const returnMatch = tpl.code.match(/return\s*\(([\s\S]*)\)\s*\}?\s*$/)
  const rawJsx = returnMatch
    ? returnMatch[1].trim()
    : `<div className="min-h-screen bg-zinc-950 p-8 text-white">\n  <h1 className="text-3xl font-extrabold">${tpl.name}</h1>\n  <p className="mt-2 text-zinc-400">${tpl.description}</p>\n</div>`

  const htmlMarkup = rawJsx
    .replace(/className=/g, 'class=')
    .replace(/\{`([^`]*)`\}/g, '$1')
    .replace(/onClick=\{[^}]*\}/g, '')
    .replace(/onChange=\{[^}]*\}/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  const nextJsCode = `'use client'\n\n${tpl.code}`

  const tsxCode = `import React from 'react'\n\nexport interface ${pascal}PageProps {\n  className?: string\n}\n\n${tpl.code.replace(
    /export default function \w+\([^)]*\)/,
    `export default function ${pascal}Page({ className = '' }: ${pascal}PageProps)`
  )}`

  const vueCode = `<script setup lang="ts">\nimport { ref } from 'vue'\n\n// ${tpl.name} — Vue 3 Composition API + Tailwind CSS\nconst isMenuOpen = ref(false)\n</script>\n\n<template>\n  <div class="${kebab}-page">\n${htmlMarkup
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n')}\n  </div>\n</template>`

  const svelteCode = `<script lang="ts">\n  // ${tpl.name} — Svelte 5 + Tailwind CSS\n  let activeTab = $state('overview')\n</script>\n\n<div class="${kebab}-page">\n${htmlMarkup
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n</div>`

  const htmlCode = `<!-- ${tpl.name} — Standalone HTML5 + Tailwind CSS -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${tpl.name}</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-zinc-950 text-white antialiased">\n${htmlMarkup
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n</body>\n</html>`

  return [
    { label: 'React (JSX)', ext: '.jsx', code: tpl.code },
    { label: 'Next.js', ext: '.jsx', code: nextJsCode },
    { label: 'TypeScript', ext: '.tsx', code: tsxCode },
    { label: 'Vue 3', ext: '.vue', code: vueCode },
    { label: 'Svelte', ext: '.svelte', code: svelteCode },
    { label: 'HTML / CSS', ext: '.html', code: htmlCode },
  ]
}

/* -------------------------------------------------------------------------- */
/*              12 Pro & 3D Spatial Full-Page Templates Catalog               */
/* -------------------------------------------------------------------------- */

const EXTRA_TEMPLATES = [
  {
    id: 'spatial-3d-saas',
    name: '3D Spatial SaaS Hero',
    category: '3D Spatial',
    icon: 'Box',
    description: 'Interactive 3D perspective product showcase with Z-depth floating console and holographic metrics.',
    tags: ['3D', 'Spatial', 'SaaS', 'Perspective'],
    renderPreview: () => (
      <div className="relative min-h-[540px] overflow-hidden bg-bg p-6 text-fg sm:p-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <nav className="relative z-10 flex items-center justify-between border-b border-line/60 pb-4">
          <div className="flex items-center gap-2 font-extrabold">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-[10px] text-white">
              3D
            </span>
            <span>HyperSpace</span>
          </div>
          <div className="hidden gap-6 text-xs text-muted sm:flex">
            <span>Engine</span>
            <span>Shaders</span>
            <span>Enterprise</span>
          </div>
          <button className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/25">
            Launch 3D
          </button>
        </nav>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            <Sparkles size={12} /> Spatial WebGL &amp; React Engine
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Interfaces with{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              True 3D Depth
            </span>
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
            Move your cursor over the 3D spatial console below to experience hardware-accelerated perspective layers.
          </p>
        </div>

        {/* Interactive 3D Floating Console */}
        <Spatial3DBlock className="mx-auto mt-8 max-w-2xl rounded-3xl border border-primary/40 bg-surface/80 p-6 shadow-2xl backdrop-blur-xl">
          <div style={{ transform: 'translateZ(30px)' }} className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Frame Rate', val: '120 FPS', badge: 'WebGL 2.0' },
              { label: 'Z-Layers', val: '6 Planes', badge: 'Spring Physics' },
              { label: 'Bundle Size', val: '14.2 kB', badge: 'Zero Bloat' },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-line/70 bg-bg/85 p-4 shadow-lg">
                <span className="text-[10px] font-bold uppercase text-primary">{m.badge}</span>
                <p className="mt-1 text-xl font-extrabold">{m.val}</p>
                <p className="text-[11px] text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        </Spatial3DBlock>
      </div>
    ),
    code: `import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function Spatial3DSaaSHero() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-10 text-white">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <span className="text-lg font-extrabold">HyperSpace 3D</span>
        <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold">Launch 3D</button>
      </header>
      <main className="mx-auto mt-14 max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold">Interfaces with True 3D Depth</h1>
        <div style={{ perspective: 1100 }} onMouseMove={handleMove} onMouseLeave={() => { x.set(0); y.set(0) }} className="mt-10">
          <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="rounded-3xl border border-indigo-500/40 bg-zinc-900/90 p-8 shadow-2xl">
            <div style={{ transform: 'translateZ(30px)' }} className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-950 p-4"><p className="text-xl font-extrabold">120 FPS</p><p className="text-xs text-zinc-400">WebGL 2.0</p></div>
              <div className="rounded-2xl bg-zinc-950 p-4"><p className="text-xl font-extrabold">6 Planes</p><p className="text-xs text-zinc-400">Z-Depth</p></div>
              <div className="rounded-2xl bg-zinc-950 p-4"><p className="text-xl font-extrabold">14.2 kB</p><p className="text-xs text-zinc-400">Gzipped</p></div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}`,
  },
  {
    id: 'spatial-3d-gallery',
    name: '3D Metaverse & NFT Vault',
    category: '3D Spatial',
    icon: 'Orbit',
    description: 'Interactive 3D artifact gallery with floating volumetric orbs, collector telemetry, and glass cards.',
    tags: ['3D', 'Web3', 'Gallery', 'Orbital'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
          <div className="flex items-center gap-2">
            <Orbit size={18} className="text-primary" />
            <span className="font-extrabold tracking-tight">AETHER // 3D ARTIFACTS</span>
          </div>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
            ● Live Spatial Drop
          </span>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {[
            {
              title: 'Chrono Sphere #04',
              price: '2.40 ETH',
              orb: 'radial-gradient(circle at 30% 25%, #fff 0%, #c4b5fd 20%, #7c3aed 58%, #09090b 100%)',
            },
            {
              title: 'Neon Core #19',
              price: '1.85 ETH',
              orb: 'radial-gradient(circle at 30% 25%, #ecfeff 0%, #67e8f9 22%, #0284c7 60%, #09090b 100%)',
            },
            {
              title: 'Solaris Orb #88',
              price: '3.10 ETH',
              orb: 'radial-gradient(circle at 30% 25%, #fef08a 0%, #fb923c 25%, #e11d48 64%, #09090b 100%)',
            },
          ].map((art) => (
            <Spatial3DBlock
              key={art.title}
              intensity={16}
              className="rounded-2xl border border-line/80 bg-surface/80 p-4 shadow-xl"
            >
              <div className="grid h-36 place-items-center rounded-xl bg-bg/80">
                <div
                  style={{ transform: 'translateZ(28px)', background: art.orb }}
                  className="h-20 w-20 rounded-full shadow-2xl"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold">{art.title}</h3>
                  <p className="font-mono text-[11px] text-primary">{art.price}</p>
                </div>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white">Collect</button>
              </div>
            </Spatial3DBlock>
          ))}
        </div>
      </div>
    ),
    code: `export default function Metaverse3DGallery() {
  const items = [
    { title: 'Chrono Sphere #04', price: '2.40 ETH' },
    { title: 'Neon Core #19', price: '1.85 ETH' },
    { title: 'Solaris Orb #88', price: '3.10 ETH' },
  ]
  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <h1 className="text-2xl font-extrabold">AETHER // 3D ARTIFACTS</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((art) => (
          <div key={art.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl transition hover:-translate-y-2">
            <div className="grid h-40 place-items-center rounded-xl bg-zinc-950">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-lg" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold">{art.title}</span>
              <span className="font-mono text-xs text-indigo-400">{art.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    id: 'spatial-3d-ai-command',
    name: '3D Neural AI Command Hub',
    category: '3D Spatial',
    icon: 'Cpu',
    description: 'Spatial AI orchestration workspace with 3D model routing nodes, live token stream, and prompt dock.',
    tags: ['3D', 'AI', 'Console', 'Workspace'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg sm:p-8">
        <div className="flex items-center justify-between border-b border-line/60 pb-4">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-accent" />
            <span className="font-extrabold">CORTEX 3D STUDIO</span>
          </div>
          <span className="rounded-lg bg-primary/15 px-2.5 py-1 font-mono text-[11px] font-bold text-primary">
            Cluster: US-WEST-3D
          </span>
        </div>

        <Spatial3DBlock
          intensity={10}
          className="mt-6 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-accent/15 p-6 shadow-2xl"
        >
          <div style={{ transform: 'translateZ(24px)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Active Neural Pipeline</span>
            <h2 className="mt-1 text-xl font-extrabold">Multi-Modal 3D Scene Synthesizer</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['Prompt Encoder', 'Spatial Mesh Gen', 'Shader Compiler'].map((node, i) => (
                <div key={node} className="rounded-xl border border-line/70 bg-bg/85 p-3">
                  <span className="font-mono text-[10px] text-primary">NODE 0{i + 1}</span>
                  <p className="mt-1 text-xs font-bold">{node}</p>
                </div>
              ))}
            </div>
          </div>
        </Spatial3DBlock>

        <div className="mt-6 flex gap-2 rounded-2xl border border-line bg-surface p-2">
          <input
            readOnly
            value="Generate a 3D glassmorphic fintech dashboard with neon charts..."
            className="flex-1 bg-transparent px-3 text-xs text-muted outline-none"
          />
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white">Synthesize</button>
        </div>
      </div>
    ),
    code: `export default function Neural3DCommandHub() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <span className="font-extrabold">CORTEX 3D STUDIO</span>
        <span className="rounded-lg bg-indigo-500/20 px-3 py-1 font-mono text-xs text-indigo-400">US-WEST-3D</span>
      </header>
      <div className="mt-8 rounded-3xl border border-indigo-500/40 bg-zinc-900 p-6 shadow-2xl">
        <h1 className="text-2xl font-extrabold">Multi-Modal 3D Scene Synthesizer</h1>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-950 p-4 font-bold">01. Prompt Encoder</div>
          <div className="rounded-xl bg-zinc-950 p-4 font-bold">02. Spatial Mesh Gen</div>
          <div className="rounded-xl bg-zinc-950 p-4 font-bold">03. Shader Compiler</div>
        </div>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'ai-startup-landing',
    name: 'AI SaaS Landing',
    category: 'SaaS & AI',
    icon: 'Sparkles',
    description: 'High-converting AI product landing page with glowing hero, live metrics, and 3D bento feature cards.',
    tags: ['AI', 'Landing', 'Hero', 'Bento'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg sm:p-10">
        <nav className="flex items-center justify-between border-b border-line/60 pb-4">
          <div className="flex items-center gap-2 font-extrabold">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span>SynthAI</span>
          </div>
          <div className="hidden gap-6 text-xs text-muted sm:flex">
            <span>Models</span>
            <span>Benchmarks</span>
            <span>Pricing</span>
          </div>
          <button className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white">Start Free</button>
        </nav>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            v3.8 Neural Engine Now Live
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ship intelligent apps <span className="text-primary">10x faster</span>
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
            Unified inference API with sub-40ms latency, automatic fallbacks, and zero-config vector memory.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/25">
              Get API Key
            </button>
            <button className="rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-semibold">
              Read Docs
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: '38ms Latency', desc: 'Edge-routed global inference nodes.' },
            { title: '99.99% Uptime', desc: 'Multi-region automatic failover.' },
            { title: 'SOC2 Type II', desc: 'Zero data retention by default.' },
          ].map((f) => (
            <Spatial3DBlock
              key={f.title}
              intensity={12}
              className="rounded-2xl border border-line/70 bg-surface/80 p-4 shadow-lg"
            >
              <div className="mb-2 h-2 w-8 rounded-full bg-primary" />
              <h3 className="text-sm font-bold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted">{f.desc}</p>
            </Spatial3DBlock>
          ))}
        </div>
      </div>
    ),
    code: `export default function AISaaSLanding() {
  return (
    <div className="min-h-screen bg-bg text-fg p-8">
      <header className="flex items-center justify-between border-b border-line pb-4">
        <span className="font-extrabold text-lg">SynthAI</span>
        <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Start Free</button>
      </header>
      <main className="mx-auto mt-16 max-w-2xl text-center">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">v3.8 Neural Engine</span>
        <h1 className="mt-4 text-4xl font-extrabold">Ship intelligent apps 10x faster</h1>
        <p className="mt-3 text-muted">Unified inference API with sub-40ms latency and automatic fallbacks.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">Get API Key</button>
          <button className="rounded-xl border border-line px-6 py-3 text-sm font-semibold">Read Docs</button>
        </div>
      </main>
    </div>
  )
}`,
  },
  {
    id: 'fintech-wallet-dash',
    name: '3D Fintech & Crypto Vault',
    category: 'Dashboard',
    icon: 'Wallet',
    description: 'Modern dark-ready financial dashboard with 3D tiltable metal card, asset breakdown, and quick transfers.',
    tags: ['Fintech', 'Crypto', '3D Card', 'Dashboard'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
          <div>
            <p className="text-[11px] text-muted">Total Portfolio Balance</p>
            <h2 className="text-2xl font-extrabold">$142,890.50</h2>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            +14.8% this month
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Spatial3DBlock
              intensity={14}
              className="h-full rounded-2xl bg-gradient-to-br from-primary to-accent p-5 text-white shadow-2xl"
            >
              <div style={{ transform: 'translateZ(26px)' }}>
                <div className="flex items-center justify-between text-xs opacity-85">
                  <span>3D Virtual Metal Card</span>
                  <span>•••• 4829</span>
                </div>
                <p className="mt-6 text-2xl font-extrabold">$48,250.00</p>
                <div className="mt-6 flex gap-2">
                  <button className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                    Send
                  </button>
                  <button className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                    Swap
                  </button>
                </div>
              </div>
            </Spatial3DBlock>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Quick Send</h3>
            <input
              placeholder="Recipient @tag or address"
              className="mt-3 w-full rounded-lg border border-line bg-bg px-3 py-2 text-xs outline-none"
            />
            <input
              placeholder="Amount (USD)"
              className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2 text-xs outline-none"
            />
            <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">
              Transfer Now
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Top Assets</h3>
          <div className="mt-3 divide-y divide-line/60 text-xs">
            {[
              { name: 'Ethereum (ETH)', val: '$64,200', change: '+6.4%' },
              { name: 'Solana (SOL)', val: '$41,890', change: '+18.2%' },
              { name: 'USD Coin (USDC)', val: '$36,800', change: '0.0%' },
            ].map((a) => (
              <div key={a.name} className="flex items-center justify-between py-2.5">
                <span className="font-semibold">{a.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold">{a.val}</span>
                  <span className="text-emerald-400">{a.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    code: `export default function FintechDashboard() {
  return (
    <div className="min-h-screen bg-bg p-6 text-fg">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-xs text-muted">Total Portfolio Balance</p>
          <h1 className="text-3xl font-extrabold">$142,890.50</h1>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">+14.8%</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-white md:col-span-2">
          <p className="text-xs opacity-80">Virtual Card •••• 4829</p>
          <p className="mt-6 text-3xl font-extrabold">$48,250.00</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-xs font-bold uppercase text-muted">Quick Send</h2>
          <input placeholder="Amount (USD)" className="mt-3 w-full rounded-lg border border-line bg-bg px-3 py-2 text-xs" />
          <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">Send</button>
        </div>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'dev-api-docs',
    name: 'Developer API Docs',
    category: 'Developer',
    icon: 'Terminal',
    description: 'Clean 2-column technical documentation layout with endpoint badge, parameter table, and cURL snippet.',
    tags: ['Docs', 'API', 'Developer', 'Technical'],
    renderPreview: () => (
      <div className="grid min-h-[540px] bg-bg text-fg md:grid-cols-[200px_1fr]">
        <aside className="border-b border-line/60 bg-surface/50 p-4 md:border-b-0 md:border-r">
          <p className="text-xs font-extrabold uppercase tracking-wider text-primary">API Reference</p>
          <ul className="mt-4 space-y-2 text-xs">
            <li className="rounded-lg bg-primary/15 px-2.5 py-1.5 font-semibold text-primary">Authentication</li>
            <li className="px-2.5 py-1.5 text-muted">Generate UI</li>
            <li className="px-2.5 py-1.5 text-muted">Stream Tokens</li>
            <li className="px-2.5 py-1.5 text-muted">Rate Limits</li>
          </ul>
        </aside>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400">
              POST
            </span>
            <code className="font-mono text-xs text-muted">/v1/ui/synthesize</code>
          </div>
          <h2 className="mt-3 text-xl font-extrabold">Generate Component Spec</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Converts a natural language prompt into a structured JSON component tree and clean Tailwind JSX.
          </p>
          <div className="mt-5 rounded-xl border border-line bg-zinc-950 p-4 font-mono text-[11px] text-zinc-200">
            <p className="text-zinc-500"># Request Example</p>
            <p className="mt-1 text-emerald-400">curl -X POST https://api.uistudio.dev/v1/synthesize \</p>
            <p className="pl-4">-H &quot;Authorization: Bearer $API_KEY&quot; \</p>
            <p className="pl-4">-d &apos;&#123;&quot;prompt&quot;: &quot;Dark pricing card&quot;&#125;&apos;</p>
          </div>
        </div>
      </div>
    ),
    code: `export default function ApiDocsPage() {
  return (
    <div className="grid min-h-screen bg-bg text-fg md:grid-cols-[240px_1fr]">
      <aside className="border-r border-line bg-surface p-5">
        <p className="text-xs font-bold uppercase text-primary">API Reference</p>
        <nav className="mt-4 space-y-2 text-sm">
          <a href="#auth" className="block rounded-lg bg-primary/15 px-3 py-1.5 font-semibold text-primary">Authentication</a>
          <a href="#generate" className="block px-3 py-1.5 text-muted">Generate UI</a>
        </nav>
      </aside>
      <main className="p-8">
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400">POST /v1/synthesize</span>
        <h1 className="mt-3 text-2xl font-extrabold">Generate Component Spec</h1>
        <pre className="mt-5 rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-200">
          curl -X POST https://api.uistudio.dev/v1/synthesize
        </pre>
      </main>
    </div>
  )
}`,
  },
  {
    id: 'split-auth-portal',
    name: 'Split-Screen Auth',
    category: 'SaaS & AI',
    icon: 'Lock',
    description: 'Enterprise authentication screen with glassmorphic sign-in form and branded social proof panel.',
    tags: ['Auth', 'Login', 'Security', 'Split'],
    renderPreview: () => (
      <div className="grid min-h-[540px] bg-bg text-fg md:grid-cols-2">
        <div className="flex flex-col justify-center p-8">
          <div className="mx-auto w-full max-w-xs space-y-4">
            <h2 className="text-2xl font-extrabold">Welcome back</h2>
            <p className="text-xs text-muted">Sign in to access your workspace and saved UI kits.</p>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-xs outline-none"
            />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-xs outline-none"
            />
            <button className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-md">
              Continue with Email
            </button>
          </div>
        </div>
        <div className="hidden flex-col justify-between bg-gradient-to-br from-primary to-accent p-8 text-white md:flex">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">UI Studio Enterprise</span>
          <blockquote className="text-lg font-bold leading-snug">
            &ldquo;This component system cut our frontend prototyping time from two weeks to a single afternoon.&rdquo;
          </blockquote>
          <p className="text-xs opacity-85">Sarah Jenkins — Head of Design, LinearFlow</p>
        </div>
      </div>
    ),
    code: `export default function SplitAuthPage() {
  return (
    <div className="grid min-h-screen bg-bg text-fg md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <form className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-extrabold">Welcome back</h1>
          <input type="email" placeholder="Email" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm" />
          <input type="password" placeholder="Password" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm" />
          <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white">Sign In</button>
        </form>
      </div>
      <div className="hidden flex-col justify-between bg-gradient-to-br from-primary to-accent p-10 text-white md:flex">
        <span className="font-bold">UI Studio</span>
        <p className="text-xl font-bold">Build production interfaces in record time.</p>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'saas-pricing-matrix',
    name: 'SaaS Pricing & Tiers',
    category: 'Marketing',
    icon: 'CreditCard',
    description: '3-tier SaaS pricing layout with 3D hover cards, highlighted Pro plan badge, and feature checkmarks.',
    tags: ['Pricing', 'SaaS', 'Conversion', 'Cards'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg sm:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold">Simple, transparent pricing</h2>
          <p className="mt-1 text-xs text-muted">Start free, upgrade when your team scales.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { name: 'Hobby', price: '$0', desc: 'For side projects', features: ['5 AI generations/day', 'Community templates'], pro: false },
            { name: 'Pro', price: '$29', desc: 'For fast-moving builders', features: ['Unlimited AI Studio', 'Multi-lang export', 'Priority models'], pro: true },
            { name: 'Team', price: '$79', desc: 'For product teams', features: ['Shared design tokens', 'SSO & Audit logs', 'Dedicated support'], pro: false },
          ].map((plan) => (
            <Spatial3DBlock
              key={plan.name}
              intensity={10}
              className={cn(
                'rounded-2xl border p-5 shadow-lg',
                plan.pro ? 'border-primary bg-primary/10' : 'border-line bg-surface'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{plan.name}</h3>
                {plan.pro && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">Popular</span>
                )}
              </div>
              <p className="mt-3 text-3xl font-extrabold">
                {plan.price}
                <span className="text-xs font-normal text-muted">/mo</span>
              </p>
              <p className="mt-1 text-xs text-muted">{plan.desc}</p>
              <ul className="mt-4 space-y-2 text-xs">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check size={13} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button
                className={cn(
                  'mt-5 w-full rounded-xl py-2 text-xs font-semibold',
                  plan.pro ? 'bg-primary text-white' : 'border border-line bg-bg'
                )}
              >
                Choose {plan.name}
              </button>
            </Spatial3DBlock>
          ))}
        </div>
      </div>
    ),
    code: `export default function PricingPage() {
  const plans = [
    { name: 'Hobby', price: '$0', pro: false },
    { name: 'Pro', price: '$29', pro: true },
    { name: 'Team', price: '$79', pro: false },
  ]
  return (
    <div className="min-h-screen bg-bg p-8 text-fg">
      <h1 className="text-center text-3xl font-extrabold">Simple, transparent pricing</h1>
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={\`rounded-2xl border p-6 \${p.pro ? 'border-primary bg-primary/10' : 'border-line bg-surface'}\`}>
            <h2 className="font-bold">{p.name}</h2>
            <p className="mt-2 text-4xl font-extrabold">{p.price}</p>
            <button className="mt-6 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white">Select</button>
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    id: 'agency-portfolio',
    name: 'Design Studio Portfolio',
    category: 'Marketing',
    icon: 'Briefcase',
    description: 'Editorial creative agency showcase with selected 3D works grid and project inquiry CTA.',
    tags: ['Agency', 'Portfolio', 'Creative', 'Studio'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg sm:p-8">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="font-extrabold tracking-tight">KINETIC® STUDIO</span>
          <button className="rounded-full border border-line px-3.5 py-1 text-xs font-semibold">Book a Call</button>
        </div>
        <h2 className="mt-8 max-w-xl text-3xl font-extrabold leading-tight">
          We craft digital products &amp; 3D brand systems for category leaders.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Veloce EV', tag: 'WebGL & Brand Identity', color: 'from-violet-600 to-indigo-600' },
            { title: 'Aether Pay', tag: 'Mobile App & Design System', color: 'from-emerald-500 to-teal-600' },
          ].map((work) => (
            <Spatial3DBlock
              key={work.title}
              intensity={12}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg"
            >
              <div className={`h-32 bg-gradient-to-br ${work.color}`} />
              <div className="p-4">
                <h3 className="font-bold">{work.title}</h3>
                <p className="text-xs text-muted">{work.tag}</p>
              </div>
            </Spatial3DBlock>
          ))}
        </div>
      </div>
    ),
    code: `export default function AgencyPortfolio() {
  return (
    <div className="min-h-screen bg-bg p-8 text-fg">
      <header className="flex justify-between border-b border-line pb-4">
        <span className="font-extrabold">KINETIC® STUDIO</span>
        <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white">Contact</button>
      </header>
      <h1 className="mt-10 max-w-2xl text-4xl font-extrabold">We craft digital products & brand systems.</h1>
    </div>
  )
}`,
  },
  {
    id: 'creator-storefront',
    name: 'Creator Digital Store',
    category: 'E-Commerce',
    icon: 'ShoppingBag',
    description: 'Modern creator bio & digital asset storefront for selling UI kits, presets, and courses.',
    tags: ['Creator', 'Store', 'Digital', 'Gumroad'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg" />
          <h2 className="mt-3 text-lg font-extrabold">Alex Rivera</h2>
          <p className="text-xs text-muted">Design Engineer • Building React &amp; Three.js kits</p>
        </div>
        <div className="mx-auto mt-6 max-w-md space-y-3">
          {[
            { title: 'Ultimate Glass UI Kit (120+ Components)', price: '$49' },
            { title: 'Framer Motion Masterclass + Source Files', price: '$79' },
            { title: 'Free Dark Mode Color Tokens Pack', price: 'Free' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4"
            >
              <span className="text-xs font-bold">{item.title}</span>
              <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    code: `export default function CreatorStore() {
  return (
    <div className="min-h-screen bg-bg p-8 text-fg">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-extrabold">Alex Rivera</h1>
        <p className="text-sm text-muted">Design Engineer & Creator</p>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'changelog-hub',
    name: 'Product Changelog',
    category: 'Developer',
    icon: 'FileText',
    description: 'Clean timeline release notes page with version tags, feature highlights, and subscribe box.',
    tags: ['Changelog', 'Releases', 'Timeline', 'Product'],
    renderPreview: () => (
      <div className="min-h-[540px] bg-bg p-6 text-fg sm:p-8">
        <div className="border-b border-line pb-4">
          <h2 className="text-2xl font-extrabold">Changelog</h2>
          <p className="text-xs text-muted">New updates and improvements to UI Studio.</p>
        </div>
        <div className="mt-6 space-y-6">
          {[
            { ver: 'v3.8.0', date: 'Nov 2026', title: 'Gemini 3.8 Live UI Synthesis', desc: 'Added real-time multi-model AI generation with automatic fallback.' },
            { ver: 'v3.5.0', date: 'Oct 2026', title: '198+ Extended Tailwind Color Tokens', desc: 'Full 50–950 shade scales and custom contrast checker.' },
          ].map((rel) => (
            <div key={rel.ver} className="grid gap-2 border-l-2 border-primary pl-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                  {rel.ver}
                </span>
                <span className="text-xs text-muted">{rel.date}</span>
              </div>
              <h3 className="text-sm font-bold">{rel.title}</h3>
              <p className="text-xs text-muted">{rel.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    code: `export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-bg p-8 text-fg">
      <h1 className="text-3xl font-extrabold">Changelog</h1>
      <div className="mt-6 border-l-2 border-primary pl-4">
        <span className="text-xs font-bold text-primary">v3.8.0</span>
        <h2 className="text-lg font-bold">Gemini 3.8 Live UI Synthesis</h2>
      </div>
    </div>
  )
}`,
  },
]

const CATEGORIES = ['All', '3D Spatial', 'SaaS & AI', 'Dashboard', 'E-Commerce', 'Developer', 'Marketing']

export default function Templates() {
  const allTemplates = useMemo(() => {
    const normalizedBase = templatesData.map((t) => ({
      ...t,
      category:
        t.id.includes('dash') || t.id.includes('admin')
          ? 'Dashboard'
          : t.id.includes('shop') || t.id.includes('store') || t.id.includes('commerce')
          ? 'E-Commerce'
          : t.id.includes('portfolio') || t.id.includes('profile')
          ? 'Marketing'
          : 'SaaS & AI',
    }))
    return [...EXTRA_TEMPLATES, ...normalizedBase]
  }, [])

  const [activeId, setActiveId] = useState(allTemplates[0].id)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('preview')
  const [langIdx, setLangIdx] = useState(0)
  const [mode, setMode] = useState('desktop')
  const [is3DStage, setIs3DStage] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const { copied, copy } = useClipboard()

  // Stage 3D Perspective Motion Values
  const stageX = useMotionValue(0)
  const stageY = useMotionValue(0)
  const stageRx = useSpring(useTransform(stageY, [-0.5, 0.5], [8, -8]), { stiffness: 160, damping: 20 })
  const stageRy = useSpring(useTransform(stageX, [-0.5, 0.5], [-10, 10]), { stiffness: 160, damping: 20 })

  const handleStageMove = (e) => {
    if (!is3DStage) return
    const r = e.currentTarget.getBoundingClientRect()
    stageX.set((e.clientX - r.left) / r.width - 0.5)
    stageY.set((e.clientY - r.top) / r.height - 0.5)
  }

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allTemplates.filter((t) => {
      const matchCat = category === 'All' || t.category === category
      const matchQuery =
        !q ||
        (t.name + ' ' + t.description + ' ' + t.tags.join(' ')).toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [allTemplates, category, search])

  const active = allTemplates.find((t) => t.id === activeId) || filteredTemplates[0] || allTemplates[0]
  const multiLangTabs = useMemo(() => generateTemplateMultiLangTabs(active), [active])
  const currentCodeObj = multiLangTabs[langIdx] || multiLangTabs[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Top Studio Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-line/60 pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-inner">
            <Layers size={13} />
            <span>3D Spatial Blueprints &amp; Multi-Language Code</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Page{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Templates
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Complete, responsive multi-section 3D &amp; web starters. Preview in{' '}
            <span className="font-semibold text-fg">Interactive 3D Stage</span> or export clean code in{' '}
            <span className="font-semibold text-fg">React, Next.js, TypeScript, Vue 3, Svelte,</span> and{' '}
            <span className="font-semibold text-fg">HTML/Tailwind</span>.
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Sparkles size={14} className="text-primary" />
            <span className="font-bold text-fg">{allTemplates.length}</span>
            <span className="text-muted">Templates</span>
          </div>
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Code2 size={14} className="text-accent" />
            <span className="font-bold text-fg">6</span>
            <span className="text-muted">Languages</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills & Search Bar */}
      <div className="mt-7 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const activeCat = category === cat
            const count =
              cat === 'All' ? allTemplates.length : allTemplates.filter((t) => t.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                  activeCat
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                    : 'border-line/70 bg-surface/50 text-muted hover:border-primary/50 hover:text-fg'
                )}
              >
                {cat === '3D Spatial' && <Box size={12} />}
                <span>{cat}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px]',
                    activeCat ? 'bg-white/20 text-white' : 'bg-line/50 text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 3D templates..."
            className="w-full rounded-xl border border-line/80 bg-surface/60 py-2 pl-9 pr-8 text-xs font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Studio Workspace */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[310px_1fr]">
        {/* Left Scrollable Template Selector Sidebar */}
        <aside className="max-h-[740px] space-y-3 overflow-y-auto pr-1">
          {filteredTemplates.map((t) => {
            const Icon = icons[t.icon] || Rocket
            const isSelected = t.id === active.id
            return (
              <motion.button
                key={t.id}
                whileHover={{ x: 3 }}
                onClick={() => setActiveId(t.id)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'glass-strong border-line/70 hover:border-primary/50'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
                      <Icon size={16} />
                    </span>
                    <div>
                      <span className="block text-sm font-bold text-fg">{t.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {t.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-line/50 bg-bg/70 px-2 py-0.5 text-[10px] font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.button>
            )
          })}
        </aside>

        {/* Right Live Preview & Multi-Lang Code Canvas */}
        <div
          className={cn(
            'min-w-0',
            expanded && 'fixed inset-0 z-50 flex flex-col bg-bg/95 p-4 backdrop-blur-xl sm:p-6'
          )}
        >
          {/* Top Action Toolbar */}
          <div className="glass-strong mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/70 p-2.5 shadow-lg">
            {/* Preview / Code Switcher */}
            <div className="inline-flex gap-1 rounded-xl border border-line/60 bg-bg/70 p-1">
              {[
                { id: 'preview', label: 'Live Preview', icon: Eye },
                { id: 'code', label: 'Multi-Lang Code', icon: Code2 },
              ].map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                      tab === t.id ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                    )}
                  >
                    <Icon size={14} /> {t.label}
                  </button>
                )
              })}
            </div>

            {/* Right 3D Stage Toggle, Export & Fullscreen Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {tab === 'preview' && (
                <button
                  onClick={() => {
                    setIs3DStage((s) => !s)
                    stageX.set(0)
                    stageY.set(0)
                  }}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition',
                    is3DStage
                      ? 'border-primary bg-primary text-white shadow-md shadow-primary/25'
                      : 'border-line/70 bg-surface/60 text-muted hover:border-primary/50 hover:text-fg'
                  )}
                  title="Tilt entire template in 3D perspective space"
                >
                  <Box size={14} />
                  <span>3D Stage {is3DStage ? 'ON' : 'OFF'}</span>
                </button>
              )}

              <button
                onClick={() => copy(currentCodeObj.code)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 px-3 py-1.5 text-xs font-semibold text-fg transition hover:border-primary/50"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-primary" />}
                <span>{copied ? 'Copied!' : `Copy ${currentCodeObj.label.split(' ')[0]}`}</span>
              </button>

              <button
                onClick={() =>
                  downloadTextFile(`${toPascal(active.name)}Template${currentCodeObj.ext}`, currentCodeObj.code)
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                <Download size={14} />
                <span>Export {currentCodeObj.ext}</span>
              </button>

              <button
                onClick={() => setExpanded((e) => !e)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 p-1.5 text-muted transition hover:border-primary/50 hover:text-fg"
                title={expanded ? 'Exit fullscreen' : 'Fullscreen preview'}
              >
                {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>
          </div>

          {/* Interactive Viewport / Multi-Lang Code Viewer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id + tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {tab === 'preview' ? (
                <div
                  style={{ perspective: is3DStage ? 1400 : undefined }}
                  onMouseMove={handleStageMove}
                  onMouseLeave={() => {
                    stageX.set(0)
                    stageY.set(0)
                  }}
                >
                  <motion.div
                    style={
                      is3DStage
                        ? {
                            rotateX: stageRx,
                            rotateY: stageRy,
                            transformStyle: 'preserve-3d',
                          }
                        : undefined
                    }
                    className={cn(is3DStage && 'rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.55)]')}
                  >
                    <ViewportResizer mode={mode} onModeChange={setMode}>
                      <div className={cn('overflow-auto', expanded ? 'max-h-[82vh]' : 'max-h-[640px]')}>
                        {active.renderPreview ? active.renderPreview() : <TemplatePreview id={active.id} />}
                      </div>
                    </ViewportResizer>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Language Selector Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-line/70 bg-surface/70 p-2 backdrop-blur-md">
                    {multiLangTabs.map((t, idx) => (
                      <button
                        key={t.label}
                        onClick={() => setLangIdx(idx)}
                        className={cn(
                          'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition',
                          langIdx === idx ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <CodeViewer
                    tabs={[
                      {
                        label: `${toPascal(active.name)}${currentCodeObj.ext}`,
                        code: currentCodeObj.code,
                      },
                    ]}
                    maxHeight={expanded ? 700 : 580}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}