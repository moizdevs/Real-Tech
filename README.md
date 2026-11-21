# Real Tech — immersive 3D website

Next.js (App Router) · TypeScript · Tailwind v4 · Three.js / React Three Fiber / Drei · GSAP ScrollTrigger · Lenis · Lucide

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Add the real contact details
Edit `src/config/site.ts`:
- `phone`    → enables the **Call Now** button and footer phone link (hidden while empty)
- `whatsapp` → digits only, e.g. `923001234567`; WhatsApp buttons then open a direct chat
- `social`   → only non-empty links are rendered

## Structure
- `src/components/three/` — procedural inverter model, particles, energy paths, scene rig, scroll layer
- `src/components/sections/` — Hero, PowerIntro, Services (+cards/visuals), InteractiveCircuit, RepairProcess, Diagnostic, Trust, Contact
- `src/lib/sceneState.ts` — per-section camera/object targets the 3D scene tweens between on scroll
