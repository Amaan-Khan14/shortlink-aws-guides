/** The ShortLink mark: two linked chain links on a rounded square. Same drawing as app/icon.svg. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="7.5" fill="var(--accent)" />
      <g transform="rotate(-45 16 16)" fill="none" stroke="var(--accent-fg)" strokeWidth="2.6" strokeLinecap="round">
        <rect x="4.5" y="11" width="14" height="10" rx="5" />
        <rect x="13.5" y="11" width="14" height="10" rx="5" />
      </g>
    </svg>
  );
}
