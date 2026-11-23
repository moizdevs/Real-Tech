"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { scrollToHash } from "@/lib/scroll";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Repair Process" },
  { href: "#problems", label: "Common Problems" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // let the menu close (and scroll lock release) before scrolling
    setTimeout(() => {
      scrollToHash(href);
      history.replaceState(null, "", href);
    }, 30);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          solid
            ? "border-white/10 bg-black/55 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" onClick={go("#top")} aria-label="Real Tech — back to top">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={go(l.href)}
                className="group relative text-[0.78rem] font-medium uppercase tracking-[0.14em] text-bone/75 transition-colors hover:text-bone"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-volt transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button href="#contact" magnetic className="max-md:!hidden !px-5 !py-2.5">
            Contact Us
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 -z-10 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="space-y-2">
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={go(l.href)}
                tabIndex={open ? 0 : -1}
                className="display flex items-baseline gap-4 py-2 text-5xl text-bone"
              >
                <span className="label !text-volt">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={go("#contact")}
          tabIndex={open ? 0 : -1}
          className="mt-10 inline-flex w-fit rounded-full bg-volt px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-black"
        >
          Contact Us
        </a>
      </div>
    </header>
  );
}
