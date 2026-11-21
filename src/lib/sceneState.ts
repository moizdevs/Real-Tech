/**
 * Shared, mutable scene state. GSAP tweens these values on scroll; the R3F scene
 * reads them every frame. Keeping this outside React avoids re-renders entirely.
 */
export type SceneTargets = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotX: number;
  /** 1 = continuous slow rotation, 0 = settle facing front and only sway. */
  spin: number;
  sway: number;
  glow: number;
  opacity: number;
};

export const sceneState: SceneTargets & {
  mx: number;
  my: number;
  scroll: number;
  invalidate: (() => void) | null;
} = {
  x: 1.9,
  y: -0.15,
  z: 0,
  scale: 1.15,
  rotX: 0.04,
  spin: 1,
  sway: 0.2,
  glow: 1,
  opacity: 1,
  mx: 0,
  my: 0,
  scroll: 0,
  invalidate: null,
};

type Pair = { d: Partial<SceneTargets>; m: Partial<SceneTargets> };

export const SCENE_STATES: Record<string, Pair> = {
  hero: {
    d: { x: 1.9, y: -0.15, z: 0, scale: 1.15, rotX: 0.04, spin: 1, sway: 0.2, glow: 1, opacity: 1 },
    m: { x: 0, y: 1.05, z: -0.5, scale: 0.8, rotX: 0.04, spin: 1, sway: 0.2, glow: 1, opacity: 1 },
  },
  intro: {
    d: { x: 0, y: -0.2, z: -4, scale: 1, rotX: 0.02, spin: 0.5, sway: 0.3, glow: 1.8, opacity: 0.5 },
    m: { x: 0, y: 0.4, z: -5, scale: 0.9, rotX: 0.02, spin: 0.5, sway: 0.3, glow: 1.6, opacity: 0.3 },
  },
  services: {
    d: { x: 3.7, y: 0, z: -3, scale: 0.8, rotX: 0.05, spin: 0, sway: 0.45, glow: 0.8, opacity: 0.26 },
    m: { x: 0, y: 0, z: -4, scale: 0.8, rotX: 0.05, spin: 0, sway: 0.45, glow: 0.6, opacity: 0.12 },
  },
  lab: {
    d: { x: 0, y: 0, z: -8, scale: 0.4, rotX: 0, spin: 0, sway: 0.2, glow: 0.4, opacity: 0 },
    m: { x: 0, y: 0, z: -8, scale: 0.4, rotX: 0, spin: 0, sway: 0.2, glow: 0.4, opacity: 0 },
  },
  process: {
    d: { x: 0, y: 0, z: -5, scale: 0.8, rotX: 0.03, spin: 0.3, sway: 0.3, glow: 0.9, opacity: 0.14 },
    m: { x: 0, y: 0, z: -5, scale: 0.8, rotX: 0.03, spin: 0.3, sway: 0.3, glow: 0.9, opacity: 0.08 },
  },
  problems: {
    d: { x: 0, y: 0, z: -8, scale: 0.4, rotX: 0, spin: 0, sway: 0.2, glow: 0.4, opacity: 0 },
    m: { x: 0, y: 0, z: -8, scale: 0.4, rotX: 0, spin: 0, sway: 0.2, glow: 0.4, opacity: 0 },
  },
  trust: {
    d: { x: 3.5, y: -0.1, z: -2, scale: 0.85, rotX: 0.04, spin: 0.2, sway: 0.4, glow: 1.1, opacity: 0.5 },
    m: { x: 0, y: 0, z: -4, scale: 0.8, rotX: 0.04, spin: 0.2, sway: 0.4, glow: 0.8, opacity: 0.12 },
  },
  contact: {
    d: { x: 2.3, y: 0.1, z: 0, scale: 1.15, rotX: 0.03, spin: 0, sway: 0.12, glow: 2, opacity: 1 },
    m: { x: 0, y: 1.5, z: -0.5, scale: 0.7, rotX: 0.03, spin: 0, sway: 0.12, glow: 1.6, opacity: 0.35 },
  },
};
