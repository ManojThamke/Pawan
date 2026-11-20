import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import { useExperience, sceneInput } from '../context/Experience';
import { projects } from '../data/portfolio';
import { paintScreen } from './screenTexture';

/* ── palette ─────────────────────────────────────────────── */
const P = {
  bg: '#e9c3a3',
  plaster: '#efd2b8',
  plasterDark: '#e2b996',
  sand: '#e8b68e',
  terra: '#c46b3a',
  terraDeep: '#9c4a24',
  brown: '#452a20',
  cream: '#f7e7d7',
  amber: '#f3a865',
};

type V3 = [number, number, number];
interface Station {
  pos: V3;
  tgt: V3;
}

/** Camera stations per route — [desktop, mobile]. */
const STATIONS: Record<string, [Station, Station]> = {
  home: [
    { pos: [0.5, 4.3, 11.2], tgt: [0.35, 2.85, 0] },
    { pos: [-0.2, 4.4, 16.5], tgt: [-0.1, 3.05, 0] },
  ],
  homeScrolled: [
    { pos: [-0.4, 2.0, 4.9], tgt: [-1.3, 1.3, 0.4] },
    { pos: [-1.6, 2.3, 5.4], tgt: [-1.6, 0.95, 0.5] },
  ],
  projects: [
    { pos: [0.5, 1.75, 3.5], tgt: [-0.85, 1.35, 0.55] },
    { pos: [-1.65, 2.35, 6.0], tgt: [-1.65, 0.62, 0.55] },
  ],
  detail: [
    { pos: [0.9, 1.85, 4.0], tgt: [-0.55, 1.4, 0.55] },
    { pos: [-1.65, 2.5, 6.3], tgt: [-1.65, 0.45, 0.55] },
  ],
  about: [
    { pos: [-0.2, 2.25, 3.2], tgt: [0.15, 2.25, -3.2] },
    { pos: [1.7, 2.0, 4.4], tgt: [1.7, 1.25, -3.2] },
  ],
};

function stationKey(path: string) {
  if (path.startsWith('/projects/')) return 'detail';
  if (path.startsWith('/projects')) return 'projects';
  if (path.startsWith('/about')) return 'about';
  return 'home';
}

const archProbe = new THREE.Vector3();

/* ── shared idle clock: only advances while not paused ───── */
const idle = { t: 0 };

/* ── camera rig ──────────────────────────────────────────── */
function CameraRig() {
  const { camera, size, invalidate } = useThree();
  const { pathname } = useLocation();
  const { paused, reducedMotion } = useExperience();
  const target = useRef(new THREE.Vector3(0, 1.5, 0));
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpTgt = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);

  useEffect(() => {
    (sceneInput as Record<string, unknown>).invalidate = invalidate;
    invalidate();
  }, [invalidate, pathname, paused]);

  useFrame((_, dt) => {
    const mobile = size.width / size.height < 0.85;
    const i = mobile ? 1 : 0;
    const key = stationKey(pathname);
    const s = STATIONS[key][i];
    tmpPos.set(...s.pos);
    tmpTgt.set(...s.tgt);
    if (key === 'home') {
      const k = reducedMotion ? Math.round(sceneInput.scroll) : sceneInput.scroll;
      const e = k * k * (3 - 2 * k);
      const s2 = STATIONS.homeScrolled[i];
      tmpPos.lerp(new THREE.Vector3(...s2.pos), e);
      tmpTgt.lerp(new THREE.Vector3(...s2.tgt), e);
    }
    if (!paused && !reducedMotion) {
      // gentle pointer parallax + breathing drift
      tmpPos.x += sceneInput.pointerX * 0.35 + Math.sin(idle.t * 0.25) * 0.08;
      tmpPos.y += -sceneInput.pointerY * 0.18 + Math.sin(idle.t * 0.33) * 0.04;
    }
    const snap = first.current || reducedMotion;
    const a = snap ? 1 : 1 - Math.exp(-dt * 2.6);
    camera.position.lerp(tmpPos, a);
    target.current.lerp(tmpTgt, a);
    camera.lookAt(target.current);
    first.current = false;
    if (key === 'about') {
      camera.updateMatrixWorld();
      archProbe.set(1.7, 2.35, -3.3).project(camera);
      const root = document.documentElement.style;
      root.setProperty('--arch-x', `${((archProbe.x + 1) / 2) * size.width}px`);
      root.setProperty('--arch-y', `${((1 - archProbe.y) / 2) * size.height}px`);
    }
    if (!paused) idle.t += Math.min(dt, 0.05);
    if (camera.position.distanceTo(tmpPos) > 0.002) invalidate();
  });
  return null;
}

