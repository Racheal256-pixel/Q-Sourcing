interface IllustrationProps {
  className?: string;
}

export function MatchHero({ className }: IllustrationProps) {
  return (
    <svg
      className={`hero-svg ${className ?? ''}`}
      viewBox="0 0 520 360"
      role="img"
      aria-label="A gig card and a candidate profile linked by a match score dial"
    >
      <rect x="6" y="22" width="508" height="314" rx="24" fill="#EAF1F7" />

      <circle cx="112" cy="66" r="3" fill="#F4A261" className="hero-dot" />
      <circle cx="430" cy="292" r="4" fill="#0F2740" opacity="0.18" className="hero-dot hero-dot-slow" />
      <circle cx="462" cy="74" r="2.5" fill="#F4A261" className="hero-dot hero-dot-late" />

      <path
        d="M222 180 H258"
        stroke="#B9CBDC"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
      <path
        d="M262 180 H298"
        stroke="#B9CBDC"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />

      <rect x="38" y="66" width="190" height="216" rx="16" fill="#0F2740" />
      <rect x="56" y="88" width="70" height="16" rx="8" fill="#F4A261" />
      <rect x="56" y="118" width="132" height="10" rx="5" fill="#FFFFFF" opacity="0.9" />
      <rect x="56" y="136" width="104" height="8" rx="4" fill="#FFFFFF" opacity="0.45" />
      <rect x="56" y="152" width="118" height="8" rx="4" fill="#FFFFFF" opacity="0.45" />
      <rect x="56" y="182" width="54" height="20" rx="10" fill="#FFFFFF" opacity="0.12" />
      <rect x="116" y="182" width="42" height="20" rx="10" fill="#FFFFFF" opacity="0.12" />
      <rect x="164" y="182" width="34" height="20" rx="10" fill="#F4A261" opacity="0.9" />
      <rect x="56" y="228" width="86" height="18" rx="9" fill="#FFFFFF" opacity="0.16" />

      <rect x="292" y="86" width="190" height="196" rx="16" fill="#FFFFFF" stroke="#D6E0EA" />
      <circle cx="332" cy="128" r="21" fill="#E3ECF5" />
      <circle cx="332" cy="122" r="7" fill="#0F2740" opacity="0.75" />
      <path d="M321 140a11 11 0 0 1 22 0" fill="#0F2740" opacity="0.75" />
      <rect x="364" y="114" width="92" height="10" rx="5" fill="#0F2740" opacity="0.8" />
      <rect x="364" y="132" width="64" height="8" rx="4" fill="#0F2740" opacity="0.28" />
      <rect x="310" y="168" width="60" height="20" rx="10" fill="#0F2740" opacity="0.08" />
      <rect x="378" y="168" width="48" height="20" rx="10" fill="#0F2740" opacity="0.08" />
      <rect x="310" y="198" width="44" height="20" rx="10" fill="#F4A261" opacity="0.9" />
      <rect x="362" y="198" width="64" height="20" rx="10" fill="#0F2740" opacity="0.08" />
      <rect x="310" y="240" width="120" height="10" rx="5" fill="#0F2740" opacity="0.14" />

      <circle cx="260" cy="180" r="36" fill="#FFFFFF" stroke="#D6E0EA" strokeWidth="2" />
      <circle cx="260" cy="180" r="26" fill="none" stroke="#EAF1F7" strokeWidth="7" />
      <circle
        cx="260"
        cy="180"
        r="26"
        fill="none"
        stroke="#F4A261"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="118 46"
        className="hero-ring"
      />
      <polyline
        points="252 180 258 186 269 174"
        fill="none"
        stroke="#0F2740"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

