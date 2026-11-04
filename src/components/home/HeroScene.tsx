"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   HeroScene — a monumental concrete sculpture rendered live with React Three Fiber.
   • procedural board-formed concrete (generated on a 512px canvas — no network assets)
   • single shadow-casting sun + hemisphere fill, soft PCF shadows on a shadow-only ground
   • intro camera move, idle drift, pointer parallax (desktop), scroll-linked rotation
   • mobile: 1× pixel ratio, 1024 shadow map, no dust, no pointer parallax
   --------------------------------------------------------------------------- */

function mulberry(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeConcrete(seed: number, dark = false) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const r = mulberry(seed);
  const base = dark ? 128 : 176;
  ctx.fillStyle = `rgb(${base},${base - 3},${base - 10})`;
  ctx.fillRect(0, 0, size, size);
  // cloudy variation: many large soft blotches
  for (let i = 0; i < 260; i++) {
    const x = r() * size, y = r() * size, rad = 20 + r() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const t = r() > 0.5 ? "255,255,255" : "0,0,0";
    g.addColorStop(0, `rgba(${t},${0.03 + r() * 0.05})`);
    g.addColorStop(1, `rgba(${t},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // board marks
  const bh = size / 8;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${0.03 + r() * 0.04})`;
    ctx.fillRect(0, i * bh, size, bh);
    ctx.fillStyle = "rgba(30,28,24,0.28)";
    ctx.fillRect(0, i * bh, size, 1.2);
  }
  // tie holes
  for (let x = 0; x < 4; x++)
    for (let y = 0; y < 2; y++) {
      const cx = ((x + 0.5) * size) / 4, cy = ((y * 2 + 1) * size) / 4;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 7);
      g.addColorStop(0, "rgba(25,22,18,0.65)");
      g.addColorStop(1, "rgba(25,22,18,0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - 8, cy - 8, 16, 16);
    }
  // pits
  for (let i = 0; i < 380; i++) {
    ctx.fillStyle = `rgba(25,22,18,${0.12 + r() * 0.25})`;
    ctx.beginPath();
    ctx.arc(r() * size, r() * size, 0.5 + r() * 1.4, 0, 7);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** sun position for an hour of the day (06–20). Noon is overhead; the day arcs east → west. */
function sunPos(h: number): [number, number, number] {
  const a = ((h - 6) / 14) * Math.PI;
  return [Math.cos(a) * -24, Math.sin(a) * 20 + 2.5, 12];
}

function Block({ size, pos, mat }: { size: [number, number, number]; pos: [number, number, number]; mat: THREE.Material }) {
  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(...size);
    const uv = g.attributes.uv, n = g.attributes.normal;
    for (let i = 0; i < uv.count; i++) {
      const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i));
      const [w, h, d] = size;
      const [a, b] = nx > 0.5 ? [d, h] : ny > 0.5 ? [w, d] : [w, h];
      uv.setXY(i, (uv.getX(i) * a) / 3, (uv.getY(i) * b) / 3);
    }
    return g;
  }, [size]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh geometry={geo} material={mat} position={pos} castShadow receiveShadow />;
}

