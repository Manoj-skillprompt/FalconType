export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={`
        sr-only focus:not-sr-only
        fixed top-2 left-2 z-[100]
        px-4 py-2 rounded-lg
        bg-[var(--accent)] text-[var(--bg)]
        font-medium text-sm
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
        transition-all
      `}
    >
      Skip to main content
    </a>
  )
}
