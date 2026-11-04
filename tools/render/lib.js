// Shared helpers for the MONOLITH architectural visualisation pipeline.
import * as THREE from "three";

// ---------- deterministic randomness ----------
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valueNoise(size, cells, rand) {
  const g = [];
  for (let i = 0; i <= cells; i++) {
    g[i] = [];
    for (let j = 0; j <= cells; j++) g[i][j] = rand();
  }
  const out = new Float32Array(size * size);
  const sm = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cells,
        fy = (y / size) * cells;
      const x0 = Math.floor(fx) % cells,
        y0 = Math.floor(fy) % cells;
      const tx = sm(fx - Math.floor(fx)),
        ty = sm(fy - Math.floor(fy));
      const a = g[x0][y0],
        b = g[x0 + 1][y0],
        c = g[x0][y0 + 1],
        d = g[x0 + 1][y0 + 1];
      out[y * size + x] = a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
    }
  return out;
}

function fbm(size, seed, octaves = [4, 8, 16, 32, 64], weights = [0.5, 0.3, 0.2, 0.15, 0.1]) {
  const rand = rng(seed);
  const acc = new Float32Array(size * size);
  let wsum = 0;
  octaves.forEach((o, i) => {
    const n = valueNoise(size, o, rand);
    const w = weights[i] ?? 0.1;
    wsum += w;
    for (let k = 0; k < acc.length; k++) acc[k] += n[k] * w;
  });
  for (let k = 0; k < acc.length; k++) acc[k] /= wsum;
  return acc;
}

function canvasFrom(size, painter) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  painter(ctx, size);
  return c;
}

