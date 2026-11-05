import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Code2, Search, SearchX, X } from 'lucide-react'
import { categories, componentsData } from '../data/componentsData'
import ComponentPreview from '../components/ComponentPreviews'
import ViewportResizer from '../components/ViewportResizer'
import CodeViewer from '../components/CodeViewer'
import Modal from '../components/Modal'
import { useClipboard } from '../hooks/useClipboard'
import { cn } from '../lib/utils'

function toPascal(name) {
  return name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

export default function Components() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState(params.get('q') || '')
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('desktop')
  const { copiedKey, copy } = useClipboard()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return componentsData.filter((c) => {
      const inCat = category === 'All' || c.category === category
      const inQuery = !q || (c.name + ' ' + c.description + ' ' + c.category + ' ' + c.tags.join(' ')).toLowerCase().includes(q)
      return inCat && inQuery
    })
  }, [category, query])

  const onQuery = (v) => {
    setQuery(v)
    if (params.get('q')) setParams({}, { replace: true })
  }

  const usageFor = (c) => {
    const n = toPascal(c.name)
    return "import " + n + " from './components/" + n + "'\n\nexport default function Demo() {\n  return <" + n + " />\n}"
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="section-title">
          Component <span className="text-gradient">Library</span>
        </h1>
        <p className="mt-3 text-muted">Live, theme-aware components. Preview them at any viewport, then view or copy the code.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search components, tags..."
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          {query && (
            <button onClick={() => onQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition',
                category === c ? 'border-primary bg-primary text-white' : 'border-line bg-surface/60 text-muted hover:border-primary/50 hover:text-fg',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ViewportResizer className="mt-8" mode={mode} onModeChange={setMode}>
        {filtered.length === 0 ? (
          <div className="grid place-items-center px-6 py-24 text-center">
            <SearchX size={40} className="text-muted" />
            <p className="mt-3 font-semibold">No components match your search</p>
            <p className="text-sm text-muted">Try a different keyword or category.</p>
          </div>
        ) : (
          <motion.div layout className="grid gap-4 bg-bg p-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((c) => (
                <motion.article
                  layout
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/60"
                >
                  <div className="flex min-h-[190px] flex-1 items-center justify-center overflow-hidden bg-bg/50 p-6">
                    <ComponentPreview id={c.id} />
                  </div>
                  <div className="border-t border-line p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold">{c.name}</h3>
                        <p className="mt-0.5 text-xs text-muted">{c.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">{c.category}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setSelected(c)} className="btn-ghost flex-1 px-3 py-2 text-xs">
                        <Code2 size={14} /> View code
                      </button>
                      <button onClick={() => copy(c.code, c.id)} className="btn-ghost flex-1 px-3 py-2 text-xs">
                        {copiedKey === c.id ? 'Copied!' : 'Copy code'}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </ViewportResizer>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.name : ''}>
        {selected && (
          <div>
            <p className="mb-4 text-sm text-muted">{selected.description}</p>
            <div className="mb-4 flex min-h-[140px] items-center justify-center overflow-hidden rounded-xl border border-line bg-bg/60 p-6">
              <ComponentPreview id={selected.id} />
            </div>
            <CodeViewer
              tabs={[
                { label: 'Component', code: selected.code },
                { label: 'Usage', code: usageFor(selected) },
              ]}
              maxHeight={320}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
