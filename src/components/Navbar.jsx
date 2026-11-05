import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, CornerDownLeft, Menu, Palette, Search, Sparkles, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { componentsData } from '../data/componentsData'
import { cn } from '../lib/utils'

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/components', label: 'Components' },
  { to: '/effects', label: 'Effects' },
  { to: '/colors', label: 'Colors' },
  { to: '/templates', label: 'Templates' },
  { to: '/playground', label: 'Playground' },
  { to: '/ai-studio', label: 'AI Studio', badge: true },
]

function ThemeSwitcher() {
  const { theme, themes, setThemeId } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-3 py-2 text-sm font-medium transition hover:border-primary/60"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Palette size={16} className="text-primary" />
        <span className="hidden md:inline">{theme.name}</span>
        <ChevronDown size={14} className={cn('transition', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="glass-strong absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl p-1.5 shadow-2xl"
            role="listbox"
          >
            {themes.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    setThemeId(t.id)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-line/40"
                >
                  <span className="flex -space-x-1">
                    {[t.colors.bg, t.colors.primary, t.colors.accent].map((c, i) => (
                      <span key={i} className="h-4 w-4 rounded-full border border-white/20" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="flex-1">{t.name}</span>
                  {t.id === theme.id && <Check size={14} className="text-primary" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function SearchPalette({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pages = navLinks.map((l) => ({ key: 'p' + l.to, label: l.label, hint: 'Page', to: l.to }))
    const comps = componentsData.map((c) => ({
      key: 'c' + c.id,
      label: c.name,
      hint: c.category,
      to: '/components?q=' + encodeURIComponent(c.name),
      hay: (c.name + ' ' + c.category + ' ' + c.tags.join(' ')).toLowerCase(),
    }))
    const all = [...pages, ...comps]
    if (!q) return all.slice(0, 9)
    return all.filter((r) => (r.hay || r.label.toLowerCase()).includes(q)).slice(0, 9)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setIndex(0)
      setTimeout(() => inputRef.current && inputRef.current.focus(), 40)
    }
  }, [open])

  useEffect(() => setIndex(0), [query])

  const go = (r) => {
    if (!r) return
    navigate(r.to)
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      go(results[index])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-start justify-center bg-black/60 p-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={18} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages and components..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <span className="kbd">ESC</span>
            </div>
            <ul className="max-h-80 overflow-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results found</li>}
              {results.map((r, i) => (
                <li key={r.key}>
                  <button
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => go(r)}
                    className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition', i === index ? 'bg-primary/15 text-fg' : 'text-muted')}
                  >
                    <span className="font-medium">{r.label}</span>
                    <span className="flex items-center gap-2 text-xs">
                      {r.hint}
                      {i === index && <CornerDownLeft size={12} />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <>
      <header className={cn('sticky top-0 z-50 transition-all', scrolled ? 'glass-strong border-b' : 'border-b border-transparent bg-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg glow-primary">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              UI<span className="text-gradient">Studio</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn('relative rounded-lg px-3 py-2 text-sm font-medium transition', isActive ? 'text-fg' : 'text-muted hover:text-fg')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-primary/15" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="relative flex items-center gap-1.5">
                      {l.label}
                      {l.badge && <span className="rounded-full bg-gradient-to-r from-primary to-accent px-1.5 py-px text-[9px] font-bold uppercase text-white">AI</span>}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-3 py-2 text-sm text-muted transition hover:border-primary/60 hover:text-fg"
              aria-label="Open search"
            >
              <Search size={16} />
              <span className="hidden xl:inline">Search</span>
              <span className="kbd hidden sm:inline">{isMac ? '⌘' : 'Ctrl'} K</span>
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-xl border border-line bg-surface/70 p-2 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-line lg:hidden"
            >
              <div className="grid gap-1 p-3">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn('rounded-lg px-3 py-2.5 text-sm font-medium', isActive ? 'bg-primary/15 text-fg' : 'text-muted')}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
