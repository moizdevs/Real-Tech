"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll";

// orthogonal "circuit trace" paths, in a 1440×700 viewBox
const TRACES = [
  "M-20 120 H260 Q280 120 280 140 V260 Q280 280 300 280 H560 Q580 280 580 300 V420 H880",
  "M-20 560 H180 Q200 560 200 540 V470 Q200 450 220 450 H460 Q480 450 480 430 V350 H760 Q780 350 780 330 V180 H1100",
  "M1460 90 H1180 Q1160 90 1160 110 V230 Q1160 250 1140 250 H900 Q880 250 880 270 V380 H640",
  "M1460 600 H1240 Q1220 600 1220 580 V500 Q1220 480 1200 480 H980 Q960 480 960 460 V400",
  "M300 -20 V60 Q300 80 320 80 H700 Q720 80 720 100 V200",
];

export default function PowerIntroSection() {
  const root = useRef<HTMLElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (line2.current) {
        line2.current.style.opacity = "1";
        line2.current.classList.add("text-volt", "text-glow");
      }
      return;
    }
    const ctx = gsap.context(() => {
      // The grid "goes down" (line 1 dims), then power flickers back on (line 2).
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 55%", once: true },
      });
      tl.to("[data-grid-line]", { opacity: 0.28, duration: 0.9, ease: "power2.out" })
        .fromTo(
          line2.current,
          { opacity: 0.08 },
          {
            keyframes: [
              { opacity: 0.9, duration: 0.06 },
              { opacity: 0.1, duration: 0.09 },
              { opacity: 1, duration: 0.05 },
              { opacity: 0.25, duration: 0.12 },
              { opacity: 1, duration: 0.5 },
            ],
          },
          "+=0.1",
        )
        .add(() => line2.current?.classList.add("text-volt", "text-glow"), "<");
      gsap.to("[data-trace-wrap]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="power" className="relative isolate overflow-hidden py-[18vh]">
      {/* continues the hero's scroll line */}
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-[16vh] w-px -translate-x-1/2 bg-gradient-to-b from-white/15 to-transparent" />

      {/* animated circuit traces */}
      <div data-trace-wrap aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[10%] -z-10 h-[120%] opacity-80">
        <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none">
          {TRACES.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
              <path
                d={d}
                pathLength={1000}
                stroke={i % 3 === 2 ? "#4aa8ff" : "#ff6a13"}
                strokeWidth="2"
                strokeLinecap="round"
                className="trace-flow"
                style={{ animationDelay: `${-i * 1.3}s`, animationDuration: `${4.2 + i * 0.7}s` }}
              />
            </g>
          ))}
          {[
            [280, 260],
            [580, 420],
            [200, 470],
            [780, 330],
            [1160, 230],
            [880, 380],
            [960, 460],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4.5" fill="#050506" stroke="rgba(255,106,19,0.7)" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,transparent_20%,#050506_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="label mb-8 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          01 — When power fails
        </p>

        <h2 className="display text-[clamp(2.8rem,9.2vw,8.6rem)] text-bone" data-mask="scroll">
          <span className="mask-line">
            <span>
              <span data-grid-line className="inline-block">
                When the grid goes down.
              </span>
            </span>
          </span>
          <span className="mask-line">
            <span>
              <span ref={line2} className="inline-block" style={{ opacity: 0.12 }}>
                We keep you running.
              </span>
            </span>
          </span>
        </h2>

        <p className="mt-10 max-w-xl text-lg leading-relaxed text-mist md:ml-auto md:mr-[6%]" data-r>
          Power interruptions shouldn&apos;t stop your work, your home, or your business. We help you find reliable
          inverter solutions and bring faulty equipment back to life.
        </p>
      </div>
    </section>
  );
}
