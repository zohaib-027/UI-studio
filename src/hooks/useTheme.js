import { createContext, createElement, useContext, useEffect, useState } from 'react'
import { applyTheme, themesData } from '../data/themesData'

const STORAGE_KEY = 'uistudio-theme-rose'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const defaultId = themesData[0]?.id || 'rose-quartz'

  const [themeId, setThemeId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && themesData.some((t) => t.id === saved)) return saved
    } catch {
      // ignore storage errors
    }
    return defaultId
  })

  const theme = themesData.find((t) => t.id === themeId) || themesData[0]

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme.id)
    } catch {
      // ignore storage errors
    }
  }, [theme])

  return createElement(
    ThemeContext.Provider,
    { value: { themes: themesData, themeId, setThemeId, theme } },
    children
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }
  return ctx
}