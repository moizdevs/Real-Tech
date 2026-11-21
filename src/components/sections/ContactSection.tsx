import { MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import MaskLines from "@/components/ui/MaskLines";
import { SITE, mapsUrl, telUrl, whatsappUrl } from "@/config/site";

export default function ContactSection() {
  const tel = telUrl();

  return (
    <section id="contact" className="relative flex min-h-[100svh] items-center overflow-hidden py-[14vh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 78% 50%, rgba(255,106,19,0.16), transparent 65%), linear-gradient(to bottom, transparent, rgba(5,5,6,0.6))",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="label mb-6 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          07 — Contact
        </p>

        <MaskLines
          className="display text-[clamp(3.2rem,10.5vw,9.5rem)] text-bone"
          lines={["Let's get your", <span key="p" className="text-volt text-glow">power back.</span>]}
        />

        <p className="mt-8 max-w-lg text-lg leading-relaxed text-mist" data-r>
          Whether you&apos;re looking to buy an inverter, sell your old one, or repair a faulty unit — Real Tech is
          ready to help.
        </p>

        <div className="mt-10 flex flex-wrap gap-3" data-r>
          <Button
            href={whatsappUrl("Hello Real Tech, I'd like to get in touch about an inverter.")}
            external
            variant="primary"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Contact on WhatsApp
          </Button>
          {tel && (
            <Button href={tel} variant="ghost">
              <Phone size={16} aria-hidden="true" />
              Call Now
            </Button>
          )}
          <Button href={mapsUrl()} external variant="ghost">
            <MapPin size={16} aria-hidden="true" />
            Get Directions
          </Button>
        </div>

        <p className="label mt-10 flex items-center gap-3 !text-bone/70" data-r>
          <MapPin size={14} className="text-volt" aria-hidden="true" />
          {SITE.location}
        </p>
      </div>
    </section>
  );
}
