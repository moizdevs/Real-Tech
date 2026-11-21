"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";

function radialTexture(inner: string, outer: string, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
export function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, speeds, map } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const orange = new THREE.Color("#ff7a26");
    const blue = new THREE.Color("#5fb0ff");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -6 + Math.random() * 9;
      speeds[i] = 0.08 + Math.random() * 0.22;
      const c = Math.random() < 0.78 ? orange : blue;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, speeds, map: radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)") };
  }, [count]);

  useFrame(({ clock }, delta) => {
    const pts = ref.current;
    if (!pts || reduced) return;
    const t = clock.elapsedTime;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * delta;
      if (y > 5.5) y = -5.5;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.3 + i) * 0.0009);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={map}
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
type Path = { pts: [number, number, number][]; color: string; speed: number; offset: number; reverse?: boolean };

const PATHS: Path[] = [
  {
    pts: [[1.0, -0.5, 0.4], [2.2, -0.15, 1.0], [3.4, 0.7, 0.3], [4.8, 0.5, -1.2], [7, 1.2, -3]],
    color: "#ff6a13",
    speed: 0.14,
    offset: 0,
  },
  {
    pts: [[-1.0, 0.3, 0.4], [-2.3, -0.2, 1.1], [-3.4, -0.9, 0.2], [-5, -0.6, -1.4], [-7, -1.4, -3]],
    color: "#ff6a13",
    speed: 0.12,
    offset: 0.4,
    reverse: true,
  },
  {
    pts: [[0.6, 1.4, 0.3], [1.4, 2.3, 0.9], [2.4, 2.9, 0.2], [4, 3.2, -1.5]],
    color: "#4aa8ff",
    speed: 0.17,
    offset: 0.7,
  },
  {
    pts: [[-0.5, -1.4, 0.5], [-1.4, -2.2, 1.0], [-2.8, -2.7, 0.2], [-4.4, -3, -1.5]],
    color: "#4aa8ff",
    speed: 0.15,
    offset: 0.2,
    reverse: true,
  },
];

function Pulse({ path, reduced }: { path: Path; reduced: boolean }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(path.pts.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.5),
    [path],
  );
  const points = useMemo(() => curve.getPoints(90), [curve]);
  const head = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const spriteMap = useMemo(() => radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)"), []);

  useFrame(({ clock }) => {
    if (!head.current) return;
    const raw = reduced ? 0.55 : (clock.elapsedTime * path.speed + path.offset) % 1;
    const t = path.reverse ? 1 - raw : raw;
    curve.getPoint(t, tmp);
    head.current.position.copy(tmp);
    const fade = Math.sin(raw * Math.PI);
    head.current.scale.setScalar(0.4 + fade * 0.9);
  });

  return (
    <group>
      <Line points={points} color={path.color} lineWidth={1} transparent opacity={0.22} />
      <group ref={head}>
        <mesh>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={path.color} toneMapped={false} />
        </mesh>
        <sprite scale={[0.7, 0.7, 0.7]}>
          <spriteMaterial
            map={spriteMap}
            color={path.color}
            transparent
            opacity={0.35}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>
    </group>
  );
}

export function EnergyPaths({ reduced }: { reduced: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    if (ring.current) ring.current.rotation.z += delta * 0.25;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.18;
  });

  return (
    <group>
      {PATHS.map((p, i) => (
        <Pulse key={i} path={p} reduced={reduced} />
      ))}
      <mesh ref={ring} position={[0, -1.7, 0]} rotation={[Math.PI / 2.05, 0, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 160]} />
        <meshBasicMaterial color="#ff6a13" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} position={[0, -1.7, 0]} rotation={[Math.PI / 2.05, 0, 0]}>
        <torusGeometry args={[3.0, 0.004, 8, 160]} />
        <meshBasicMaterial color="#4aa8ff" transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
export function Backdrop() {
  const glowMap = useMemo(
    () => radialTexture("rgba(255,255,255,0.9)", "rgba(255,255,255,0)", 256),
    [],
  );
  const shadowMap = useMemo(() => radialTexture("rgba(0,0,0,0.85)", "rgba(0,0,0,0)", 256), []);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const floor = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.3) * 0.08;
    if (glow.current) glow.current.opacity = 0.2 * sceneState.glow * pulse;
    if (floor.current) floor.current.opacity = 0.28 * sceneState.glow * pulse;
  });

  return (
    <group>
      {/* halo behind the product */}
      <mesh position={[0, 0.1, -1.4]}>
        <planeGeometry args={[8.5, 8.5]} />
        <meshBasicMaterial
          ref={glow}
          map={glowMap}
          color="#ff6a13"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* contact shadow + floor glow beneath the suspended unit */}
      <mesh position={[0, -2.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 4.6]} />
        <meshBasicMaterial map={shadowMap} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.6, 5.6]} />
        <meshBasicMaterial
          ref={floor}
          map={glowMap}
          color="#ff6a13"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* light beams */}
      <mesh position={[-1.2, 3.2, -0.6]} rotation={[0, 0, 0.18]}>
        <coneGeometry args={[1.5, 8, 32, 1, true]} />
        <meshBasicMaterial
          color="#4aa8ff"
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[1.4, 3.2, -0.8]} rotation={[0, 0, -0.16]}>
        <coneGeometry args={[1.2, 8, 32, 1, true]} />
        <meshBasicMaterial
          color="#ff8f45"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
