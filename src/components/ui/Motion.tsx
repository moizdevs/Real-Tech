"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, setLenis } from "@/lib/scroll";

/**
 * Smooth scrolling (Lenis on the GSAP ticker) plus the page-wide reveal system:
 *  - [data-r]       fade-up on enter
 *  - [data-mask]    parent of .mask-line spans, lines slide up out of a mask
 */
export default function Motion({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reduced) return;

      ScrollTrigger.batch("[data-r]", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.09, overwrite: true },
          ),
      });

      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((group) => {
        const lines = group.querySelectorAll<HTMLElement>(".mask-line > span");
        const delay = Number(group.dataset.delay ?? 0);
        const immediate = group.dataset.mask === "now";
        gsap.fromTo(
          lines,
          { yPercent: 112, autoAlpha: 1 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.15,
            ease: "power4.out",
            stagger: 0.12,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: group, start: "top 88%", once: true },
          },
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
