"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import MaskLines from "@/components/ui/MaskLines";

const STEPS = [
  {
    n: "01",
    title: "Bring it in",
    body: "Bring your inverter to our workshop or contact us first to describe the issue.",
  },
  {
    n: "02",
    title: "Diagnose",
    body: "We inspect and test the unit to identify the actual fault.",
  },
  {
    n: "03",
    title: "Quote & repair",
    body: "We explain the issue and cost before proceeding with the repair.",
  },
  {
    n: "04",
    title: "Test & return",
    body: "We test the repaired inverter under load before returning it to you.",
  },
];

/**
 * Desktop: pinned, horizontally scrubbed timeline with a growing line + travelling spark.
 * Mobile / reduced motion: a plain vertical timeline whose line fills as you scroll.
 */
export default function RepairProcessSection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const spark = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    const setActive = (index: number) => {
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((s, i) => {
        s.dataset.state = i === index ? "active" : i < index ? "done" : "idle";
      });
      if (counter.current) counter.current.textContent = `0${index + 1} / 04`;
    };
    setActive(0);

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const distance = () => Math.max(0, t.scrollWidth - window.innerWidth + 120);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance() * 1.1 + 200}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
        },
      });
      tl.to(t, { x: () => -distance() }, 0);
      tl.fromTo(line.current, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center" }, 0);
      tl.fromTo(spark.current, { left: "0%" }, { left: "100%" }, 0);
      return () => tl.kill();
    });

    mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      steps.forEach((s, i) => {
        ScrollTrigger.create({
          trigger: s,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      const v = el.querySelector<HTMLElement>("[data-vline]");
      if (v) {
        gsap.fromTo(
          v,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: { trigger: el.querySelector<HTMLElement>("[data-timeline]") ?? el, start: "top 70%", end: "bottom 70%", scrub: true },
          },
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="process" className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24 lg:py-0">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label mb-6 flex items-center gap-3" data-r>
              <span className="h-px w-10 bg-volt" />
              04 — Repair process
            </p>
            <MaskLines
              className="display text-[clamp(2.6rem,7.6vw,6.8rem)] text-bone"
              lines={["Four steps.", <span key="z" className="text-volt">Zero guesswork.</span>]}
            />
          </div>
          <span ref={counter} className="label hidden !text-bone/70 lg:block" aria-hidden="true">
            01 / 04
          </span>
        </div>
      </div>

      {/* timeline */}
      <div className="relative mt-14 lg:mt-20" data-timeline>
        {/* desktop line */}
        <div aria-hidden="true" className="absolute left-0 right-0 top-8 hidden h-px bg-white/12 lg:block" />
        <div aria-hidden="true" className="absolute left-0 right-0 top-8 hidden h-px lg:block">
          <div ref={line} className="h-full w-full bg-volt shadow-[0_0_14px_rgba(255,106,19,0.9)]" />
          <div
            ref={spark}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt shadow-[0_0_24px_8px_rgba(255,106,19,0.7)]"
          />
        </div>

        {/* mobile line */}
        <div aria-hidden="true" className="absolute bottom-0 left-[1.65rem] top-0 w-px bg-white/12 sm:left-[2.4rem] lg:hidden">
          <div data-vline className="h-full w-full bg-volt shadow-[0_0_12px_rgba(255,106,19,0.9)]" />
        </div>

        <div
          ref={track}
          className="flex flex-col gap-10 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-10 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              data-step
              data-state="idle"
              className="group relative flex gap-6 pl-12 sm:pl-16 lg:w-[min(30vw,430px)] lg:flex-none lg:flex-col lg:gap-0 lg:pl-0"
            >
              {/* node on the line */}
              <span
                aria-hidden="true"
                className="absolute left-[-0.1rem] top-2 grid h-7 w-7 place-items-center rounded-full border border-white/25 bg-ink transition-all duration-500 group-data-[state=active]:scale-125 group-data-[state=active]:border-volt group-data-[state=done]:border-volt/60 sm:left-[0.55rem] lg:static lg:mb-8 lg:mt-6 lg:h-4 lg:w-4"
              >
                <span className="h-2 w-2 rounded-full bg-white/30 transition-colors duration-500 group-data-[state=active]:bg-volt group-data-[state=done]:bg-volt/70 lg:h-1.5 lg:w-1.5" />
              </span>

              <div>
                <span className="display outline-text block text-[clamp(4.5rem,9vw,7.5rem)] leading-[0.8] transition-all duration-500 group-data-[state=active]:[-webkit-text-stroke-color:#ff6a13] group-data-[state=active]:[text-shadow:0_0_40px_rgba(255,106,19,0.35)]">
                  {s.n}
                </span>
                <h3 className="display mt-5 text-3xl text-bone transition-opacity duration-500 group-data-[state=idle]:opacity-50 sm:text-4xl lg:mt-8 lg:text-5xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-mist transition-opacity duration-500 group-data-[state=idle]:opacity-50">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

