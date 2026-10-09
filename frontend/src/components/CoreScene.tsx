import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Pointer = { x: number; y: number; inside: boolean };

function Core({ pointer }: { pointer: Pointer }) {
  const rig = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const satellites = useRef<THREE.Group>(null);
  const shellEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.35, 1)), []);
  const cageEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.1, 2.1, 2.1)), []);

  useEffect(
    () => () => {
      shellEdges.dispose();
      cageEdges.dispose();
    },
    [shellEdges, cageEdges],
  );

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const focus = pointer.inside ? 1 : 0;

    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, pointer.x * 0.7, 0.06);
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, -pointer.y * 0.45, 0.06);
      rig.current.position.y = Math.sin(t * 0.8) * 0.08;
    }
    if (shell.current) {
      shell.current.rotation.y += dt * (0.25 + focus * 0.35);
      shell.current.rotation.x += dt * 0.08;
    }
    if (inner.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.05 + focus * 0.12;
      inner.current.scale.setScalar(THREE.MathUtils.lerp(inner.current.scale.x, pulse, 0.12));
      inner.current.rotation.y -= dt * 0.6;
    }
    if (rings.current) {
      rings.current.children.forEach((ring, index) => {
        ring.rotation.z += dt * (0.3 + index * 0.18) * (index % 2 === 0 ? 1 : -1);
      });
    }
    if (satellites.current) {
      satellites.current.rotation.y += dt * 0.5;
      satellites.current.rotation.z = Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <group ref={rig}>
      <lineSegments geometry={cageEdges}>
        <lineBasicMaterial color="#d9b8a6" transparent opacity={0.55} />
      </lineSegments>
      <group ref={shell}>
        <lineSegments geometry={shellEdges}>
          <lineBasicMaterial color="#c65a2e" transparent opacity={0.85} />
        </lineSegments>
      </group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color="#c65a2e" emissive="#9a3b16" emissiveIntensity={0.35} roughness={0.35} metalness={0.25} flatShading />
      </mesh>
      <group ref={rings}>
        {[1.75, 2.05].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / 2 + index * 0.5, index * 0.6, 0]}>
            <torusGeometry args={[radius, 0.012, 8, 120]} />
            <meshBasicMaterial color={index === 0 ? "#c65a2e" : "#e7b39a"} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
      <group ref={satellites}>
        {[0, 1, 2, 3].map((index) => {
          const angle = (index / 4) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 2.05, Math.sin(angle) * 0.4, Math.sin(angle) * 2.05]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#1c1612" emissive="#c65a2e" emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

class CoreBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function CoreScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [pointer] = useState<Pointer>(() => ({ x: 0, y: 0, inside: false }));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = wrapper.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
        pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
        pointer.inside = true;
      }}
      onPointerLeave={() => {
        pointer.x = 0;
        pointer.y = 0;
        pointer.inside = false;
      }}
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <CoreBoundary>
        <Canvas
          dpr={[1, 1.75]}
          frameloop={visible ? "always" : "demand"}
          camera={{ position: [0, 0, 6.2], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} />
          <pointLight position={[-3, -1, 3]} color="#ffb48a" intensity={8} distance={10} />
          <Core pointer={pointer} />
        </Canvas>
      </CoreBoundary>
    </div>
  );
}
