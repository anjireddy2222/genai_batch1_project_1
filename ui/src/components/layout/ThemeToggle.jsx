import { IconMoon, IconSun, IconDeviceDesktop } from '@tabler/icons-react'
import { useTheme } from '../../hooks/useTheme.js'

const CYCLE = ['light', 'dark', 'system']
const ICONS = { light: IconSun, dark: IconMoon, system: IconDeviceDesktop }
const LABELS = { light: 'Light theme', dark: 'Dark theme', system: 'System theme' }

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = ICONS[theme]

  const handleClick = () => {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length]
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${LABELS[theme]}. Click to change.`}
      title={LABELS[theme]}
      className="grid h-9 w-9 place-items-center rounded-control border border-border text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
    >
      <Icon size={18} stroke={1.75} />
    </button>
  )
}
