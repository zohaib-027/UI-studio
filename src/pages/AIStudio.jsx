import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Bot,
  Box,
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  Trash2,
  User,
  Wand2,
} from 'lucide-react'
import { EXAMPLE_PROMPTS, generateLocal, generateWithGemini, specToCode } from '../lib/uiGenerator'
import SpecRenderer from '../components/SpecRenderer'
import ViewportResizer from '../components/ViewportResizer'
import CodeViewer from '../components/CodeViewer'
import { useClipboard } from '../hooks/useClipboard'
import { downloadTextFile, cn } from '../lib/utils'

// Paste your Gemini API Key here (or set VITE_GEMINI_API_KEY in your .env file)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6IttRMIA-RW4uRROAQA3UTb5Xe5JCu1Eg1_-w-RgS5BOg'

/* -------------------------------------------------------------------------- */
/*              Conversational Intent Detector (Chat vs UI Build)             */
/* -------------------------------------------------------------------------- */

function getConversationalReply(rawText) {
  const clean = rawText
    .toLowerCase()
    .replace(/[!?.।,]/g, '')
    .trim()

  const greetings = [
    'hi',
    'hii',
    'hiii',
    'hello',
    'hlo',
    'helo',
    'hey',
    'hy',
    'yo',
    'salam',
    'assalam',
    'assalamualaikum',
    'assalam o alaikum',
    'aoa',
    'hola',
    'namaste',
    'good morning',
    'good evening',
    'good night',
  ]

  if (greetings.includes(clean) || /^(hi+|hlo+|hello+|hey+|salam|aoa)\b/.test(clean) && clean.split(' ').length <= 3) {
    return 'Hello! 👋 Kaise hain aap? Main aapka AI UI Architect hoon. Aap mujhe koi bhi interface, card, login form, dashboard, ya landing page banane ke liye bol sakte hain—main uska live preview aur multi-language code tayyar kar doonga!'
  }

  if (/^(how are you|kaise ho|kya hal hai|whats up|sup|kya haal|theek ho)/.test(clean)) {
    return 'Main bilkul theek hoon, shukriya! 😊 Bataiye aaj hum kaunsa UI design ya web page build karein? Aap Urdu, Roman Urdu, ya English mein apna idea likh sakte hain.'
  }

  if (/^(who are you|tum kaun ho|what can you do|kya kar sakte ho|help|madad)/.test(clean)) {
    return 'Main **UI Studio AI Architect** hoon! Aap mujhe kisi bhi web component ya full page ka idea dein (jaise *"Dark SaaS pricing page"* ya *"3D crypto wallet dashboard"*), aur main turant uska live preview + **React, Next.js, TypeScript, Vue 3, Svelte, aur HTML** code generate kar doonga.'
  }

  if (/^(thanks|thank you|shukriya|thx|ok|okay|nice|great|awesome|zabardast)/.test(clean)) {
    return 'Bohat shukriya! 🙌 Agar aap is design mein koi tabdeeli chahte hain (jaise colors, layout, ya naya section add karna) toh zaroor batayein.'
  }

  return null
}

/* -------------------------------------------------------------------------- */
/*                  Multi-Language Code Compiler for AI Output                */
/* -------------------------------------------------------------------------- */

