import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Components from './pages/Components'
import Effects from './pages/Effects'
import Colors from './pages/Colors'
import Templates from './pages/Templates'
import Playground from './pages/Playground'
import AIStudio from './pages/AIStudio'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-6 text-center">
      <div>
        <p className="text-gradient text-7xl font-extrabold">404</p>
        <p className="mt-3 text-muted">This page drifted off into space.</p>
        <Link to="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/components" element={<Components />} />
          <Route path="/effects" element={<Effects />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/ai-studio" element={<AIStudio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen">
          <Navbar />
          <AnimatedRoutes />
          <footer className="mt-24 border-t border-line py-8 text-center text-sm text-muted">
            Built with React, Tailwind, Framer Motion and Three.js · React UI Studio
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
