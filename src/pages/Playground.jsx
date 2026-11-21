import { useMemo, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Box,
  Check,
  Code2,
  Copy,
  Download,
  Layers,
  Palette,
  RotateCcw,
  Shuffle,
  Sliders,
  Sparkles,
  Type,
} from 'lucide-react'
import CodeViewer from '../components/CodeViewer'
import ViewportResizer from '../components/ViewportResizer'
import { useClipboard } from '../hooks/useClipboard'
import { downloadTextFile, cn } from '../lib/utils'

const DEFAULTS = {
  badge: '3D SPATIAL EDITION',
  showBadge: true,
  text: 'Build 3D Interfaces Faster',
  subtitle: 'Tweak 3D perspective tilt, Z-depth pop-out layers, glass blur, and export in 7 languages.',
  buttonText: 'Launch Studio',
  showButton: true,
  paddingY: 34,
  paddingX: 38,
  maxWidth: 480,
  radius: 26,
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: -0.5,
  borderWidth: 1,
  borderStyle: 'solid',
  shadow: 'glow',
  fillMode: 'gradient', // 'solid' | 'gradient'
  bg: '#111126',
  bg2: '#2e1065',
  gradientAngle: 135,
  glassBlur: 16,
  textColor: '#ffffff',
  borderColor: '#6366f1',
  accentColor: '#6366f1',
  align: 'center',
  /* 3D Spatial Controls */
  enable3DTilt: true,
  tiltIntensity: 16,
  rotateX: 0,
  rotateY: 0,
  zDepth: 28,
  show3DOrbs: true,
  showSpecularGlare: true,
}

const PRESETS = [
  {
    name: '3D Hologram',
    values: {
      ...DEFAULTS,
      badge: 'HOLOGRAPHIC 3D',
      fillMode: 'gradient',
      bg: '#090d1f',
      bg2: '#312e81',
      borderColor: '#38bdf8',
      accentColor: '#06b6d4',
      shadow: 'glow',
      radius: 26,
      enable3DTilt: true,
      tiltIntensity: 18,
      zDepth: 34,
      show3DOrbs: true,
      showSpecularGlare: true,
    },
  },
  {
    name: 'Quantum 3D Orb',
    values: {
      ...DEFAULTS,
      badge: 'SPATIAL ENGINE',
      fillMode: 'gradient',
      bg: '#140a26',
      bg2: '#4c1d95',
      borderColor: '#a855f7',
      accentColor: '#ec4899',
      shadow: 'xl',
      radius: 30,
      enable3DTilt: true,
      tiltIntensity: 20,
      zDepth: 38,
      show3DOrbs: true,
      showSpecularGlare: true,
    },
  },
  {
    name: 'Frosted Glass',
    values: {
      ...DEFAULTS,
      badge: 'GLASSMORPHISM',
      fillMode: 'solid',
      bg: '#1e293b',
      glassBlur: 22,
      borderColor: '#94a3b8',
      accentColor: '#38bdf8',
      shadow: 'xl',
      radius: 28,
      zDepth: 22,
      show3DOrbs: false,
    },
  },
  {
    name: 'Vercel Minimal',
    values: {
      ...DEFAULTS,
      badge: 'ENTERPRISE',
      fillMode: 'solid',
      bg: '#09090b',
      borderColor: '#27272a',
      accentColor: '#ffffff',
      textColor: '#fafafa',
      shadow: 'md',
      radius: 14,
      align: 'left',
      enable3DTilt: false,
      zDepth: 0,
      show3DOrbs: false,
      showSpecularGlare: false,
    },
  },
  {
    name: 'Sunset Blaze',
    values: {
      ...DEFAULTS,
      badge: 'LIMITED DROP',
      fillMode: 'gradient',
      bg: '#881337',
      bg2: '#ea580c',
      gradientAngle: 120,
      borderColor: '#fb7185',
      accentColor: '#f43f5e',
      shadow: 'xl',
      radius: 22,
      enable3DTilt: true,
      tiltIntensity: 15,
      zDepth: 26,
      show3DOrbs: true,
    },
  },
  {
    name: 'Emerald Matrix',
    values: {
      ...DEFAULTS,
      badge: 'SYSTEM ONLINE',
      fillMode: 'gradient',
      bg: '#022c22',
      bg2: '#065f46',
      borderColor: '#10b981',
      accentColor: '#10b981',
      shadow: 'lg',
      radius: 18,
      enable3DTilt: true,
      zDepth: 24,
      show3DOrbs: true,
    },
  },
]

