export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="7" fill="none" stroke="rgba(255,255,255,0.28)" />
        <path d="M18.5 4 8 18.2h6.4L12.8 28 24 13h-6.6L18.5 4Z" fill="#ff6a13" />
      </svg>
      <span className="display text-[1.35rem] leading-none tracking-[0.06em] text-bone">
        REAL<span className="text-volt"> </span>TECH
      </span>
    </span>
  );
}
