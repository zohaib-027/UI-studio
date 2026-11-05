import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import CodeViewer from '../components/CodeViewer'
import ViewportResizer from '../components/ViewportResizer'

const DEFAULTS = {
  text: 'Hello, UI Studio',
  subtitle: 'Tweak every control and watch the code update.',
  paddingY: 28,
  paddingX: 32,
  radius: 20,
  fontSize: 24,
  fontWeight: 700,
  borderWidth: 1,
  shadow: 'lg',
  bg: '#1a1a2e',
  textColor: '#ffffff',
  borderColor: '#6366f1',
  align: 'center',
}

const SHADOWS = {
  none: { css: 'none', tw: 'shadow-none' },
  sm: { css: '0 1px 3px rgba(0,0,0,0.3)', tw: 'shadow-sm' },
  md: { css: '0 6px 16px rgba(0,0,0,0.35)', tw: 'shadow-md' },
  lg: { css: '0 14px 34px rgba(0,0,0,0.4)', tw: 'shadow-lg' },
  xl: { css: '0 24px 60px rgba(0,0,0,0.5)', tw: 'shadow-xl' },
  glow: { css: '0 0 40px rgba(99,102,241,0.7)', tw: 'shadow-[0_0_40px_rgba(99,102,241,0.7)]' },
}

function Slider({ label, value, min, max, step = 1, unit = 'px', onChange }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-xs font-semibold">
        {label}
        <span className="font-mono text-muted">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[rgb(var(--primary))]" />
    </label>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs font-semibold">
      {label}
      <span className="flex items-center gap-2">
        <span className="font-mono text-muted">{value}</span>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-line bg-transparent p-0.5" />
      </span>
    </label>
  )
}

export default function Playground() {
  const [s, setS] = useState(DEFAULTS)
  const [mode, setMode] = useState('desktop')
  const set = (key) => (value) => setS((prev) => ({ ...prev, [key]: value }))

  const style = {
    padding: s.paddingY + 'px ' + s.paddingX + 'px',
    borderRadius: s.radius + 'px',
    background: s.bg,
    color: s.textColor,
    border: s.borderWidth + 'px solid ' + s.borderColor,
    boxShadow: SHADOWS[s.shadow].css,
    textAlign: s.align,
  }

  const jsx = useMemo(
    () => `export default function CustomCard() {
  return (
    <div
      style={{
        padding: '${s.paddingY}px ${s.paddingX}px',
        borderRadius: ${s.radius},
        background: '${s.bg}',
        color: '${s.textColor}',
        border: '${s.borderWidth}px solid ${s.borderColor}',
        boxShadow: '${SHADOWS[s.shadow].css}',
        textAlign: '${s.align}',
      }}
    >
      <h2 style={{ fontSize: ${s.fontSize}, fontWeight: ${s.fontWeight}, margin: 0 }}>
        ${s.text}
      </h2>
      <p style={{ opacity: 0.75, margin: '8px 0 0' }}>
        ${s.subtitle}
      </p>
    </div>
  )
}`,
    [s],
  )

  const tailwind = useMemo(
    () => `export default function CustomCard() {
  return (
    <div className="py-[${s.paddingY}px] px-[${s.paddingX}px] rounded-[${s.radius}px] bg-[${s.bg}] text-[${s.textColor}] border-[${s.borderWidth}px] border-[${s.borderColor}] ${SHADOWS[s.shadow].tw} text-${s.align}">
      <h2 className="text-[${s.fontSize}px] font-[${s.fontWeight}]">${s.text}</h2>
      <p className="mt-2 opacity-75">${s.subtitle}</p>
    </div>
  )
}`,
    [s],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="section-title">
            Visual <span className="text-gradient">Playground</span>
          </h1>
          <p className="mt-3 text-muted">Adjust the controls and copy the generated JSX or Tailwind.</p>
        </div>
        <button onClick={() => setS(DEFAULTS)} className="btn-ghost">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="glass h-fit space-y-5 rounded-2xl p-5">
          <label className="block text-xs font-semibold">
            Title
            <input value={s.text} onChange={(e) => set('text')(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal outline-none focus:border-primary" />
          </label>
          <label className="block text-xs font-semibold">
            Subtitle
            <input value={s.subtitle} onChange={(e) => set('subtitle')(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal outline-none focus:border-primary" />
          </label>
          <Slider label="Padding Y" value={s.paddingY} min={0} max={80} onChange={set('paddingY')} />
          <Slider label="Padding X" value={s.paddingX} min={0} max={120} onChange={set('paddingX')} />
          <Slider label="Border radius" value={s.radius} min={0} max={64} onChange={set('radius')} />
          <Slider label="Border width" value={s.borderWidth} min={0} max={8} onChange={set('borderWidth')} />
          <Slider label="Font size" value={s.fontSize} min={12} max={56} onChange={set('fontSize')} />
          <Slider label="Font weight" value={s.fontWeight} min={300} max={900} step={100} unit="" onChange={set('fontWeight')} />

          <div>
            <span className="mb-1.5 block text-xs font-semibold">Shadow</span>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.keys(SHADOWS).map((k) => (
                <button key={k} onClick={() => set('shadow')(k)} className={'rounded-lg border px-2 py-1.5 text-xs font-semibold capitalize transition ' + (s.shadow === k ? 'border-primary bg-primary text-white' : 'border-line text-muted hover:text-fg')}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold">Text align</span>
            <div className="grid grid-cols-3 gap-1.5">
              {['left', 'center', 'right'].map((a) => (
                <button key={a} onClick={() => set('align')(a)} className={'rounded-lg border px-2 py-1.5 text-xs font-semibold capitalize transition ' + (s.align === a ? 'border-primary bg-primary text-white' : 'border-line text-muted hover:text-fg')}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <ColorField label="Background" value={s.bg} onChange={set('bg')} />
            <ColorField label="Text color" value={s.textColor} onChange={set('textColor')} />
            <ColorField label="Border color" value={s.borderColor} onChange={set('borderColor')} />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <ViewportResizer mode={mode} onModeChange={setMode}>
            <div className="grid min-h-[320px] place-items-center bg-bg p-6">
              <div style={style} className="w-full max-w-md">
                <h2 style={{ fontSize: s.fontSize, fontWeight: s.fontWeight, margin: 0 }}>{s.text}</h2>
                <p style={{ opacity: 0.75, margin: '8px 0 0' }}>{s.subtitle}</p>
              </div>
            </div>
          </ViewportResizer>
          <CodeViewer
            tabs={[
              { label: 'JSX (inline styles)', code: jsx },
              { label: 'Tailwind classes', code: tailwind },
            ]}
            maxHeight={380}
          />
        </div>
      </div>
    </div>
  )
}
