"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const W = 2.0;
const H = 2.7;
const D = 1.0;

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function useMaterials() {
  return useMemo(() => {
    const display = canvasTexture(512, 256, (ctx, w, h) => {
      ctx.fillStyle = "#04080b";
      ctx.fillRect(0, 0, w, h);
      // faint grid
      ctx.strokeStyle = "rgba(74,168,255,0.07)";
      for (let x = 0; x < w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.fillStyle = "#ff8f45";
      ctx.font = "700 132px 'Courier New', monospace";
      ctx.textBaseline = "middle";
      ctx.fillText("230", 28, h / 2 - 8);
      ctx.fillStyle = "rgba(255,143,69,0.7)";
      ctx.font = "600 34px 'Courier New', monospace";
      ctx.fillText("V", 292, h / 2 + 22);
      // battery bar
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 3;
      ctx.strokeRect(340, 70, 140, 60);
      ctx.fillRect(480, 86, 10, 28);
      ctx.fillStyle = "#4aa8ff";
      for (let i = 0; i < 4; i++) ctx.fillRect(348 + i * 33, 78, 27, 44);
      // status line
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "600 26px 'Courier New', monospace";
      ctx.fillText("MAINS  ·  OUTPUT  ·  BATT", 28, h - 36);
      // scanlines
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1.5);
    });

    const label = canvasTexture(1024, 256, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#f2efea";
      ctx.font = "800 130px 'Arial Narrow', Arial, sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      try {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = "18px";
      } catch {
        /* older browsers */
      }
      ctx.fillText("REAL TECH", w / 2, h / 2 - 10);
      ctx.fillStyle = "#ff6a13";
      ctx.fillRect(w / 2 - 70, h - 38, 140, 6);
    });

    return {
      display,
      label,
      shell: new THREE.MeshPhysicalMaterial({
        color: "#1d1f24",
        metalness: 0.85,
        roughness: 0.36,
        clearcoat: 0.35,
        clearcoatRoughness: 0.35,
      }),
      bezel: new THREE.MeshPhysicalMaterial({
        color: "#0b0c0f",
        metalness: 0.3,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
      steel: new THREE.MeshStandardMaterial({ color: "#9a9da5", metalness: 1, roughness: 0.28 }),
      dark: new THREE.MeshStandardMaterial({ color: "#030304", metalness: 0.2, roughness: 0.9 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#0f0f10", metalness: 0, roughness: 0.85 }),
      volt: new THREE.MeshStandardMaterial({
        color: "#ff6a13",
        emissive: "#ff6a13",
        emissiveIntensity: 2.4,
        toneMapped: false,
      }),
      arc: new THREE.MeshStandardMaterial({
        color: "#4aa8ff",
        emissive: "#4aa8ff",
        emissiveIntensity: 2.2,
        toneMapped: false,
      }),
      white: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
      displayMat: new THREE.MeshBasicMaterial({ map: display, toneMapped: false }),
      labelMat: new THREE.MeshBasicMaterial({ map: label, transparent: true, toneMapped: false }),
    };
  }, []);
}

export default function Inverter() {
  const m = useMaterials();
  const led = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (led.current) {
      const mat = led.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 2.4) * 1.1;
    }
  });

  const frontZ = D / 2;
  const frontSlots = Array.from({ length: 8 }, (_, i) => -0.52 - i * 0.085);
  const topSlats = Array.from({ length: 11 }, (_, i) => -0.4 + i * 0.08);
  const backSlats = Array.from({ length: 10 }, (_, i) => -0.2 - i * 0.09);

  return (
    <group>
      {/* chassis */}
      <RoundedBox args={[W, H, D]} radius={0.09} smoothness={4} material={m.shell} />

      {/* front bezel */}
      <RoundedBox
        args={[W - 0.16, H - 0.16, 0.05]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, frontZ + 0.015]}
        material={m.bezel}
      />

      {/* label */}
      <mesh position={[0, 1.13, frontZ + 0.045]} material={m.labelMat}>
        <planeGeometry args={[0.95, 0.2375]} />
      </mesh>

      {/* display recess + screen */}
      <mesh position={[0, 0.66, frontZ + 0.042]} material={m.steel}>
        <boxGeometry args={[1.28, 0.7, 0.01]} />
      </mesh>
      <mesh position={[0, 0.66, frontZ + 0.05]} material={m.dark}>
        <boxGeometry args={[1.24, 0.66, 0.012]} />
      </mesh>
      <mesh position={[0, 0.66, frontZ + 0.058]} material={m.displayMat}>
        <planeGeometry args={[1.2, 0.6]} />
      </mesh>

      {/* buttons */}
      {[-0.5, 0, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.1, frontZ + 0.06]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 32]} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, frontZ + 0.052]} rotation={[0, 0, 0]} material={m.volt}>
        <torusGeometry args={[0.135, 0.012, 12, 48]} />
      </mesh>

      {/* status LEDs */}
      <mesh ref={led} position={[-0.38, -0.16, frontZ + 0.055]} material={m.volt.clone()}>
        <sphereGeometry args={[0.03, 16, 16]} />
      </mesh>
      <mesh position={[0, -0.16, frontZ + 0.055]} material={m.arc}>
        <sphereGeometry args={[0.03, 16, 16]} />
      </mesh>
      <mesh position={[0.38, -0.16, frontZ + 0.055]} material={m.white}>
        <sphereGeometry args={[0.03, 16, 16]} />
      </mesh>

      {/* front vent slots */}
      {frontSlots.map((y) => (
        <mesh key={y} position={[0, y, frontZ + 0.045]} material={m.dark}>
          <boxGeometry args={[1.3, 0.035, 0.02]} />
        </mesh>
      ))}

      {/* glowing edge strip */}
      <mesh position={[0, -1.2, frontZ + 0.045]} material={m.volt}>
        <boxGeometry args={[1.5, 0.022, 0.02]} />
      </mesh>

      {/* top grille */}
      <mesh position={[0, H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.dark}>
        <planeGeometry args={[1.4, 0.92]} />
      </mesh>
      {topSlats.map((z) => (
        <mesh key={z} position={[0, H / 2 + 0.006, z]} material={m.steel}>
          <boxGeometry args={[1.3, 0.008, 0.03]} />
        </mesh>
      ))}

      {/* right side: ports + breaker */}
      <group position={[W / 2 + 0.001, -0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={m.dark}>
          <planeGeometry args={[0.8, 1.2]} />
        </mesh>
        {[0.3, -0.05].map((y) => (
          <RoundedBox key={y} args={[0.34, 0.2, 0.04]} radius={0.03} position={[-0.12, y, 0.015]} material={m.rubber} />
        ))}
        <mesh position={[0.22, 0.3, 0.02]} material={m.volt}>
          <boxGeometry args={[0.14, 0.26, 0.04]} />
        </mesh>
        <mesh position={[0.22, -0.2, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 20]} />
        </mesh>
      </group>

      {/* back panel */}
      <group position={[0, 0, -D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[0.42, 0.3, 0.05]} radius={0.03} position={[0.45, 0.8, 0.02]} material={m.dark} />
        <mesh position={[-0.45, 0.8, 0.02]} material={m.volt}>
          <boxGeometry args={[0.16, 0.24, 0.05]} />
        </mesh>
        {backSlats.map((y) => (
          <mesh key={y} position={[0, y, 0.01]} material={m.dark}>
            <boxGeometry args={[1.4, 0.04, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* feet */}
      {[
        [-0.8, -0.36],
        [0.8, -0.36],
        [-0.8, 0.36],
        [0.8, 0.36],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -H / 2 - 0.04, z]} material={m.rubber}>
          <cylinderGeometry args={[0.1, 0.11, 0.08, 20]} />
        </mesh>
      ))}
    </group>
  );
}
