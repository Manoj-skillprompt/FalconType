import { WORDS, QUOTES, programmingSyntax } from '@/data/words'
import type { TestMode, Language } from '@/types'

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pick<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array)
  if (count >= shuffled.length) {
    const result = [...shuffled]
    while (result.length < count) {
      result.push(...shuffle(array))
    }
    return result.slice(0, count)
  }
  return shuffled.slice(0, count)
}

function generateWords(count: number, language: Language, punctuation: boolean, numbers: boolean): string[] {
  const words = WORDS.medium
  let selected = pick(words, count)

  if (punctuation) {
    selected = selected.map(word => {
      const punct = WORDS.punctuation
      const r = Math.random()
      if (r < 0.2) return word + punct[Math.floor(Math.random() * punct.length)]
      if (r < 0.25) return punct[Math.floor(Math.random() * 4)] + word
      return word
    })
  }

  if (numbers) {
    selected = selected.map(word => {
      if (Math.random() < 0.15) {
        const numCount = Math.floor(Math.random() * 3) + 1
        let numStr = ''
        for (let i = 0; i < numCount; i++) {
          numStr += Math.floor(Math.random() * 10)
        }
        return word + numStr
      }
      return word
    })
  }

  return selected
}

function generateProgrammingText(language: string, count: number): string[] {
  const words = programmingSyntax[language] ?? programmingSyntax.javascript
  return pick(words, count)
}

export function generateText(
  mode: TestMode,
  count: number,
  language: Language = 'english',
  punctuation = false,
  numbers = false,
  customText = ''
): string {
  switch (mode) {
    case 'words':
    case 'time':
      return generateWords(count, language, punctuation, numbers).join(' ')
    case 'quote': {
      const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
      return quote.text
    }
    case 'numbers': {
      const digits = Array.from({ length: count * 5 }, () => Math.floor(Math.random() * 10))
      return digits.join(' ')
    }
    case 'custom':
      return customText || 'Type your custom text here...'
    default:
      return generateWords(count, language, punctuation, numbers).join(' ')
  }
}

export function generatePracticeText(type: string, count: number = 30): string {
  switch (type) {
    case 'weak':
      return generateWords(count, 'english', false, false).join(' ')
    case 'difficult':
      return pick(WORDS.medium.filter(w => w.length > 6), count).join(' ')
    case 'common':
      return pick(WORDS.easy, count).join(' ')
    case 'javascript':
    case 'typescript':
    case 'python':
    case 'html':
    case 'css':
    case 'sql':
    case 'json':
    case 'markdown':
      return generateProgrammingText(type, count).join(' ')
    default:
      return generateWords(count, 'english', false, false).join(' ')
  }
}

export function getQuoteAuthor(text: string): string | null {
  const quote = QUOTES.find(q => q.text === text)
  return quote?.author ?? null
}
