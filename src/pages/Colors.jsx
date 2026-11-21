import { useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Box,
  Check,
  Code2,
  Copy,
  Download,
  Droplets,
  Eye,
  Layers,
  Palette,
  Pipette,
  Search,
  Sparkles,
  SunMoon,
} from 'lucide-react'
import { hexToRgbString, themeToCssVariables } from '../data/themesData'
import { useTheme } from '../hooks/useTheme'
import { useClipboard } from '../hooks/useClipboard'
import CodeViewer from '../components/CodeViewer'
import { downloadTextFile, cn } from '../lib/utils'

/* -------------------------------------------------------------------------- */
/*                     8 Interactive 3D Spatial Color Orbs                    */
/* -------------------------------------------------------------------------- */

const SPATIAL_3D_COLORS = [
  {
    name: 'Holographic Plasma',
    tag: 'IRIDESCENT 3D',
    coreHex: '#8b5cf6',
    orbGradient:
      'radial-gradient(circle at 30% 25%, #ffffff 0%, #c4b5fd 18%, #7c3aed 52%, #0e7490 85%, #09090b 100%)',
    glow: 'rgba(139, 92, 246, 0.55)',
    tailwind: 'bg-[radial-gradient(circle_at_30%_25%,#fff_0%,#c4b5fd_18%,#7c3aed_52%,#0e7490_85%,#09090b_100%)]',
  },
  {
    name: 'Cyber Cyan Sphere',
    tag: 'NEON VOLUMETRIC',
    coreHex: '#06b6d4',
    orbGradient:
      'radial-gradient(circle at 32% 24%, #ecfeff 0%, #67e8f9 22%, #0284c7 60%, #1e1b4b 95%)',
    glow: 'rgba(6, 182, 212, 0.55)',
    tailwind: 'bg-[radial-gradient(circle_at_32%_24%,#ecfeff_0%,#67e8f9_22%,#0284c7_60%,#1e1b4b_95%)]',
  },
  {
    name: 'Solar Flare Orb',
    tag: 'WARM EMISSIVE',
    coreHex: '#f97316',
    orbGradient:
      'radial-gradient(circle at 28% 26%, #fef08a 0%, #fb923c 25%, #e11d48 64%, #4c0519 96%)',
    glow: 'rgba(249, 115, 22, 0.55)',
    tailwind: 'bg-[radial-gradient(circle_at_28%_26%,#fef08a_0%,#fb923c_25%,#e11d48_64%,#4c0519_96%)]',
  },
  {
    name: 'Quantum Emerald',
    tag: 'BIO-LUMINESCENT',
    coreHex: '#10b981',
    orbGradient:
      'radial-gradient(circle at 30% 25%, #d1fae5 0%, #34d399 24%, #059669 60%, #022c22 95%)',
    glow: 'rgba(16, 185, 129, 0.5)',
    tailwind: 'bg-[radial-gradient(circle_at_30%_25%,#d1fae5_0%,#34d399_24%,#059669_60%,#022c22_95%)]',
  },
  {
    name: 'Liquid Obsidian',
    tag: 'METALLIC CHROME',
    coreHex: '#27272a',
    orbGradient:
      'radial-gradient(circle at 28% 22%, #ffffff 0%, #a1a1aa 14%, #27272a 48%, #09090b 88%)',
    glow: 'rgba(161, 161, 170, 0.35)',
    tailwind: 'bg-[radial-gradient(circle_at_28%_22%,#fff_0%,#a1a1aa_14%,#27272a_48%,#09090b_88%)]',
  },
  {
    name: 'Velvet Rose Core',
    tag: 'SUBSURFACE 3D',
    coreHex: '#ec4899',
    orbGradient:
      'radial-gradient(circle at 32% 24%, #fce7f3 0%, #f472b6 24%, #be185d 60%, #3b0764 95%)',
    glow: 'rgba(236, 72, 153, 0.5)',
    tailwind: 'bg-[radial-gradient(circle_at_32%_24%,#fce7f3_0%,#f472b6_24%,#be185d_60%,#3b0764_95%)]',
  },
  {
    name: 'Arctic Glass',
    tag: 'REFRACTIVE 3D',
    coreHex: '#38bdf8',
    orbGradient:
      'radial-gradient(circle at 30% 22%, #ffffff 0%, #bae6fd 26%, #0ea5e9 62%, #0c4a6e 95%)',
    glow: 'rgba(56, 189, 248, 0.5)',
    tailwind: 'bg-[radial-gradient(circle_at_30%_22%,#fff_0%,#bae6fd_26%,#0ea5e9_62%,#0c4a6e_95%)]',
  },
  {
    name: 'Golden Nebula',
    tag: 'SPECULAR GOLD',
    coreHex: '#eab308',
    orbGradient:
      'radial-gradient(circle at 30% 24%, #fef9c3 0%, #facc15 24%, #b45309 64%, #451a03 96%)',
    glow: 'rgba(234, 179, 8, 0.5)',
    tailwind: 'bg-[radial-gradient(circle_at_30%_24%,#fef9c3_0%,#facc15_24%,#b45309_64%,#451a03_96%)]',
  },
]

