// Helper SVG data URIs for realistic civic sanitation scenes

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_IMAGES = {
  overflowingDumpster: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <linearGradient id="brick" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#B45309"/>
          <stop offset="100%" stop-color="#92400E"/>
        </linearGradient>
        <linearGradient id="bin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4B5563"/>
          <stop offset="100%" stop-color="#1F2937"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sky)"/>
      <rect x="0" y="320" width="800" height="180" fill="#71717A"/>
      <line x1="0" y1="320" x2="800" y2="320" stroke="#52525B" stroke-width="6"/>
      <rect x="60" y="100" width="280" height="220" fill="url(#brick)"/>
      <!-- Dumpster -->
      <path d="M 280 200 L 580 200 L 540 400 L 260 400 Z" fill="url(#bin)"/>
      <rect x="250" y="190" width="350" height="18" rx="4" fill="#111827"/>
      <text x="340" y="310" fill="#9CA3AF" font-family="sans-serif" font-size="18" font-weight="bold">DISTRICT 4 SANITATION</text>
      <!-- Overflowing trash bags -->
      <ellipse cx="360" cy="180" rx="45" ry="35" fill="#1C1917"/>
      <ellipse cx="440" cy="165" rx="55" ry="40" fill="#292524"/>
      <ellipse cx="500" cy="185" rx="40" ry="30" fill="#09090B"/>
      <!-- Scattered roadside rubbish -->
      <polygon points="210,410 250,380 260,420" fill="#D97706"/>
      <rect x="550" y="390" width="60" height="35" rx="3" fill="#CA8A04" transform="rotate(15 550 390)"/>
      <ellipse cx="630" cy="420" rx="35" ry="18" fill="#18181B"/>
      <ellipse cx="200" cy="430" rx="28" ry="14" fill="#3B82F6" opacity="0.8"/>
      <ellipse cx="240" cy="445" rx="22" ry="10" fill="#EF4444" opacity="0.8"/>
      <!-- Warning tag -->
      <rect x="30" y="30" width="180" height="36" rx="6" fill="#FEF2F2" stroke="#EF4444"/>
      <text x="45" y="54" fill="#991B1B" font-family="sans-serif" font-size="13" font-weight="600">PHOTO: BEFORE CLEANUP</text>
    </svg>
  `),

  roadsidePiles: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="pave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#94A3B8"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="#E2E8F0"/>
      <rect x="0" y="240" width="800" height="260" fill="url(#pave)"/>
      <rect x="0" y="220" width="800" height="25" fill="#475569"/>
      <!-- Curb -->
      <line x1="0" y1="245" x2="800" y2="245" stroke="#334155" stroke-width="4"/>
      <!-- Tree and sidewalk -->
      <rect x="120" y="60" width="24" height="180" fill="#78350F"/>
      <circle cx="132" cy="70" r="70" fill="#4D7C0F"/>
      <!-- Large pile of discarded plastics & cartons -->
      <polygon points="340,380 480,240 620,390" fill="#3F3F46"/>
      <rect x="380" y="290" width="90" height="70" fill="#B45309" transform="rotate(-12 380 290)"/>
      <rect x="460" y="280" width="110" height="65" fill="#D97706" transform="rotate(8 460 280)"/>
      <circle cx="370" cy="360" r="35" fill="#1E293B"/>
      <circle cx="530" cy="370" r="42" fill="#0F172A"/>
      <circle cx="450" cy="380" r="38" fill="#1C1917"/>
      <ellipse cx="300" cy="390" rx="30" ry="12" fill="#EF4444" opacity="0.8"/>
      <rect x="30" y="30" width="180" height="36" rx="6" fill="#FEF2F2" stroke="#EF4444"/>
      <text x="45" y="54" fill="#991B1B" font-family="sans-serif" font-size="13" font-weight="600">PHOTO: BEFORE CLEANUP</text>
    </svg>
  `),

  constructionDebris: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <rect width="800" height="500" fill="#E7E5E4"/>
      <rect x="0" y="280" width="800" height="220" fill="#A8A29E"/>
      <!-- Concrete rubble and broken bricks -->
      <polygon points="180,450 320,310 460,450" fill="#78716C"/>
      <polygon points="250,420 380,290 520,430" fill="#57534E"/>
      <rect x="300" y="360" width="80" height="40" fill="#DC2626" transform="rotate(-15 300 360)"/>
      <rect x="360" y="380" width="70" height="35" fill="#EA580C" transform="rotate(25 360 380)"/>
      <line x1="220" y1="420" x2="480" y2="350" stroke="#71717A" stroke-width="8"/>
      <line x1="320" y1="460" x2="420" y2="300" stroke="#52525B" stroke-width="6"/>
      <rect x="30" y="30" width="180" height="36" rx="6" fill="#FEF2F2" stroke="#EF4444"/>
      <text x="45" y="54" fill="#991B1B" font-family="sans-serif" font-size="13" font-weight="600">PHOTO: BEFORE CLEANUP</text>
    </svg>
  `),

  resolvedCleanStreet: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="cleansky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#BAE6FD"/>
          <stop offset="100%" stop-color="#E0F2FE"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#cleansky)"/>
      <rect x="0" y="280" width="800" height="220" fill="#64748B"/>
      <!-- Polished sidewalk -->
      <rect x="0" y="250" width="800" height="45" fill="#CBD5E1"/>
      <line x1="0" y1="295" x2="800" y2="295" stroke="#94A3B8" stroke-width="4"/>
      <!-- Clean green bin neatly aligned -->
      <rect x="340" y="200" width="120" height="130" rx="8" fill="#687447"/>
      <rect x="330" y="190" width="140" height="15" rx="4" fill="#424D2B"/>
      <!-- Fresh planter and tree -->
      <circle cx="180" cy="180" r="50" fill="#4D7C0F"/>
      <rect x="172" y="230" width="16" height="50" fill="#78350F"/>
      <circle cx="620" cy="180" r="50" fill="#4D7C0F"/>
      <rect x="612" y="230" width="16" height="50" fill="#78350F"/>
      <!-- Verified stamp -->
      <rect x="30" y="30" width="190" height="36" rx="6" fill="#F0FDF4" stroke="#22C55E"/>
      <text x="45" y="54" fill="#15803D" font-family="sans-serif" font-size="13" font-weight="600">VERIFIED: AFTER CLEANUP</text>
    </svg>
  `),

  resolvedCleanPavement: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <rect width="800" height="500" fill="#F1F5F9"/>
      <rect x="0" y="220" width="800" height="280" fill="#94A3B8"/>
      <!-- Neatly swept clean pavement -->
      <line x1="150" y1="220" x2="150" y2="500" stroke="#CBD5E1" stroke-dasharray="10 10"/>
      <line x1="400" y1="220" x2="400" y2="500" stroke="#CBD5E1" stroke-dasharray="10 10"/>
      <line x1="650" y1="220" x2="650" y2="500" stroke="#CBD5E1" stroke-dasharray="10 10"/>
      <rect x="30" y="30" width="190" height="36" rx="6" fill="#F0FDF4" stroke="#22C55E"/>
      <text x="45" y="54" fill="#15803D" font-family="sans-serif" font-size="13" font-weight="600">VERIFIED: AFTER CLEANUP</text>
    </svg>
  `),
};
