import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], description: 'Next test' },
  { keys: ['Shift', 'Enter'], description: 'Retry test' },
  { keys: ['Esc'], description: 'Stop test / Go home' },
  { keys: ['Ctrl', ','], description: 'Toggle settings' },
  { keys: ['Ctrl', '/'], description: 'Toggle shortcuts help' },
  { keys: ['Vol+', 'Vol-', 'Vol Mute'], description: 'Volume controls' },
]

export function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-[400px] max-w-[90vw] p-6 rounded-xl',
          'bg-[var(--bg)] border border-[var(--border)] shadow-2xl'
        )}
        role="dialog"
        aria-label="Keyboard shortcuts"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-[var(--bg-card)]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.keys.join('+')} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-[var(--text-primary)]">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd key={key} className={cn(
                    'px-1.5 py-0.5 text-xs font-mono rounded',
                    'bg-[var(--bg-card)] border border-[var(--border)]',
                    'text-[var(--text-secondary)]'
                  )}>
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
