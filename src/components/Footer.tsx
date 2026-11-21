import { MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { SITE, mapsUrl, telUrl, whatsappUrl } from "@/config/site";

const SERVICES = [
  { href: "#services", label: "Buy an inverter" },
  { href: "#services", label: "Sell your inverter" },
  { href: "#services", label: "Inverter repair" },
  { href: "#process", label: "Repair process" },
  { href: "#problems", label: "Common problems" },
];

export default function Footer() {
  const tel = telUrl();
  const social = Object.entries(SITE.social).filter(([, v]) => v);

  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
            Real Tech sells new and used inverters, buys old and faulty units, and repairs inverter circuit boards
            in {SITE.city}.
          </p>
          {social.length > 0 && (
            <ul className="mt-6 flex gap-4">
              {social.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label transition-colors hover:text-volt"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer services">
          <p className="label mb-5 !text-bone/50">Services</p>
          <ul className="space-y-3 text-sm">
            {SERVICES.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="text-bone/80 transition-colors hover:text-volt">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label mb-5 !text-bone/50">Contact</p>
          <ul className="space-y-3 text-sm text-bone/80">
            <li>
              <a href={whatsappUrl("Hello Real Tech")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-volt">
                <MessageCircle size={15} className="text-volt" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            {tel && (
              <li>
                <a href={tel} className="flex items-center gap-2.5 transition-colors hover:text-volt">
                  <Phone size={15} className="text-volt" aria-hidden="true" />
                  {SITE.phone}
                </a>
              </li>
            )}
            <li>
              <a href={mapsUrl()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 transition-colors hover:text-volt">
                <MapPin size={15} className="mt-0.5 flex-none text-volt" aria-hidden="true" />
                {SITE.location}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="label !text-[0.65rem]">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="label !text-[0.65rem]">Buy · Sell · Repair</p>
        </div>
      </div>
    </footer>
  );
}
