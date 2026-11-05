import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Code2, LayoutDashboard, Rocket, ShoppingBag, User } from 'lucide-react'
import { templatesData } from '../data/templatesData'
import TemplatePreview from '../components/TemplatePreviews'
import ViewportResizer from '../components/ViewportResizer'
import CodeViewer from '../components/CodeViewer'
import { cn } from '../lib/utils'

const icons = { Rocket, User, ShoppingBag, LayoutDashboard }

export default function Templates() {
  const [activeId, setActiveId] = useState(templatesData[0].id)
  const [tab, setTab] = useState('preview')
  const [mode, setMode] = useState('desktop')
  const active = templatesData.find((t) => t.id === activeId) || templatesData[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="section-title">
          Page <span className="text-gradient">Templates</span>
        </h1>
        <p className="mt-3 text-muted">Full-page starting points with live, interactive previews. Switch viewports or grab the code.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {templatesData.map((t) => {
            const Icon = icons[t.icon] || Rocket
            return (
              <motion.button
                key={t.id}
                whileHover={{ x: 3 }}
                onClick={() => setActiveId(t.id)}
                className={cn('rounded-2xl border p-4 text-left transition', t.id === activeId ? 'border-primary bg-primary/10 glow-primary' : 'border-line bg-surface/60 hover:border-primary/50')}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <Icon size={18} />
                  </span>
                  <span className="font-bold">{t.name}</span>
                </div>
                <p className="mt-2 text-xs text-muted">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-bg/70 px-2 py-0.5 text-[10px] font-semibold text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="min-w-0">
          <div className="mb-4 inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
            {[
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'code', label: 'Code', icon: Code2 },
            ].map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn('inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition', tab === t.id ? 'bg-primary text-white' : 'text-muted hover:text-fg')}
                >
                  <Icon size={14} /> {t.label}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active.id + tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tab === 'preview' ? (
                <ViewportResizer mode={mode} onModeChange={setMode}>
                  <div className="max-h-[620px] overflow-auto">
                    <TemplatePreview id={active.id} />
                  </div>
                </ViewportResizer>
              ) : (
                <CodeViewer tabs={[{ label: active.name.replace(/[^A-Za-z]/g, '') + '.jsx', code: active.code }]} maxHeight={620} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
