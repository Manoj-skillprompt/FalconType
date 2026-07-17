import { SEO } from '@/components/seo/SEO'
import { JsonLd } from '@/components/seo/JsonLd'
import { websiteJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/structuredData'
import { useTypingStore } from '@/stores/typingStore'
import { TestModes } from '@/components/typing/TestModes'
import { TypingArea } from '@/components/typing/TypingArea'
import { LiveStats } from '@/components/typing/LiveStats'
import { ResultScreen } from '@/components/result/ResultScreen'
import { VirtualKeyboard } from '@/components/typing/VirtualKeyboard'

export function TestPage() {
  const isFinished = useTypingStore((s) => s.isFinished)

  return (
    <>
      <SEO />
      <JsonLd data={[websiteJsonLd(), faqJsonLd(), breadcrumbJsonLd([{ name: 'Home', url: 'https://falcontype.com/' }])]}/>

      <article className="w-full flex flex-col items-center justify-start gap-2 mt-12">
        <h1 className="sr-only">FalconType — Free Online Typing Speed Test</h1>

        <TestModes />
        {!isFinished && <TypingArea />}
        {!isFinished && <LiveStats />}
        {!isFinished && <VirtualKeyboard />}
        {isFinished && <ResultScreen />}
      </article>
    </>
  )
}
