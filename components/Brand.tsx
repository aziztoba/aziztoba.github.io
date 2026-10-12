export function Monogram() {
  return (
    <svg viewBox="0 0 50 44" aria-hidden="true" fill="currentColor">
      <path d="M2 38 16 5h9l14 33H28l-3-8H14l-3 8ZM17 22h6l-3-9Z" />
      <path d="M27 5h22v8h-7v25h-8V13h-7Z" />
    </svg>
  );
}
export function Brand() {
  return (
    <header className="brand-row">
      <a className="brand" href="/" aria-label="Abdulaziz Toba home">
        <Monogram />
        <span>aziztoba.github.io</span>
      </a>
      <a
        className="github-link"
        href="https://github.com/aziztoba"
        target="_blank"
        rel="noreferrer"
      >
        github
      </a>
    </header>
  );
}
