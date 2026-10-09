import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const stations = {
  DATA: { caption: "Ingest from every source", target: "services" },
  PIPELINE: { caption: "Clean, transform, orchestrate", target: "services" },
  MODEL: { caption: "Train and serve AI", target: "cortex" },
  INTELLIGENCE: { caption: "Decisions and automation", target: "platform" },
} as const;

type Station = keyof typeof stations;
const stationNames = Object.keys(stations) as Station[];

type Interaction = {
  hovered: Station | null;
  cursor: THREE.Vector3;
  pointerInside: boolean;
  magnet: number;
  flowTime: number;
  flowRate: number;
  dragging: boolean;
  spin: number;
};

type HeroApi = {
  interaction: Interaction;
  hovered: Station | null;
  hover: (name: Station) => void;
  unhover: (name: Station) => void;
  activate: (name: Station, pointerType: string) => void;
  labels: RefObject<Partial<Record<Station, HTMLElement | null>>>;
};

const HeroContext = createContext<HeroApi | null>(null);
const MotionContext = createContext(false);

function useHero() {
  const api = useContext(HeroContext);
  if (!api) throw new Error("PipelineScene parts must render inside PipelineScene.");
  return api;
}

const SAMPLES = 140;
const HALF_WIDTH = 5.9;
const HALF_HEIGHT = 2.65;

// Earlier SVG artboard was 1160 x 320; map it onto world units centred on the artboard.
function fromArtboard(x: number, y: number, z = 0) {
  return new THREE.Vector3((x - 580) / 100, -(y - 200) / 100, z);
}

const mainCurve = new THREE.CatmullRomCurve3([
  fromArtboard(40, 230),
  fromArtboard(180, 198),
  fromArtboard(390, 210),
  fromArtboard(580, 168),
  fromArtboard(760, 190),
  fromArtboard(960, 206),
  fromArtboard(1120, 170),
]);

const backCurve = new THREE.CatmullRomCurve3([
  fromArtboard(70, 250, -0.5),
  fromArtboard(280, 246, -0.5),
  fromArtboard(500, 230, -0.5),
  fromArtboard(760, 202, -0.5),
  fromArtboard(1120, 220, -0.5),
]);

type Wave = { amplitude: number; depth: number; phase: number; speed: number };

const mainWave: Wave = { amplitude: 0.1, depth: 0.45, phase: 0, speed: 0.4 };
const backWave: Wave = { amplitude: 0.08, depth: 0.35, phase: 1.8, speed: 0.32 };

function magnetInfluence(point: THREE.Vector3, interaction: Interaction) {
  if (interaction.magnet < 0.001) return 0;
  const dx = point.x - interaction.cursor.x;
  const dy = point.y - interaction.cursor.y;
  return interaction.magnet * Math.exp(-(dx * dx) / 1.45 - (dy * dy) / 2.4);
}

function wavePoint(
  curve: THREE.CatmullRomCurve3,
  wave: Wave,
  u: number,
  time: number,
  target: THREE.Vector3,
  interaction?: Interaction,
) {
  curve.getPointAt(u, target);
  target.y += Math.sin(u * Math.PI * 3 + time * wave.speed + wave.phase) * wave.amplitude;
  target.z += Math.sin(u * Math.PI * 2 + time * wave.speed * 0.6 + wave.phase) * wave.depth;
  if (interaction) {
    const pull = magnetInfluence(target, interaction);
    if (pull > 0) {
      target.y += THREE.MathUtils.clamp(interaction.cursor.y - target.y, -0.9, 0.9) * pull * 0.85;
      target.z += pull * 0.4;
    }
  }
  return target;
}

function uAtX(curve: THREE.CatmullRomCurve3, x: number) {
  const point = new THREE.Vector3();
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 400; i += 1) {
    const u = i / 400;
    curve.getPointAt(u, point);
    const distance = Math.abs(point.x - x);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = u;
    }
  }
  return best;
}

// One circle per station: DATA, PIPELINE, MODEL (under the bot), INTELLIGENCE.
const nodeUs = [180, 390, 580, 960].map((x) => uAtX(mainCurve, (x - 580) / 100));

