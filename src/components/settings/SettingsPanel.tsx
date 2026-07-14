import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import type { CaretStyle, CaretAnimation, Theme, FontFamily } from '@/types'
import { X } from 'lucide-react'

const THEMES: { key: Theme; label: string }[] = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
  { key: 'olivia', label: 'Olivia' },
  { key: 'mirage', label: 'Mirage' },
  { key: 'dracula', label: 'Dracula' },
  { key: 'monokai', label: 'Monokai' },
]

const FONTS: { key: FontFamily; label: string }[] = [
  { key: 'mono', label: 'Mono' },
  { key: 'sans', label: 'Sans' },
  { key: 'serif', label: 'Serif' },
  { key: 'jetbrains', label: 'JetBrains' },
  { key: 'fira', label: 'Fira Code' },
  { key: 'source', label: 'Source Code' },
]

const CARET_STYLES: { key: CaretStyle; label: string }[] = [
  { key: 'line', label: 'Line' },
  { key: 'block', label: 'Block' },
  { key: 'underline', label: 'Underline' },
]

const CARET_ANIMATIONS: { key: CaretAnimation; label: string }[] = [
  { key: 'smooth', label: 'Smooth' },
  { key: 'solid', label: 'Solid' },
  { key: 'pulse', label: 'Pulse' },
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

export function SettingsPanel() {
  const { settings, isOpen, setOpen, updateTyping, updateAppearance, updateSound } = useSettingsStore()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className={cn(
        'fixed right-0 top-0 bottom-0 z-50 w-[380px] max-w-[90vw]',
        'bg-[var(--bg)] border-l border-[var(--border)] shadow-2xl',
        'overflow-y-auto p-6',
        'animate-slideIn'
      )}>
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
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.appearance.accentColor}
                  onChange={e => updateAppearance({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]"
                />
                <span className="text-xs font-mono text-[var(--text-secondary)]">{settings.appearance.accentColor}</span>
              </div>
            </OptionGroup>

            <OptionGroup label="Caret Style">
              {CARET_STYLES.map(cs => (
                <ToggleButton key={cs.key} active={settings.appearance.caretStyle === cs.key} onClick={() => updateAppearance({ caretStyle: cs.key })}>
                  {cs.label}
                </ToggleButton>
              ))}
            </OptionGroup>

            <OptionGroup label="Caret Animation">
              {CARET_ANIMATIONS.map(ca => (
                <ToggleButton key={ca.key} active={settings.appearance.caretAnimation === ca.key} onClick={() => updateAppearance({ caretAnimation: ca.key })}>
                  {ca.label}
                </ToggleButton>
              ))}
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

            <OptionGroup label="Confidence Mode">
              <ToggleButton active={settings.typing.confidenceMode} onClick={() => updateTyping({ confidenceMode: !settings.typing.confidenceMode })}>
                {settings.typing.confidenceMode ? 'On' : 'Off'}
              </ToggleButton>
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

            <OptionGroup label="Always Center Caret">
              <ToggleButton active={settings.typing.alwaysCenterCaret} onClick={() => updateTyping({ alwaysCenterCaret: !settings.typing.alwaysCenterCaret })}>
                {settings.typing.alwaysCenterCaret ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Live WPM">
              <ToggleButton active={settings.typing.liveWpm} onClick={() => updateTyping({ liveWpm: !settings.typing.liveWpm })}>
                {settings.typing.liveWpm ? 'On' : 'Off'}
              </ToggleButton>
            </OptionGroup>

            <OptionGroup label="Quick Restart">
              <ToggleButton active={settings.typing.quickRestart} onClick={() => updateTyping({ quickRestart: !settings.typing.quickRestart })}>
                {settings.typing.quickRestart ? 'On' : 'Off'}
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
        </div>
      </div>
    </>
  )
}
