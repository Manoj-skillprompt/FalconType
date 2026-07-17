import { SEO } from '@/components/seo/SEO'
import { JsonLd } from '@/components/seo/JsonLd'
import { websiteJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/structuredData'
import { useTypingStore } from '@/stores/typingStore'
import { TestModes } from '@/components/typing/TestModes'
import { TypingArea } from '@/components/typing/TypingArea'
import { LiveStats } from '@/components/typing/LiveStats'
import { ResultScreen } from '@/components/result/ResultScreen'
import { VirtualKeyboard } from '@/components/typing/VirtualKeyboard'
import { Keyboard } from 'lucide-react'

export function TestPage() {
  const isFinished = useTypingStore((s) => s.isFinished)

  return (
    <>
      <SEO />
      <JsonLd data={[websiteJsonLd(), faqJsonLd(), breadcrumbJsonLd([{ name: 'Home', url: 'https://falcontype.com/' }])]}/>

      <article className="w-full flex flex-col items-center justify-start gap-2 mt-12">
        <h1 className="sr-only">falconType — Free Online Typing Speed Test</h1>

        <TestModes />
        {!isFinished && <TypingArea />}
        {!isFinished && <LiveStats />}
        {!isFinished && <VirtualKeyboard />}
        {!isFinished && (
          <button
            onClick={() => window.dispatchEvent(new Event('open-shortcuts'))}
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mt-4"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard size={14} />
            <span>Shortcuts</span>
            <kbd className="px-1 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)]">Ctrl+/</kbd>
          </button>
        )}
        {isFinished && <ResultScreen />}
      </article>
    </>
  )
}
