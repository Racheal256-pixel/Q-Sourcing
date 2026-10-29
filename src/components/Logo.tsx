export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="KaziLink"
    >
      <rect width="64" height="64" rx="16" fill="#0F2740" />
      <path
        d="M21 15v34M21 33l17-16M21 33l17 16"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <g fill="#F4A261">
        <circle cx="21" cy="15" r="4" />
        <circle cx="21" cy="49" r="4" />
        <circle cx="38" cy="17" r="4" />
        <circle cx="38" cy="49" r="4" />
      </g>
    </svg>
  );
}
