"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

const MODEL = "/models/wheel3.glb";

// Largest dimension of the tyre, in world units, after normalising.
const TYRE_SIZE = 1.77;

function Tyre({
  progress,
  trigger,
}: {
  progress: RefObject<number>;
  trigger: number;
}) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(MODEL);
  const { invalidate } = useThree();

  useEffect(() => {
    invalidate();
  }, [trigger, invalidate]);

  // Normalise the model's size, and orient its axle towards the camera (+Z)
  // so it can roll like a wheel. The axle is the smallest bounding-box axis.
  const { scale, baseRotation } = useMemo(() => {
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const minDim = Math.min(size.x, size.y, size.z);

    let baseRotation: [number, number, number] = [0, 0, 0];
    if (minDim === size.x)
      baseRotation = [0, Math.PI / 2, 0]; // axle along X -> rotate onto Z
    else if (minDim === size.y)
      baseRotation = [Math.PI / 2, 0, 0]; // axle along Y -> rotate onto Z
    // else axle already along Z

    return { scale: TYRE_SIZE / maxDim, baseRotation };
  }, [scene]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const p = progress.current ?? 0;

    // Start half-off the left edge, finish half-off the right edge.
    const left = -state.viewport.width / 2; // centre on the left edge -> half hidden
    const right = state.viewport.width / 2; // centre on the right edge -> half hidden
    g.position.x = left + (right - left) * p;

    // Roll like a wheel: rotate about the axle (Z), clockwise as it moves right.
    g.rotation.z = -p * Math.PI * 6;
  });

  return (
    <group ref={ref}>
      <group rotation={baseRotation} scale={scale}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);

export default function TyreCanvas({
  progress,
  trigger,
}: {
  progress: RefObject<number>;
  trigger: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop="demand"
    >
      {/* Self-contained lighting — no remote HDR fetch. */}
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.4} groundColor="#222" />
      <directionalLight position={[5, 6, 5]} intensity={2.2} />
      <directionalLight position={[-6, -2, -4]} intensity={0.8} color="#88aaff" />

      <Suspense fallback={null}>
        <Tyre progress={progress} trigger={trigger} />
      </Suspense>
    </Canvas>
  );
}
