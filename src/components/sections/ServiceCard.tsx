import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import MaskLines from "@/components/ui/MaskLines";
import Button from "@/components/ui/Button";

type Props = {
  index: string;
  kicker: string;
  heading: string;
  description: string;
  cta: { label: string; href: string };
  visual: ReactNode;
  reverse?: boolean;
  children?: ReactNode;
  accent?: string;
};

/** One full-width service "chapter": big numeral, copy, and its own interactive visual. */
export default function ServiceCard({
  index,
  kicker,
  heading,
  description,
  cta,
  visual,
  reverse,
  children,
  accent = "#ff6a13",
}: Props) {
  return (
    <article className="relative border-t border-white/10 py-16 md:py-24">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <div className="flex items-end gap-5" data-r>
            <span
              className="display outline-text text-[clamp(5rem,12vw,9rem)] leading-[0.8]"
              style={{ WebkitTextStrokeColor: `${accent}88` }}
            >
              {index}
            </span>
            <span className="label mb-2" style={{ color: accent }}>
              {kicker}
            </span>
          </div>

          <MaskLines
            className="display mt-8 text-[clamp(2.4rem,5.4vw,4.6rem)] text-bone"
            lines={[heading]}
          />

          <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-mist" data-r>
            {description}
          </p>

          {children && (
            <div className="mt-8" data-r>
              {children}
            </div>
          )}

          <div className="mt-10" data-r>
            <Button href={cta.href} external variant="ghost">
              {cta.label}
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        <div data-r>{visual}</div>
      </div>
    </article>
  );
}
