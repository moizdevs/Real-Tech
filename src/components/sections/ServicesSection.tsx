import { Check } from "lucide-react";
import MaskLines from "@/components/ui/MaskLines";
import ServiceCard from "./ServiceCard";
import { BuyVisual, RepairVisual, SellVisual } from "./ServiceVisuals";
import { whatsappUrl } from "@/config/site";

const REPAIR_ITEMS = [
  "Circuit board diagnostics",
  "Component-level repairs",
  "Transformer repairs",
  "Capacitor replacement",
  "Fan and display repairs",
  "Load testing",
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative scroll-mt-0">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 md:pb-24">
        <p className="label mb-6 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          02 — Services
        </p>
        <MaskLines
          className="display max-w-4xl text-[clamp(2.6rem,7vw,6.2rem)] text-bone"
          lines={["Three ways we keep", "you powered."]}
        />
      </div>

      <ServiceCard
        index="01"
        kicker="Buy an inverter"
        heading="Power. Matched to your needs."
        description="Explore new and used inverters for your home, shop, or workspace. We'll help you find the right solution for your requirements."
        cta={{
          label: "Explore Available Inverters",
          href: whatsappUrl("Hello Real Tech, I'd like to explore the inverters you have available."),
        }}
        visual={<BuyVisual />}
        accent="#ff6a13"
      />

      <ServiceCard
        index="02"
        kicker="Sell your inverter"
        heading="Unused? Upgraded? We'll buy it."
        description="Have an old, faulty, or upgraded inverter? Bring it to us for an honest assessment and a fair offer."
        cta={{
          label: "Get an Offer",
          href: whatsappUrl("Hello Real Tech, I have an inverter I'd like to sell. Can you make me an offer?"),
        }}
        visual={<SellVisual />}
        reverse
        accent="#ffb020"
      />

      <ServiceCard
        index="03"
        kicker="Inverter repair"
        heading="Diagnosed. Repaired. Load-tested."
        description="We don't guess. We inspect the components, trace the fault, repair the issue, and test the inverter before handing it back."
        cta={{
          label: "Request a Repair",
          href: whatsappUrl("Hello Real Tech, I'd like to get my inverter inspected and repaired."),
        }}
        visual={<RepairVisual />}
        accent="#4aa8ff"
      >
        <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {REPAIR_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-bone/85">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-arc/50 text-arc">
                <Check size={11} strokeWidth={3} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </ServiceCard>
    </section>
  );
}
