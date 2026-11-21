"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import MaskLines from "@/components/ui/MaskLines";
import Button from "@/components/ui/Button";
import { whatsappUrl } from "@/config/site";

const FAULTS = [
  {
    title: "Inverter not turning on",
    note: "Can point to a tripped breaker or fuse, a flat or disconnected battery, a failed power stage, or a fault on the control board. It takes an inspection to tell which.",
  },
  {
    title: "Battery not charging",
    note: "Often linked to the charging circuit, poor connections, or a battery that has weakened over time. Both the charger section and the battery need checking.",
  },
  {
    title: "Overload warnings",
    note: "Sometimes the load really is too heavy — but a weakened output stage or a faulty sensing circuit can also report an overload that isn't there.",
  },
  {
    title: "Continuous beeping",
    note: "The buzzer is the inverter's way of reporting a condition such as low battery, overload or a fault. The beep pattern and how the unit behaves help narrow it down.",
  },
  {
    title: "No output",
    note: "The unit may power up but deliver nothing at the sockets. Possible causes include an output relay, the power stage, or a protection lock-out.",
  },
  {
    title: "Unexpected shutdowns",
    note: "Frequently tied to overheating, battery voltage dropping under load, loose connections, or a protection circuit tripping.",
  },
  {
    title: "Blown components",
    note: "A burnt smell, visible damage or a popped fuse usually means something failed hard. Stop using the unit — the cause has to be traced, not just the part swapped.",
  },
  {
    title: "Fan failure",
    note: "A stalled or noisy fan lets heat build up and stresses the power components. It is worth attending to early.",
  },
  {
    title: "Display errors",
    note: "Blank, flickering or wrong readings can come from the display itself, its connection, or the control board behind it.",
  },
  {
    title: "Short circuit problems",
    note: "Usually a protection trip caused by a wiring fault, a faulty load, or damaged output components. Disconnect the load and avoid repeatedly resetting the unit.",
  },
];

export default function DiagnosticSection() {
  const [i, setI] = useState(0);
  const fault = FAULTS[i];

  return (
    <section id="problems" className="relative py-[14vh]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="label mb-6 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          05 — Common problems
        </p>
        <MaskLines
          className="display text-[clamp(2.6rem,7.6vw,6.8rem)] text-bone"
          lines={["Is your inverter", <span key="a" className="text-volt">acting up?</span>]}
        />

        <div
          className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-[#07080a]/90 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md"
          data-r
        >
          {/* title bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-volt" />
            </div>
            <span className="label !text-[0.65rem]">Fault finder · select a symptom</span>
            <span className="label !text-[0.65rem] hidden sm:block">
              {String(i + 1).padStart(2, "0")} / {FAULTS.length}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            {/* list */}
            <ul role="listbox" aria-label="Common inverter problems" className="border-b border-white/10 lg:border-b-0 lg:border-r">
              {FAULTS.map((f, idx) => (
                <li key={f.title} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={idx === i}
                    onClick={() => setI(idx)}
                    onMouseEnter={() => setI(idx)}
                    className={`flex w-full items-center gap-4 border-b border-white/[0.06] px-5 py-3.5 text-left transition-colors last:border-b-0 ${
                      idx === i ? "bg-volt/10" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className={`label !text-[0.65rem] ${idx === i ? "!text-volt" : ""}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[0.95rem] ${idx === i ? "font-medium text-bone" : "text-bone/70"}`}>
                      {f.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`ml-auto h-1.5 w-1.5 rounded-full transition-all ${
                        idx === i ? "bg-volt shadow-[0_0_10px_2px_rgba(255,106,19,0.8)]" : "bg-white/15"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            {/* readout */}
            <div className="relative flex flex-col justify-between gap-10 p-6 sm:p-10" aria-live="polite">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(255,106,19,0.12), transparent 70%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)",
                }}
              />
              <div className="relative" key={fault.title}>
                <p className="label !text-volt">Symptom {String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)] text-bone">{fault.title}</h3>
                <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-mist">{fault.note}</p>
                <p className="mt-5 max-w-lg text-xs leading-relaxed text-mist/70">
                  Every unit is different. We inspect first and tell you what we find — we don&apos;t promise a fix
                  before we&apos;ve seen the inverter.
                </p>
              </div>

              <div className="relative">
                <p className="display text-2xl tracking-[0.03em] text-bone sm:text-3xl">
                  Experiencing this issue? Let our technicians inspect it.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    href={whatsappUrl(`Hello Real Tech, my inverter has this problem: "${fault.title}". Can you inspect it?`)}
                    external
                    variant="primary"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Ask on WhatsApp
                  </Button>
                  <Button href="#contact" variant="ghost">
                    Other ways to reach us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
