import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function applyTheme(theme) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const isDark = theme === 'dark' || (theme === 'system' && media.matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system')

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  return { theme, setTheme }
}
