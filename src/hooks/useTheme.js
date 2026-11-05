import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { themes, applyTheme } from '../data/themesData'

const STORAGE_KEY = 'react-ui-studio-theme'
const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && themes.some((t) => t.id === stored)) return stored
  } catch (e) {
    /* storage unavailable */
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(readStoredTheme)

  useEffect(() => {
    applyTheme(themeId)
    try {
      localStorage.setItem(STORAGE_KEY, themeId)
    } catch (e) {
      /* storage unavailable */
    }
  }, [themeId])

  const setThemeId = useCallback((id) => setThemeIdState(id), [])

  const value = useMemo(
    () => ({
      themeId,
      setThemeId,
      themes,
      theme: themes.find((t) => t.id === themeId) || themes[0],
    }),
    [themeId, setThemeId],
  )

  return createElement(ThemeContext.Provider, { value }, children)
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

export default useTheme
