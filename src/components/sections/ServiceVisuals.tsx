"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll";
import InverterIllustration, { InverterVariant } from "@/components/illustrations/InverterIllustration";
import { SITE } from "@/config/site";

/* ------------------------------------------------------------------ */
/* 01 — BUY: a fan of three product types, hover/tap to bring one forward */
/* ------------------------------------------------------------------ */
const PRODUCTS: { id: InverterVariant; name: string; note: string; color: string }[] = [
  { id: "ups", name: "Home UPS", note: "Everyday backup for the home", color: "#ff6a13" },
  { id: "hybrid", name: "Solar hybrid", note: "Built to work alongside solar", color: "#ffb020" },
  { id: "sine", name: "Pure sine wave", note: "Clean output for sensitive devices", color: "#4aa8ff" },
];

export function BuyVisual() {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 14);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div>
      <div
        className="relative mx-auto aspect-[5/4] w-full max-w-[560px] [perspective:1200px]"
        role="group"
        aria-label="Inverter types"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-[10%] bottom-[6%] h-[18%] rounded-[50%] blur-2xl transition-colors duration-700"
          style={{ background: PRODUCTS[active].color, opacity: 0.28 }}
        />
        <div ref={stage} className="absolute inset-0 [transform-style:preserve-3d]">
          {PRODUCTS.map((p, i) => {
            const pos = i - active;
            const abs = Math.abs(pos);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={`Show ${p.name}`}
                aria-pressed={active === i}
                className="absolute left-1/2 top-1/2 h-[88%] w-[48%] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translate(-50%,-50%) translateX(${pos * 62}%) translateZ(${-abs * 140}px) rotateY(${-pos * 16}deg) scale(${1 - abs * 0.1})`,
                  opacity: 1 - abs * 0.38,
                  zIndex: 10 - abs,
                  filter: abs ? "brightness(0.6)" : "none",
                }}
              >
                {SITE.photos[p.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={SITE.photos[p.id]} alt={p.name} className="h-full w-full rounded-xl object-cover" loading="lazy" />
                ) : (
                  <InverterIllustration variant={p.id} className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-pressed={active === i}
            className={`rounded-xl border px-4 py-3 text-left transition-colors duration-300 ${
              active === i ? "border-white/30 bg-white/[0.06]" : "border-white/10 hover:border-white/20"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-bone">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="mt-1 block text-xs leading-snug text-mist">{p.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — SELL: an old unit is "scanned" into a clean outlined product      */
/* ------------------------------------------------------------------ */
export function SellVisual() {
  return (
    <div className="relative mx-auto flex max-w-[520px] items-center justify-center gap-6 sm:gap-10">
      <div className="relative aspect-[3/4] w-[58%] max-w-[300px]">
        {/* worn, solid unit */}
        <InverterIllustration worn variant="ups" className="absolute inset-0 h-full w-full opacity-90" />
        {/* clean outline revealed by the scan */}
        <div
          className="absolute inset-0"
          style={{ animation: "scan-reveal 4.5s linear infinite alternate" }}
        >
          <div className="absolute inset-0 bg-ink/70" />
          <InverterIllustration outline variant="ups" className="absolute inset-0 h-full w-full drop-shadow-[0_0_12px_rgba(255,106,19,0.55)]" />
        </div>
        {/* scan bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 h-px bg-volt shadow-[0_0_18px_3px_rgba(255,106,19,0.8)]"
          style={{ animation: "scan-bar 4.5s linear infinite alternate" }}
        />
      </div>

      <ol className="space-y-5">
        {[
          ["01", "Inspect"],
          ["02", "Assess"],
          ["03", "Fair offer"],
        ].map(([n, t]) => (
          <li key={n} className="flex items-center gap-3">
            <span className="label !text-volt">{n}</span>
            <span className="display text-2xl tracking-[0.03em] text-bone/90">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — REPAIR: circuit board with a diagnostic scan sweeping across      */
/* ------------------------------------------------------------------ */
export function RepairVisual() {
  return (
    <div className="relative mx-auto aspect-[8/5] w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/10 bg-[#12151a]">
      <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
        {/* traces */}
        <g stroke="rgba(255,255,255,0.12)" strokeWidth="2">
          <path d="M40 90H260V210H420" />
          <path d="M40 150H200V300H420" />
          <path d="M40 380H300V320H420" />
          <path d="M520 90H700V200" />
          <path d="M520 260H760" />
          <path d="M520 330H640V440H760" />
          <path d="M300 440H560V380" />
        </g>
        <g stroke="#ff6a13" strokeWidth="2.5" strokeLinecap="round">
          {["M40 90H260V210H420", "M520 260H760", "M300 440H560V380"].map((d, i) => (
            <path key={i} d={d} pathLength={1000} className="trace-flow" style={{ animationDelay: `${-i * 1.6}s` }} />
          ))}
        </g>
        {/* transformer */}
        <rect x="70" y="190" width="150" height="130" rx="8" fill="#14161a" stroke="rgba(255,255,255,0.2)" />
        <g stroke="#ff6a13" strokeOpacity="0.8" strokeWidth="3">
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d={`M${92 + i * 20} 205V305`} />
          ))}
        </g>
        {/* mosfets */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${430 + i * 58} 130)`}>
            <rect width="42" height="70" rx="4" fill="#1a1c21" stroke="rgba(255,255,255,0.22)" />
            <rect x="6" y="6" width="30" height="16" rx="2" fill="#7e8189" />
          </g>
        ))}
        {/* capacitors */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={470 + i * 70} cy="380" r="26" fill="#0f1114" stroke="rgba(255,255,255,0.25)" />
            <circle cx={470 + i * 70} cy="380" r="14" fill="#1b1e23" stroke="#ff6a13" strokeOpacity="0.5" />
          </g>
        ))}
        {/* control chip */}
        <rect x="290" y="95" width="110" height="80" rx="5" fill="#101216" stroke="rgba(255,255,255,0.2)" />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} fill="rgba(255,255,255,0.35)">
            <rect x={298 + i * 12} y="86" width="4" height="9" />
            <rect x={298 + i * 12} y="175" width="4" height="9" />
          </g>
        ))}
      </svg>
      {/* sweeping diagnostic beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-volt/25 to-transparent"
        style={{ animation: "scan-x 3.8s linear infinite" }}
      >
        <div className="absolute inset-y-0 left-1/2 w-px bg-volt shadow-[0_0_16px_2px_rgba(255,106,19,0.9)]" />
      </div>
      <span className="label absolute bottom-3 left-4 !text-volt">Scanning · component level</span>
    </div>
  );
}
