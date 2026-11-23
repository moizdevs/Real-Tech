"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Inverter from "./Inverter";
import { Backdrop, EnergyPaths, Particles } from "./Effects";
import { sceneState } from "@/lib/sceneState";

type Props = { lowPower: boolean; reduced: boolean };

const TAU = Math.PI * 2;

function Rig({ reduced }: { reduced: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.SpotLight>(null);
  const spinAngle = useRef(0.6);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    sceneState.invalidate = invalidate;
    const onMove = (e: PointerEvent) => {
      sceneState.mx = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    invalidate();
    return () => {
      window.removeEventListener("pointermove", onMove);
      sceneState.invalidate = null;
    };
  }, [invalidate]);

  useFrame(({ clock, invalidate: inv }, delta) => {
    const s = sceneState;
    // fully hidden → stop rendering until GSAP wakes us again
    if (s.opacity < 0.02) return;

    const t = reduced ? 0 : clock.elapsedTime;
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;

    // position / scale (targets are tweened by GSAP) + gentle float
    o.position.set(s.x, s.y + Math.sin(t * 0.9) * 0.07, s.z);
    o.scale.setScalar(s.scale);

    // yaw: continuous spin when s.spin≈1, otherwise settle to front + sway
    if (!reduced) spinAngle.current += delta * 0.32 * s.spin;
    const nearest = Math.round(spinAngle.current / TAU) * TAU;
    spinAngle.current += (nearest - spinAngle.current) * Math.min(1, delta * 2.2) * (1 - s.spin);

    const sway = Math.sin(t * 0.5) * s.sway;
    // swing around the front so the display is always readable, like a product shot
    const swing = Math.sin(t * 0.38) * 0.55 * Math.max(s.spin, 0.25);
    const targetYaw = swing + sway + s.mx * 0.35;
    const targetPitch = s.rotX + s.my * 0.12;
    i.rotation.y += (targetYaw - i.rotation.y) * Math.min(1, delta * 4);
    i.rotation.x += (targetPitch - i.rotation.x) * Math.min(1, delta * 4);

    // camera parallax
    camera.position.x += (s.mx * 0.45 - camera.position.x) * Math.min(1, delta * 2);
    camera.position.y += (0.2 - s.my * 0.25 - camera.position.y) * Math.min(1, delta * 2);
    camera.lookAt(0, 0, 0);

    if (keyLight.current) keyLight.current.intensity = 140 * (0.6 + s.glow * 0.4);

    inv();
  });

  return (
    <>
      <group ref={outer}>
        <group ref={inner}>
          <Inverter />
        </group>
        <Backdrop />
        <EnergyPaths reduced={reduced} />
      </group>
      <spotLight
        ref={keyLight}
        position={[3, 5, 7]}
        angle={0.6}
        penumbra={1}
        intensity={140}
        color="#ffe2cc"
        distance={30}
        decay={2}
      />
      <pointLight position={[-5, 1, 3]} intensity={25} color="#4aa8ff" distance={16} decay={2} />
      <pointLight position={[5, 0.5, -3]} intensity={55} color="#ff6a13" distance={16} decay={2} />
    </>
  );
}

export default function InverterScene({ lowPower, reduced }: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.2, 9], fov: 34, near: 0.1, far: 60 }}
      gl={{
        antialias: !lowPower,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <Environment resolution={128} frames={1} environmentIntensity={1.5}>
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 5, 2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={5} color="#ff6a13" position={[6, 0, -2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#4aa8ff" position={[-6, 1, -2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={3} color="#ffe6d2" position={[0, 0, 6]} scale={5} />
      </Environment>
      <Particles count={lowPower ? 90 : 260} reduced={reduced} />
      <Rig reduced={reduced} />
    </Canvas>
  );
}