const SHADOWS = {
  none: { css: 'none', tw: 'shadow-none' },
  sm: { css: '0 2px 6px rgba(0,0,0,0.25)', tw: 'shadow-sm' },
  md: { css: '0 8px 20px rgba(0,0,0,0.35)', tw: 'shadow-md' },
  lg: { css: '0 16px 36px rgba(0,0,0,0.45)', tw: 'shadow-lg' },
  xl: { css: '0 24px 60px rgba(0,0,0,0.55)', tw: 'shadow-xl' },
  glow: { css: '0 0 48px rgba(99,102,241,0.55)', tw: 'shadow-[0_0_48px_rgba(99,102,241,0.55)]' },
}

function Slider({ label, value, min, max, step = 1, unit = 'px', onChange }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[11px] font-semibold text-fg/90">
        <span>{label}</span>
        <span className="font-mono text-primary">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-[rgb(var(--primary))]"
      />
    </label>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 text-[11px] font-semibold text-fg/90">
      <span>{label}</span>
      <span className="flex items-center gap-2 rounded-lg border border-line/70 bg-bg/80 px-2 py-1">
        <span className="font-mono text-[10px] uppercase text-muted">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
        />
      </span>
    </label>
  )
}

export default function Playground() {
  const [s, setS] = useState(DEFAULTS)
  const [mode, setMode] = useState('desktop')
  const [inspectorTab, setInspectorTab] = useState('3d') // '3d' | 'content' | 'layout' | 'style'
  const [langIdx, setLangIdx] = useState(0)
  const { copied, copy } = useClipboard()

  // Real-time 3D Cursor Tilt Motion Values
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springRx = useSpring(useTransform(my, [-0.5, 0.5], [s.tiltIntensity, -s.tiltIntensity]), {
    stiffness: 200,
    damping: 20,
  })
  const springRy = useSpring(useTransform(mx, [-0.5, 0.5], [-s.tiltIntensity, s.tiltIntensity]), {
    stiffness: 200,
    damping: 20,
  })

  const handleStageMouseMove = (e) => {
    if (!s.enable3DTilt) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleStageMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const set = (key) => (value) => setS((prev) => ({ ...prev, [key]: value }))

  const randomize = () => {
    const pairs = [
      ['#0f172a', '#4f46e5', '#818cf8'],
      ['#18181b', '#be185d', '#f472b6'],
      ['#042f2e', '#0d9488', '#2dd4bf'],
      ['#1e1b4b', '#7c3aed', '#c084fc'],
      ['#172554', '#0284c7', '#38bdf8'],
    ]
    const [bg, bg2, border] = pairs[Math.floor(Math.random() * pairs.length)]
    setS((prev) => ({
      ...prev,
      fillMode: Math.random() > 0.3 ? 'gradient' : 'solid',
      bg,
      bg2,
      borderColor: border,
      accentColor: border,
      radius: [16, 22, 26, 32][Math.floor(Math.random() * 4)],
      shadow: ['lg', 'xl', 'glow'][Math.floor(Math.random() * 3)],
      enable3DTilt: true,
      zDepth: [20, 28, 36][Math.floor(Math.random() * 3)],
      show3DOrbs: true,
    }))
  }

  const backgroundCss =
    s.fillMode === 'gradient'
      ? `linear-gradient(${s.gradientAngle}deg, ${s.bg}, ${s.bg2})`
      : s.bg

  const cardStyle = {
    padding: `${s.paddingY}px ${s.paddingX}px`,
    maxWidth: `${s.maxWidth}px`,
    borderRadius: `${s.radius}px`,
    background: backgroundCss,
    backdropFilter: s.glassBlur > 0 ? `blur(${s.glassBlur}px)` : undefined,
    color: s.textColor,
    border: `${s.borderWidth}px ${s.borderStyle} ${s.borderColor}`,
    boxShadow: SHADOWS[s.shadow].css,
    textAlign: s.align,
    transformStyle: 'preserve-3d',
  }

  const buttonTextContrast = s.accentColor.toLowerCase() === '#ffffff' ? '#09090b' : '#ffffff'

  /* ------------------------------------------------------------------------ */
  /*                    7-Language Live Code Compiler Tabs                    */
  /* ------------------------------------------------------------------------ */

  const multiLangTabs = useMemo(() => {
    const bgClass =
      s.fillMode === 'gradient'
        ? `bg-[linear-gradient(${s.gradientAngle}deg,${s.bg},${s.bg2})]`
        : `bg-[${s.bg}]`
    const toDartHex = (hex) => `0xFF${hex.replace('#', '').toUpperCase()}`

    // 1. Tailwind JSX
    const tailwindCode = `export default function SpatialCard() {
  return (
    <div style={{ perspective: 1100 }} className="inline-block w-full max-w-[${s.maxWidth}px]">
      <div
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(${s.rotateX}deg) rotateY(${s.rotateY}deg)' }}
        className="relative w-full py-[${s.paddingY}px] px-[${s.paddingX}px] rounded-[${s.radius}px] ${bgClass} text-[${s.textColor}] border-[${s.borderWidth}px] border-${s.borderStyle} border-[${s.borderColor}] ${SHADOWS[s.shadow].tw} text-${s.align} backdrop-blur-[${s.glassBlur}px] transition-transform duration-300"
      >${
        s.showBadge
          ? `\n        <span style={{ transform: 'translateZ(${s.zDepth}px)' }} className="inline-block mb-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-[${s.accentColor}]/20 text-[${s.accentColor}]">
          ${s.badge}
        </span>`
          : ''
      }
        <h2 style={{ transform: 'translateZ(${Math.round(s.zDepth * 0.8)}px)' }} className="text-[${s.fontSize}px] font-[${s.fontWeight}] tracking-[${s.letterSpacing}px] leading-tight">
          ${s.text}
        </h2>
        <p style={{ transform: 'translateZ(${Math.round(s.zDepth * 0.5)}px)' }} className="mt-2.5 text-sm opacity-80 leading-relaxed">
          ${s.subtitle}
        </p>${
          s.showButton
            ? `\n        <div style={{ transform: 'translateZ(${s.zDepth}px)' }} className="mt-5">
          <button className="rounded-xl px-5 py-2.5 text-xs font-bold bg-[${s.accentColor}] text-[${buttonTextContrast}] shadow-md transition hover:opacity-90">
            ${s.buttonText}
          </button>
        </div>`
            : ''
        }
      </div>
    </div>
  )
}`

    // 2. Framer Motion 3D Interactive JSX
    const framer3DCode = `import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function Interactive3DCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [${s.tiltIntensity}, -${s.tiltIntensity}]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-${s.tiltIntensity}, ${s.tiltIntensity}]), { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div style={{ perspective: 1100 }} onMouseMove={handleMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          maxWidth: ${s.maxWidth},
          padding: '${s.paddingY}px ${s.paddingX}px',
          borderRadius: ${s.radius},
          background: '${backgroundCss}',
          color: '${s.textColor}',
          border: '${s.borderWidth}px ${s.borderStyle} ${s.borderColor}',
          boxShadow: '${SHADOWS[s.shadow].css}',
          textAlign: '${s.align}',
        }}
      >
        <div style={{ transform: 'translateZ(${s.zDepth}px)' }}>
          ${s.showBadge ? `<span className="inline-block mb-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase" style={{ background: '${s.accentColor}33', color: '${s.accentColor}' }}>${s.badge}</span>` : ''}
          <h2 style={{ fontSize: ${s.fontSize}, fontWeight: ${s.fontWeight}, letterSpacing: '${s.letterSpacing}px' }}>${s.text}</h2>
          <p className="mt-2.5 text-sm opacity-80">${s.subtitle}</p>
          ${s.showButton ? `<button className="mt-5 rounded-xl px-5 py-2.5 text-xs font-bold" style={{ background: '${s.accentColor}', color: '${buttonTextContrast}' }}>${s.buttonText}</button>` : ''}
        </div>
      </motion.div>
    </div>
  )
}`

    // 3. TypeScript (.tsx)
    const tsxCode = `import React from 'react'

export interface SpatialCardProps {
  title?: string
  subtitle?: string
  buttonText?: string
  onAction?: () => void
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  title = '${s.text.replace(/'/g, "\\'")}',
  subtitle = '${s.subtitle.replace(/'/g, "\\'")}',
  buttonText = '${s.buttonText.replace(/'/g, "\\'")}',
  onAction,
}) => {
  return (
    <div style={{ perspective: 1100 }} className="w-full max-w-[${s.maxWidth}px]">
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(${s.rotateX}deg) rotateY(${s.rotateY}deg)',
          padding: '${s.paddingY}px ${s.paddingX}px',
          borderRadius: ${s.radius},
          background: '${backgroundCss}',
          color: '${s.textColor}',
          border: '${s.borderWidth}px ${s.borderStyle} ${s.borderColor}',
          boxShadow: '${SHADOWS[s.shadow].css}',
          textAlign: '${s.align}',
        }}
      >
        <h2 style={{ transform: 'translateZ(${s.zDepth}px)', fontSize: ${s.fontSize}, fontWeight: ${s.fontWeight} }}>{title}</h2>
        <p className="mt-2.5 text-sm opacity-80">{subtitle}</p>
        ${s.showButton ? `<button onClick={onAction} style={{ transform: 'translateZ(${s.zDepth}px)', background: '${s.accentColor}', color: '${buttonTextContrast}' }} className="mt-5 rounded-xl px-5 py-2.5 text-xs font-bold">{buttonText}</button>` : ''}
      </div>
    </div>
  )
}`

    // 4. Vue 3 Composition API
    const vueCode = `<script setup lang="ts">
import { ref } from 'vue'

const rx = ref(${s.rotateX})
const ry = ref(${s.rotateY})

function onMouseMove(e: MouseEvent) {
  if (!${s.enable3DTilt}) return
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  rx.value = Number((-py * ${s.tiltIntensity * 2}).toFixed(2))
  ry.value = Number((px * ${s.tiltIntensity * 2}).toFixed(2))
}

function onMouseLeave() {
  rx.value = ${s.rotateX}
  ry.value = ${s.rotateY}
}
</script>

<template>
  <div style="perspective: 1100px" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div
      class="spatial-card"
      :style="{
        transform: \`rotateX(\${rx}deg) rotateY(\${ry}deg)\`,
        transformStyle: 'preserve-3d',
      }"
    >
      ${s.showBadge ? `<span class="badge">${s.badge}</span>` : ''}
      <h2 class="title">${s.text}</h2>
      <p class="subtitle">${s.subtitle}</p>
      ${s.showButton ? `<button class="cta-btn">${s.buttonText}</button>` : ''}
    </div>
  </div>
</template>

<style scoped>
.spatial-card {
  width: 100%;
  max-width: ${s.maxWidth}px;
  padding: ${s.paddingY}px ${s.paddingX}px;
  border-radius: ${s.radius}px;
  background: ${backgroundCss};
  backdrop-filter: blur(${s.glassBlur}px);
  color: ${s.textColor};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  box-shadow: ${SHADOWS[s.shadow].css};
  text-align: ${s.align};
  transition: transform 0.15s ease-out;
}
.title {
  transform: translateZ(${s.zDepth}px);
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  letter-spacing: ${s.letterSpacing}px;
}
.cta-btn {
  transform: translateZ(${s.zDepth}px);
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 12px;
  background: ${s.accentColor};
  color: ${buttonTextContrast};
  font-weight: 700;
}
</style>`

    // 5. Svelte 5
    const svelteCode = `<script lang="ts">
  let rx = $state(${s.rotateX})
  let ry = $state(${s.rotateY})

  function handleMove(e: MouseEvent) {
    if (!${s.enable3DTilt}) return
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    rx = -((e.clientY - r.top) / r.height - 0.5) * ${s.tiltIntensity * 2}
    ry = ((e.clientX - r.left) / r.width - 0.5) * ${s.tiltIntensity * 2}
  }
</script>

<div style="perspective: 1100px" onmousemove={handleMove} onmouseleave={() => { rx = ${s.rotateX}; ry = ${s.rotateY} }}>
  <div
    style="
      transform: rotateX({rx}deg) rotateY({ry}deg);
      transform-style: preserve-3d;
      max-width: ${s.maxWidth}px;
      padding: ${s.paddingY}px ${s.paddingX}px;
      border-radius: ${s.radius}px;
      background: ${backgroundCss};
      color: ${s.textColor};
      border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
      box-shadow: ${SHADOWS[s.shadow].css};
      text-align: ${s.align};
    "
  >
    <h2 style="transform: translateZ(${s.zDepth}px); font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}">
      ${s.text}
    </h2>
    <p style="opacity: 0.8; margin-top: 10px">${s.subtitle}</p>
    ${s.showButton ? `<button style="transform: translateZ(${s.zDepth}px); margin-top: 20px; padding: 10px 20px; border-radius: 12px; background: ${s.accentColor}; color: ${buttonTextContrast}; font-weight: 700">${s.buttonText}</button>` : ''}
  </div>
</div>`

    // 6. Pure HTML5 + CSS3
    const htmlCssCode = `<!-- Standalone 3D Spatial Card (HTML5 + CSS3) -->
<div class="spatial-stage">
  <div class="spatial-card">
    ${s.showBadge ? `<span class="spatial-badge">${s.badge}</span>` : ''}
    <h2 class="spatial-title">${s.text}</h2>
    <p class="spatial-subtitle">${s.subtitle}</p>
    ${s.showButton ? `<button class="spatial-btn">${s.buttonText}</button>` : ''}
  </div>
</div>

<style>
  .spatial-stage {
    perspective: 1100px;
    display: inline-block;
    width: 100%;
    max-width: ${s.maxWidth}px;
  }
  .spatial-card {
    padding: ${s.paddingY}px ${s.paddingX}px;
    border-radius: ${s.radius}px;
    background: ${backgroundCss};
    backdrop-filter: blur(${s.glassBlur}px);
    color: ${s.textColor};
    border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
    box-shadow: ${SHADOWS[s.shadow].css};
    text-align: ${s.align};
    transform-style: preserve-3d;
    transform: rotateX(${s.rotateX}deg) rotateY(${s.rotateY}deg);
    transition: transform 0.3s ease;
  }
  .spatial-badge {
    display: inline-block;
    margin-bottom: 12px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 800;
    background: ${s.accentColor}33;
    color: ${s.accentColor};
    transform: translateZ(${s.zDepth}px);
  }
  .spatial-title {
    font-size: ${s.fontSize}px;
    font-weight: ${s.fontWeight};
    letter-spacing: ${s.letterSpacing}px;
    margin: 0;
    transform: translateZ(${Math.round(s.zDepth * 0.8)}px);
  }
  .spatial-subtitle {
    opacity: 0.8;
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 1.6;
  }
  .spatial-btn {
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    font-weight: 700;
    font-size: 12px;
    background: ${s.accentColor};
    color: ${buttonTextContrast};
    cursor: pointer;
    transform: translateZ(${s.zDepth}px);
  }
</style>`

    // 7. Flutter (Dart)
    const flutterCode = `// spatial_card.dart — Flutter / Dart 3D Matrix4 Widget
import 'package:flutter/material.dart';

class SpatialCard extends StatelessWidget {
  const SpatialCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Transform(
      alignment: FractionalOffset.center,
      transform: Matrix4.identity()
        ..setEntry(3, 2, 0.001)
        ..rotateX(${(s.rotateX * (Math.PI / 180)).toFixed(3)})
        ..rotateY(${(s.rotateY * (Math.PI / 180)).toFixed(3)}),
      child: Container(
        constraints: const BoxConstraints(maxWidth: ${s.maxWidth}),
        padding: const EdgeInsets.symmetric(vertical: ${s.paddingY}, horizontal: ${s.paddingX}),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(${s.radius}),
          color: const Color(${toDartHex(s.bg)}),
          border: Border.all(
            color: const Color(${toDartHex(s.borderColor)}),
            width: ${s.borderWidth},
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '${s.text.replace(/'/g, "\\'")}',
              style: const TextStyle(
                fontSize: ${s.fontSize},
                fontWeight: FontWeight.w800,
                color: Color(${toDartHex(s.textColor)}),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              '${s.subtitle.replace(/'/g, "\\'")}',
              style: TextStyle(
                fontSize: 14,
                color: const Color(${toDartHex(s.textColor)}).withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(${toDartHex(s.accentColor)}),
                foregroundColor: const Color(${toDartHex(buttonTextContrast)}),
              ),
              onPressed: () {},
              child: const Text('${s.buttonText.replace(/'/g, "\\'")}'),
            ),
          ],
        ),
      ),
    );
  }
}`

    return [
      { label: 'Tailwind JSX', filename: 'SpatialCard.jsx', code: tailwindCode },
      { label: 'Framer 3D', filename: 'Interactive3DCard.jsx', code: framer3DCode },
      { label: 'TypeScript', filename: 'SpatialCard.tsx', code: tsxCode },
      { label: 'Vue 3', filename: 'SpatialCard.vue', code: vueCode },
      { label: 'Svelte 5', filename: 'SpatialCard.svelte', code: svelteCode },
      { label: 'HTML / CSS', filename: 'spatial-card.html', code: htmlCssCode },
      { label: 'Flutter (Dart)', filename: 'spatial_card.dart', code: flutterCode },
    ]
  }, [s, backgroundCss, buttonTextContrast])

  const activeExport = multiLangTabs[langIdx] || multiLangTabs[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Studio Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-line/60 pb-7 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-inner">
            <Box size={13} />
            <span>3D Spatial Inspector • 7 Languages</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            3D Visual{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Playground
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Sculpt 3D perspective tilt, Z-depth pop-out layers, volumetric orbs, and glass shaders in real time—then
            export clean code in <span className="font-semibold text-fg">7 languages &amp; frameworks</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={randomize}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            <Shuffle size={14} /> Inspire 3D
          </button>
          <button
            onClick={() => setS(DEFAULTS)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 px-3.5 py-2 text-xs font-semibold text-fg transition hover:border-primary/50"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Quick Style Presets Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-xs font-bold text-muted">
          <Sparkles size={13} className="text-primary" /> 3D Presets:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setS(preset.values)}
            className="rounded-full border border-line/70 bg-surface/60 px-3.5 py-1 text-xs font-semibold text-fg/90 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Split Workspace: Left 4-Tab 3D Inspector | Right 3D Live Canvas & Multi-Lang Code */}
      <div className="mt-7 grid gap-6 lg:grid-cols-[370px_1fr]">
        {/* LEFT: Tabbed 3D & Property Inspector */}
        <aside className="glass-strong flex h-fit flex-col overflow-hidden rounded-2xl border border-line/70 shadow-xl backdrop-blur-xl">
          {/* Inspector Tabs */}
          <div className="grid grid-cols-4 border-b border-line/60 bg-surface/50 p-1.5 gap-1">
            {[
              { id: '3d', label: '3D FX', icon: Box },
              { id: 'content', label: 'Text', icon: Type },
              { id: 'layout', label: 'Layout', icon: Layers },
              { id: 'style', label: 'Colors', icon: Palette },
            ].map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setInspectorTab(t.id)}
                  className={cn(
                    'flex items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition',
                    inspectorTab === t.id ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                  )}
                >
                  <Icon size={13} />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>

          <div className="space-y-4 p-5">
            {inspectorTab === '3d' && (
              <>
                <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5">
                  <div>
                    <span className="block text-xs font-bold text-fg">Interactive Cursor 3D Tilt</span>
                    <span className="text-[10px] text-muted">Hover card on canvas to tilt in 3D</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={s.enable3DTilt}
                    onChange={(e) => set('enable3DTilt')(e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--primary))]"
                  />
                </div>

                {s.enable3DTilt && (
                  <Slider
                    label="Cursor Tilt Sensitivity"
                    value={s.tiltIntensity}
                    min={4}
                    max={30}
                    unit="deg"
                    onChange={set('tiltIntensity')}
                  />
                )}

                <Slider
                  label="Z-Depth Layer Pop-Out (translateZ)"
                  value={s.zDepth}
                  min={0}
                  max={56}
                  onChange={set('zDepth')}
                />

                <Slider
                  label="Static 3D Pitch (rotateX)"
                  value={s.rotateX}
                  min={-25}
                  max={25}
                  unit="deg"
                  onChange={set('rotateX')}
                />

                <Slider
                  label="Static 3D Yaw (rotateY)"
                  value={s.rotateY}
                  min={-25}
                  max={25}
                  unit="deg"
                  onChange={set('rotateY')}
                />

                <div className="space-y-2.5 border-t border-line/50 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-fg">3D Volumetric Floating Orbs</span>
                    <input
                      type="checkbox"
                      checked={s.show3DOrbs}
                      onChange={(e) => set('show3DOrbs')(e.target.checked)}
                      className="h-4 w-4 accent-[rgb(var(--primary))]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-fg">Specular Gloss Light Glare</span>
                    <input
                      type="checkbox"
                      checked={s.showSpecularGlare}
                      onChange={(e) => set('showSpecularGlare')(e.target.checked)}
                      className="h-4 w-4 accent-[rgb(var(--primary))]"
                    />
                  </div>
                </div>
              </>
            )}

            {inspectorTab === 'content' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-fg">Top Pill Badge</span>
                  <input
                    type="checkbox"
                    checked={s.showBadge}
                    onChange={(e) => set('showBadge')(e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--primary))]"
                  />
                </div>
                {s.showBadge && (
                  <input
                    value={s.badge}
                    onChange={(e) => set('badge')(e.target.value)}
                    placeholder="Badge label"
                    className="w-full rounded-xl border border-line/80 bg-bg/80 px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                )}

                <label className="block text-xs font-bold text-fg">
                  Headline
                  <input
                    value={s.text}
                    onChange={(e) => set('text')(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line/80 bg-bg/80 px-3 py-2 text-xs font-normal outline-none focus:border-primary"
                  />
                </label>

                <label className="block text-xs font-bold text-fg">
                  Description
                  <textarea
                    rows={2}
                    value={s.subtitle}
                    onChange={(e) => set('subtitle')(e.target.value)}
                    className="mt-1.5 w-full resize-none rounded-xl border border-line/80 bg-bg/80 px-3 py-2 text-xs font-normal outline-none focus:border-primary"
                  />
                </label>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-fg">Action Button</span>
                  <input
                    type="checkbox"
                    checked={s.showButton}
                    onChange={(e) => set('showButton')(e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--primary))]"
                  />
                </div>
                {s.showButton && (
                  <input
                    value={s.buttonText}
                    onChange={(e) => set('buttonText')(e.target.value)}
                    placeholder="Button text"
                    className="w-full rounded-xl border border-line/80 bg-bg/80 px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                )}

                <div className="space-y-3.5 border-t border-line/50 pt-3">
                  <Slider label="Headline Size" value={s.fontSize} min={14} max={48} onChange={set('fontSize')} />
                  <Slider
                    label="Font Weight"
                    value={s.fontWeight}
                    min={400}
                    max={900}
                    step={100}
                    unit=""
                    onChange={set('fontWeight')}
                  />
                  <Slider
                    label="Letter Spacing"
                    value={s.letterSpacing}
                    min={-2}
                    max={4}
                    step={0.5}
                    onChange={set('letterSpacing')}
                  />
                </div>
              </>
            )}

            {inspectorTab === 'layout' && (
              <>
                <Slider label="Card Max Width" value={s.maxWidth} min={280} max={680} step={10} onChange={set('maxWidth')} />
                <Slider label="Padding Vertical (Y)" value={s.paddingY} min={12} max={72} onChange={set('paddingY')} />
                <Slider label="Padding Horizontal (X)" value={s.paddingX} min={12} max={84} onChange={set('paddingX')} />
                <Slider label="Corner Radius" value={s.radius} min={0} max={48} onChange={set('radius')} />
                <Slider label="Border Thickness" value={s.borderWidth} min={0} max={6} onChange={set('borderWidth')} />

                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold">Border Style</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['solid', 'dashed', 'dotted'].map((st) => (
                      <button
                        key={st}
                        onClick={() => set('borderStyle')(st)}
                        className={cn(
                          'rounded-lg border py-1.5 text-xs font-semibold capitalize transition',
                          s.borderStyle === st
                            ? 'border-primary bg-primary text-white'
                            : 'border-line/70 text-muted hover:text-fg'
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold">Content Alignment</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'left', icon: AlignLeft },
                      { id: 'center', icon: AlignCenter },
                      { id: 'right', icon: AlignRight },
                    ].map((a) => {
                      const Icon = a.icon
                      return (
                        <button
                          key={a.id}
                          onClick={() => set('align')(a.id)}
                          className={cn(
                            'flex items-center justify-center rounded-lg border py-2 transition',
                            s.align === a.id
                              ? 'border-primary bg-primary text-white'
                              : 'border-line/70 text-muted hover:text-fg'
                          )}
                        >
                          <Icon size={14} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {inspectorTab === 'style' && (
              <>
                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold">Background Fill Mode</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['solid', 'gradient'].map((fm) => (
                      <button
                        key={fm}
                        onClick={() => set('fillMode')(fm)}
                        className={cn(
                          'rounded-lg border py-1.5 text-xs font-semibold capitalize transition',
                          s.fillMode === fm
                            ? 'border-primary bg-primary text-white'
                            : 'border-line/70 text-muted hover:text-fg'
                        )}
                      >
                        {fm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <ColorField
                    label={s.fillMode === 'gradient' ? 'Gradient Start' : 'Background'}
                    value={s.bg}
                    onChange={set('bg')}
                  />
                  {s.fillMode === 'gradient' && (
                    <>
                      <ColorField label="Gradient End" value={s.bg2} onChange={set('bg2')} />
                      <Slider
                        label="Gradient Angle"
                        value={s.gradientAngle}
                        min={0}
                        max={360}
                        step={15}
                        unit="deg"
                        onChange={set('gradientAngle')}
                      />
                    </>
                  )}
                  <ColorField label="Text Color" value={s.textColor} onChange={set('textColor')} />
                  <ColorField label="Border Color" value={s.borderColor} onChange={set('borderColor')} />
                  <ColorField label="Badge & Button Accent" value={s.accentColor} onChange={set('accentColor')} />
                </div>

                <Slider label="Backdrop Glass Blur" value={s.glassBlur} min={0} max={24} onChange={set('glassBlur')} />

                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold">Elevation & Glow</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.keys(SHADOWS).map((k) => (
                      <button
                        key={k}
                        onClick={() => set('shadow')(k)}
                        className={cn(
                          'rounded-lg border px-2 py-1.5 text-xs font-semibold capitalize transition',
                          s.shadow === k
                            ? 'border-primary bg-primary text-white'
                            : 'border-line/70 text-muted hover:text-fg'
                        )}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* RIGHT: 3D Interactive Live Canvas & Multi-Lang Code */}
        <div className="min-w-0 space-y-5">
          {/* Quick Export Bar */}
          <div className="glass-strong flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/70 px-4 py-2.5 shadow-md">
            <span className="flex items-center gap-2 text-xs font-semibold text-muted">
              <Box size={14} className="text-primary" />
              3D Spatial Stage • <span className="font-mono text-fg">Z:{s.zDepth}px</span> •{' '}
              <span className="font-mono text-fg">{s.maxWidth}px</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copy(activeExport.code)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 px-3 py-1.5 text-xs font-semibold text-fg transition hover:border-primary/50"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-primary" />}
                <span>{copied ? 'Copied!' : `Copy ${activeExport.label}`}</span>
              </button>
              <button
                onClick={() => downloadTextFile(activeExport.filename, activeExport.code)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                <Download size={14} />
                <span>{activeExport.filename}</span>
              </button>
            </div>
          </div>

          <ViewportResizer mode={mode} onModeChange={setMode}>
            <div
              style={{ perspective: 1200 }}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
              className="relative grid min-h-[420px] place-items-center overflow-hidden bg-bg/85 p-8"
            >
              {/* Studio Dotted Canvas Background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              />

              {/* 3D Perspective Wrapper */}
              <motion.div
                style={{
                  rotateX: s.enable3DTilt ? springRx : s.rotateX,
                  rotateY: s.enable3DTilt ? springRy : s.rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative z-10 flex w-full justify-center"
              >
                {/* Floating 3D Volumetric Orbs */}
                {s.show3DOrbs && (
                  <>
                    <div
                      style={{
                        transform: `translateZ(${s.zDepth + 16}px)`,
                        background: `radial-gradient(circle at 30% 25%, #ffffff 0%, ${s.accentColor} 45%, #09090b 100%)`,
                        boxShadow: `0 14px 32px ${s.accentColor}66`,
                      }}
                      className="pointer-events-none absolute -right-5 -top-5 z-20 h-14 w-14 rounded-full"
                    />
                    <div
                      style={{
                        transform: `translateZ(${Math.max(10, s.zDepth - 6)}px)`,
                        background: `radial-gradient(circle at 30% 25%, #ffffff 0%, ${s.borderColor} 50%, #09090b 100%)`,
                      }}
                      className="pointer-events-none absolute -bottom-4 -left-4 z-20 h-10 w-10 rounded-full opacity-90"
                    />
                  </>
                )}

                {/* Live Rendered 3D Card */}
                <div style={cardStyle} className="relative w-full overflow-visible transition-shadow duration-200">
                  {/* Specular Gloss Light Glare Overlay */}
                  {s.showSpecularGlare && (
                    <div
                      style={{ borderRadius: `${s.radius}px` }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-60"
                    />
                  )}

                  {s.showBadge && (
                    <span
                      style={{
                        transform: `translateZ(${s.zDepth}px)`,
                        backgroundColor: `${s.accentColor}26`,
                        color: s.accentColor,
                        border: `1px solid ${s.accentColor}55`,
                      }}
                      className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
                    >
                      {s.badge}
                    </span>
                  )}

                  <h2
                    style={{
                      transform: `translateZ(${Math.round(s.zDepth * 0.85)}px)`,
                      fontSize: s.fontSize,
                      fontWeight: s.fontWeight,
                      letterSpacing: `${s.letterSpacing}px`,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {s.text}
                  </h2>

                  <p
                    style={{
                      transform: `translateZ(${Math.round(s.zDepth * 0.5)}px)`,
                      opacity: 0.85,
                      margin: '10px 0 0',
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {s.subtitle}
                  </p>

                  {s.showButton && (
                    <div style={{ transform: `translateZ(${s.zDepth}px)` }} className="mt-5">
                      <button
                        style={{
                          backgroundColor: s.accentColor,
                          color: buttonTextContrast,
                        }}
                        className="rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition hover:opacity-90"
                      >
                        {s.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </ViewportResizer>

          {/* 7-Language Multi-Framework Code Export Suite */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line/70 bg-surface/70 p-2 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-1.5">
                {multiLangTabs.map((t, idx) => (
                  <button
                    key={t.label}
                    onClick={() => setLangIdx(idx)}
                    className={cn(
                      'rounded-xl px-3 py-1.5 text-xs font-semibold transition',
                      langIdx === idx ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="hidden items-center gap-1 pr-2 text-[11px] font-medium text-muted sm:inline-flex">
                <Code2 size={13} className="text-primary" /> 7 Languages
              </span>
            </div>

            <CodeViewer
              tabs={[
                {
                  label: activeExport.filename,
                  code: activeExport.code,
                },
              ]}
              maxHeight={390}
            />
          </div>
        </div>
      </div>
    </div>
  )
}