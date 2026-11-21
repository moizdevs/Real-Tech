import { Gauge, Receipt, ScanSearch } from "lucide-react";
import MaskLines from "@/components/ui/MaskLines";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Honest diagnosis",
    body: "We explain what is wrong and what actually needs repair.",
  },
  {
    icon: Gauge,
    title: "Tested under load",
    body: "Repaired equipment is tested before it leaves the workshop.",
  },
  {
    icon: Receipt,
    title: "Fair pricing",
    body: "You understand the repair cost before work begins.",
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="relative py-[14vh]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="label mb-6 flex items-center gap-3" data-r>
          <span className="h-px w-10 bg-volt" />
          06 — How we work
        </p>
        <MaskLines
          className="display text-[clamp(2.6rem,7.6vw,6.8rem)] text-bone"
          lines={["Straight talk.", <span key="t" className="text-volt">Tested work.</span>]}
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              data-r
              className="group relative bg-[#08090b]/90 p-8 backdrop-blur-sm transition-colors duration-500 hover:bg-[#0c0d10] sm:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-volt transition-transform duration-700 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between">
                <span className="relative grid h-14 w-14 place-items-center rounded-xl border border-white/15 text-volt transition-all duration-500 group-hover:border-volt/60 group-hover:shadow-[0_0_30px_rgba(255,106,19,0.35)]">
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="display outline-text text-6xl leading-none">0{i + 1}</span>
              </div>
              <h3 className="display mt-14 text-4xl text-bone">{title}</h3>
              <p className="mt-4 max-w-xs text-[0.98rem] leading-relaxed text-mist">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