function toTex(canvas, repeat = [1, 1], srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shade(ctx, size, noise, base, amp, extra) {
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < noise.length; i++) {
    const n = (noise[i] - 0.5) * amp;
    img.data[i * 4] = Math.max(0, Math.min(255, base[0] + n));
    img.data[i * 4 + 1] = Math.max(0, Math.min(255, base[1] + n));
    img.data[i * 4 + 2] = Math.max(0, Math.min(255, base[2] + n));
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  extra && extra(ctx, size);
}

// ---------- procedural material maps ----------
export function concreteMaps(seed = 3, opts = {}) {
  const { base = [176, 173, 165], boards = true, ties = true, repeat = [1, 1], amp = 46 } = opts;
  const size = 1024;
  const noise = fbm(size, seed);
  const rand = rng(seed + 11);
  const color = canvasFrom(size, (ctx) =>
    shade(ctx, size, noise, base, amp, (c) => {
      if (boards) {
        const bh = size / 8;
        for (let i = 0; i < 8; i++) {
          c.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "0,0,0"},${0.025 + rand() * 0.04})`;
          c.fillRect(0, i * bh, size, bh);
          c.fillStyle = "rgba(40,38,34,0.22)";
          c.fillRect(0, i * bh, size, 1.5);
        }
      }
      if (ties) {
        for (let x = 0; x < 4; x++)
          for (let y = 0; y < 4; y++) {
            const cx = size * (x + 0.5) / 4, cy = size * (y + 0.5) / 4;
            const g = c.createRadialGradient(cx, cy, 0, cx, cy, 11);
            g.addColorStop(0, "rgba(30,28,24,0.55)");
            g.addColorStop(0.6, "rgba(30,28,24,0.25)");
            g.addColorStop(1, "rgba(30,28,24,0)");
            c.fillStyle = g;
            c.beginPath();
            c.arc(cx, cy, 11, 0, 7);
            c.fill();
          }
      }
      for (let i = 0; i < 700; i++) {
        c.fillStyle = `rgba(30,28,24,${0.1 + rand() * 0.25})`;
        c.beginPath();
        c.arc(rand() * size, rand() * size, 0.6 + rand() * 1.8, 0, 7);
        c.fill();
      }
    })
  );
  return { map: toTex(color, repeat), bump: toTex(color, repeat, false) };
}

export function stoneMaps(seed = 9, base = [214, 200, 178], repeat = [1, 1]) {
  const size = 1024;
  const noise = fbm(size, seed, [3, 6, 12, 40, 90], [0.5, 0.35, 0.25, 0.2, 0.12]);
  const rand = rng(seed);
  const color = canvasFrom(size, (ctx) =>
    shade(ctx, size, noise, base, 38, (c) => {
      for (let i = 0; i < 40; i++) {
        c.strokeStyle = `rgba(${rand() > 0.5 ? "120,96,70" : "255,248,235"},${0.06 + rand() * 0.1})`;
        c.lineWidth = 0.6 + rand() * 2.2;
        c.beginPath();
        let y = rand() * size;
        c.moveTo(0, y);
        for (let x = 0; x <= size; x += 64) {
          y += (rand() - 0.5) * 8;
          c.lineTo(x, y);
        }
        c.stroke();
      }
      // joints of ashlar blocks
      c.strokeStyle = "rgba(70,56,40,0.35)";
      c.lineWidth = 2;
      for (let r = 0; r < 4; r++) {
        c.beginPath();
        c.moveTo(0, (r * size) / 4);
        c.lineTo(size, (r * size) / 4);
        c.stroke();
        for (let k = 0; k < 3; k++) {
          const x = ((k + (r % 2) * 0.5) * size) / 3;
          c.beginPath();
          c.moveTo(x, (r * size) / 4);
          c.lineTo(x, ((r + 1) * size) / 4);
          c.stroke();
        }
      }
    })
  );
  return { map: toTex(color, repeat), bump: toTex(color, repeat, false) };
}

export function timberMaps(seed = 5, base = [150, 104, 66], repeat = [1, 1], planks = 6) {
  const size = 1024;
  const rand = rng(seed);
  const noise = fbm(size, seed, [2, 4, 8, 16], [0.4, 0.3, 0.2, 0.1]);
  const color = canvasFrom(size, (ctx) => {
    const pw = size / planks;
    for (let p = 0; p < planks; p++) {
      const tone = (rand() - 0.5) * 34;
      for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < pw; x += 2) {
          const gx = p * pw + x;
          const ring = Math.sin((gx * 0.35 + noise[y * size + gx] * 22 + y * 0.012) * 1) * 0.5 + 0.5;
          const grain = (ring - 0.5) * 38 + (noise[y * size + gx] - 0.5) * 40 + tone;
          ctx.fillStyle = `rgb(${base[0] + grain},${base[1] + grain * 0.8},${base[2] + grain * 0.6})`;
          ctx.fillRect(gx, y, 2, 2);
        }
      }
      ctx.fillStyle = "rgba(25,15,8,0.55)";
      ctx.fillRect(p * pw, 0, 2, size);
    }
    // fine streaks
    for (let i = 0; i < 500; i++) {
      ctx.strokeStyle = `rgba(40,24,12,${0.04 + rand() * 0.08})`;
      ctx.lineWidth = 0.5 + rand();
      const x = rand() * size;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (rand() - 0.5) * 6, size);
      ctx.stroke();
    }
  });
  return { map: toTex(color, repeat), bump: toTex(color, repeat, false) };
}

export function metalMaps(seed = 21, base = [150, 144, 132], repeat = [1, 1]) {
  const size = 1024;
  const rand = rng(seed);
  const noise = fbm(size, seed, [2, 5, 10], [0.5, 0.3, 0.1]);
  const color = canvasFrom(size, (ctx) => {
    shade(ctx, size, noise, base, 18, (c) => {
      // brushed streaks
      for (let i = 0; i < 2200; i++) {
        c.strokeStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "0,0,0"},${0.02 + rand() * 0.05})`;
        c.lineWidth = 0.5 + rand() * 1.2;
        const y = rand() * size;
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(size, y + (rand() - 0.5) * 3);
        c.stroke();
      }
      // standing seams
      for (let x = 0; x < 6; x++) {
        c.fillStyle = "rgba(15,14,12,0.55)";
        c.fillRect((x * size) / 6 - 2, 0, 4, size);
        c.fillStyle = "rgba(255,255,255,0.18)";
        c.fillRect((x * size) / 6 + 2, 0, 2, size);
      }
    });
  });
  return { map: toTex(color, repeat), bump: toTex(color, repeat, false) };
}

