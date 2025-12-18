import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply dark class to html element
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save to localStorage
    localStorage.setItem('darkMode', String(isDark))
  }, [isDark])

  const toggleDarkMode = () => setIsDark(!isDark)

  return { isDark, toggleDarkMode }
}