function Spatial3DColorCard({ item, copy, copiedKey }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), { stiffness: 220, damping: 18 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), { stiffness: 220, damping: 18 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  const cssKey = `3d-css-${item.name}`
  const twKey = `3d-tw-${item.name}`

  return (
    <div style={{ perspective: 900 }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="glass-strong group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line/70 p-4 shadow-lg transition-colors hover:border-primary/60"
      >
        <div className="relative grid h-36 place-items-center overflow-hidden rounded-xl bg-bg/70">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          <span className="absolute left-2.5 top-2.5 rounded-md border border-line/60 bg-surface/80 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-muted">
            {item.tag}
          </span>

          <motion.div
            style={{
              transform: 'translateZ(34px)',
              background: item.orbGradient,
              boxShadow: `0 18px 36px ${item.glow}, inset -6px -8px 16px rgba(0,0,0,0.65)`,
            }}
            whileHover={{ scale: 1.12 }}
            className="h-20 w-20 rounded-full transition-transform duration-300"
          />
        </div>

        <div className="mt-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-fg">{item.name}</h3>
            <span className="font-mono text-[10px] text-muted">{item.coreHex}</span>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => copy(`background: ${item.orbGradient};`, cssKey)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              {copiedKey === cssKey ? <Check size={12} /> : <Copy size={12} />}
              {copiedKey === cssKey ? 'Copied!' : '3D CSS'}
            </button>
            <button
              onClick={() => copy(item.tailwind, twKey)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-line/70 bg-bg/60 px-2.5 py-1.5 text-[11px] font-semibold text-fg transition hover:border-primary/50"
            >
              {copiedKey === twKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedKey === twKey ? 'Copied!' : 'Tailwind'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                     18 Extended Tailwind Color Palettes                    */
/* -------------------------------------------------------------------------- */

const EXTENDED_PALETTES = [
  {
    name: 'Slate',
    category: 'Neutrals',
    shades: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
      500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617',
    },
  },
  {
    name: 'Zinc',
    category: 'Neutrals',
    shades: {
      50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa',
      500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b',
    },
  },
  {
    name: 'Red',
    category: 'Warm',
    shades: {
      50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
      500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a',
    },
  },
  {
    name: 'Orange',
    category: 'Warm',
    shades: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
      500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407',
    },
  },
  {
    name: 'Amber',
    category: 'Warm',
    shades: {
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
      500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03',
    },
  },
  {
    name: 'Yellow',
    category: 'Warm',
    shades: {
      50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15',
      500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006',
    },
  },
  {
    name: 'Lime',
    category: 'Nature',
    shades: {
      50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635',
      500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05',
    },
  },
  {
    name: 'Emerald',
    category: 'Nature',
    shades: {
      50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
      500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22',
    },
  },
  {
    name: 'Teal',
    category: 'Nature',
    shades: {
      50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
      500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e',
    },
  },
  {
    name: 'Cyan',
    category: 'Cool',
    shades: {
      50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
      500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344',
    },
  },
  {
    name: 'Sky',
    category: 'Cool',
    shades: {
      50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
      500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49',
    },
  },
  {
    name: 'Blue',
    category: 'Cool',
    shades: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
    },
  },
  {
    name: 'Indigo',
    category: 'Vibrant',
    shades: {
      50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
      500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
    },
  },
  {
    name: 'Violet',
    category: 'Vibrant',
    shades: {
      50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
      500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065',
    },
  },
  {
    name: 'Purple',
    category: 'Vibrant',
    shades: {
      50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc',
      500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764',
    },
  },
  {
    name: 'Fuchsia',
    category: 'Vibrant',
    shades: {
      50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9',
      500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e',
    },
  },
  {
    name: 'Pink',
    category: 'Vibrant',
    shades: {
      50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
      500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724',
    },
  },
  {
    name: 'Rose',
    category: 'Warm',
    shades: {
      50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
      500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519',
    },
  },
]

const CURATED_GRADIENTS = [
  {
    name: 'Hyper Violet',
    tailwind: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500',
    css: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #06b6d4 100%)',
  },
  {
    name: 'Cyberpunk Neon',
    tailwind: 'bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-400',
    css: 'linear-gradient(90deg, #c026d3 0%, #ec4899 50%, #fbbf24 100%)',
  },
  {
    name: 'Emerald Matrix',
    tailwind: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600',
    css: 'linear-gradient(90deg, #10b981 0%, #14b8a6 50%, #0891b2 100%)',
  },
  {
    name: 'Sunset Blaze',
    tailwind: 'bg-gradient-to-r from-rose-500 via-orange-500 to-yellow-500',
    css: 'linear-gradient(90deg, #f43f5e 0%, #f97316 50%, #eab308 100%)',
  },
  {
    name: 'Oceanic Depth',
    tailwind: 'bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400',
    css: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 50%, #38bdf8 100%)',
  },
  {
    name: 'Midnight Aurora',
    tailwind: 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900',
    css: 'linear-gradient(90deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
  },
  {
    name: 'Peach Velvet',
    tailwind: 'bg-gradient-to-r from-pink-500 via-rose-400 to-orange-300',
    css: 'linear-gradient(90deg, #ec4899 0%, #fb7185 50%, #fdba74 100%)',
  },
  {
    name: 'Electric Lime',
    tailwind: 'bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-600',
    css: 'linear-gradient(90deg, #a3e635 0%, #10b981 50%, #0d9488 100%)',
  },
]

/* -------------------------------------------------------------------------- */
/*                       Custom Hex Scale & Contrast Helper                   */
/* -------------------------------------------------------------------------- */

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return { r: 99, g: 102, b: 241 }
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  )
}

