import { ElementType, ReactNode } from "react";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** "now" animates on load; default animates when scrolled into view. */
  trigger?: "now" | "scroll";
  delay?: number;
  lineClassNames?: string[];
};

/** Headline where each line slides up out of its own mask. Animated by <Motion />. */
export default function MaskLines({
  lines,
  as: Tag = "h2",
  className = "",
  trigger = "scroll",
  delay = 0,
  lineClassNames = [],
}: Props) {
  return (
    <Tag className={className} data-mask={trigger} data-delay={delay}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span className={lineClassNames[i] ?? ""}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
