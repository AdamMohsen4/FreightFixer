import type { CSSProperties } from "react";

interface LogoProps {
  className?: string;
  style?: CSSProperties;
  size?: number;
  showText?: boolean;
  iconOnly?: boolean;
}

export function FreightLogo({
  className,
  style,
  size = 40,
  showText = true,
  iconOnly = false,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`} style={style}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Base circle */}
        <circle cx="50" cy="50" r="48" fill="#0F52BA" />
        <circle cx="50" cy="50" r="44" fill="#1A65D6" />

        {/* Globe grid lines */}
        <path
          d="M10 50H90"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <path
          d="M50 10V90"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="44"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="30"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Ship/truck container */}
        <rect x="30" y="38" width="40" height="24" fill="#F0F4F8" rx="2" />
        <rect
          x="30"
          y="38"
          width="40"
          height="24"
          stroke="#0A3D91"
          strokeWidth="1.5"
          rx="2"
        />
        <line
          x1="37"
          y1="38"
          x2="37"
          y2="62"
          stroke="#0A3D91"
          strokeWidth="1.5"
        />
        <line
          x1="44"
          y1="38"
          x2="44"
          y2="62"
          stroke="#0A3D91"
          strokeWidth="1.5"
        />
        <line
          x1="51"
          y1="38"
          x2="51"
          y2="62"
          stroke="#0A3D91"
          strokeWidth="1.5"
        />
        <line
          x1="58"
          y1="38"
          x2="58"
          y2="62"
          stroke="#0A3D91"
          strokeWidth="1.5"
        />
        <line
          x1="65"
          y1="38"
          x2="65"
          y2="62"
          stroke="#0A3D91"
          strokeWidth="1.5"
        />

        {/* Motion lines */}
        <path
          d="M20 50H10"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M25 42H15"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M25 58H15"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {showText && !iconOnly && (
        <div className="flex flex-col">
          <span className="text-base font-bold leading-tight tracking-tight">
            FreightFixer
          </span>
        </div>
      )}
    </div>
  );
}
