import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { hexToRgbString, themeToCssVariables } from '../data/themesData'
import { useTheme } from '../hooks/useTheme'
import { useClipboard } from '../hooks/useClipboard'
import CodeViewer from '../components/CodeViewer'
import { cn } from '../lib/utils'

function Swatch({ name, hex, copy, copiedKey }) {
  const rgb = hexToRgbString(hex)
  const hexKey = 'hex-' + name + hex
  const rgbKey = 'rgb-' + name + hex
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface/60">
      <div className="h-16" style={{ background: hex }} />
      <div className="space-y-1.5 p-3">
        <p className="text-xs font-bold uppercase tracking-wide">{name}</p>
        <button onClick={() => copy(hex, hexKey)} className="flex w-full items-center justify-between rounded-md bg-bg/60 px-2 py-1 font-mono text-[11px] text-muted transition hover:text-fg">
          {hex}
          {copiedKey === hexKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
        <button onClick={() => copy(rgb, rgbKey)} className="flex w-full items-center justify-between rounded-md bg-bg/60 px-2 py-1 font-mono text-[11px] text-muted transition hover:text-fg">
          {rgb}
          {copiedKey === rgbKey ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  )
}

export default function Colors() {
  const { themes, themeId, setThemeId, theme } = useTheme()
  const { copiedKey, copy } = useClipboard()

  const tailwindSnippet = `// tailwind.config.js
colors: {
  bg: 'rgb(var(--bg) / <alpha-value>)',
  surface: 'rgb(var(--surface) / <alpha-value>)',
  fg: 'rgb(var(--fg) / <alpha-value>)',
  muted: 'rgb(var(--muted) / <alpha-value>)',
  line: 'rgb(var(--line) / <alpha-value>)',
  primary: 'rgb(var(--primary) / <alpha-value>)',
  accent: 'rgb(var(--accent) / <alpha-value>)',
}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="section-title">
          Theme <span className="text-gradient">Palettes</span>
        </h1>
        <p className="mt-3 text-muted">Seven design-token sets. Click a theme to apply it to the whole studio, then copy any color.</p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ y: -4 }}
            onClick={() => setThemeId(t.id)}
            className={cn('overflow-hidden rounded-2xl border-2 text-left transition', t.id === themeId ? 'border-primary glow-primary' : 'border-line hover:border-primary/50')}
            style={{ background: t.colors.bg, color: t.colors.fg }}
          >
            <div className="flex h-20">
              {[t.colors.primary, t.colors.accent, t.colors.surface, t.colors.line].map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold">{t.name}</span>
                {t.id === themeId && <Check size={16} style={{ color: t.colors.primary }} />}
              </div>
              <p className="mt-1 text-xs" style={{ color: t.colors.muted }}>
                {t.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold">
            {theme.name} <span className="text-muted">tokens</span>
          </h2>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">Mode: {theme.mode}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(theme.colors).map(([name, hex]) => (
            <Swatch key={name} name={name} hex={hex} copy={copy} copiedKey={copiedKey} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-bold">CSS variables</h3>
          <CodeViewer tabs={[{ label: 'CSS', code: themeToCssVariables(theme) }]} maxHeight={320} />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-bold">Tailwind mapping</h3>
          <CodeViewer tabs={[{ label: 'tailwind.config.js', code: tailwindSnippet }]} maxHeight={320} />
        </div>
      </section>

      <section className="mt-14">
        <h3 className="mb-3 text-lg font-bold">Live preview</h3>
        <div className="grid gap-4 rounded-2xl border border-line bg-bg p-6 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="font-bold">Card title</p>
            <p className="mt-1 text-sm text-muted">Muted supporting text on a surface color.</p>
          </div>
          <div className="flex items-center justify-center gap-3 rounded-xl border border-line bg-surface p-5">
            <button className="btn-primary">Primary</button>
            <button className="btn-ghost">Ghost</button>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface p-5">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Primary</span>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">Accent</span>
          </div>
        </div>
      </section>
    </div>
  )
}