function Sculpture({ play, pointer, scroll, reduced, coarse, rtl, hour }: { hour: number; rtl: boolean; play: boolean; pointer: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number>; reduced: boolean; coarse: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const hourRef = useRef(hour);
  const warm = useMemo(() => new THREE.Color(), []);
  const cool = useMemo(() => new THREE.Color(0xfff4e6), []);
  const hot = useMemo(() => new THREE.Color(0xff8f4f), []);
  const top = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const { camera, size, invalidate } = useThree();
  const t0 = useRef<number | null>(null);
  const cur = useRef({ x: 0, y: 0 });

  const mats = useMemo(() => {
    const light = makeConcrete(3);
    const dark = makeConcrete(9, true);
    return {
      light: new THREE.MeshStandardMaterial({ map: light, roughness: 0.95, metalness: 0 }),
      dark: new THREE.MeshStandardMaterial({ map: dark, roughness: 0.97 }),
      timber: new THREE.MeshStandardMaterial({ color: 0x9a6a42, roughness: 0.7 }),
    };
  }, []);
  useEffect(() => () => { Object.values(mats).forEach((m) => { (m.map as THREE.Texture | null)?.dispose(); m.dispose(); }); }, [mats]);

  const dustGeo = useMemo(() => {
    const r = mulberry(7), n = coarse ? 0 : 140, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = (r() - 0.5) * 34; a[i * 3 + 1] = r() * 18; a[i * 3 + 2] = (r() - 0.5) * 34; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, [coarse]);
  useEffect(() => () => dustGeo.dispose(), [dustGeo]);

  // framing: pushes the sculpture right on desktop, lower on mobile
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const portrait = size.width < size.height * 0.9 || size.width < 820;
    if (portrait) cam.setViewOffset(size.width, size.height, 0, -size.height * 0.02, size.width, size.height);
    else cam.setViewOffset(size.width, size.height, (rtl ? 1 : -1) * size.width * 0.21, -size.height * 0.03, size.width, size.height);
    // eslint-disable-next-line react-hooks/immutability -- r3f cameras are mutable by design
    cam.fov = portrait ? 38 : 30;
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate, rtl]);

  useEffect(() => {
    hourRef.current = hour;
    if (reduced) { const l = sun.current; if (l) { l.position.set(...sunPos(hour)); } invalidate(); }
  }, [hour, reduced, invalidate]);

  const rest = useMemo(() => new THREE.Vector3(18, 9.4, 24.6), []);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (play && t0.current === null) t0.current = t;
    const k = reduced ? 1 : play ? Math.min(1, (t - (t0.current ?? t)) / 3.2) : 0;
    const e = 1 - Math.pow(1 - k, 4); // easeOutQuart
    const p = pointer.current ?? { x: 0, y: 0 };
    cur.current.x += (p.x - cur.current.x) * 0.05;
    cur.current.y += (p.y - cur.current.y) * 0.05;
    const s = scroll.current ?? 0;
    const drift = reduced ? 0 : Math.sin(t * 0.15) * 0.04;
    g.rotation.y = -0.9 * (1 - e) + drift + cur.current.x * 0.16 + s * 0.9;
    g.scale.setScalar(0.82 + 0.18 * e);
    g.position.y = -2 * (1 - e) - s * 1.2;
    const dist = 1 + (1 - e) * 0.55 + s * 0.15;
    camera.position.set(rest.x * dist, rest.y * dist + cur.current.y * -0.8 + (1 - e) * 4, rest.z * dist);
    camera.lookAt(0.3, 4.7, 0);
    // exploded-axon: the upper slabs lift away as you scroll
    if (top.current) top.current.position.y = (reduced ? 0 : Math.sin(t * 0.4) * 0.08) + s * 2.6;
    // time of day: the sun travels east → west, warming at the edges of the day
    const L = sun.current;
    if (L) {
      const target = sunPos(hourRef.current);
      const k = reduced ? 1 : 0.06;
      L.position.x += (target[0] - L.position.x) * k;
      L.position.y += (target[1] - L.position.y) * k;
      L.position.z += (target[2] - L.position.z) * k;
      const a = ((hourRef.current - 6) / 14) * Math.PI;
      const w = Math.pow(1 - Math.sin(a), 1.6);
      warm.copy(cool).lerp(hot, w);
      L.color.lerp(warm, 0.1);
      L.intensity = 0.9 + 2.5 * Math.sin(a);
      if (hemi.current) hemi.current.intensity = 0.45 + 0.35 * Math.sin(a);
    }
    if (dust.current && !reduced) dust.current.rotation.y = t * 0.01;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={[0xfff6ea, 0x8a8478, 0.75]} />
      <directionalLight ref={sun} position={[-14, 20, 12]} intensity={3.2} color={0xfff0dc} castShadow shadow-mapSize={coarse ? [1024, 1024] : [2048, 2048]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-camera-near={1} shadow-camera-far={80} shadow-bias={-0.0003} shadow-normalBias={0.03} shadow-radius={5} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
      <group ref={group}>
        <Block size={[7, 0.6, 7]} pos={[0, 0.3, 0]} mat={mats.dark} />
        <Block size={[3.2, 8.4, 3.2]} pos={[-1.8, 4.8, 0]} mat={mats.light} />
        <Block size={[3.2, 5.2, 3.2]} pos={[1.9, 3.2, 0]} mat={mats.light} />
        <Block size={[1.4, 4.2, 3]} pos={[0, 3, 0]} mat={mats.timber} />
        <group ref={top}>
          <Block size={[7.8, 1.5, 3.6]} pos={[0, 8.4, 0]} mat={mats.light} />
          <Block size={[4.4, 1.2, 3.4]} pos={[3.4, 6.6, 0]} mat={mats.dark} />
          <Block size={[2.2, 0.5, 6.4]} pos={[-2.6, 9.4, 0.2]} mat={mats.light} />
        </group>
      </group>
      {!coarse && (
        <points ref={dust} geometry={dustGeo}>
          <pointsMaterial size={0.06} color={0xfff0dc} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
        </points>
      )}
    </>
  );
}

export default function HeroScene({ play, active, reduced, coarse, rtl, hour, onReady, scroll }: { hour: number; rtl: boolean; play: boolean; active: boolean; reduced: boolean; coarse: boolean; onReady: () => void; scroll: React.RefObject<number> }) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (coarse || reduced) return;
    const m = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", m, { passive: true });
    return () => window.removeEventListener("pointermove", m);
  }, [coarse, reduced]);
  return (
    <Canvas
      shadows="soft"
      dpr={coarse ? [1, 1.5] : [1, 1.75]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      camera={{ fov: 30, near: 0.1, far: 200, position: [18, 9.4, 24.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.setClearColor(0x000000, 0);
        onReady();
      }}
      aria-hidden="true"
    >
      <Sculpture play={play} pointer={pointer} scroll={scroll} reduced={reduced} coarse={coarse} rtl={rtl} hour={hour} />
    </Canvas>
  );
}