/* ── laptop with live project screen ─────────────────────── */
function Laptop() {
  const { activeProject } = useExperience();
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 960;
    c.height = 560;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { canvas: c, texture: t };
  }, []);
  const { invalidate } = useThree();

  useEffect(() => {
    const paint = () => {
      paintScreen(canvas, projects[activeProject]?.visual ?? 'nids');
      texture.needsUpdate = true;
      invalidate();
    };
    paint();
    // repaint once web fonts have arrived
    document.fonts?.ready.then(paint);
  }, [activeProject, canvas, texture, invalidate]);

  useFrame(() => {
    if (!group.current || !lid.current) return;
    group.current.position.y = 1.02 + Math.sin(idle.t * 1.1) * 0.05;
    group.current.rotation.z = Math.sin(idle.t * 0.7) * 0.02;
    group.current.rotation.y = 0.42 + Math.sin(idle.t * 0.5) * 0.04;
  });

  return (
    <group ref={group} position={[-1.7, 1.02, 0.55]} rotation={[0.08, 0.42, 0]}>
      {/* base */}
      <RoundedBox args={[1.6, 0.07, 1.06]} radius={0.03} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={P.amber} roughness={0.45} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.037, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.38, 0.5]} />
        <meshStandardMaterial color={P.terra} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.037, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.52, 0.28]} />
        <meshStandardMaterial color={'#e9965a'} roughness={0.5} />
      </mesh>
      {/* lid, hinged at back edge */}
      <group ref={lid} position={[0, 0.035, -0.52]} rotation={[-1.86 + Math.PI / 2, 0, 0]}>
        <RoundedBox args={[1.6, 1.0, 0.045]} radius={0.03} smoothness={4} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color={P.amber} roughness={0.45} metalness={0.15} />
        </RoundedBox>
        <mesh position={[0, 0.5, 0.024]}>
          <planeGeometry args={[1.48, 0.88]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ── arched wall with glowing niche ───────────────────────── */
function ArchWall() {
  const geo = useMemo(() => {
    const W = 7.2,
      H = 5.6;
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2, 0);
    shape.lineTo(W / 2, 0);
    shape.lineTo(W / 2, H);
    shape.lineTo(-W / 2, H);
    shape.lineTo(-W / 2, 0);
    const r = 1.05,
      cx = 0,
      base = 0.9,
      top = 3.1;
    const hole = new THREE.Path();
    hole.moveTo(cx - r, base);
    hole.lineTo(cx + r, base);
    hole.lineTo(cx + r, top);
    hole.absarc(cx, top, r, 0, Math.PI, false);
    hole.lineTo(cx - r, base);
    shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 48 });
    return g;
  }, []);
  const lamp = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (lamp.current) lamp.current.position.x = Math.sin(idle.t * 0.8) * 0.05;
  });
  return (
    <group position={[1.7, 0, -3.6]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={P.plaster} roughness={0.95} />
      </mesh>
      {/* niche interior */}
      <mesh position={[0, 2.5, -0.15]}>
        <planeGeometry args={[2.2, 3.4]} />
        <meshStandardMaterial color={P.terraDeep} emissive={P.terra} emissiveIntensity={0.55} roughness={0.9} />
      </mesh>
      {/* vertical fluting inside the niche — horizontal ledges for an original look */}
      {[1.4, 2.2, 3.0].map((y) => (
        <mesh key={y} position={[0, y, 0.05]} castShadow>
          <boxGeometry args={[2.1, 0.06, 0.32]} />
          <meshStandardMaterial color={P.sand} roughness={0.8} />
        </mesh>
      ))}
      {/* crescent lamp */}
      <mesh ref={lamp} position={[0, 3.5, 0.2]}>
        <torusGeometry args={[0.32, 0.035, 16, 64, Math.PI * 1.2]} />
        <meshStandardMaterial color={P.cream} emissive={'#ffd9a8'} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3.2, 0.6]} intensity={6} distance={5} color={'#ffb877'} />
      {/* small glowing data-orbs on ledges */}
      {[
        [-0.6, 1.5],
        [0.5, 2.3],
        [-0.2, 3.1],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.15]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color={'#fff1dc'} emissive={'#ffe2b8'} emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ── bar-chart sculpture ─────────────────────────────────── */
function ChartSculpture() {
  const bars = [0.55, 0.95, 0.7, 1.35, 1.05];
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(() => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const h = bars[i] * (1 + Math.sin(idle.t * 0.9 + i * 0.9) * 0.08);
      m.scale.y = h;
      m.position.y = 0.56 + h / 2;
    });
  });
  return (
    <group position={[1.75, 0, 1.0]} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[2.0, 0.26, 0.9]} radius={0.1} smoothness={4} position={[0, 0.43, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={P.plaster} roughness={0.9} />
      </RoundedBox>
      {bars.map((h, i) => (
        <mesh key={i} ref={(m) => (refs.current[i] = m)} position={[-0.68 + i * 0.34, 0.56 + h / 2, 0]} castShadow>
          <boxGeometry args={[0.22, 1, 0.22]} />
          <meshStandardMaterial color={i === 3 ? P.terra : i % 2 ? P.amber : P.sand} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ── floating data panels ────────────────────────────────── */
function DataPanels() {
  const tex = useMemo(() => {
    const make = (kind: number) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 160;
      const x = c.getContext('2d')!;
      x.fillStyle = '#fbeee2';
      x.fillRect(0, 0, 256, 160);
      if (kind === 0) {
        // scatter / clusters
        for (let i = 0; i < 40; i++) {
          x.fillStyle = i % 3 ? '#e8a777' : '#c46b3a';
          const cx = i % 2 ? 80 : 170;
          x.beginPath();
          x.arc(cx + Math.cos(i * 2.3) * (14 + (i % 5) * 7), 80 + Math.sin(i * 1.7) * (12 + (i % 4) * 8), 5, 0, 7);
          x.fill();
        }
      } else if (kind === 1) {
        // code lines
        const ws = [140, 90, 170, 60, 120, 150, 80];
        ws.forEach((w, i) => {
          x.fillStyle = i % 3 === 0 ? '#c46b3a' : '#d9a37c';
          x.fillRect(22 + (i % 3 === 1 ? 20 : 0), 22 + i * 18, w, 8);
        });
      } else {
        // sparkline
        x.strokeStyle = '#c46b3a';
        x.lineWidth = 6;
        x.lineJoin = 'round';
        x.beginPath();
        [130, 110, 118, 80, 92, 56, 64, 34].forEach((y, i) => (i ? x.lineTo(20 + i * 31, y) : x.moveTo(20, y)));
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    return [make(0), make(1), make(2)];
  }, []);
  const panels: { p: V3; r: V3; s: number; t: number }[] = [
    { p: [-3.6, 3.1, -1.6], r: [0, 0.5, 0.05], s: 0.95, t: 0 },
    { p: [3.9, 3.3, -1.0], r: [0, -0.45, -0.05], s: 0.85, t: 1 },
    { p: [-4.4, 1.6, 0.6], r: [0, 0.7, 0.02], s: 0.7, t: 2 },
  ];
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(() => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = panels[i].p[1] + Math.sin(idle.t * 0.8 + i * 2) * 0.12;
      g.rotation.y = panels[i].r[1] + Math.sin(idle.t * 0.4 + i) * 0.06;
    });
  });
  return (
    <>
      {panels.map((d, i) => (
        <group key={i} ref={(g) => (refs.current[i] = g)} position={d.p} rotation={d.r} scale={d.s}>
          <RoundedBox args={[1.5, 0.98, 0.05]} radius={0.06} smoothness={4} castShadow>
            <meshStandardMaterial color={P.cream} roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.32, 0.82]} />
            <meshStandardMaterial map={tex[d.t]} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ── props ───────────────────────────────────────────────── */
function Props() {
  return (
    <>
      {/* main round stage */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5.6, 5.75, 0.3, 96]} />
        <meshStandardMaterial color={P.plaster} roughness={0.95} />
      </mesh>
      {/* laptop pedestal */}
      <mesh position={[-1.7, 0.58, 0.55]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.1, 0.56, 72]} />
        <meshStandardMaterial color={'#f3dcc6'} roughness={0.9} />
      </mesh>
      {/* stepped terraces, back left */}
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} args={[2.4 - i * 0.6, 0.55, 1.4]} radius={0.12} smoothness={4} position={[-3.3 + i * 0.3, 0.55 + i * 0.55, -2.2]} castShadow receiveShadow>
          <meshStandardMaterial color={i === 1 ? P.plasterDark : P.plaster} roughness={0.95} />
        </RoundedBox>
      ))}
      {/* book stack */}
      {[P.terra, P.cream, P.brown].map((c, i) => (
        <RoundedBox key={i} args={[0.7 - i * 0.05, 0.11, 0.48]} radius={0.02} smoothness={3} position={[-3.15 + i * 0.03, 2.27 + i * 0.12, -2.2]} rotation={[0, 0.25 * (i - 1), 0]} castShadow>
          <meshStandardMaterial color={c} roughness={0.7} />
        </RoundedBox>
      ))}
      {/* potted plant on terrace */}
      <group position={[-3.6, 1.1, -1.75]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.17, 0.5, 32]} />
          <meshStandardMaterial color={P.terra} roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.cos(i * 1.3) * 0.12, 0.75 + (i % 2) * 0.12, Math.sin(i * 1.3) * 0.12]} rotation={[Math.cos(i) * 0.4, i, Math.sin(i) * 0.5]} scale={[0.12, 0.38, 0.05]} castShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={'#a8784f'} roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* orb lamp front right */}
      <group position={[3.7, 0.3, 1.9]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.1, 12]} />
          <meshStandardMaterial color={P.brown} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color={'#fff3e2'} emissive={'#ffd6a0'} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        <pointLight position={[0, 1.2, 0]} intensity={3} distance={4} color={'#ffc58f'} />
      </group>
    </>
  );
}

export default function Workspace() {
  return (
    <>
      <color attach="background" args={[P.bg]} />
      <fog attach="fog" args={[P.bg, 11, 30]} />
      <hemisphereLight args={['#fff1e2', '#d9a27a', 1.25]} />
      <directionalLight
        position={[-5, 9, 6]}
        intensity={1.9}
        color={'#ffe6cc'}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      <CameraRig />
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={'#ecc8a8'} roughness={1} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 6, -4.4]} receiveShadow>
        <planeGeometry args={[60, 14]} />
        <meshStandardMaterial color={'#e7bf9d'} roughness={1} />
      </mesh>
      <Props />
      <ArchWall />
      <Laptop />
      <ChartSculpture />
      <DataPanels />
      <Glints />
    </>
  );
}

function Glints() {
  const { paused } = useExperience();
  return <Sparkles count={70} scale={[14, 7, 9]} position={[0, 3.2, 0]} size={2.6} speed={paused ? 0 : 0.25} opacity={0.85} color={'#fff4df'} />;
}
