import { useState, useRef, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import type { Theme, FontFamily } from '@/types'
import { X } from 'lucide-react'

const THEMES: { key: Theme; label: string }[] = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
]

const FONTS: { key: FontFamily; label: string }[] = [
  { key: 'mono', label: 'JetBrains Mono' },
  { key: 'fira', label: 'Fira Code' },
  { key: 'grotesk', label: 'Space Grotesk' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  )
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  )
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 text-xs rounded-md transition-all',
        active
          ? 'bg-[var(--accent)] text-[var(--bg)] font-medium'
          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      )}
    >
      {children}
    </button>
  )
}

const PRESET_COLORS = [
  '#e2b714', '#f38ba8', '#a6e3a1', '#89b4fa', '#cba6f7',
  '#fab387', '#94e2d5', '#f9e2af', '#74c7ec', '#eba0ac',
]

function AccentColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]"
        style={{ backgroundColor: value }}
      />
      {open && (
        <div className={cn(
          'absolute right-full top-1/2 -translate-y-1/2 mr-3 z-50',
          'p-3 rounded-lg border border-[var(--border)]',
          'bg-[var(--bg)] shadow-xl'
        )}>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => { onChange(c); setOpen(false) }}
                className={cn(
                  'w-7 h-7 rounded-md border transition-transform hover:scale-110',
                  value === c ? 'border-[var(--text-primary)] ring-1 ring-[var(--text-primary)]' : 'border-[var(--border)]'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]">
            <input
              type="color"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-[var(--border)]"
            />
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">{value}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsPanel() {
  const settings = useSettingsStore(s => s.settings)
  const isOpen = useSettingsStore(s => s.isOpen)
  const setOpen = useSettingsStore(s => s.setOpen)
  const updateTyping = useSettingsStore(s => s.updateTyping)
  const updateAppearance = useSettingsStore(s => s.updateAppearance)
  const updateSound = useSettingsStore(s => s.updateSound)
  const resetSettings = useSettingsStore(s => s.resetSettings)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <aside
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-[380px] max-w-[90vw]',
          'bg-[var(--bg)] border-l border-[var(--border)] shadow-2xl',
          'overflow-y-auto p-6',
          'animate-slideIn'
        )}
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-[var(--bg-card)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8">
          <Section title="Appearance">
            <OptionGroup label="Theme">
              {THEMES.map(t => (
                <ToggleButton key={t.key} active={settings.appearance.theme === t.key} onClick={() => updateAppearance({ theme: t.key })}>
                  {t.label}
                </ToggleButton>
              ))}
            </OptionGroup>

            <OptionGroup label="Font">
              {FONTS.map(f => (
                <ToggleButton key={f.key} active={settings.appearance.fontFamily === f.key} onClick={() => updateAppearance({ fontFamily: f.key })}>
                  {f.label}
                </ToggleButton>
              ))}
            </OptionGroup>

            <OptionGroup label="Font Size">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={14}
                  max={32}
                  step={1}
                  value={settings.appearance.fontSize}
                  onChange={e => updateAppearance({ fontSize: Number(e.target.value) })}
                  className="w-24 accent-[var(--accent)]"
                />
                <span className="text-xs font-mono w-8 text-right">{settings.appearance.fontSize}</span>
              </div>
            </OptionGroup>

            <OptionGroup label="Accent Color">
              <AccentColorPicker
                value={settings.appearance.accentColor}
                onChange={(color) => updateAppearance({ accentColor: color })}
              />
            </OptionGroup>

          </Section>

          <Section title="Typing">
            <OptionGroup label="Punctuation">
              <ToggleButton active={settings.typing.punctuation} onClick={() => updateTyping({ punctuation: !settings.typing.punctuation })}>
                {settings.typing.punctuation ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Numbers">
              <ToggleButton active={settings.typing.numbers} onClick={() => updateTyping({ numbers: !settings.typing.numbers })}>
                {settings.typing.numbers ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Stop on Error">
              <ToggleButton active={settings.typing.stopOnError} onClick={() => updateTyping({ stopOnError: !settings.typing.stopOnError })}>
                {settings.typing.stopOnError ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Backspace">
              {(['allow', 'deny'] as const).map(b => (
                <ToggleButton key={b} active={settings.typing.backspace === b} onClick={() => updateTyping({ backspace: b })}>
                  {b}
                </ToggleButton>
              ))}
            </OptionGroup>

            <OptionGroup label="Blind Mode">
              <ToggleButton active={settings.typing.blindMode} onClick={() => updateTyping({ blindMode: !settings.typing.blindMode })}>
                {settings.typing.blindMode ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Hide Typed Words">
              <ToggleButton active={settings.typing.hideTypedWords} onClick={() => updateTyping({ hideTypedWords: !settings.typing.hideTypedWords })}>
                {settings.typing.hideTypedWords ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Live WPM">
              <ToggleButton active={settings.typing.liveWpm} onClick={() => updateTyping({ liveWpm: !settings.typing.liveWpm })}>
                {settings.typing.liveWpm ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

          </Section>

          <Section title="Sound">
            <OptionGroup label="Keypress Sound">
              <ToggleButton active={settings.sound.keypress} onClick={() => updateSound({ keypress: !settings.sound.keypress })}>
                {settings.sound.keypress ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Error Sound">
              <ToggleButton active={settings.sound.error} onClick={() => updateSound({ error: !settings.sound.error })}>
                {settings.sound.error ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Volume">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.sound.volume}
                  onChange={e => updateSound({ volume: Number(e.target.value) })}
                  className="w-24 accent-[var(--accent)]"
                />
                <span className="text-xs font-mono w-8 text-right">{settings.sound.volume}</span>
              </div>
            </OptionGroup>
          </Section>

          <button
            onClick={resetSettings}
            className={cn(
              'w-full px-4 py-2 text-xs rounded-lg transition-colors',
              'border border-[var(--border)] text-[var(--text-secondary)]',
              'hover:bg-[var(--text-incorrect)]/10 hover:text-[var(--text-incorrect)] hover:border-[var(--text-incorrect)]/30'
            )}
          >
            Reset to Defaults
          </button>
        </div>
      </aside>
    </>
  )
}
