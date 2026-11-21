import { MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import MaskLines from "@/components/ui/MaskLines";
import InverterIllustration from "@/components/illustrations/InverterIllustration";
import { SITE, whatsappUrl } from "@/config/site";

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-24 pt-32 sm:pb-28 md:justify-center md:pb-16"
    >
      {/* depth: vignette + faint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 72% 48%, rgba(255,106,19,0.10), transparent 60%), radial-gradient(ellipse 120% 90% at 50% 120%, #050506 35%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_50%,#000_20%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* shown only when WebGL is unavailable */}
      <div className="hero-fallback pointer-events-none absolute right-[6%] top-1/2 w-[min(34vw,420px)] -translate-y-1/2 max-md:left-1/2 max-md:right-auto max-md:top-[26%] max-md:w-[46vw] max-md:-translate-x-1/2">
        <InverterIllustration title="Illustration of a Real Tech inverter" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="label mb-6 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          {SITE.name} · {SITE.city}
        </p>

        <MaskLines
          as="h1"
          trigger="now"
          delay={0.15}
          className="display text-[clamp(3.6rem,11.5vw,10.5rem)] text-bone"
          lines={["Power that", <>never backs <span className="text-volt text-glow">down.</span></>]}
        />

        <div className="mt-8 max-w-md" data-r>
          <p className="display text-2xl tracking-[0.04em] text-bone sm:text-3xl">Buy. Sell. Repair.</p>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-mist">
            Reliable inverter solutions and precision repairs to keep your home and business running.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3" data-r>
          <Button href="#services" variant="primary">
            Explore Our Services
          </Button>
          <Button
            href={whatsappUrl("Hello Real Tech, I'd like to know more about your inverter services.")}
            external
            variant="ghost"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Contact on WhatsApp
          </Button>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 md:mt-16" data-r>
          {["New & used inverters", "We buy old & faulty units", "Component-level repair"].map((t) => (
            <li key={t} className="label flex items-center gap-2.5 !text-bone/60">
              <span className="h-1.5 w-1.5 rounded-full bg-volt" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* scroll indicator, leads straight into the next section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="label !text-[0.62rem]">Scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-6 bg-volt [animation:bob_1.8s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
