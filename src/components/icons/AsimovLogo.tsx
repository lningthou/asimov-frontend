// Logo concepts for Asimov

// Option 1: Abstract "A" with data/neural network nodes
export function LogoNodes({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Connecting lines */}
      <path d="M12 7V12M12 12L6 18M12 12L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Three connected nodes forming abstract A shape */}
      <circle cx="12" cy="4" r="3.5" fill="#ABB2F1" />
      <circle cx="5" cy="20" r="3.5" fill="#ABB2F1" />
      <circle cx="19" cy="20" r="3.5" fill="#ABB2F1" />
      {/* Center node */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

// Option 2: Stylized eye/vision - representing egocentric data
export function LogoEye({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 5C7 5 3 9 2 12C3 15 7 19 12 19C17 19 21 15 22 12C21 9 17 5 12 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

// Option 3: Abstract robot/hand - representing manipulation data
export function LogoHand({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Palm */}
      <rect x="7" y="10" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Fingers */}
      <path d="M9 10V6C9 5 9.5 4 10.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 10V6C15 5 14.5 4 13.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Thumb */}
      <path d="M7 14H4C3 14 2 14.5 2 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Option 4: Geometric A with circuit traces
export function LogoCircuit({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer A shape */}
      <path
        d="M12 3L3 21H7L9 17H15L17 21H21L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner horizontal */}
      <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Circuit dot */}
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Option 5: Minimal cube/3D data - representing spatial data
export function LogoCube({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Isometric cube */}
      <path
        d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12L3 7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12L21 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Option 6: Orbital/atom - representing foundational models
export function LogoOrbital({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center */}
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      {/* Orbits */}
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(-60 12 12)" />
    </svg>
  );
}

export default LogoNodes;