const nodeStations: Partial<Record<number, { name: Station; offset: [number, number, number] }>> = {
  0: { name: "DATA", offset: [-0.2, 0.44, 0] },
  1: { name: "PIPELINE", offset: [0, -0.48, 0] },
  3: { name: "INTELLIGENCE", offset: [0, 0.46, 0] },
};

function useReducedMotion() {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
}

function useSceneTime() {
  const { interaction } = useHero();
  return () => interaction.flowTime;
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(198, 90, 46, 0.55)");
    gradient.addColorStop(0.45, "rgba(231, 160, 122, 0.22)");
    gradient.addColorStop(1, "rgba(231, 160, 122, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function useStationHandlers(name: Station) {
  const { hover, unhover, activate } = useHero();
  return {
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (event.nativeEvent.pointerType !== "touch") hover(name);
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => {
      if (event.nativeEvent.pointerType !== "touch") unhover(name);
    },
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      if (event.delta > 6) return;
      activate(name, (event.nativeEvent as PointerEvent).pointerType || "mouse");
    },
  };
}

function HitArea({ name, radius }: { name: Station; radius: number }) {
  const handlers = useStationHandlers(name);
  return (
    <mesh {...handlers}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function Label({ name, offset }: { name: Station; offset: [number, number, number] }) {
  const anchor = useRef<THREE.Group>(null);
  const { labels } = useHero();
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }) => {
    const element = labels.current?.[name];
    if (!anchor.current || !element) return;
    anchor.current.getWorldPosition(world).project(camera);
    const x = (world.x * 0.5 + 0.5) * size.width;
    const y = (-world.y * 0.5 + 0.5) * size.height;
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    element.style.visibility = "visible";
  });

  return <group ref={anchor} position={offset} />;
}

type CurveProps = {
  curve: THREE.CatmullRomCurve3;
  wave: Wave;
  color: string;
  width: number;
  opacity?: number;
  flowSpeed?: number;
};

function FlowingCurve({ curve, wave, color, width, opacity = 0.95, flowSpeed }: CurveProps) {
  const line = useRef<ComponentRef<typeof Line>>(null);
  const time = useSceneTime();
  const { interaction } = useHero();
  const dashed = flowSpeed !== undefined;
  const initial = useMemo(() => {
    const point = new THREE.Vector3();
    return Array.from({ length: SAMPLES + 1 }, (_, i) => wavePoint(curve, wave, i / SAMPLES, 0, point).clone());
  }, [curve, wave]);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const positions = useMemo(() => new Array<number>((SAMPLES + 1) * 3).fill(0), []);

  useFrame((_, delta) => {
    const current = line.current;
    if (!current) return;
    const t = time();
    for (let i = 0; i <= SAMPLES; i += 1) {
      wavePoint(curve, wave, i / SAMPLES, t, scratch, interaction);
      positions[i * 3] = scratch.x;
      positions[i * 3 + 1] = scratch.y;
      positions[i * 3 + 2] = scratch.z;
    }
    current.geometry.setPositions(positions);
    if (dashed) {
      current.computeLineDistances();
      current.material.dashOffset -= Math.min(delta, 0.05) * flowSpeed * interaction.flowRate;
    }
  });

  return (
    <Line
      ref={line}
      points={initial}
      color={color}
      lineWidth={width}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={0.34}
      gapSize={0.4}
    />
  );
}

const TRAIL = 12;
const TRAIL_GAP = 0.016;
const UP = new THREE.Vector3(0, 1, 0);

type StreamProps = {
  curve: THREE.CatmullRomCurve3;
  wave: Wave;
  dashes: number;
  packets: number;
  speed: number;
  glow: THREE.Texture;
  color: string;
  bright?: boolean;
};

