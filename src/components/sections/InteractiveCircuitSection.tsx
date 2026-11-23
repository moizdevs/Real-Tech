"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll";
import MaskLines from "@/components/ui/MaskLines";

type CompId = "transformer" | "capacitors" | "mosfets" | "fan" | "control" | "output";

type Comp = {
  id: CompId;
  name: string;
  tag: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  desc: string;
  checks: string[];
};

const VB_W = 800;
const VB_H = 520;

const COMPS: Comp[] = [
  {
    id: "transformer",
    name: "Transformer",
    tag: "Voltage conversion",
    x: 40,
    y: 90,
    w: 240,
    h: 200,
    z: 38,
    desc: "Steps the battery-side voltage up to mains level. Overheating, a shorted winding or poor connections can leave an inverter with no usable output.",
    checks: ["Winding continuity & insulation", "Signs of overheating", "Connections & mounting"],
  },
  {
    id: "capacitors",
    name: "Capacitors",
    tag: "Energy smoothing",
    x: 330,
    y: 60,
    w: 200,
    h: 90,
    z: 46,
    desc: "Smooth and store energy in the power stages. They age with heat and time — swelling, leakage or lost capacity can cause erratic behaviour.",
    checks: ["Bulging or leaking", "Capacity and ESR where needed", "Replaced with suitable parts"],
  },
  {
    id: "mosfets",
    name: "MOSFETs",
    tag: "Power switching",
    x: 330,
    y: 200,
    w: 240,
    h: 110,
    z: 30,
    desc: "The power switches that turn battery DC into AC. They work hardest under load, and overloads or shorts are a common way for them to fail.",
    checks: ["Each device tested, out of circuit if needed", "Gate-drive and driver parts", "The cause traced, not just the damage"],
  },
  {
    id: "fan",
    name: "Cooling fan",
    tag: "Thermal control",
    x: 620,
    y: 50,
    w: 140,
    h: 140,
    z: 22,
    desc: "Moves heat away from the power parts. A slow or seized fan lets temperatures climb and can trigger unexpected shutdowns.",
    checks: ["Spin and bearing noise", "Fan control circuit", "Airflow path & dust"],
  },
  {
    id: "control",
    name: "Control board",
    tag: "Logic & protection",
    x: 40,
    y: 340,
    w: 230,
    h: 140,
    z: 26,
    desc: "The brain of the unit: sets the output, watches battery, load and temperature, and decides when to protect the inverter.",
    checks: ["Power rails & reference signals", "Display and button connections", "Sensing & protection circuits"],
  },
  {
    id: "output",
    name: "Output circuits",
    tag: "Delivery to your load",
    x: 590,
    y: 320,
    w: 170,
    h: 150,
    z: 20,
    desc: "Relays, wiring and protection that deliver power to your appliances. Faults here can look like a dead inverter even when the rest is healthy.",
    checks: ["Relay & contacts", "Output wiring & sockets", "Behaviour under real load"],
  },
];

const TRACES: { d: string; for: string }[] = [
  { d: "M280 250H310V255H330", for: "transformer mosfets" },
  { d: "M570 270H640V320H675", for: "mosfets output" },
  { d: "M430 150V200", for: "capacitors mosfets" },
  { d: "M280 110H330", for: "transformer capacitors" },
  { d: "M270 400H300V290H330", for: "control mosfets" },
  { d: "M155 340V312H300V30H690V50", for: "control fan" },
  { d: "M270 450H590", for: "control output" },
  { d: "M530 105H575V120H620", for: "capacitors fan" },
];

