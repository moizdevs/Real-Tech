import { useId } from "react";

export type InverterVariant = "ups" | "hybrid" | "sine";

type Props = {
  variant?: InverterVariant;
  /** Draw as a clean wireframe outline instead of a solid product. */
  outline?: boolean;
  /** Dull, worn look (used for the "old unit" state). */
  worn?: boolean;
  className?: string;
  title?: string;
};

const ACCENT: Record<InverterVariant, string> = {
  ups: "#ff6a13",
  hybrid: "#ffb020",
  sine: "#4aa8ff",
};

/** Self-contained SVG product illustration so the page never depends on external images. */
export default function InverterIllustration({
  variant = "ups",
  outline = false,
  worn = false,
  className = "",
  title,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const accent = worn ? "#7a6f63" : ACCENT[variant];
  const stroke = outline ? accent : "rgba(255,255,255,0.12)";

  return (
    <svg
      viewBox="0 0 240 320"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={worn ? "#3a3733" : "#2a2c31"} />
          <stop offset="0.5" stopColor={worn ? "#25231f" : "#17181c"} />
          <stop offset="1" stopColor={worn ? "#1a1916" : "#0d0e10"} />
        </linearGradient>
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1013" />
          <stop offset="1" stopColor="#07080a" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {!outline && !worn && <ellipse cx="120" cy="300" rx="90" ry="12" fill={`url(#glow-${uid})`} />}

      {/* chassis */}
      <rect
        x="30"
        y="14"
        width="180"
        height="278"
        rx="14"
        fill={outline ? "none" : `url(#body-${uid})`}
        stroke={outline ? accent : "rgba(255,255,255,0.14)"}
        strokeWidth={outline ? 1.6 : 1}
        strokeDasharray={outline ? "5 5" : undefined}
      />
      {/* side highlight */}
      {!outline && <path d="M34 28c0-8 6-12 12-12" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />}

      {/* top vents */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x={64 + i * 16}
          y="22"
          width="9"
          height="3"
          rx="1.5"
          fill={outline ? "none" : "rgba(0,0,0,0.7)"}
          stroke={outline ? accent : "none"}
        />
      ))}

      {/* front face */}
      <rect
        x="42"
        y="34"
        width="156"
        height="246"
        rx="9"
        fill={outline ? "none" : `url(#face-${uid})`}
        stroke={stroke}
      />

      {/* brand mark */}
      <rect x="86" y="46" width="68" height="3" rx="1.5" fill={outline ? "none" : "rgba(242,239,234,0.85)"} stroke={outline ? accent : "none"} />
      <rect x="108" y="53" width="24" height="2" rx="1" fill={accent} opacity={worn ? 0.4 : 1} />

      {/* display */}
      <rect x="58" y="70" width="124" height="62" rx="5" fill={outline ? "none" : "#04080b"} stroke={outline ? accent : "rgba(255,255,255,0.2)"} />
      {!outline && (
        <>
          <text
            x="68"
            y="115"
            fontFamily="ui-monospace, Menlo, monospace"
            fontWeight="700"
            fontSize="38"
            fill={worn ? "#5a4f45" : accent}
            opacity={worn ? 0.6 : 1}
          >
            {worn ? "Er" : variant === "hybrid" ? "PV" : "230"}
          </text>
          <rect x="134" y="88" width="38" height="18" rx="2" fill="none" stroke="rgba(255,255,255,0.5)" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={137 + i * 11} y="91" width="8" height="12" fill={worn ? "#443e38" : "#4aa8ff"} opacity={worn && i > 0 ? 0.2 : 1} />
          ))}
          <rect x="68" y="122" width="62" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        </>
      )}

      {/* buttons + leds */}
      {[84, 120, 156].map((cx) => (
        <circle key={cx} cx={cx} cy="156" r="9" fill={outline ? "none" : "#2b2d33"} stroke={outline ? accent : "rgba(255,255,255,0.25)"} />
      ))}
      <circle cx="120" cy="156" r="12.5" fill="none" stroke={accent} strokeOpacity={worn ? 0.3 : 0.9} />
      {[92, 120, 148].map((cx, i) => (
        <circle key={cx} cx={cx} cy="180" r="2.6" fill={outline ? "none" : i === 0 ? accent : i === 1 ? "#4aa8ff" : "#fff"} stroke={outline ? accent : "none"} opacity={worn ? 0.35 : 1} />
      ))}

      {/* front vent slots */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x="62"
          y={198 + i * 9}
          width="116"
          height="4"
          rx="2"
          fill={outline ? "none" : "rgba(0,0,0,0.85)"}
          stroke={outline ? accent : "none"}
        />
      ))}

      {/* accent strip */}
      <rect x="70" y="268" width="100" height="2.5" rx="1.2" fill={accent} opacity={worn ? 0.3 : 1} />

      {/* solar badge */}
      {variant === "hybrid" && !outline && !worn && (
        <g transform="translate(160 44)" stroke={accent} strokeWidth="1.3" strokeLinecap="round">
          <circle r="4.5" fill="none" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={Math.cos(a) * 7} y1={Math.sin(a) * 7} x2={Math.cos(a) * 10} y2={Math.sin(a) * 10} />;
          })}
        </g>
      )}
      {/* sine wave badge */}
      {variant === "sine" && !outline && !worn && (
        <path d="M54 52q5-8 10 0t10 0" stroke={accent} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      )}

      {/* wear marks */}
      {worn && (
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          <path d="M60 220l30 6M150 240l22-4M72 262l40 3" />
          <circle cx="170" cy="100" r="6" fill="rgba(0,0,0,0.35)" stroke="none" />
        </g>
      )}

      {/* feet */}
      {[52, 188].map((x) => (
        <rect key={x} x={x - 6} y="292" width="12" height="9" rx="2" fill={outline ? "none" : "#0b0b0c"} stroke={outline ? accent : "rgba(255,255,255,0.1)"} />
      ))}
    </svg>
  );
}
