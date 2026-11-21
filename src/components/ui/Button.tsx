"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, scrollToHash } from "@/lib/scroll";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "whatsapp";
  external?: boolean;
  className?: string;
  magnetic?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
};

const base =
  "group relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 will-change-transform";

const variants = {
  primary: "bg-volt text-black hover:bg-volt-soft shadow-[0_0_0_1px_rgba(255,106,19,0.6),0_10px_40px_-10px_rgba(255,106,19,0.7)]",
  ghost: "border border-white/20 text-bone hover:border-white/50 hover:bg-white/5 backdrop-blur-sm",
  whatsapp: "bg-bone text-black hover:bg-white",
};

export default function Button({
  href,
  children,
  variant = "primary",
  external,
  className = "",
  magnetic = true,
  ariaLabel,
  onClick,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !magnetic || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const qx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const qy = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.28);
      qy((e.clientY - (r.top + r.height / 2)) * 0.4);
    };
    const leave = () => {
      qx(0);
      qy(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [magnetic]);

  const isHash = href.startsWith("#");

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        onClick?.();
        if (isHash) {
          e.preventDefault();
          scrollToHash(href);
          history.replaceState(null, "", href);
        }
      }}
    >
      {children}
    </a>
  );
}