function buildMultiLangCodeTabs(spec, reactCode) {
  const title = (spec?.title || 'GeneratedUI').replace(/[^A-Za-z0-9]/g, '') || 'GeneratedUI'
  const kebab = (spec?.title || 'generated-ui')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const returnMatch = reactCode.match(/return\s*\(([\s\S]*)\)\s*\}?\s*$/)
  const rawJsx = returnMatch
    ? returnMatch[1].trim()
    : `<div className="min-h-screen bg-zinc-950 p-8 text-white">\n  <h1 className="text-3xl font-extrabold">${spec?.title || 'Generated UI'}</h1>\n</div>`

  const htmlMarkup = rawJsx
    .replace(/className=/g, 'class=')
    .replace(/\{`([^`]*)`\}/g, '$1')
    .replace(/onClick=\{[^}]*\}/g, '')
    .replace(/onChange=\{[^}]*\}/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  const nextJsCode = `'use client'\n\n${reactCode}`

  const tsxCode = `import React from 'react'\n\nexport interface ${title}Props {\n  className?: string\n}\n\n${reactCode.replace(
    /export default function \w+\([^)]*\)/,
    `export default function ${title}({ className = '' }: ${title}Props)`
  )}`

  const vueCode = `<script setup lang="ts">\nimport { ref } from 'vue'\n\n// ${spec?.title || 'Generated UI'} — Vue 3 Composition API\nconst isReady = ref(true)\n</script>\n\n<template>\n  <div class="${kebab}-wrapper">\n${htmlMarkup
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n')}\n  </div>\n</template>`

  const svelteCode = `<script lang="ts">\n  // ${spec?.title || 'Generated UI'} — Svelte 5 + Tailwind CSS\n  let active = $state(true)\n</script>\n\n<div class="${kebab}-wrapper">\n${htmlMarkup
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n</div>`

  const htmlCode = `<!-- ${spec?.title || 'Generated UI'} — Standalone HTML5 + Tailwind CSS -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${spec?.title || 'Generated UI'}</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-zinc-950 text-white antialiased">\n${htmlMarkup
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n</body>\n</html>`

  return [
    { label: 'React (JSX)', filename: `${title}.jsx`, code: reactCode },
    { label: 'Next.js', filename: `${title}Page.jsx`, code: nextJsCode },
    { label: 'TypeScript', filename: `${title}.tsx`, code: tsxCode },
    { label: 'Vue 3', filename: `${title}.vue`, code: vueCode },
    { label: 'Svelte 5', filename: `${title}.svelte`, code: svelteCode },
    { label: 'HTML / CSS', filename: `${kebab || 'index'}.html`, code: htmlCode },
  ]
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'bot',
    text: 'Assalam-o-Alaikum & Hello! 👋 Main aapka AI UI Architect hoon. Mujh se normal baat karein ya kisi bhi page/component ka idea dein (jaise "3D SaaS pricing page" ya "Modern fintech dashboard"), aur main uska live preview + 6 languages mein code bana doonga.',
  },
]