function generateCustomScale(baseHex) {
  const { r, g, b } = hexToRgb(baseHex)
  const mix = (target, weight) =>
    rgbToHex(r + (target - r) * weight, g + (target - g) * weight, b + (target - b) * weight)

  return {
    50: mix(255, 0.92),
    100: mix(255, 0.84),
    200: mix(255, 0.68),
    300: mix(255, 0.48),
    400: mix(255, 0.24),
    500: baseHex.toLowerCase(),
    600: mix(0, 0.16),
    700: mix(0, 0.34),
    800: mix(0, 0.52),
    900: mix(0, 0.7),
    950: mix(0, 0.84),
  }
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/* -------------------------------------------------------------------------- */
/*                        Multi-Language Token Generators                     */
/* -------------------------------------------------------------------------- */

function buildMultiLangTokenTabs(theme) {
  const c = theme.colors
  const toDartHex = (hex) => `0xFF${hex.replace('#', '').toUpperCase()}`

  const cssVars = themeToCssVariables(theme)

  const tailwindConfig = `// tailwind.config.js — ${theme.name} Theme
export default {
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
    },
  },
}`

  const scssCode = `// _tokens.scss — ${theme.name} Theme
$color-bg: ${c.bg};
$color-surface: ${c.surface};
$color-fg: ${c.fg};
$color-muted: ${c.muted};
$color-line: ${c.line};
$color-primary: ${c.primary};
$color-accent: ${c.accent};

$theme-map: (
  'bg': $color-bg,
  'surface': $color-surface,
  'fg': $color-fg,
  'muted': $color-muted,
  'line': $color-line,
  'primary': $color-primary,
  'accent': $color-accent,
);`

  const tsTokens = `// themeTokens.ts — React / Next.js / TypeScript
export const ${theme.id.replace(/[^a-zA-Z0-9]/g, '_')}Theme = {
  name: '${theme.name}',
  mode: '${theme.mode}',
  colors: {
    bg: '${c.bg}',
    surface: '${c.surface}',
    fg: '${c.fg}',
    muted: '${c.muted}',
    line: '${c.line}',
    primary: '${c.primary}',
    accent: '${c.accent}',
  },
} as const`

  const vueComposable = `// useThemeTokens.ts — Vue 3 Composition API
import { reactive } from 'vue'

export const themeTokens = reactive({
  name: '${theme.name}',
  bg: '${c.bg}',
  surface: '${c.surface}',
  fg: '${c.fg}',
  muted: '${c.muted}',
  line: '${c.line}',
  primary: '${c.primary}',
  accent: '${c.accent}',
})`

  const flutterDart = `// app_colors.dart — Flutter / Dart Material Theme
import 'package:flutter/material.dart';

class AppColors {
  static const Color bg = Color(${toDartHex(c.bg)});
  static const Color surface = Color(${toDartHex(c.surface)});
  static const Color fg = Color(${toDartHex(c.fg)});
  static const Color muted = Color(${toDartHex(c.muted)});
  static const Color line = Color(${toDartHex(c.line)});
  static const Color primary = Color(${toDartHex(c.primary)});
  static const Color accent = Color(${toDartHex(c.accent)});
}`

  const swiftUiCode = `// AppColors.swift — SwiftUI iOS / macOS
import SwiftUI

extension Color {
    static let themeBg = Color(hex: "${c.bg}")
    static let themeSurface = Color(hex: "${c.surface}")
    static let themeFg = Color(hex: "${c.fg}")
    static let themeMuted = Color(hex: "${c.muted}")
    static let themeLine = Color(hex: "${c.line}")
    static let themePrimary = Color(hex: "${c.primary}")
    static let themeAccent = Color(hex: "${c.accent}")
}`

  const jsonTokens = JSON.stringify(
    {
      $schema: 'https://tr.designtokens.org/format/',
      theme: theme.name,
      mode: theme.mode,
      colors: Object.fromEntries(
        Object.entries(c).map(([k, v]) => [k, { $value: v, $type: 'color' }])
      ),
    },
    null,
    2
  )

  return [
    { label: 'CSS Vars', filename: `${theme.id}.css`, code: cssVars },
    { label: 'Tailwind', filename: 'tailwind.config.js', code: tailwindConfig },
    { label: 'SCSS / Sass', filename: `_${theme.id}.scss`, code: scssCode },
    { label: 'TypeScript', filename: `${theme.id}Theme.ts`, code: tsTokens },
    { label: 'Vue 3', filename: 'useThemeTokens.ts', code: vueComposable },
    { label: 'Flutter (Dart)', filename: 'app_colors.dart', code: flutterDart },
    { label: 'SwiftUI', filename: 'AppColors.swift', code: swiftUiCode },
    { label: 'W3C JSON', filename: `${theme.id}.tokens.json`, code: jsonTokens },
  ]
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

function Swatch({ name, hex, copy, copiedKey }) {
  const rgb = hexToRgbString(hex)
  const hexKey = 'hex-' + name + hex
  const rgbKey = 'rgb-' + name + hex
  return (
    <div className="glass-strong group overflow-hidden rounded-2xl border border-line/70 shadow-sm transition hover:border-primary/50 hover:shadow-md">
      <div className="relative h-16 transition-transform duration-300 group-hover:scale-105" style={{ background: hex }} />
      <div className="space-y-1.5 bg-surface/80 p-3 backdrop-blur-md">
        <p className="text-xs font-extrabold uppercase tracking-wider text-fg">{name}</p>
        <button
          onClick={() => copy(hex, hexKey)}
          className="flex w-full items-center justify-between rounded-lg border border-line/50 bg-bg/70 px-2 py-1 font-mono text-[11px] text-muted transition hover:border-primary/40 hover:text-fg"
        >
          <span>{hex}</span>
          {copiedKey === hexKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
        <button
          onClick={() => copy(rgb, rgbKey)}
          className="flex w-full items-center justify-between rounded-lg border border-line/50 bg-bg/70 px-2 py-1 font-mono text-[11px] text-muted transition hover:border-primary/40 hover:text-fg"
        >
          <span>{rgb}</span>
          {copiedKey === rgbKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  )
}

export default function Colors() {
  const { themes, themeId, setThemeId, theme } = useTheme()
  const { copiedKey, copy } = useClipboard()

  const [themeModeFilter, setThemeModeFilter] = useState('all') // 'all' | 'dark' | 'light'
  const [paletteFilter, setPaletteFilter] = useState('All')
  const [searchColor, setSearchColor] = useState('')
  const [customHex, setCustomHex] = useState('#8b5cf6')
  const [exportLangIdx, setExportLangIdx] = useState(0)

  const exportSectionRef = useRef(null)

  const filteredThemes = useMemo(() => {
    if (themeModeFilter === 'all') return themes
    return themes.filter((t) => t.mode === themeModeFilter)
  }, [themes, themeModeFilter])

  const customScale = useMemo(() => generateCustomScale(customHex), [customHex])
  const whiteContrast = useMemo(() => {
    const lum = getLuminance(customHex)
    return (1.05 / (lum + 0.05)).toFixed(2)
  }, [customHex])

  const filteredPalettes = useMemo(() => {
    const q = searchColor.trim().toLowerCase()
    return EXTENDED_PALETTES.filter((p) => {
      const matchCat = paletteFilter === 'All' || p.category === paletteFilter
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        Object.values(p.shades).some((hex) => hex.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [paletteFilter, searchColor])

  const exportTabs = useMemo(() => buildMultiLangTokenTabs(theme), [theme])

  const inspectThemeCode = (id, e) => {
    e.stopPropagation()
    setThemeId(id)
    exportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Studio Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-line/60 pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-inner">
            <Palette size={13} />
            <span>19 Global Themes • 3D Shaders • 8 Languages</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Colors &amp;{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              3D Theme Studio
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Apply any of the <span className="font-semibold text-fg">{themes.length} Studio Global Themes</span> live,
            explore 3D volumetric color spheres, and export multi-language tokens in{' '}
            <span className="font-semibold text-fg">CSS, Tailwind, SCSS, TypeScript, Vue, Flutter,</span> and{' '}
            <span className="font-semibold text-fg">SwiftUI</span>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <SunMoon size={14} className="text-primary" />
            <span className="font-bold text-fg">{themes.length}</span>
            <span className="text-muted">Global Themes</span>
          </div>
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Droplets size={14} className="text-accent" />
            <span className="font-bold text-fg">206+</span>
            <span className="text-muted">Swatches</span>
          </div>
          <div className="glass-strong flex items-center gap-2 rounded-xl border border-line/60 px-3.5 py-2 text-xs">
            <Code2 size={14} className="text-emerald-400" />
            <span className="font-bold text-fg">8</span>
            <span className="text-muted">Languages</span>
          </div>
        </div>
      </div>

      {/* Section 1: 19 Studio Global Themes */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <SunMoon size={20} className="text-primary" /> Studio Global Themes ({filteredThemes.length})
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Click any card to restyle the entire app, or click <span className="font-semibold text-fg">Code</span> to
              export its multi-language tokens.
            </p>
          </div>

          {/* All / Dark / Light Filter */}
          <div className="inline-flex items-center rounded-xl border border-line/70 bg-surface/60 p-1 text-xs">
            {[
              { id: 'all', label: `All (${themes.length})` },
              { id: 'dark', label: `Dark (${themes.filter((t) => t.mode === 'dark').length})` },
              { id: 'light', label: `Light (${themes.filter((t) => t.mode === 'light').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setThemeModeFilter(tab.id)}
                className={cn(
                  'rounded-lg px-3 py-1 font-semibold transition',
                  themeModeFilter === tab.id ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredThemes.map((t) => {
            const active = t.id === themeId
            return (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                onClick={() => setThemeId(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setThemeId(t.id)}
                className={cn(
                  'group cursor-pointer overflow-hidden rounded-2xl border-2 text-left shadow-md transition',
                  active ? 'border-primary glow-primary' : 'border-line/80 hover:border-primary/50'
                )}
                style={{ background: t.colors.bg, color: t.colors.fg }}
              >
                <div className="flex h-14">
                  {[t.colors.primary, t.colors.accent, t.colors.surface, t.colors.line].map((c, i) => (
                    <div key={i} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{t.name}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => inspectThemeCode(t.id, e)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition hover:opacity-90"
                        style={{
                          backgroundColor: `${t.colors.primary}26`,
                          color: t.colors.primary,
                        }}
                        title="View multi-language code for this theme"
                      >
                        <Code2 size={11} /> Code
                      </button>
                      {active && (
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: t.colors.primary, color: t.colors.bg }}
                        >
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs" style={{ color: t.colors.muted }}>
                    {t.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Active Theme Semantic Tokens */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold">
              {theme.name} <span className="text-muted">Semantic Tokens</span>
            </h3>
            <span className="rounded-full border border-line/70 bg-surface/60 px-3 py-1 text-xs font-medium text-muted">
              Mode: {theme.mode}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {Object.entries(theme.colors).map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} copy={copy} copiedKey={copiedKey} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Multi-Language Theme Code Export Suite (Promoted Right Below Themes!) */}
      <section ref={exportSectionRef} className="glass-strong mt-12 rounded-3xl border border-primary/40 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary">
              <Code2 size={12} /> Active Theme Code Compiler
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
              {theme.name} — Multi-Language Export
            </h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Switch any theme above and copy or download its ready-to-use code in 8 compatible languages.
            </p>
          </div>

          {exportTabs[exportLangIdx] && (
            <button
              onClick={() =>
                downloadTextFile(exportTabs[exportLangIdx].filename, exportTabs[exportLangIdx].code)
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90"
            >
              <Download size={14} /> Download {exportTabs[exportLangIdx].filename}
            </button>
          )}
        </div>

        {/* Language Selector Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 rounded-2xl border border-line/70 bg-bg/70 p-2">
          {exportTabs.map((t, idx) => (
            <button
              key={t.label}
              onClick={() => setExportLangIdx(idx)}
              className={cn(
                'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition',
                exportLangIdx === idx ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {exportTabs[exportLangIdx] && (
          <CodeViewer
            className="mt-4"
            tabs={[
              {
                label: exportTabs[exportLangIdx].filename,
                code: exportTabs[exportLangIdx].code,
              },
            ]}
            maxHeight={320}
          />
        )}
      </section>

      {/* Section 3: Volumetric 3D Spatial Color Spheres */}
      <section className="mt-14">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary">
              <Box size={12} /> 3D Volumetric Shaders
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">3D Spatial Color Spheres</h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Hover over any 3D sphere to tilt in perspective space and copy its multi-stop radial 3D shader CSS or
              Tailwind utility.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPATIAL_3D_COLORS.map((item) => (
            <Spatial3DColorCard key={item.name} item={item} copy={copy} copiedKey={copiedKey} />
          ))}
        </div>
      </section>

      {/* Section 4: Interactive Custom Color & 11-Shade Generator */}
      <section className="glass-strong mt-14 rounded-3xl border border-line/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-[11px] font-semibold text-accent">
              <Pipette size={12} /> Live Scale Generator
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Custom Brand Shade Builder</h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Pick any brand hex color to auto-generate a full 50–950 Tailwind shade scale and check white-text contrast.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line/80 bg-bg/90 px-3 py-2 font-mono text-xs">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <span className="font-bold uppercase text-fg">{customHex}</span>
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-line/70 bg-surface/70 px-3.5 py-2 text-xs">
              <Eye size={14} className="text-primary" />
              <span className="text-muted">White Text Contrast:</span>
              <span
                className={cn(
                  'font-mono font-bold',
                  Number(whiteContrast) >= 4.5 ? 'text-emerald-400' : 'text-amber-400'
                )}
              >
                {whiteContrast}:1 {Number(whiteContrast) >= 4.5 ? '(AA Pass)' : '(Large Text)'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-6 lg:grid-cols-11">
          {Object.entries(customScale).map(([step, hex]) => {
            const key = `custom-${step}-${hex}`
            const isCopied = copiedKey === key
            const isLight = Number(step) <= 300
            return (
              <button
                key={step}
                onClick={() => copy(hex, key)}
                className="group flex flex-col overflow-hidden rounded-xl border border-line/60 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="flex h-16 w-full items-center justify-center"
                  style={{ backgroundColor: hex, color: isLight ? '#09090b' : '#ffffff' }}
                >
                  {isCopied ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </div>
                <div className="bg-surface/90 p-2 text-left">
                  <p className="text-[11px] font-bold text-fg">{step}</p>
                  <p className="font-mono text-[10px] uppercase text-muted">{isCopied ? 'Copied!' : hex}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Section 5: Curated Mesh & Aura Gradients */}
      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <Sparkles size={20} className="text-primary" /> Curated Mesh Gradients
        </h2>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          Ready-to-use multi-stop gradients for hero headlines, buttons, and glowing cards.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CURATED_GRADIENTS.map((g) => {
            const twKey = 'grad-tw-' + g.name
            const cssKey = 'grad-css-' + g.name
            return (
              <div
                key={g.name}
                className="glass-strong overflow-hidden rounded-2xl border border-line/70 shadow-md transition hover:border-primary/50"
              >
                <div className="h-24 w-full" style={{ background: g.css }} />
                <div className="p-4">
                  <h3 className="text-sm font-bold text-fg">{g.name}</h3>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => copy(g.tailwind, twKey)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      {copiedKey === twKey ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === twKey ? 'Copied!' : 'Tailwind'}
                    </button>
                    <button
                      onClick={() => copy(`background: ${g.css};`, cssKey)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-line/70 bg-bg/60 px-2.5 py-1.5 text-[11px] font-semibold text-fg transition hover:border-primary/50"
                    >
                      {copiedKey === cssKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedKey === cssKey ? 'Copied!' : 'CSS'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 6: Complete 18-Palette Tailwind Color Matrix */}
      <section className="mt-16">
        <div className="flex flex-col justify-between gap-4 border-b border-line/60 pb-5 md:flex-row md:items-end">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <Layers size={20} className="text-primary" /> Complete Tailwind Color Matrix
            </h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Click any swatch below to copy its HEX value directly to your clipboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchColor}
                onChange={(e) => setSearchColor(e.target.value)}
                placeholder="Filter color or hex..."
                className="w-44 rounded-xl border border-line/70 bg-surface/60 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['All', 'Vibrant', 'Cool', 'Warm', 'Nature', 'Neutrals'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPaletteFilter(cat)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-semibold transition',
                    paletteFilter === cat
                      ? 'border-primary bg-primary text-white'
                      : 'border-line/70 bg-surface/50 text-muted hover:border-primary/50 hover:text-fg'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {filteredPalettes.map((palette) => (
            <div key={palette.name} className="glass-strong rounded-2xl border border-line/60 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: palette.shades[500] }} />
                  <h3 className="text-sm font-extrabold text-fg">{palette.name}</h3>
                  <span className="rounded bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
                    {palette.category}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted">50 — 950</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
                {Object.entries(palette.shades).map(([shade, hex]) => {
                  const key = `${palette.name}-${shade}`
                  const isCopied = copiedKey === key
                  const isLight = Number(shade) <= 300
                  return (
                    <button
                      key={shade}
                      onClick={() => copy(hex, key)}
                      className="group flex flex-col overflow-hidden rounded-xl border border-line/50 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
                    >
                      <div
                        className="flex h-12 w-full items-center justify-center"
                        style={{ backgroundColor: hex, color: isLight ? '#09090b' : '#ffffff' }}
                      >
                        {isCopied ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </div>
                      <div className="bg-bg/80 px-2 py-1.5 text-left">
                        <p className="text-[10px] font-bold text-fg">{shade}</p>
                        <p className="font-mono text-[9px] uppercase text-muted">{isCopied ? 'Copied' : hex}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}