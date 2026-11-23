import { MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import MaskLines from "@/components/ui/MaskLines";
import { SITE, mapsUrl, telUrl, whatsappUrl } from "@/config/site";

export default function ContactSection() {
  const tel = telUrl();

  return (
    <section id="contact" className="relative z-10 flex min-h-[90svh] items-center overflow-hidden bg-volt py-[14vh] text-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 80% at 80% 50%, #000, transparent 75%)",
        }}
      />
      <svg aria-hidden="true" viewBox="0 0 32 32" className="pointer-events-none absolute -right-10 top-1/2 h-[70vmin] w-[70vmin] -translate-y-1/2 opacity-[0.12]">
        <path d="M18.5 4 8 18.2h6.4L12.8 28 24 13h-6.6L18.5 4Z" fill="#000" />
      </svg>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="label mb-6 flex items-center gap-3 !text-black/70" data-r>
          <span className="h-px w-10 bg-black" />
          07 — Contact
        </p>

        <MaskLines
          className="display text-[clamp(3rem,10.5vw,9.5rem)] text-black"
          lines={["Let's get your", <span key="p" className="text-white">power back.</span>]}
        />

        <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-black/80" data-r>
          Whether you&apos;re looking to buy an inverter, sell your old one, or repair a faulty unit — Real Tech is
          ready to help.
        </p>

        <div className="mt-10 flex flex-wrap gap-3" data-r>
          <Button
            href={whatsappUrl("Hello Real Tech, I'd like to get in touch about an inverter.")}
            external
            variant="dark"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Contact on WhatsApp
          </Button>
          {tel && (
            <Button href={tel} variant="darkGhost">
              <Phone size={16} aria-hidden="true" />
              Call Now
            </Button>
          )}
          <Button href={mapsUrl()} external variant="darkGhost">
            <MapPin size={16} aria-hidden="true" />
            Get Directions
          </Button>
        </div>

        <p className="label mt-10 flex items-center gap-3 !text-black/75" data-r>
          <MapPin size={14} className="text-black" aria-hidden="true" />
          {SITE.location}
        </p>
      </div>
    </section>
  );
}