/* ---- little product renderers, each in its own coordinate system ---- */
function Visual({ id }: { id: CompId }): ReactNode {
  switch (id) {
    case "transformer":
      return (
        <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
          <rect x="4" y="4" width="232" height="192" rx="10" fill="#15171b" stroke="rgba(255,255,255,0.22)" />
          <rect x="20" y="20" width="200" height="160" rx="6" fill="#0d0e11" />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={30 + i * 22} y="28" width="14" height="144" rx="7" fill="url(#cu)" />
          ))}
          <defs>
            <linearGradient id="cu" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7a3a12" />
              <stop offset="0.5" stopColor="#ff8a3d" />
              <stop offset="1" stopColor="#6b300d" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "capacitors":
      return (
        <svg viewBox="0 0 200 90" className="h-full w-full" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${12 + i * 62} 6)`}>
              <rect width="52" height="78" rx="10" fill="#101216" stroke="rgba(255,255,255,0.25)" />
              <rect x="0" y="0" width="52" height="16" rx="8" fill="#23262c" />
              <rect x="40" y="16" width="8" height="62" fill="#4aa8ff" opacity="0.55" />
              <path d="M10 8h32M26 3v10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      );
    case "mosfets":
      return (
        <svg viewBox="0 0 240 110" className="h-full w-full" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${10 + i * 56} 4)`}>
              <rect width="44" height="86" rx="4" fill="#191b20" stroke="rgba(255,255,255,0.25)" />
              <rect x="6" y="6" width="32" height="30" rx="3" fill="#8b8e96" />
              <circle cx="22" cy="21" r="6" fill="#2a2c31" />
              {[8, 20, 32].map((x) => (
                <rect key={x} x={x} y="86" width="4" height="20" fill="#b8bbc2" />
              ))}
            </g>
          ))}
        </svg>
      );
    case "fan":
      return (
        <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
          <rect x="4" y="4" width="132" height="132" rx="14" fill="#101216" stroke="rgba(255,255,255,0.22)" />
          <circle cx="70" cy="70" r="54" fill="#07080a" stroke="rgba(255,255,255,0.15)" />
          <g style={{ transformOrigin: "70px 70px", animation: "spin-slow 1.6s linear infinite" }}>
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} transform={`rotate(${a} 70 70)`} d="M70 70C58 46 62 22 76 18c10 14 6 36-6 52Z" fill="#2c2f36" stroke="rgba(255,255,255,0.18)" />
            ))}
            <circle cx="70" cy="70" r="9" fill="#ff6a13" />
          </g>
        </svg>
      );
    case "control":
      return (
        <svg viewBox="0 0 230 140" className="h-full w-full" aria-hidden="true">
          <rect x="3" y="3" width="224" height="134" rx="8" fill="#0f1114" stroke="rgba(255,255,255,0.22)" />
          <rect x="70" y="30" width="86" height="64" rx="4" fill="#15171c" stroke="rgba(255,255,255,0.3)" />
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i} fill="rgba(255,255,255,0.4)">
              <rect x={76 + i * 11} y="22" width="4" height="8" />
              <rect x={76 + i * 11} y="94" width="4" height="8" />
            </g>
          ))}
          <circle cx="80" cy="42" r="3" fill="#ff6a13" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={16 + i * 14} y="108" width="9" height="16" rx="1" fill="#1d2025" stroke="rgba(255,255,255,0.2)" />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={170} y={26 + i * 22} width="40" height="10" rx="2" fill="#1d2025" stroke="rgba(255,255,255,0.2)" />
          ))}
        </svg>
      );
    case "output":
      return (
        <svg viewBox="0 0 170 150" className="h-full w-full" aria-hidden="true">
          <rect x="3" y="3" width="164" height="144" rx="8" fill="#0f1114" stroke="rgba(255,255,255,0.22)" />
          <rect x="16" y="14" width="138" height="58" rx="6" fill="#1b1d22" stroke="rgba(255,255,255,0.22)" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={44 + i * 46} cy="43" r="15" fill="#2a2d33" stroke="rgba(255,255,255,0.25)" />
              <path d={`M${36 + i * 46} 43h16`} stroke="#0b0c0e" strokeWidth="3" />
            </g>
          ))}
          <rect x="16" y="86" width="64" height="44" rx="6" fill="#171a1e" stroke="#ff6a13" strokeOpacity="0.55" />
          <path d="M30 108h36" stroke="#ff6a13" strokeWidth="3" strokeLinecap="round" />
          <rect x="94" y="86" width="60" height="44" rx="6" fill="#171a1e" stroke="rgba(255,255,255,0.2)" />
        </svg>
      );
  }
}

