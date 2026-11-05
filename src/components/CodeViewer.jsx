import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useClipboard } from '../hooks/useClipboard'
import { cn } from '../lib/utils'

const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|<\/?[A-Za-z][\w.]*|\/>|\b(?:import|from|export|default|const|let|var|return|function|if|else|true|false|null|useState|useEffect)\b|\b\d+(?:\.\d+)?\b)/g

function classify(token) {
  if (token.startsWith('//') || token.startsWith('/*')) return 'text-muted italic'
  if (/^["'`]/.test(token)) return 'text-emerald-400'
  if (token.startsWith('<') || token === '/>') return 'text-sky-400'
  if (/^\d/.test(token)) return 'text-amber-400'
  return 'text-fuchsia-400'
}

function highlight(code) {
  const out = []
  let last = 0
  let m
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index))
    out.push(
      <span key={m.index} className={classify(m[0])}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  out.push(code.slice(last))
  return out
}

export default function CodeViewer({ tabs, className, maxHeight = 420 }) {
  const [active, setActive] = useState(0)
  const { copied, copy } = useClipboard()
  const safeIndex = Math.min(active, tabs.length - 1)
  const current = tabs[safeIndex]

  return (
    <div className={cn('overflow-hidden rounded-xl border border-line bg-[#0b0d14] text-slate-200', className)}>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-2">
        <div className="flex">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={cn(
                'border-b-2 px-3 py-2.5 text-xs font-semibold transition',
                i === safeIndex ? 'border-primary text-white' : 'border-transparent text-slate-400 hover:text-slate-200',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => copy(current.code)}
          className="mr-1 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-auto p-4 font-mono text-[12.5px] leading-relaxed" style={{ maxHeight }}>
        <code>{highlight(current.code)}</code>
      </pre>
    </div>
  )
}
