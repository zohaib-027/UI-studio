import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Download, Eye, KeyRound, Loader2, Sparkles, Wand2, Code2, Copy } from 'lucide-react'
import { EXAMPLE_PROMPTS, generateLocal, generateWithGemini, specToCode } from '../lib/uiGenerator'
import SpecRenderer from '../components/SpecRenderer'
import ViewportResizer from '../components/ViewportResizer'
import CodeViewer from '../components/CodeViewer'
import { useClipboard } from '../hooks/useClipboard'
import { downloadTextFile, cn } from '../lib/utils'

const STEPS = ['Analyzing your prompt', 'Choosing layout and sections', 'Composing components', 'Applying colors and copy', 'Generating React code']
const KEY_STORAGE = 'react-ui-studio-gemini-key'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function AIStudio() {
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0])
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(-1)
  const [spec, setSpec] = useState(null)
  const [code, setCode] = useState('')
  const [source, setSource] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('preview')
  const [mode, setMode] = useState('desktop')
  const { copied, copy } = useClipboard()
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    try {
      setApiKey(localStorage.getItem(KEY_STORAGE) || '')
    } catch (e) {
      /* storage unavailable */
    }
    return () => {
      mounted.current = false
    }
  }, [])

  const saveKey = (value) => {
    setApiKey(value)
    try {
      if (value) localStorage.setItem(KEY_STORAGE, value)
      else localStorage.removeItem(KEY_STORAGE)
    } catch (e) {
      /* storage unavailable */
    }
  }

  const generate = async () => {
    const text = prompt.trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setStep(0)

    const key = apiKey.trim()
    let result = null
    let usedGemini = false
    let failure = ''

    const work = (async () => {
      if (key) {
        try {
          result = await generateWithGemini(text, key)
          usedGemini = true
        } catch (e) {
          failure = e && e.message ? e.message : 'Gemini request failed.'
        }
      }
      if (!result) {
        await sleep(300)
        result = generateLocal(text)
      }
    })()

    for (let i = 0; i < STEPS.length; i += 1) {
      if (!mounted.current) return
      setStep(i)
      await sleep(i === STEPS.length - 1 ? 450 : 650)
    }
    await work
    if (!mounted.current) return

    setSpec(result)
    setCode(specToCode(result))
    setSource(usedGemini ? 'Gemini' : 'Local generator')
    if (failure) setError(failure + ' Showing the local generator result instead.')
    setTab('preview')
    setStep(STEPS.length)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles size={13} /> AI Studio
        </span>
        <h1 className="section-title mt-3">
          Describe it. <span className="text-gradient">Get the UI.</span>
        </h1>
        <p className="mt-3 text-muted">Write a prompt in plain English. The generator builds a live preview and exportable React code. Add a Gemini API key for richer, model-written copy.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[400px_1fr]">
        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <label className="text-xs font-semibold">Your prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder="e.g. A pricing page for a developer API platform in blue"
              className="mt-2 w-full resize-none rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((p) => (
                <button key={p} onClick={() => setPrompt(p)} className="rounded-full border border-line px-2.5 py-1 text-left text-[11px] text-muted transition hover:border-primary/60 hover:text-fg">
                  {p.length > 40 ? p.slice(0, 38) + '...' : p}
                </button>
              ))}
            </div>
            <button onClick={generate} disabled={loading || !prompt.trim()} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {loading ? 'Generating...' : 'Generate UI'}
            </button>
          </div>

          <div className="glass rounded-2xl p-5">
            <button onClick={() => setShowKey((s) => !s)} className="flex w-full items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <KeyRound size={15} className="text-primary" /> Gemini API key <span className="text-xs font-normal text-muted">(optional)</span>
              </span>
              <span className="text-xs text-muted">{apiKey ? 'Saved' : showKey ? 'Hide' : 'Add'}</span>
            </button>
            <AnimatePresence initial={false}>
              {showKey && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => saveKey(e.target.value)}
                    placeholder="AIza..."
                    autoComplete="off"
                    className="mt-3 w-full rounded-lg border border-line bg-bg px-3 py-2 font-mono text-xs outline-none focus:border-primary"
                  />
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">Stored only in this browser and sent straight to Google. Leave empty to use the built-in local generator.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {step >= 0 && (
              <motion.ol initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-2.5 rounded-2xl p-5">
                {STEPS.map((label, i) => {
                  const done = step > i
                  const active = step === i && loading
                  return (
                    <li key={label} className={cn('flex items-center gap-3 text-sm transition', done || active ? 'text-fg' : 'text-muted/60')}>
                      <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]', done ? 'border-primary bg-primary text-white' : active ? 'border-primary' : 'border-line')}>
                        {done ? <Check size={11} /> : active ? <Loader2 size={11} className="animate-spin text-primary" /> : i + 1}
                      </span>
                      {label}
                    </li>
                  )
                })}
              </motion.ol>
            )}
          </AnimatePresence>
        </aside>

        <div className="min-w-0">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!spec && !loading && (
            <div className="grid min-h-[420px] place-items-center rounded-2xl border border-dashed border-line p-8 text-center">
              <div>
                <Sparkles size={36} className="mx-auto text-primary" />
                <p className="mt-3 font-semibold">Your generated UI appears here</p>
                <p className="mt-1 text-sm text-muted">Pick an example prompt or write your own, then press Generate.</p>
              </div>
            </div>
          )}

          {!spec && loading && (
            <div className="grid min-h-[420px] place-items-center rounded-2xl border border-line bg-surface/40">
              <div className="text-center">
                <Loader2 size={34} className="mx-auto animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted">{STEPS[Math.min(step, STEPS.length - 1)]}...</p>
              </div>
            </div>
          )}

          {spec && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: loading ? 0.5 : 1, y: 0 }} key={code.length + spec.title}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
                  {[
                    { id: 'preview', label: 'Preview', icon: Eye },
                    { id: 'code', label: 'React code', icon: Code2 },
                  ].map((t) => {
                    const Icon = t.icon
                    return (
                      <button key={t.id} onClick={() => setTab(t.id)} className={cn('inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition', tab === t.id ? 'bg-primary text-white' : 'text-muted hover:text-fg')}>
                        <Icon size={14} /> {t.label}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-line px-3 py-1 text-[11px] text-muted">Source: {source}</span>
                  <button onClick={() => copy(code)} className="btn-ghost px-3 py-1.5 text-xs">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={() => downloadTextFile((spec.title || 'Generated').replace(/[^A-Za-z0-9]/g, '') + 'Page.jsx', code)} className="btn-ghost px-3 py-1.5 text-xs">
                    <Download size={14} /> .jsx
                  </button>
                </div>
              </div>

              {tab === 'preview' ? (
                <ViewportResizer mode={mode} onModeChange={setMode}>
                  <div className="max-h-[680px] overflow-auto">
                    <SpecRenderer spec={spec} />
                  </div>
                </ViewportResizer>
              ) : (
                <CodeViewer tabs={[{ label: 'GeneratedPage.jsx', code }]} maxHeight={680} />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