export function groundMaps(seed = 31, base = [182, 176, 162], repeat = [30, 30], grain = 70) {
  const size = 1024;
  const rand = rng(seed);
  const noise = fbm(size, seed, [8, 16, 32, 64, 128], [0.3, 0.3, 0.3, 0.3, 0.3]);
  const color = canvasFrom(size, (ctx) =>
    shade(ctx, size, noise, base, grain, (c) => {
      for (let i = 0; i < 9000; i++) {
        c.fillStyle = `rgba(${rand() > 0.5 ? "250,246,236" : "60,54,44"},${0.1 + rand() * 0.25})`;
        c.fillRect(rand() * size, rand() * size, 1 + rand() * 2.2, 1 + rand() * 2.2);
      }
    })
  );
  return { map: toTex(color, repeat), bump: toTex(color, repeat, false) };
}

// ---------- materials ----------
export function mats() {
  const concrete = concreteMaps(3, { repeat: [1, 1] });
  const concreteDark = concreteMaps(4, { base: [118, 116, 110], repeat: [1, 1] });
  const stone = stoneMaps(9, [214, 198, 172]);
  const timber = timberMaps(5);
  const timberDark = timberMaps(8, [92, 62, 40]);
  const metal = metalMaps(21);
  const m = {
    concrete: new THREE.MeshStandardMaterial({ map: concrete.map, bumpMap: concrete.bump, bumpScale: 1.6, roughness: 0.92, metalness: 0 }),
    concreteDark: new THREE.MeshStandardMaterial({ map: concreteDark.map, bumpMap: concreteDark.bump, bumpScale: 1.6, roughness: 0.95 }),
    stone: new THREE.MeshStandardMaterial({ map: stone.map, bumpMap: stone.bump, bumpScale: 1.4, roughness: 0.9 }),
    timber: new THREE.MeshStandardMaterial({ map: timber.map, bumpMap: timber.bump, bumpScale: 0.8, roughness: 0.72 }),
    timberDark: new THREE.MeshStandardMaterial({ map: timberDark.map, bumpMap: timberDark.bump, bumpScale: 0.8, roughness: 0.7 }),
    metal: new THREE.MeshStandardMaterial({ map: metal.map, bumpMap: metal.bump, bumpScale: 0.6, roughness: 0.42, metalness: 0.85 }),
    steelBlack: new THREE.MeshStandardMaterial({ color: 0x1c1d1b, roughness: 0.5, metalness: 0.8 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9fb1ad, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.32, envMapIntensity: 1.6, side: THREE.DoubleSide }),
    glow: new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
    glowSoft: new THREE.MeshStandardMaterial({ color: 0xffe2b3, emissive: 0xffc27a, emissiveIntensity: 1.6, roughness: 0.9 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x25302f, roughness: 0.02, metalness: 0.1, envMapIntensity: 1.8 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf1eee7, roughness: 0.96 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x59664a, roughness: 1 }),
    leaf2: new THREE.MeshStandardMaterial({ color: 0x6d7a58, roughness: 1 }),
    moss: new THREE.MeshStandardMaterial({ color: 0x4a5640, roughness: 1 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x3a2f27, roughness: 1 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xa66d4e, roughness: 0.45, metalness: 0.9 }),
  };
  return m;
}

export function ground(mat, size = 400, repeat = 60, y = 0) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mat.map && mat.map.repeat.set(repeat, repeat);
  mat.bumpMap && mat.bumpMap.repeat.set(repeat, repeat);
  g.rotation.x = -Math.PI / 2;
  g.position.y = y;
  g.receiveShadow = true;
  return g;
}

// ---------- builders ----------
export function box(parent, w, h, d, x, y, z, mat, { cast = true, receive = true, name } = {}) {
  const geo = new THREE.BoxGeometry(w, h, d);
  // world-scaled UVs so textures keep a constant density regardless of box size
  const uv = geo.attributes.uv;
  const nrm = geo.attributes.normal;
  const sc = 1 / 3; // 1 texture tile per 3m
  for (let i = 0; i < uv.count; i++) {
    const nx = Math.abs(nrm.getX(i)), ny = Math.abs(nrm.getY(i));
    let u, v;
    if (nx > 0.5) { u = d; v = h; } else if (ny > 0.5) { u = w; v = d; } else { u = w; v = h; }
    uv.setXY(i, uv.getX(i) * u * sc, uv.getY(i) * v * sc);
  }
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = receive;
  if (name) m.name = name;
  parent.add(m);
  return m;
}