export default function InteractiveCircuitSection() {
  const [active, setActive] = useState<CompId>("mosfets");
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // gentle auto-tour through the components while the section is on screen
  useEffect(() => {
    if (!inView || paused || reduced.current) return;
    const id = setInterval(() => {
      setActive((cur) => COMPS[(COMPS.findIndex((c) => c.id === cur) + 1) % COMPS.length].id);
    }, 3400);
    return () => clearInterval(id);
  }, [inView, paused]);

  // pointer-driven 3D tilt
  useEffect(() => {
    const el = tilt.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      gsap.set(el, { rotationX: 14, rotationY: -8 });
      return;
    }
    gsap.set(el, { rotationX: 16, rotationY: -10 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.parentElement!.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      ry(-10 + nx * 22);
      rx(16 - ny * 16);
    };
    const leave = () => {
      rx(16);
      ry(-10);
    };
    const parent = el.parentElement!;
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, []);

  const current = COMPS.find((c) => c.id === active)!;
  const pick = (id: CompId) => setActive(id);

  return (
    <section ref={root} id="lab" className="relative overflow-x-clip py-[14vh]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="label mb-6 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          03 — Diagnosis
        </p>
        <MaskLines
          className="display text-[clamp(2.6rem,7.6vw,6.8rem)] text-bone"
          lines={["We find the problem.", <span key="b" className="text-volt">Not just the symptom.</span>]}
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* board */}
          <div
            className="relative [perspective:1500px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            data-r
          >
            <div
              ref={tilt}
              data-active={active}
              className="board relative aspect-[800/520] w-full [transform-style:preserve-3d]"
            >
              {/* PCB plate */}
              <svg
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                className="absolute inset-0 h-full w-full rounded-2xl"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#1a1e25" />
                    <stop offset="1" stopColor="#12151a" />
                  </linearGradient>
                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.07)" />
                  </pattern>
                </defs>
                <rect width={VB_W} height={VB_H} rx="18" fill="url(#pcb)" stroke="rgba(255,255,255,0.14)" />
                <rect width={VB_W} height={VB_H} rx="18" fill="url(#dots)" />
                {[
                  [18, 18],
                  [782, 18],
                  [18, 502],
                  [782, 502],
                ].map(([cx, cy]) => (
                  <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="6" fill="#050506" stroke="rgba(255,255,255,0.25)" />
                ))}
                {/* decorative resistors */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={300 + i * 52} y="340" width="30" height="9" rx="2" fill="#1f2227" stroke="rgba(255,255,255,0.18)" />
                ))}
                {TRACES.map((t, i) => (
                  <path key={`b${i}`} d={t.d} data-for={t.for} stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinejoin="round" />
                ))}
                {TRACES.map((t, i) => (
                  <path
                    key={`f${i}`}
                    d={t.d}
                    data-for={t.for}
                    data-flow
                    pathLength={1000}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="transparent"
                    opacity="0"
                    className="trace-flow"
                    style={{ animationDuration: "2.2s" }}
                  />
                ))}
              </svg>

              {/* diagnostic beam */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-28 -translate-x-1/2 bg-gradient-to-r from-transparent via-volt/10 to-transparent [transform:translateZ(60px)]"
                style={{ animation: "scan-x 6s linear infinite" }}
              >
                <div className="absolute inset-y-0 left-1/2 w-px bg-volt/60" />
              </div>

              {/* components */}
              {COMPS.map((c) => {
                const on = c.id === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pick(c.id)}
                    onMouseEnter={() => pick(c.id)}
                    onFocus={() => pick(c.id)}
                    aria-label={`${c.name}: ${c.tag}`}
                    aria-pressed={on}
                    className="group absolute rounded-lg transition-[transform,opacity,box-shadow] duration-500"
                    style={{
                      left: `${(c.x / VB_W) * 100}%`,
                      top: `${(c.y / VB_H) * 100}%`,
                      width: `${(c.w / VB_W) * 100}%`,
                      height: `${(c.h / VB_H) * 100}%`,
                      transform: `translateZ(${on ? c.z + 26 : c.z}px)`,
                      opacity: on ? 1 : 0.55,
                      boxShadow: on
                        ? "0 0 0 1.5px #ff6a13, 0 0 36px rgba(255,106,19,0.45), 0 30px 40px -10px rgba(0,0,0,0.8)"
                        : "0 18px 24px -10px rgba(0,0,0,0.75)",
                    }}
                  >
                    <Visual id={c.id} />
                    <span
                      className={`label pointer-events-none absolute -top-7 left-0 whitespace-nowrap max-md:hidden rounded bg-black/80 px-2 py-1 !text-[0.62rem] !text-volt transition-opacity duration-300 ${
                        on ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {c.name} · {c.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* info */}
          <div data-r>
            <ul className="grid grid-cols-2 gap-2" aria-label="Inverter components">
              {COMPS.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => pick(c.id)}
                    onMouseEnter={() => pick(c.id)}
                    aria-pressed={c.id === active}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                      c.id === active ? "border-volt/60 bg-volt/10" : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <span className="label !text-[0.65rem] !text-volt">0{i + 1}</span>
                    <span className="text-sm font-medium text-bone">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm" aria-live="polite">
              <p className="label !text-volt">{current.tag}</p>
              <h3 className="display mt-3 text-4xl text-bone">{current.name}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-mist">{current.desc}</p>
              <p className="label mt-6">What we look at</p>
              <ul className="mt-3 space-y-2">
                {current.checks.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-bone/85">
                    <span className="mt-2 h-px w-4 flex-none bg-volt" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
