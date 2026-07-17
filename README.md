# falconType

A free, open-source online typing speed test built with React, TypeScript, and Vite.

## Features

- **Multiple test modes** — Time, Words, Quote, Numbers, Custom
- **Real-time stats** — WPM, accuracy, raw WPM, consistency, errors
- **Live WPM chart** — tracks progress across tests
- **Activity heatmap** — 28-day typing activity overview
- **Achievements** — unlockable milestones for speed, accuracy, and streaks
- **Customizable settings** — theme, font, font size, accent color, punctuation, numbers, blind mode, and more
- **Virtual keyboard** — visual key highlighting for next key and press feedback
- **Sound effects** — optional keypress and error sounds via Web Audio API
- **Dark/Light theme** — with full accent color customization
- **Keyboard shortcuts** — Ctrl+Enter (next test), Shift+Enter (retry), Escape (stop/reset), Ctrl+, (settings)
- **SEO optimized** — meta tags, Open Graph, JSON-LD structured data
- **Responsive design** — works on desktop and mobile
- **Accessibility** — ARIA labels, skip link, keyboard navigation

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| UI | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Routing | React Router DOM 7 |
| Charts | Recharts |
| Icons | Lucide React |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── typing/        # TestPage, TypingArea, LiveStats, VirtualKeyboard, TestModes
│   ├── result/        # ResultScreen with WPM chart
│   ├── dashboard/     # Stats, progress chart, heatmap, achievements
│   ├── settings/      # Settings panel and page
│   ├── layout/        # Header, Footer, Breadcrumbs
│   ├── seo/           # Meta tags and JSON-LD
│   └── ui/            # SkipLink, ShortcutsHelp
├── stores/            # Zustand stores (typing, settings, history)
├── lib/               # Utils, storage, sound, word generator, SEO config
├── data/              # Word lists, programming syntax, quotes
├── styles/            # Global CSS with theme variables
└── types/             # TypeScript interfaces
```

## Browser Support

Requires a modern browser with ES module support. Best体验 on Chrome, Firefox, Edge, or Safari with a physical keyboard.

## License

MIT
