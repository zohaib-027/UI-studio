import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Command, CornerDownLeft, Menu, Palette, Search, Sparkles, X } from 'lucide-react'
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
        className="inline-flex items-center gap-2 rounded-xl border border-line/60 bg-surface/50 px-3 py-2 text-xs font-semibold text-fg/90 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-surface/80 hover:shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex h-4 w-4 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Palette size={13} />
        </div>
        <span className="hidden md:inline font-mono text-xs tracking-tight">{theme.name}</span>
        <ChevronDown size={12} className={cn('text-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="glass-strong absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-line/80 p-1.5 shadow-2xl backdrop-blur-xl"
            role="listbox"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">Select Theme</div>
            {themes.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    setThemeId(t.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-xs font-medium transition-all',
                    t.id === theme.id ? 'bg-primary/15 text-primary font-semibold' : 'text-fg/80 hover:bg-line/40 hover:text-fg'
                  )}
                >
                  <span className="flex -space-x-1.5 ring-1 ring-white/10 rounded-full p-0.5 bg-black/20">
                    {[t.colors.bg, t.colors.primary, t.colors.accent].map((c, i) => (
                      <span key={i} className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="flex-1 tracking-tight">{t.name}</span>
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
    const pages = navLinks.map((l) => ({ key: 'p' + l.to, label: l.label, hint: 'Navigation', to: l.to }))
    const comps = componentsData.map((c) => ({
      key: 'c' + c.id,
      label: c.name,
      hint: c.category,
      to: '/components?q=' + encodeURIComponent(c.name),
      hay: (c.name + ' ' + c.category + ' ' + c.tags.join(' ')).toLowerCase(),
    }))
    const all = [...pages, ...comps]
    if (!q) return all.slice(0, 8)
    return all.filter((r) => (r.hay || r.label.toLowerCase()).includes(q)).slice(0, 8)
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
          className="fixed inset-0 z-[110] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="glass-strong w-full max-w-xl overflow-hidden rounded-2xl border border-line/80 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line/60 px-4 py-3.5">
              <Search size={18} className="text-primary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type to search components, pages, features..."
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted/60"
              />
              <kbd className="inline-flex items-center gap-0.5 rounded-md border border-line/60 bg-surface/50 px-2 py-0.5 text-[10px] font-semibold text-muted">
                ESC
              </kbd>
            </div>
            <ul className="max-h-80 overflow-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-xs font-medium text-muted">No components or pages matched your query</li>}
              {results.map((r, i) => (
                <li key={r.key}>
                  <button
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => go(r)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all',
                      i === index ? 'bg-primary/15 text-primary font-semibold shadow-sm' : 'text-fg/70 hover:text-fg'
                    )}
                  >
                    <span className="font-medium tracking-tight">{r.label}</span>
                    <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      <span className="rounded-md border border-line/40 bg-surface/40 px-1.5 py-0.5">{r.hint}</span>
                      {i === index && <CornerDownLeft size={12} className="text-primary" />}
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
    const onScroll = () => setScrolled(window.scrollY > 10)
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
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-strong border-b border-line/60 shadow-lg shadow-black/5 backdrop-blur-xl py-0.5'
            : 'border-b border-transparent bg-transparent py-1'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-primary/80 to-accent text-white shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
              <Sparkles size={17} className="transition-transform duration-300 group-hover:rotate-12" />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-fg">
                UI<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Studio</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted -mt-1">React Engine</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 rounded-full border border-line/40 bg-surface/30 p-1 backdrop-blur-md lg:flex shadow-inner">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn('relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors', isActive ? 'text-fg' : 'text-muted hover:text-fg')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/15 border border-primary/25 shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {l.label}
                      {l.badge && (
                        <span className="flex h-4 items-center rounded-full bg-gradient-to-r from-primary to-accent px-1.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                          AI
                        </span>
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-line/60 bg-surface/50 px-3 py-2 text-xs font-medium text-muted backdrop-blur-md transition-all hover:border-primary/50 hover:bg-surface/80 hover:text-fg shadow-sm"
              aria-label="Open command palette"
            >
              <Search size={14} className="text-primary" />
              <span className="hidden xl:inline">Search studio...</span>
              <kbd className="hidden items-center gap-0.5 rounded-md border border-line/60 bg-surface/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted sm:inline-flex">
                {isMac ? <Command size={10} /> : 'Ctrl'} K
              </kbd>
            </button>

            <ThemeSwitcher />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-xl border border-line/60 bg-surface/50 p-2 text-fg backdrop-blur-md transition hover:bg-surface/80 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-line/60 bg-surface/90 backdrop-blur-xl lg:hidden"
            >
              <div className="grid gap-1 p-3">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium transition-all',
                        isActive ? 'bg-primary/15 text-primary font-semibold' : 'text-muted hover:bg-line/30 hover:text-fg'
                      )
                    }
                  >
                    <span>{l.label}</span>
                    {l.badge && (
                      <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[9px] font-bold text-white">
                        AI
                      </span>
                    )}
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