export default function AIStudio() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [loading, setLoading] = useState(false)
  const [spec, setSpec] = useState(null)
  const [code, setCode] = useState('')
  const [tab, setTab] = useState('preview')
  const [langIdx, setLangIdx] = useState(0)
  const [mode, setMode] = useState('desktop')
  const [is3DStage, setIs3DStage] = useState(false)

  const { copied, copy } = useClipboard()
  const chatEndRef = useRef(null)

  // 3D Stage Tilt Motion Values
  const stageX = useMotionValue(0)
  const stageY = useMotionValue(0)
  const stageRx = useSpring(useTransform(stageY, [-0.5, 0.5], [7, -7]), { stiffness: 160, damping: 20 })
  const stageRy = useSpring(useTransform(stageX, [-0.5, 0.5], [-9, 9]), { stiffness: 160, damping: 20 })

  const handleStageMove = (e) => {
    if (!is3DStage) return
    const r = e.currentTarget.getBoundingClientRect()
    stageX.set((e.clientX - r.left) / r.width - 0.5)
    stageY.set((e.clientY - r.top) / r.height - 0.5)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const multiLangTabs = useMemo(() => (spec ? buildMultiLangCodeTabs(spec, code) : []), [spec, code])
  const activeCodeTab = multiLangTabs[langIdx] || multiLangTabs[0]

  const handleSend = async (customPrompt) => {
    const text = (customPrompt || input).trim()
    if (!text || loading) return

    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    if (!customPrompt) setInput('')

    // 1. Check if the user is just chatting / greeting (not requesting a UI build)
    const conversationalReply = getConversationalReply(text)
    if (conversationalReply) {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 350))
      setLoading(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: conversationalReply,
        },
      ])
      return
    }

    // 2. User asked to build or modify a UI -> Synthesize UI + Multi-Lang Code
    setLoading(true)
    let result = null

    const hasValidKey = GEMINI_API_KEY && !GEMINI_API_KEY.includes('PASTE_YOUR_API_KEY_HERE')

    if (hasValidKey) {
      try {
        const contextPrompt = spec
          ? `Current UI Title: "${spec.title}". Refine or update based on user request: ${text}`
          : text
        result = await generateWithGemini(contextPrompt, GEMINI_API_KEY)
      } catch (e) {
        // Silently fall back to local synthesizer if Gemini is busy or unreachable
      }
    }

    if (!result) {
      await new Promise((r) => setTimeout(r, 550))
      result = generateLocal(text)
    }

    setSpec(result)
    setCode(specToCode(result))
    setTab('preview')
    setLoading(false)

    const botReply = {
      id: Date.now() + 1,
      role: 'bot',
      text: `Done! ✨ Maine **"${result.title || 'Custom Pro UI'}"** generate kar diya hai. Right side par aap iska Live Preview (3D Stage ke saath) aur **React, Next.js, TypeScript, Vue 3, Svelte, aur HTML** code dekh aur export kar sakte hain.`,
    }
    setMessages((prev) => [...prev, botReply])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Studio Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line/60 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles size={13} /> Conversational AI UI Architect • 6 Languages
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
            Chat to{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Build Pro Interfaces
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-line/60 bg-surface/60 px-3.5 py-2 text-xs">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-medium text-fg/90">Smart Intent Engine Ready</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Conversational Chat Bot | Right Live 3D & Multi-Lang Canvas */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[410px_1fr]">
        {/* LEFT: AI Chat Interface */}
        <aside className="glass-strong flex h-[680px] flex-col overflow-hidden rounded-2xl border border-line/70 shadow-xl backdrop-blur-xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-line/60 bg-surface/50 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-fg">UI Studio Assistant</h2>
                <p className="text-[11px] text-muted">Chat naturally or describe a UI to build</p>
              </div>
            </div>

            {messages.length > 1 && (
              <button
                onClick={() => {
                  setMessages(INITIAL_MESSAGES)
                  setSpec(null)
                  setCode('')
                }}
                className="rounded-lg border border-line/60 bg-bg/60 p-1.5 text-muted transition hover:border-rose-500/40 hover:text-rose-400"
                title="Clear conversation"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Chat Messages History */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-2.5', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs',
                    m.role === 'user'
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-line/60 bg-surface text-primary'
                  )}
                >
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={cn(
                    'max-w-[83%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm',
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-primary text-white'
                      : 'rounded-tl-sm border border-line/60 bg-surface/85 text-fg/95'
                  )}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-line/60 bg-surface text-primary">
                  <Loader2 size={14} className="animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-line/60 bg-surface/80 px-3.5 py-2.5 text-xs text-muted">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="border-t border-line/40 bg-surface/30 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {EXAMPLE_PROMPTS.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  disabled={loading}
                  className="shrink-0 rounded-full border border-line/60 bg-surface/70 px-2.5 py-1 text-[10px] font-medium text-muted transition hover:border-primary/50 hover:text-fg disabled:opacity-50"
                >
                  {p.length > 30 ? p.slice(0, 28) + '...' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Box */}
          <div className="border-t border-line/60 bg-surface/40 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-line/80 bg-bg/90 p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder='Say "Hlo" or ask to build (e.g., "Dark SaaS pricing page")...'
                className="max-h-24 flex-1 resize-none bg-transparent px-1.5 py-1 text-xs outline-none placeholder:text-muted/60"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                title="Send message"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT: Live Preview & Multi-Language Code Workspace */}
        <div className="min-w-0">
          {!spec && !loading && (
            <div className="glass-strong flex h-[680px] flex-col items-center justify-center rounded-2xl border border-dashed border-line/80 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-inner">
                <Wand2 size={28} />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-fg">AI Design Canvas Ready</h3>
              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted">
                Start a conversation on the left or click any prompt blueprint below to generate a responsive UI with{' '}
                <span className="font-semibold text-fg">React, Next.js, TypeScript, Vue 3, Svelte,</span> and{' '}
                <span className="font-semibold text-fg">HTML</span> code.
              </p>

              <div className="mt-6 grid w-full max-w-lg gap-2.5 sm:grid-cols-2">
                {EXAMPLE_PROMPTS.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="flex items-center gap-2.5 rounded-xl border border-line/70 bg-surface/70 p-3 text-left text-xs font-semibold text-fg/90 transition hover:border-primary hover:bg-primary/10"
                  >
                    <MessageSquare size={14} className="shrink-0 text-primary" />
                    <span className="line-clamp-1">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!spec && loading && (
            <div className="glass-strong flex h-[680px] flex-col items-center justify-center rounded-2xl border border-line/70 p-8 text-center">
              <Loader2 size={34} className="animate-spin text-primary" />
              <p className="mt-4 text-sm font-bold text-fg">Architecting your interface &amp; multi-lang code...</p>
              <p className="mt-1 text-xs text-muted">Compiling React, Next.js, TypeScript, Vue 3, Svelte &amp; HTML</p>
            </div>
          )}

          {spec && (
            <div className="space-y-4">
              {/* Top Toolbar */}
              <div className="glass-strong flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/70 p-2.5 shadow-lg">
                <div className="inline-flex gap-1 rounded-xl border border-line/60 bg-bg/70 p-1">
                  <button
                    onClick={() => setTab('preview')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                      tab === 'preview' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                    )}
                  >
                    <Eye size={14} /> Live Preview
                  </button>
                  <button
                    onClick={() => setTab('code')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                      tab === 'code' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-fg'
                    )}
                  >
                    <Code2 size={14} /> Multi-Lang Code
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {tab === 'preview' && (
                    <button
                      onClick={() => {
                        setIs3DStage((v) => !v)
                        stageX.set(0)
                        stageY.set(0)
                      }}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition',
                        is3DStage
                          ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                          : 'border-line/70 bg-surface/60 text-muted hover:border-primary/50 hover:text-fg'
                      )}
                    >
                      <Box size={14} />
                      <span>3D Stage {is3DStage ? 'ON' : 'OFF'}</span>
                    </button>
                  )}

                  {activeCodeTab && (
                    <>
                      <button
                        onClick={() => copy(activeCodeTab.code)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-line/70 bg-surface/60 px-3 py-1.5 text-xs font-semibold text-fg transition hover:border-primary/50"
                      >
                        {copied ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : (
                          <Copy size={14} className="text-primary" />
                        )}
                        <span>{copied ? 'Copied!' : `Copy ${activeCodeTab.label.split(' ')[0]}`}</span>
                      </button>

                      <button
                        onClick={() => downloadTextFile(activeCodeTab.filename, activeCodeTab.code)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                      >
                        <Download size={14} />
                        <span>{activeCodeTab.filename}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

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
                    className={cn(is3DStage && 'rounded-3xl shadow-[0_28px_80px_rgba(0,0,0,0.5)]')}
                  >
                    <ViewportResizer mode={mode} onModeChange={setMode}>
                      <div className="max-h-[600px] overflow-auto">
                        <SpecRenderer spec={spec} />
                      </div>
                    </ViewportResizer>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 6-Language Selector Pills */}
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

                  {activeCodeTab && (
                    <CodeViewer
                      tabs={[
                        {
                          label: activeCodeTab.filename,
                          code: activeCodeTab.code,
                        },
                      ]}
                      maxHeight={540}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}