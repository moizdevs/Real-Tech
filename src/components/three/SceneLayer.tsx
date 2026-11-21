"use client";

import { Component, ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll";
import { SCENE_STATES, sceneState } from "@/lib/sceneState";

const InverterScene = dynamic(() => import("./InverterScene"), { ssr: false });

const SECTIONS: [string, string][] = [
  ["top", "hero"],
  ["power", "intro"],
  ["services", "services"],
  ["lab", "lab"],
  ["process", "process"],
  ["problems", "problems"],
  ["trust", "trust"],
  ["contact", "contact"],
];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function markNoWebGL() {
  document.documentElement.dataset.webgl = "0";
}

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneLayer() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<{ lowPower: boolean; reduced: boolean } | null>(null);

  // decide whether/how to render, after first paint
  useEffect(() => {
    if (!hasWebGL()) {
      markNoWebGL();
      return;
    }
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    const start = () => setMode({ lowPower: mobile || weak, reduced: prefersReducedMotion() });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 200);
  }, []);

  // scroll choreography
  useEffect(() => {
    if (!mode) return;
    const el = wrap.current;
    if (el) el.style.opacity = String(sceneState.opacity);
    const ctx = gsap.context(() => {
      const go = (name: string) => {
        const pair = SCENE_STATES[name];
        if (!pair) return;
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const target = mobile ? pair.m : pair.d;
        gsap.to(sceneState, {
          ...target,
          duration: mode.reduced ? 0.01 : 1.6,
          ease: "power3.inOut",
          overwrite: "auto",
          onUpdate: () => {
            if (el) el.style.opacity = String(sceneState.opacity);
            sceneState.invalidate?.();
          },
        });
      };

      SECTIONS.forEach(([id, state]) => {
        const node = document.getElementById(id);
        if (!node) return;
        ScrollTrigger.create({
          trigger: node,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => go(state),
          onEnterBack: () => go(state),
        });
      });

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          sceneState.scroll = self.progress;
          sceneState.invalidate?.();
        },
      });

      go("hero");
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [mode]);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-none"
      style={{ opacity: 0 }}
    >
      {mode && (
        <Boundary onError={markNoWebGL}>
          <InverterScene lowPower={mode.lowPower} reduced={mode.reduced} />
        </Boundary>
      )}
    </div>
  );
}