// A chain of short strokes plus brighter packets, all travelling the same direction,
// so the line always reads as data passing through it.
function PassingStream({ curve, wave, dashes, packets, speed, glow, color, bright = false }: StreamProps) {
  const dashRefs = useRef<(THREE.Mesh | null)[]>([]);
  const heads = useRef<(THREE.Group | null)[]>([]);
  const trails = useRef<(THREE.Mesh | null)[]>([]);
  const time = useSceneTime();
  const { interaction } = useHero();
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const behind = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const dashFlow = useRef(0);
  const packetFlow = useRef(Array.from({ length: packets }, (_, index) => index / packets));

  const place = (u: number, t: number, target: THREE.Vector3) => {
    const wrapped = ((u % 1) + 1) % 1;
    wavePoint(curve, wave, Math.max(0, wrapped - 0.004), t, behind, interaction);
    wavePoint(curve, wave, Math.min(1, wrapped + 0.004), t, ahead, interaction);
    direction.subVectors(ahead, behind);
    if (direction.lengthSq() > 1e-6) direction.normalize();
    return wavePoint(curve, wave, wrapped, t, target, interaction);
  };

  useFrame((_, delta) => {
    const t = time();
    const step = Math.min(delta, 0.05) * speed * interaction.flowRate;
    dashFlow.current = (dashFlow.current + step) % 1;

    for (let i = 0; i < dashes; i += 1) {
      const mesh = dashRefs.current[i];
      if (!mesh) continue;
      const u = (i / dashes + dashFlow.current) % 1;
      place(u, t, mesh.position);
      if (direction.lengthSq() > 0.5) mesh.quaternion.setFromUnitVectors(UP, direction);
      const fade = Math.sin(u * Math.PI);
      const near = magnetInfluence(mesh.position, interaction);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.min(1, (bright ? 0.72 : 0.45) + fade * 0.28 + near * 0.35);
      const stretch = 1 + near * 1.35;
      mesh.scale.set(1 + near * 0.45, stretch, 1 + near * 0.45);
    }

    for (let p = 0; p < packets; p += 1) {
      const current = packetFlow.current[p];
      const head = heads.current[p];
      if (head) place(current, t, head.position);
      const near = magnetInfluence(head ? head.position : behind, interaction);
      packetFlow.current[p] = (current + step * 1.35 * (1 + near * 1.5)) % 1;
      const fade = Math.sin(current * Math.PI);
      if (head) head.scale.setScalar(0.65 + fade * 0.55);

      for (let j = 1; j <= TRAIL; j += 1) {
        const mesh = trails.current[p * TRAIL + j - 1];
        if (!mesh) continue;
        const u = current - j * TRAIL_GAP;
        mesh.visible = u > 0.01;
        if (!mesh.visible) continue;
        place(u, t, mesh.position);
        mesh.scale.setScalar(fade);
      }
    }
  });

  return (
    <group>
      {Array.from({ length: dashes }, (_, index) => (
        <mesh
          key={`dash-${index}`}
          ref={(element) => {
            dashRefs.current[index] = element;
          }}
        >
          <capsuleGeometry args={[bright ? 0.028 : 0.016, bright ? 0.38 : 0.18, 3, 6]} />
          <meshBasicMaterial color={color} transparent depthWrite={false} />
        </mesh>
      ))}
      {Array.from({ length: packets }, (_, p) => (
        <group key={`packet-${p}`}>
          <group
            ref={(element) => {
              heads.current[p] = element;
            }}
          >
            <mesh>
              <sphereGeometry args={[bright ? 0.09 : 0.055, 16, 16]} />
              <meshBasicMaterial color={bright ? "#9a3b16" : color} />
            </mesh>
            <sprite scale={bright ? [0.85, 0.85, 1] : [0.5, 0.5, 1]}>
              <spriteMaterial map={glow} transparent depthWrite={false} />
            </sprite>
          </group>
          {Array.from({ length: TRAIL }, (_, j) => {
            const falloff = 1 - (j + 1) / (TRAIL + 1);
            return (
              <mesh
                key={j}
                ref={(element) => {
                  trails.current[p * TRAIL + j] = element;
                }}
              >
                <sphereGeometry args={[(bright ? 0.07 : 0.04) * (0.35 + falloff * 0.65), 8, 8]} />
                <meshBasicMaterial color={color} transparent opacity={falloff * 0.7} depthWrite={false} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function Node({ index, glow }: { index: number; glow: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const rippleMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const time = useSceneTime();
  const { interaction } = useHero();
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const u = nodeUs[index];
  const station = nodeStations[index];

  useFrame(() => {
    const t = time();
    group.current?.position.copy(wavePoint(mainCurve, mainWave, u, t, scratch, interaction));

    // A ping travels DATA -> INTELLIGENCE so the nodes fire in sequence like a pipeline.
    const phase = (((t * 0.28 - index * 0.22) % 1) + 1) % 1;
    const flash = Math.pow(1 - phase, 6);

    ripple.current?.scale.setScalar(1 + phase * 1.7);
    if (rippleMaterial.current) rippleMaterial.current.opacity = (1 - phase) * 0.6;
    core.current?.scale.setScalar(1 + flash * 0.6);

    if (halo.current) {
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.45 + flash * 0.55;
    }
  });

  return (
    <group ref={group}>
      <sprite ref={halo} scale={[0.6, 0.6, 1]}>
        <spriteMaterial map={glow} transparent depthWrite={false} />
      </sprite>
      <mesh>
        <ringGeometry args={[0.165, 0.18, 64]} />
        <meshBasicMaterial color="#e7b39a" side={THREE.DoubleSide} transparent opacity={0.95} />
      </mesh>
      <mesh ref={ripple}>
        <ringGeometry args={[0.17, 0.182, 64]} />
        <meshBasicMaterial ref={rippleMaterial} color="#c65a2e" side={THREE.DoubleSide} transparent depthWrite={false} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.045, 18, 18]} />
        <meshBasicMaterial color="#c65a2e" />
      </mesh>
      {station ? (
        <>
          <HitArea name={station.name} radius={0.38} />
          <Label name={station.name} offset={station.offset} />
        </>
      ) : null}
    </group>
  );
}

const BOT_Y = 1.02;
const TAU = Math.PI * 2;

function Bot({ glow }: { glow: THREE.Texture }) {
  const float = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const smile = useRef<THREE.Mesh>(null);
  const antenna = useRef<THREE.Group>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const chest = useRef<THREE.MeshStandardMaterial>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const angle = useRef(0.4);
  const happy = useRef(0);
  const reduce = useContext(MotionContext);
  const { interaction } = useHero();

  useFrame(({ clock }, delta) => {
    const t = reduce ? 0 : clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const active = interaction.hovered === "MODEL";
    const ease = reduce ? 1 : 0.12;
    happy.current = THREE.MathUtils.lerp(happy.current, active ? 1 : 0, ease);
    const h = happy.current;
    const looking = interaction.pointerInside && !reduce;
    const lookX = looking ? THREE.MathUtils.clamp(interaction.cursor.x * 0.12, -0.6, 0.6) : 0;
    const lookY = looking ? THREE.MathUtils.clamp((BOT_Y - interaction.cursor.y) * 0.35, -0.35, 0.35) : 0;

    if (active) {
      const facing = Math.round(angle.current / TAU) * TAU;
      angle.current = THREE.MathUtils.lerp(angle.current, facing + lookX, ease);
    } else if (!reduce) {
      angle.current += dt * 0.55;
    }

    if (body.current) {
      body.current.rotation.y = angle.current + interaction.spin;
      body.current.rotation.z = reduce ? 0 : Math.sin(t * 1.1) * 0.05 * (1 - h);
    }

    if (float.current) {
      const bounce = reduce ? 0 : Math.abs(Math.sin(t * 5.5)) * 0.07 * h;
      float.current.position.y = BOT_Y + (reduce ? 0 : Math.sin(t * 1.3) * 0.06) + bounce;
    }

    if (head.current) {
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, lookY - h * 0.08, ease);
      head.current.rotation.z = THREE.MathUtils.lerp(head.current.rotation.z, reduce ? 0 : Math.sin(t * 2.2) * 0.12 * h, ease);
    }

    if (eyes.current) {
      const blink = !reduce && t % 3.8 < 0.13 ? 0.12 : 1;
      eyes.current.scale.y = THREE.MathUtils.lerp(eyes.current.scale.y, active ? 0.45 : blink, 0.35);
      eyes.current.position.y = THREE.MathUtils.lerp(eyes.current.position.y, active ? 0.035 : 0.02, ease);
    }

    smile.current?.scale.setScalar(Math.max(h, 0.001));

    if (antenna.current && !reduce) antenna.current.rotation.y += dt * (1.2 + h * 9);
    const pulse = reduce ? 0.5 : 0.5 + Math.sin(t * 3) * 0.5;
    if (bulb.current) bulb.current.emissiveIntensity = 0.8 + pulse * 0.8 + h * 2.2;
    if (chest.current) chest.current.emissiveIntensity = 0.6 + pulse * 0.6 + h * 1.4;

    if (rightArm.current) {
      const wave = reduce ? 2.4 : 2.5 + Math.sin(t * 11) * 0.4;
      rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, active ? wave : 0.18, ease);
    }
    if (leftArm.current) {
      const swing = reduce ? 0 : Math.sin(t * 1.6) * 0.12;
      leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, -0.18 - swing - h * 0.25, ease);
    }

    if (halo.current) {
      const material = halo.current.material as THREE.SpriteMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.75 + h * 0.25, ease);
      halo.current.scale.setScalar(THREE.MathUtils.lerp(halo.current.scale.x, 2.2 + h * 0.6, ease));
    }
  });

  return (
    <group ref={float} position={[0, BOT_Y, 0.15]}>
      <sprite ref={halo} scale={[2.2, 2.2, 1]} position={[0, 0, -0.3]}>
        <spriteMaterial map={glow} transparent depthWrite={false} opacity={0.75} />
      </sprite>
      <group ref={body} scale={1.25}>
        <group ref={head} position={[0, 0.3, 0]}>
          <RoundedBox args={[0.64, 0.5, 0.52]} radius={0.14} smoothness={5}>
            <meshStandardMaterial color="#fffaf5" roughness={0.42} />
          </RoundedBox>
          <RoundedBox args={[0.52, 0.32, 0.06]} radius={0.07} smoothness={4} position={[0, 0, 0.24]}>
            <meshStandardMaterial color="#2a1f1a" roughness={0.25} metalness={0.25} />
          </RoundedBox>
          <group ref={eyes} position={[0, 0.02, 0.28]}>
            {[-0.12, 0.12].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <capsuleGeometry args={[0.038, 0.07, 6, 12]} />
                <meshStandardMaterial color="#ffd9c4" emissive="#ff9a66" emissiveIntensity={1.8} toneMapped={false} />
              </mesh>
            ))}
          </group>
          <mesh ref={smile} position={[0, -0.075, 0.28]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.065, 0.014, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#ffd9c4" emissive="#ff9a66" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.07, 24]} />
              <meshStandardMaterial color="#c65a2e" roughness={0.4} />
            </mesh>
          ))}
          <group ref={antenna} position={[0, 0.25, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.16, 10]} />
              <meshStandardMaterial color="#c65a2e" />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <sphereGeometry args={[0.055, 20, 20]} />
              <meshStandardMaterial ref={bulb} color="#ffb48a" emissive="#ff7a3d" emissiveIntensity={1} toneMapped={false} />
            </mesh>
          </group>
        </group>
        <RoundedBox args={[0.44, 0.34, 0.38]} radius={0.11} smoothness={4} position={[0, -0.14, 0]}>
          <meshStandardMaterial color="#fffaf5" roughness={0.42} />
        </RoundedBox>
        <mesh position={[0, -0.12, 0.192]}>
          <circleGeometry args={[0.05, 24]} />
          <meshStandardMaterial ref={chest} color="#ffb48a" emissive="#ff7a3d" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
        {[
          { side: 1, ref: rightArm },
          { side: -1, ref: leftArm },
        ].map(({ side, ref }) => (
          <group key={side} ref={ref} position={[side * 0.26, -0.04, 0]}>
            <mesh position={[0, -0.11, 0]}>
              <capsuleGeometry args={[0.045, 0.13, 6, 12]} />
              <meshStandardMaterial color="#c65a2e" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
      <HitArea name="MODEL" radius={0.85} />
      <Label name="MODEL" offset={[0, 1.18, 0]} />
    </group>
  );
}

function Parallax({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const reduce = useContext(MotionContext);
  const { interaction } = useHero();
  const pointer = useRef({ x: 0, y: 0 });
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;

    // Hovering the header eases the whole pipeline to a stop; leaving resumes it.
    interaction.flowRate = THREE.MathUtils.lerp(interaction.flowRate, interaction.pointerInside ? 0 : 1, 0.08);
    interaction.flowTime += Math.min(delta, 0.05) * interaction.flowRate;

    const drift = Math.sin(interaction.flowTime * 0.25) * 0.05;
    const spinTilt = THREE.MathUtils.clamp(interaction.spin * 0.12, -0.2, 0.2);
    const targetY = pointer.current.x * 0.16 + drift + spinTilt;
    const targetX = -0.16 + pointer.current.y * 0.06;
    const ease = interaction.pointerInside ? 0 : reduce ? 1 : 0.03;
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, targetY, ease);
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, targetX, ease);
    node.position.y = Math.sin(interaction.flowTime * 0.5) * 0.04;

    if (interaction.pointerInside && !reduce) {
      raycaster.setFromCamera(state.pointer, state.camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        interaction.cursor.copy(node.worldToLocal(hit));
      }
    }
    interaction.magnet = 0;

    if (!interaction.dragging) {
      interaction.spin = THREE.MathUtils.lerp(interaction.spin, 0, reduce ? 1 : 0.05);
    }
  });

  return (
    <group ref={group} rotation={[-0.16, 0, 0]}>
      {children}
    </group>
  );
}

function FitCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
    const fitWidth = HALF_WIDTH / (tanHalf * aspect);
    const fitHeight = HALF_HEIGHT / tanHalf;
    const distance = Math.max(fitWidth, fitHeight) * 1.08;
    perspective.position.set(0, distance * 0.08 + 0.35, distance);
    perspective.lookAt(0, 0.45, 0);
    perspective.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

function Scene() {
  const glow = useMemo(() => glowTexture(), []);
  const invalidate = useThree((state) => state.invalidate);
  const { hovered } = useHero();

  useEffect(() => () => glow.dispose(), [glow]);

  useEffect(() => {
    invalidate();
  }, [hovered, invalidate]);

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 5, 6]} intensity={1.8} />
      <pointLight position={[-2, 1.5, 2]} color="#ffb48a" intensity={6} distance={6} />
      <FitCamera />
      <Parallax>
        <FlowingCurve curve={backCurve} wave={backWave} color="#efd3c6" width={1.4} opacity={0.85} />
        <PassingStream curve={backCurve} wave={backWave} dashes={16} packets={3} speed={0.05} glow={glow} color="#e08a62" />
        <FlowingCurve curve={mainCurve} wave={mainWave} color="#e7b39a" width={1.6} opacity={0.55} />
        <PassingStream
          curve={mainCurve}
          wave={mainWave}
          dashes={18}
          packets={4}
          speed={0.07}
          glow={glow}
          color="#c65a2e"
          bright
        />
        {nodeUs.map((_, index) => (
          <Node key={index} index={index} glow={glow} />
        ))}
        <Bot glow={glow} />
      </Parallax>
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function PipelineScene() {
  const reduce = useReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const labels = useRef<Partial<Record<Station, HTMLElement | null>>>({});
  const lastDragX = useRef(0);
  const [interaction] = useState<Interaction>(() => ({
    hovered: null,
    cursor: new THREE.Vector3(999, 999, 0),
    pointerInside: false,
    magnet: 0,
    flowTime: 0,
    flowRate: 1,
    dragging: false,
    spin: 0,
  }));
  const [hovered, setHovered] = useState<Station | null>(null);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(true);

  const setActive = useCallback(
    (name: Station | null) => {
      interaction.hovered = name;
      setHovered(name);
    },
    [interaction],
  );

  const hover = useCallback((name: Station) => setActive(name), [setActive]);

  const unhover = useCallback(
    (name: Station) => {
      if (interaction.hovered === name) setActive(null);
    },
    [interaction, setActive],
  );

  const activate = useCallback(
    (name: Station, pointerType: string) => {
      if (pointerType === "touch" && interaction.hovered !== name) {
        setActive(name);
        return;
      }
      document
        .getElementById(stations[name].target)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [interaction, reduce, setActive],
  );

  useEffect(() => {
    const element = wrapper.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => {
      const dx = event.clientX - lastDragX.current;
      lastDragX.current = event.clientX;
      interaction.spin = THREE.MathUtils.clamp(interaction.spin + dx * 0.012, -2.4, 2.4);
    };
    const onEnd = () => {
      interaction.dragging = false;
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, [dragging, interaction]);

  const api = useMemo<HeroApi>(
    () => ({ interaction, hovered, hover, unhover, activate, labels }),
    [interaction, hovered, hover, unhover, activate],
  );

  return (
    <div
      ref={wrapper}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") interaction.pointerInside = true;
      }}
      onPointerLeave={() => {
        interaction.pointerInside = false;
      }}
      onPointerDown={(event) => {
        if (event.button !== 0 || reduce) return;
        lastDragX.current = event.clientX;
        interaction.dragging = true;
        setDragging(true);
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: dragging ? "grabbing" : hovered ? "pointer" : "grab",
        userSelect: "none",
        background:
          "linear-gradient(to bottom, rgba(246,244,240,0) 0%, rgba(243,221,210,0.55) 48%, rgba(246,244,240,0.1) 100%)",
      }}
    >
      <SceneBoundary>
        {stationNames.map((name) => {
          const active = hovered === name;
          return (
            <button
              key={name}
              type="button"
              ref={(element) => {
                labels.current[name] = element;
              }}
              aria-label={`${name}: ${stations[name].caption}`}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") hover(name);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== "touch") unhover(name);
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onFocus={() => hover(name)}
              onBlur={() => unhover(name)}
              onClick={(event) => activate(name, (event.nativeEvent as PointerEvent).pointerType || "mouse")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: active ? 3 : 2,
                visibility: "hidden",
                transition: "color 200ms ease",
                background: "transparent",
                border: 0,
                padding: "6px 10px",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: active ? "#c65a2e" : "#9a3b16",
                whiteSpace: "nowrap",
                willChange: "transform",
              }}
            >
              {name}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  ...(name === "MODEL"
                    ? {
                        top: "50%",
                        left: "100%",
                        transform: `translate(${active ? 6 : -2}px, -50%)`,
                      }
                    : {
                        top: "100%",
                        left: "50%",
                        transform: `translate(-50%, ${active ? 4 : -2}px)`,
                      }),
                  opacity: active ? 1 : 0,
                  pointerEvents: "none",
                  transition: "opacity 180ms ease, transform 180ms ease",
                  background: "rgba(255,252,249,0.96)",
                  border: "1px solid rgba(28,22,18,0.1)",
                  borderRadius: "10px",
                  boxShadow: "0 12px 28px rgba(28,22,18,0.12)",
                  padding: "7px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: 0,
                  color: "#3f3833",
                }}
              >
                {stations[name].caption}
              </span>
            </button>
          );
        })}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
          <HeroContext.Provider value={api}>
            <MotionContext.Provider value={reduce}>
              <Canvas
                dpr={[1, 1.75]}
                frameloop={visible ? "always" : "demand"}
                camera={{ position: [0, 0.8, 11], fov: 30, near: 0.1, far: 60 }}
                gl={{ antialias: true, alpha: true }}
                onPointerMissed={() => setActive(null)}
                style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
              >
                <Scene />
              </Canvas>
            </MotionContext.Provider>
          </HeroContext.Provider>
        </div>
      </SceneBoundary>
    </div>
  );
}
