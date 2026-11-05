import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { cn } from '../lib/utils'

export const viewports = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, max: 1600 },
  { id: 'tablet', label: 'Tablet', icon: Tablet, max: 768 },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, max: 390 },
]

export function ViewportToggle({ value, onChange }) {
  return (
    <div className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
      {viewports.map((v) => {
        const Icon = v.icon
        const active = value === v.id
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            title={v.label}
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              active ? 'text-white' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span layoutId="viewport-pill" className="absolute inset-0 rounded-lg bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <Icon size={14} className="relative" />
            <span className="relative hidden sm:inline">{v.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function ViewportResizer({ children, className, defaultMode = 'desktop', mode: controlledMode, onModeChange, hideToggle = false }) {
  const [inner, setInner] = useState(defaultMode)
  const mode = controlledMode || inner
  const setMode = onModeChange || setInner
  const current = viewports.find((v) => v.id === mode) || viewports[0]

  return (
    <div className={className}>
      {!hideToggle && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <ViewportToggle value={mode} onChange={setMode} />
          <span className="font-mono text-xs text-muted">{current.id === 'desktop' ? 'Full width' : current.max + 'px'}</span>
        </div>
      )}
      <div className="rounded-2xl border border-dashed border-line bg-bg/40 p-3 sm:p-4">
        <motion.div
          layout
          animate={{ maxWidth: current.max }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="mx-auto w-full overflow-hidden rounded-xl border border-line bg-bg shadow-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
