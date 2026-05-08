import { FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../hooks/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-card inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
      aria-label="Toggle theme"
    >
      {isDark ? <FaSun /> : <FaMoon />}
      {isDark ? 'Light' : 'Dark'} Mode
    </button>
  )
}
