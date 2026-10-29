type CoverTheme = 'code' | 'social' | 'coffee' | 'design' | 'match';

const rules: Array<{ theme: CoverTheme; pattern: RegExp }> = [
  { theme: 'coffee', pattern: /barista|coffee|cafe|kitchen|waiter|food|chef/i },
  { theme: 'social', pattern: /social|marketing|content|instagram|media|brand|community/i },
  { theme: 'design', pattern: /design|figma|canvas|ui|ux|illustrat/i },
  {
    theme: 'code',
    pattern: /react|developer|engineer|code|frontend|back|software|data|typescript|javascript|api/i,
  },
];

export function coverTheme(title: string, skills: string[] = []): CoverTheme {
  const text = `${title} ${skills.join(' ')}`;
  for (const rule of rules) {
    if (rule.pattern.test(text)) return rule.theme;
  }
  return 'match';
}

function Scene({ theme }: { theme: CoverTheme }) {
  if (theme === 'code') {
    return (
      <>
        <circle cx="446" cy="14" r="78" fill="#DDE7F1" />
        <rect x="104" y="22" width="248" height="116" rx="14" fill="#FFFFFF" stroke="#DDE7F1" />
        <circle cx="128" cy="42" r="3.5" fill="#C3D3E2" />
        <circle cx="141" cy="42" r="3.5" fill="#C3D3E2" />
        <circle cx="154" cy="42" r="3.5" fill="#F4A261" />
        <rect x="128" y="60" width="110" height="8" rx="4" fill="#C3D3E2" />
        <rect x="128" y="78" width="172" height="8" rx="4" fill="#DDE7F1" />
        <rect x="145" y="96" width="138" height="8" rx="4" fill="#DDE7F1" />
        <rect x="145" y="114" width="78" height="8" rx="4" fill="#F4A261" opacity="0.9" />
        <circle cx="392" cy="112" r="40" fill="none" stroke="#F4A261" strokeWidth="3" opacity="0.4" />
        <circle cx="392" cy="112" r="27" fill="#0F2740" />
        <path
          d="M380 112l8 8 15-16"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    );
  }

  if (theme === 'social') {
    return (
      <>
        <circle cx="52" cy="152" r="72" fill="#DDE7F1" />
        <g transform="rotate(-6 240 80)">
          <rect x="192" y="10" width="96" height="140" rx="20" fill="#FFFFFF" stroke="#DDE7F1" />
          <rect x="208" y="28" width="64" height="7" rx="3.5" fill="#DDE7F1" />
          <rect x="208" y="48" width="54" height="22" rx="10" fill="#0F2740" opacity="0.12" />
          <rect x="224" y="78" width="56" height="22" rx="10" fill="#F4A261" opacity="0.9" />
          <rect x="208" y="108" width="44" height="18" rx="9" fill="#0F2740" opacity="0.12" />
          <circle cx="240" cy="136" r="5" fill="#C3D3E2" />
        </g>
        <circle cx="372" cy="42" r="26" fill="#0F2740" />
        <path
          d="M372 54c-9-6-14-10-14-16a7 7 0 0 1 14-3 7 7 0 0 1 14 3c0 6-5 10-14 16z"
          fill="#F4A261"
        />
        <circle cx="112" cy="42" r="5" fill="#F4A261" />
        <circle cx="94" cy="66" r="3.5" fill="#C3D3E2" />
      </>
    );
  }

  if (theme === 'coffee') {
    return (
      <>
        <circle cx="424" cy="142" r="80" fill="#DDE7F1" />
        <ellipse cx="240" cy="132" rx="94" ry="12" fill="#DDE7F1" />
        <path
          d="M190 48h100l-9 62a20 20 0 0 1-20 18h-42a20 20 0 0 1-20-18z"
          fill="#FFFFFF"
          stroke="#DDE7F1"
          strokeWidth="2"
        />
        <path d="M290 60h10a20 20 0 0 1 0 40h-14" fill="none" stroke="#DDE7F1" strokeWidth="7" />
        <ellipse cx="240" cy="52" rx="44" ry="7" fill="#0F2740" opacity="0.08" />
        <path
          d="M216 40c-6-7 6-11 0-18M240 40c-6-7 6-11 0-18M264 40c-6-7 6-11 0-18"
          fill="none"
          stroke="#C3D3E2"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <g fill="#F4A261">
          <ellipse cx="108" cy="118" rx="12" ry="8" transform="rotate(-24 108 118)" />
          <ellipse cx="84" cy="94" rx="12" ry="8" transform="rotate(18 84 94)" />
        </g>
        <path d="M101 120l14-4M77 96l14-4" stroke="#0F2740" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </>
    );
  }

  if (theme === 'design') {
    return (
      <>
        <circle cx="74" cy="26" r="66" fill="#DDE7F1" />
        <rect x="128" y="16" width="224" height="128" rx="14" fill="#FFFFFF" stroke="#DDE7F1" />
        <path
          d="M158 108c32-58 74-58 100-26s40 16 48 0"
          fill="none"
          stroke="#0F2740"
          strokeWidth="3"
          opacity="0.45"
        />
        <path d="M158 108l40-30M306 82l24 4" stroke="#C3D3E2" strokeWidth="2" />
        <circle cx="158" cy="108" r="6" fill="#0F2740" />
        <circle cx="258" cy="82" r="6" fill="#F4A261" />
        <circle cx="198" cy="86" r="4" fill="#C3D3E2" />
        <circle cx="330" cy="86" r="4" fill="#C3D3E2" />
        <circle cx="160" cy="60" r="7" fill="#0F2740" />
        <circle cx="182" cy="60" r="7" fill="#F4A261" />
        <circle cx="204" cy="60" r="7" fill="#C3D3E2" />
      </>
    );
  }

  return (
    <>
      <circle cx="424" cy="16" r="76" fill="#DDE7F1" />
      <path d="M162 52h90M162 108h90M140 74v12M274 74v12" stroke="#C3D3E2" strokeWidth="3" />
      <rect x="118" y="30" width="44" height="44" rx="12" fill="#0F2740" />
      <path d="M132 53l7 7 13-14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="252" y="30" width="44" height="44" rx="12" fill="#FFFFFF" stroke="#DDE7F1" />
      <circle cx="274" cy="52" r="8" fill="#F4A261" />
      <rect x="118" y="86" width="44" height="44" rx="12" fill="#FFFFFF" stroke="#DDE7F1" />
      <circle cx="140" cy="108" r="8" fill="#0F2740" opacity="0.2" />
      <rect x="252" y="86" width="44" height="44" rx="12" fill="#F4A261" opacity="0.18" />
      <path d="M296 52h72M296 108h72" stroke="#C3D3E2" strokeWidth="3" />
      <circle cx="382" cy="52" r="4.5" fill="#F4A261" />
      <circle cx="382" cy="108" r="4.5" fill="#0F2740" opacity="0.25" />
    </>
  );
}

export function GigCover({
  title,
  skills = [],
  className,
}: {
  title: string;
  skills?: string[];
  className?: string;
}) {
  const theme = coverTheme(title, skills);
  return (
    <svg
      viewBox="0 0 480 160"
      className={className}
      role="img"
      aria-label={`Artwork for ${title}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="480" height="160" fill="#EAF1F7" />
      <Scene theme={theme} />
    </svg>
  );
}