export function cyl(parent, rt, rb, h, x, y, z, mat, seg = 48, open = false) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open), mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}

export function slats(parent, count, w, h, d, x0, y, z, step, mat, axis = "x") {
  const geo = new THREE.BoxGeometry(w, h, d);
  const im = new THREE.InstancedMesh(geo, mat, count);
  const o = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    if (axis === "x") o.position.set(x0 + i * step, y, z);
    else o.position.set(x0, y, z + i * step);
    o.updateMatrix();
    im.setMatrixAt(i, o.matrix);
  }
  im.castShadow = im.receiveShadow = true;
  parent.add(im);
  return im;
}

export function tree(parent, x, z, mats, scale = 1, seed = 1) {
  return null; // foliage intentionally omitted: abstract, material-led visualisation style
  const r = rng(seed);
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.2 * scale, 3 * scale, 8), mats.trunk);
  trunk.position.y = 1.5 * scale;
  trunk.castShadow = true;
  g.add(trunk);
  for (let i = 0; i < 9; i++) {
    const s = (0.9 + r() * 0.9) * scale;
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), r() > 0.5 ? mats.leaf : mats.leaf2);
    blob.position.set((r() - 0.5) * 2.4 * scale, (3.2 + r() * 1.6) * scale, (r() - 0.5) * 2.4 * scale);
    blob.castShadow = true;
    blob.receiveShadow = true;
    g.add(blob);
  }
  g.position.set(x, 0, z);
  parent.add(g);
  return g;
}

// ---------- sky, light & environment ----------
export function sky(scene, renderer, { top = 0xaab7c4, horizon = 0xf0e6d6, ground: gcol = 0xc9c2b4, sunDir = [-0.5, 0.35, 0.8], sunColor = 0xfff0d8, sunStrength = 3.1, hemi = 0.55, fog = 0.0035, exposure = 1.0, shadowSize = 40, shadowTarget = [0, 0, 0] } = {}) {
  const skyGeo = new THREE.SphereGeometry(900, 32, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { top: { value: new THREE.Color(top) }, horizon: { value: new THREE.Color(horizon) }, sunDir: { value: new THREE.Vector3(...sunDir).normalize() }, sunColor: { value: new THREE.Color(sunColor) } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 horizon; uniform vec3 sunDir; uniform vec3 sunColor;
      void main(){ float h = clamp(vP.y,0.0,1.0); vec3 c = mix(horizon, top, pow(h,0.55));
        float s = max(dot(normalize(vP), sunDir),0.0); c += sunColor * (pow(s,64.0)*0.55 + pow(s,6.0)*0.16);
        gl_FragColor = vec4(c,1.0); }`,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyMesh);
  scene.fog = new THREE.FogExp2(horizon, fog);

  // environment map from the sky itself (for glass / metal / water reflections)
  const pm = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(skyGeo, skyMat));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: gcol }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  envScene.add(floor);
  scene.environment = pm.fromScene(envScene, 0.02).texture;
  scene.environmentIntensity = 0.55;

  const hemiL = new THREE.HemisphereLight(top, gcol, hemi);
  scene.add(hemiL);
  const sun = new THREE.DirectionalLight(sunColor, sunStrength);
  const d = new THREE.Vector3(...sunDir).normalize().multiplyScalar(80);
  sun.position.set(shadowTarget[0] + d.x, shadowTarget[1] + d.y, shadowTarget[2] + d.z);
  sun.target.position.set(...shadowTarget);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  const c = sun.shadow.camera;
  c.left = -shadowSize; c.right = shadowSize; c.top = shadowSize; c.bottom = -shadowSize; c.near = 1; c.far = 220;
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.04;
  sun.shadow.radius = 5;
  scene.add(sun, sun.target);
  renderer.toneMappingExposure = exposure;
  return { sun, hemiL };
}

export function makeRenderer(w, h) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

export { THREE };
