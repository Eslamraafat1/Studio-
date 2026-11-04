import { THREE, box, cyl, slats, tree, sky, ground, groundMaps, concreteMaps, stoneMaps, timberMaps, metalMaps, rng } from "./lib.js";

function person(parent, x, z, h = 1.75, y = 0, color = 0x2b2c2a) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, h - 0.55, 4, 10), mat);
  body.position.set(x, y + (h - 0.2) / 2 + 0.1, z);
  body.castShadow = true;
  parent.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshStandardMaterial({ color: 0xc8a58a, roughness: 0.9 }));
  head.position.set(x, y + h - 0.05, z);
  head.castShadow = true;
  parent.add(head);
}

function palm(parent, x, z, m, h = 8, seed = 1) {
  const r = rng(seed);
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, h, 8), new THREE.MeshStandardMaterial({ color: 0x6f5a45, roughness: 1 }));
  trunk.position.y = h / 2;
  trunk.castShadow = true;
  g.add(trunk);
  const fm = new THREE.MeshStandardMaterial({ color: 0x4f6240, roughness: 0.9, side: THREE.DoubleSide });
  for (let i = 0; i < 11; i++) {
    const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 3.6, 1, 4), fm);
    const a = (i / 11) * Math.PI * 2 + r() * 0.3;
    frond.position.set(Math.cos(a) * 1.3, h + 0.1 - Math.abs(Math.sin(i)) * 0.3, Math.sin(a) * 1.3);
    frond.rotation.set(Math.PI / 2 - 0.45, 0, 0);
    const holder = new THREE.Group();
    holder.add(frond);
    frond.position.set(0, 0.0, 1.7);
    frond.rotation.x = -Math.PI / 2 + 0.55;
    holder.rotation.y = a;
    holder.position.y = h;
    holder.children[0].castShadow = true;
    g.add(holder);
  }
  g.position.set(x, 0, z);
  parent.add(g);
}

function lattice(parent, w, h, x, y, z, mat, ry = 0, cell = 0.32) {
  const g = new THREE.Group();
  const nx = Math.floor(w / cell), ny = Math.floor(h / cell);
  const geo = new THREE.BoxGeometry(cell * 0.62, cell * 0.62, 0.3);
  // alternating cell pattern gives a mashrabiya feel
  const items = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) if ((i + j) % 2 === 0 || (i % 4 === 0)) items.push([i, j]);
  const im = new THREE.InstancedMesh(geo, mat, items.length);
  const o = new THREE.Object3D();
  items.forEach(([i, j], k) => {
    o.position.set(-w / 2 + (i + 0.5) * cell, -h / 2 + (j + 0.5) * cell, 0);
    o.rotation.z = Math.PI / 4;
    o.updateMatrix();
    im.setMatrixAt(k, o.matrix);
  });
  im.castShadow = im.receiveShadow = true;
  g.add(im);
  // frame
  const t = 0.18;
  [[w, t, 0, h / 2], [w, t, 0, -h / 2], [t, h, w / 2, 0], [t, h, -w / 2, 0]].forEach(([fw, fh, fx, fy]) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.4), mat);
    f.position.set(fx, fy, 0);
    f.castShadow = true;
    g.add(f);
  });
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
}

// =====================================================================
// 01 — THE SILENT HOUSE (Kyoto)
// =====================================================================
function silent(scene, renderer, m) {
  sky(scene, renderer, { top: 0xa3b3c2, horizon: 0xf3e6d2, ground: 0xb8ae9a, sunDir: [-0.55, 0.32, 0.78], sunStrength: 3.4, hemi: 0.5, fog: 0.011, exposure: 1.05, shadowSize: 34, shadowTarget: [2, 0, 2] });
  const gm = groundMaps(31, [176, 170, 156], [1, 1], 60);
  const gmat = new THREE.MeshStandardMaterial({ map: gm.map, bumpMap: gm.bump, bumpScale: 2, roughness: 1 });
  scene.add(ground(gmat, 500, 80));
  const g = new THREE.Group();
  scene.add(g);
  box(g, 27, 0.5, 13, 1, 0.25, 0, m.concrete);
  box(g, 29, 0.38, 15, 1, 4.25, 0, m.concrete);
  box(g, 28.4, 0.12, 14.4, 1, 3.98, 0, m.timber, { cast: false });
  box(g, 7, 3.55, 9.4, -9.5, 2.275, -1.5, m.concreteDark);
  // glazed living volume
  box(g, 17, 3.45, 0.06, 3.5, 2.22, 4.9, m.glass, { cast: false });
  box(g, 17, 3.45, 0.06, 3.5, 2.22, -3.3, m.timberDark);
  box(g, 17, 0.1, 8.2, 3.5, 0.55, 0.8, m.timber, { cast: false });
  box(g, 15.6, 3.2, 0.08, 3.5, 2.2, -3.2, m.glowSoft, { cast: false });
  slats(g, 85, 0.08, 3.45, 0.08, -4.6, 2.22, 4.95, 0.2, m.steelBlack);
  // timber slat screen
  slats(g, 46, 0.07, 3.6, 0.16, 6.2, 2.3, 6.6, 0.18, m.timber);
  // deck
  box(g, 22, 0.14, 3, 2, 0.57, 6.4, m.timber);
  // stepping stones
  const r = rng(4);
  for (let i = 0; i < 8; i++) {
    const s = cyl(g, 0.5 + r() * 0.15, 0.55, 0.12, -6 + i * 0.9 + (r() - 0.5) * 0.4, 0.06, 20 - i * 1.8 + (r() - 0.5) * 0.5, m.stone, 24);
    s.scale.z = 0.9 + r() * 0.3;
  }
  for (let i = 0; i < 9; i++) {
    const mo = new THREE.Mesh(new THREE.SphereGeometry(0.9 + r() * 0.7, 16, 12), m.moss);
    mo.scale.y = 0.35;
    mo.position.set(-10 + r() * 24, 0.1, 9 + r() * 7);
    mo.receiveShadow = mo.castShadow = true;
    g.add(mo);
  }
  tree(g, 14, 10.5, m, 1.7, 3);
  tree(g, -14, 11, m, 1.3, 7);
  tree(g, 21, -3, m, 2, 11);
  tree(g, -19, -6, m, 1.9, 13);
  person(g, 3, 6.5, 1.72, 0.65);
  const l1 = new THREE.PointLight(0xffc27a, 90, 22, 1.6);
  l1.position.set(3, 2.2, 1);
  scene.add(l1);
  return [
    { pos: [-21, 1.7, 30], look: [3, 2.6, 0], fov: 30, w: 2400, h: 1350 },
    { pos: [17, 1.6, 15], look: [1, 2.6, 2], fov: 36, w: 2400, h: 1350 },
    { pos: [2, 1.4, 21], look: [3, 2.7, 0], fov: 38, w: 1500, h: 2000 },
    { pos: [-5, 2.0, 11], look: [3, 2.6, 5], fov: 30, w: 2400, h: 1350 },
  ];
}

// =====================================================================
// 02 — CONCRETE HORIZON (Copenhagen)
// =====================================================================
function horizon(scene, renderer, m) {
  sky(scene, renderer, { top: 0x8e99a5, horizon: 0xdcdcd9, ground: 0x9aa0a0, sunDir: [-0.3, 0.55, 0.6], sunColor: 0xf3efe6, sunStrength: 1.9, hemi: 0.95, fog: 0.0042, exposure: 1.1, shadowSize: 60, shadowTarget: [0, 0, -10] });
  m.water.color.set(0x66777a); m.water.roughness = 0.12;
  const water = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), m.water);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.3;
  scene.add(water);
  const g = new THREE.Group();
  scene.add(g);
  const qm = concreteMaps(7, { base: [150, 149, 144], boards: false, ties: false });
  const quay = new THREE.MeshStandardMaterial({ map: qm.map, bumpMap: qm.bump, bumpScale: 1, roughness: 1 });
  box(g, 90, 1, 26, 0, 0.0, 18, quay);
  box(g, 40, 6, 16, -22, 3.5, -4, m.concreteDark);
  // two slabs + glazing = the horizon bar
  box(g, 84, 1.3, 14, 8, 7.8, -4, m.concrete);
  box(g, 84, 1.3, 14, 8, 13.9, -4, m.concrete);
  box(g, 83.6, 4.8, 0.08, 8, 10.85, 2.6, m.glass, { cast: false });
  box(g, 83, 4.6, 0.1, 8, 10.85, -2.5, m.glowSoft, { cast: false });
  slats(g, 28, 0.35, 4.8, 0.7, -32, 10.85, 3.0, 3, m.concrete);
  // roof parapet + fins
  box(g, 84, 0.5, 0.5, 8, 14.8, 3, m.concrete);
  // ramp
  const ramp = box(g, 4, 0.5, 28, 26, 3.2, 8, m.concrete);
  ramp.rotation.x = -0.12;
  ramp.position.y = 3.0;
  box(g, 30, 4.5, 14, 36, 2.8, -6, m.concreteDark);
  // steps down to water
  for (let i = 0; i < 6; i++) box(g, 30, 0.35, 1.6 - i * 0.1, -6, 0 - i * 0.28, 32 + i * 1.4, quay);
  // posts / bollards
  for (let i = 0; i < 12; i++) cyl(g, 0.18, 0.18, 1, -40 + i * 7.5, 0.9, 29.5, m.steelBlack, 12);
  const r = rng(2);
  for (let i = 0; i < 9; i++) person(g, -22 + r() * 44, 20 + r() * 7, 1.6 + r() * 0.2, 0.5);
  const l = new THREE.PointLight(0xffd7a0, 120, 60, 1.5);
  l.position.set(8, 10, -2);
  scene.add(l);
  return [
    { pos: [-34, 3.2, 44], look: [8, 9.5, -4], fov: 40, w: 2400, h: 1350 },
    { pos: [18, 1.6, 31], look: [6, 10, -4], fov: 52, w: 2400, h: 1350 },
    { pos: [4, 1.6, 31], look: [4, 11, -4], fov: 58, w: 1500, h: 2000 },
    { pos: [66, 5, 16], look: [8, 8.5, -5], fov: 34, w: 2400, h: 1350 },
  ];
}

// =====================================================================
// 03 — THE COURTYARD (Cairo)
// =====================================================================
function courtyard(scene, renderer, m) {
  sky(scene, renderer, { top: 0x9db8cf, horizon: 0xf6e4c8, ground: 0xd2b88f, sunDir: [-0.45, 0.78, 0.45], sunColor: 0xfff1d6, sunStrength: 3.8, hemi: 0.55, fog: 0.0024, exposure: 1.05, shadowSize: 30, shadowTarget: [0, 0, 0] });
  const sand = groundMaps(41, [208, 184, 148], [1, 1], 50);
  const gmat = new THREE.MeshStandardMaterial({ map: sand.map, bumpMap: sand.bump, bumpScale: 1.5, roughness: 1 });
  scene.add(ground(gmat, 500, 90));
  const g = new THREE.Group();
  scene.add(g);
  const S = m.stone;
  const H = 9, T = 1.4, L = 17; // half extent
  box(g, L * 2 + T, H, T, 0, H / 2, -L, S);
  box(g, L * 2 + T, H, T, 0, H / 2, L, S);
  box(g, T, H, L * 2, -L, H / 2, 0, S);
  box(g, T, H, L * 2, L, H / 2, 0, S);
  // gallery blocks inside walls (two-storey arcade)
  const cols = 6;
  for (let side = 0; side < 4; side++) {
    const grp = new THREE.Group();
    for (let i = 0; i < cols; i++) cyl(grp, 0.34, 0.34, 6.2, -9 + (i * 18) / (cols - 1), 3.1, 0, S, 24);
    box(grp, 21, 0.6, 3.2, 0, 6.5, 0.4, S);
    box(grp, 21, 0.2, 3.4, 0, 6.9, 0.4, m.timberDark);
    slats(grp, 50, 0.1, 0.16, 3.4, -10.4, 7.12, 0.4, 0.42, m.timberDark);
    grp.rotation.y = (side * Math.PI) / 2;
    const ang = (side * Math.PI) / 2;
    grp.position.set(Math.sin(ang) * -1 * (L - 2.7) * -1, 0, Math.cos(ang) * -1 * (L - 2.7));
    g.add(grp);
  }
  // mashrabiya panels on the walls inside
  for (let i = 0; i < 3; i++) lattice(g, 4.4, 5.2, -9 + i * 9, 3.8, -L + 0.9, m.timberDark, 0);
  for (let i = 0; i < 3; i++) lattice(g, 4.4, 5.2, -9 + i * 9, 3.8, L - 0.9, m.timberDark, Math.PI);
  // courtyard floor + pool
  box(g, L * 2 - 4, 0.3, L * 2 - 4, 0, 0.15, 0, m.stone);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), m.water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = 0.32;
  scene.add(pool);
  [[-5.4, 0, 0.5, 10.8], [5.4, 0, 0.5, 10.8], [0, -5.4, 11.4, 0.5], [0, 5.4, 11.4, 0.5]].forEach(([x, z, w, d]) => box(g, w, 0.35, d, x, 0.4, z, m.stone));
  // central pavilion screen
  lattice(g, 6, 6, 0, 3.4, -2, m.timberDark, 0, 0.3);
  // palms
  palm(g, -9, 9, m, 9, 1);
  palm(g, 9, 9.5, m, 7.5, 2);
  palm(g, 9, -9, m, 10, 3);
  tree(g, -9, -9, m, 1.3, 5);
  person(g, 3, 8, 1.7, 0.3, 0x3a2f27);
  person(g, -7, 2, 1.7, 0.3, 0x6c5a45);
  return [
    { pos: [-13, 2.2, 14.8], look: [6, 4.5, -14], fov: 50, w: 2400, h: 1350 },
    { pos: [3, 1.8, 14.5], look: [0, 4, -16], fov: 46, w: 2400, h: 1350 },
    { pos: [2, 1.5, 12], look: [0, 4.2, -16], fov: 55, w: 1500, h: 2000 },
    { pos: [-14, 16, 33], look: [0, 3, 0], fov: 46, w: 2400, h: 1350 },
  ];
}

// =====================================================================
// 04 — FORM & LIGHT (Milan)
// =====================================================================
function formLight(scene, renderer, m) {
  sky(scene, renderer, { top: 0x93a8c0, horizon: 0xf4d9b2, ground: 0xb9ab95, sunDir: [0.85, 0.24, 0.45], sunColor: 0xffd9a6, sunStrength: 4.2, hemi: 0.45, fog: 0.0045, exposure: 1.1, shadowSize: 55, shadowTarget: [0, 0, 0] });
  const pm = concreteMaps(14, { base: [196, 190, 178], boards: false, ties: false });
  const plaza = new THREE.MeshStandardMaterial({ map: pm.map, bumpMap: pm.bump, bumpScale: 1, roughness: 0.95 });
  scene.add(ground(plaza, 600, 90));
  const g = new THREE.Group();
  scene.add(g);
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x232827, roughness: 0.12, metalness: 0.2, envMapIntensity: 1.7 });
  box(g, 26, 8, 24, 0, 4, 0, dark);
  slats(g, 52, 0.12, 8, 0.45, -12.8, 4, 12.2, 0.5, m.metal);
  box(g, 18, 22, 16, -2, 19, -1, m.stone);
  slats(g, 36, 0.25, 22, 0.75, -10.6, 19, 7.4, 0.5, m.stone);
  box(g, 14, 12, 14, 7, 36, 2, dark);
  slats(g, 28, 0.14, 12, 0.5, 0.4, 36, 9.3, 0.5, m.metal);
  box(g, 22, 1.2, 18, 2, 30.8, 0, m.concrete); // plate
  // context blocks
  const r = rng(6);
  const ctx = [[-46, -4, 18, 30, 18], [-40, 34, 22, 20, 18], [46, -10, 20, 38, 20], [50, 34, 22, 26, 22], [0, -48, 30, 28, 18], [-52, -44, 22, 44, 20], [38, -50, 24, 24, 20]];
  ctx.forEach(([x, z, w, h, d]) => box(g, w, h, d, x, h / 2, z, m.white));
  // trees on plaza
  for (let i = 0; i < 6; i++) tree(g, -22 + i * 9, 28 + (i % 2) * 3, m, 1.2, i + 1);
  for (let i = 0; i < 14; i++) person(g, -14 + r() * 28, 16 + r() * 14, 1.6 + r() * 0.25, 0, i % 3 ? 0x2b2c2a : 0x7c5b44);
  return [
    { pos: [-30, 2.4, 46], look: [3, 22, 0], fov: 46, w: 2400, h: 1350 },
    { pos: [26, 1.8, 30], look: [-1, 18, 4], fov: 55, w: 2400, h: 1350 },
    { pos: [-12, 1.2, 28], look: [2, 24, 0], fov: 60, w: 1500, h: 2000 },
    { pos: [-6, 12, 19], look: [-2, 14, 8], fov: 28, w: 2400, h: 1350 },
  ];
}

// =====================================================================
// 05 — DESERT FRAME (AlUla)
// =====================================================================
function desert(scene, renderer, m) {
  sky(scene, renderer, { top: 0x8aa6c6, horizon: 0xf8d3a6, ground: 0xc79b6d, sunDir: [-0.85, 0.2, 0.3], sunColor: 0xffc58a, sunStrength: 4.6, hemi: 0.5, fog: 0.0048, exposure: 1.12, shadowSize: 70, shadowTarget: [0, 0, -10] });
  const sand = groundMaps(55, [214, 172, 124], [1, 1], 60);
  const gmat = new THREE.MeshStandardMaterial({ map: sand.map, bumpMap: sand.bump, bumpScale: 2, roughness: 1 });
  const geo = new THREE.PlaneGeometry(700, 700, 280, 280);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const flat = Math.exp(-Math.pow((x * x + (y + 10) * (y + 10)) / 2600, 1.4)); // calm pad around building
    const h = (Math.sin(x * 0.045 + 1.2) * 3 + Math.sin(y * 0.03 - x * 0.012) * 4 + Math.sin(x * 0.11 + y * 0.07) * 0.8 + Math.sin(y * 0.2) * 0.25) * (1 - flat * 0.95);
    p.setZ(i, h);
  }
  geo.computeVertexNormals();
  const terr = new THREE.Mesh(geo, gmat);
  gmat.map.repeat.set(80, 80);
  gmat.bumpMap.repeat.set(80, 80);
  terr.rotation.x = -Math.PI / 2;
  terr.receiveShadow = true;
  scene.add(terr);
  const g = new THREE.Group();
  scene.add(g);
  const rock = m.stone;
  // distant mesas
  const r = rng(12);
  for (let i = 0; i < 11; i++) {
    const w = 30 + r() * 40, h = 30 + r() * 50, d = 26 + r() * 30;
    const x = -240 + i * 46 + r() * 20, z = -230 - r() * 60;
    const b = box(g, w, h, d, x, h / 2 - 2, z, rock);
    b.scale.x = 1;
    box(g, w * 0.7, h * 0.4, d * 0.8, x + 4, h + h * 0.2 - 2, z, rock);
  }
  // the frames
  const colW = 3, colD = 4.4, colH = 12;
  for (let i = 0; i < 7; i++) {
    const z = 14 - i * 9;
    const s = 1 - i * 0.04;
    box(g, colW, colH * s, colD, -9, (colH * s) / 2, z, rock);
    box(g, colW, colH * s, colD, 9, (colH * s) / 2, z, rock);
    box(g, 21, 3.2, colD, 0, colH * s + 1.6, z, rock);
  }
  // low suites behind
  box(g, 38, 4.4, 14, 0, 2.2, -62, rock);
  box(g, 14, 3, 30, -26, 1.5, -40, rock);
  box(g, 14, 3.2, 30, 26, 1.6, -40, rock);
  box(g, 34, 0.1, 6, 0, 0.2, -52, m.water, { cast: false });
  // pool / threshold
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(7, 60), m.water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0.12, -12);
  scene.add(pool);
  box(g, 9, 0.24, 66, 0, 0.0, -12, rock, { cast: false });
  palm(g, -16, 8, m, 8, 4);
  palm(g, -19, 2, m, 6.5, 5);
  person(g, 1, 20, 1.75, 0.1, 0x3a2f27);
  person(g, -2, 17, 1.7, 0.1, 0xe8dfcf);
  return [
    { pos: [0.5, 1.6, 36], look: [0, 6, -30], fov: 46, w: 2400, h: 1350 },
    { pos: [-30, 3, 26], look: [0, 6, -12], fov: 40, w: 2400, h: 1350 },
    { pos: [10, 1.4, 20], look: [-6, 11, 8], fov: 56, w: 1500, h: 2000 },
    { pos: [-3, 8, 28], look: [0, 4, -35], fov: 32, w: 2400, h: 1350 },
  ];
}

// =====================================================================
// 06 — THE OBSERVATORY (Lisbon)
// =====================================================================
function observatory(scene, renderer, m) {
  sky(scene, renderer, { top: 0x43597e, horizon: 0xf2c49b, ground: 0x9a8f86, sunDir: [-0.85, 0.12, -0.15], sunColor: 0xffb98a, sunStrength: 3.2, hemi: 0.75, fog: 0.0038, exposure: 1.18, shadowSize: 36, shadowTarget: [0, 0, 0] });
  const gm = concreteMaps(17, { base: [171, 166, 156], boards: false, ties: false });
  const pavement = new THREE.MeshStandardMaterial({ map: gm.map, bumpMap: gm.bump, bumpScale: 1, roughness: 0.95 });
  scene.add(ground(pavement, 600, 100));
  const g = new THREE.Group();
  scene.add(g);
  // terraced platform
  cyl(g, 22, 22.4, 0.7, 0, 0.35, 0, m.stone, 96);
  cyl(g, 17, 17.2, 1.2, 0, 1.3, 0, m.concrete, 96);
  // drum
  cyl(g, 9, 9.4, 14, 0, 8.9, 0, m.concrete, 96);
  // ring of slit windows
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const w = box(g, 0.5, 6, 0.7, Math.sin(a) * 9.3, 8, Math.cos(a) * 9.3, m.glowSoft, { cast: false });
    w.rotation.y = a;
  }
  // dome with slit
  const domeMat = new THREE.MeshStandardMaterial({ color: 0xb9b5ab, roughness: 0.5, metalness: 0.75, side: THREE.DoubleSide, envMapIntensity: 1.3 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(9.4, 72, 36, 0.35, Math.PI * 2 - 0.7, 0, Math.PI / 2), domeMat);
  dome.position.y = 15.9;
  dome.castShadow = dome.receiveShadow = true;
  dome.rotation.y = -0.5;
  g.add(dome);
  cyl(g, 9.6, 9.6, 0.6, 0, 15.75, 0, m.steelBlack, 96);
  // spiral ramp
  const turns = 1.4, N = 90, R = 13.2;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const a = t * turns * Math.PI * 2 + 0.5;
    const y = 1.9 + t * 11.2;
    const seg = box(g, (2 * Math.PI * R * turns) / N + 0.35, 0.38, 3.2, Math.sin(a) * R, y, Math.cos(a) * R, m.concrete);
    seg.rotation.y = a;
    seg.rotation.z = 0;
    // balustrade
    const rail = box(g, (2 * Math.PI * R * turns) / N + 0.3, 1.05, 0.08, Math.sin(a) * (R + 1.5), y + 0.7, Math.cos(a) * (R + 1.5), m.steelBlack);
    rail.rotation.y = a;
  }
  // light cone beam up from slit
  const beam = new THREE.Mesh(new THREE.ConeGeometry(4.2, 90, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe3bd, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false }));
  beam.position.set(0, 62, 0);
  beam.rotation.set(0, 0, 0);
  scene.add(beam);
  const lamp = new THREE.PointLight(0xffc27a, 160, 40, 1.4);
  lamp.position.set(0, 9, 11);
  scene.add(lamp);
  const r = rng(8);
  for (let i = 0; i < 8; i++) person(g, -12 + r() * 24, 17 + r() * 8, 1.7, 0.5, 0x232321);
  tree(g, -26, 20, m, 1.3, 2);
  tree(g, 28, 14, m, 1.4, 4);
  // balustrade wall at terrace edge
  return [
    { pos: [-36, 2.4, 34], look: [0, 11, 0], fov: 42, w: 2400, h: 1350 },
    { pos: [24, 1.5, 26], look: [0, 12, 0], fov: 50, w: 2400, h: 1350 },
    { pos: [-10, 1.2, 28], look: [0, 14, 0], fov: 62, w: 1500, h: 2000 },
    { pos: [-17, 11, 20], look: [4, 9, 8], fov: 34, w: 2400, h: 1350 },
  ];
}

// =====================================================================
// MATERIAL SWATCHES
// =====================================================================
function materialStudy(kind) {
  return function (scene, renderer, m) {
    sky(scene, renderer, { top: 0xbfc6cc, horizon: 0xeae4d8, ground: 0x8a867d, sunDir: [-0.9, 0.35, 0.35], sunColor: 0xfff0dc, sunStrength: 3.6, hemi: 1.3, fog: 0, exposure: 1.45, shadowSize: 10, shadowTarget: [0, 0, 0] });
    scene.fog = null;
    scene.background = new THREE.Color(0x1b1e19);
    const g = new THREE.Group();
    scene.add(g);
    const mk = {
      concrete: () => { const c = concreteMaps(23, { base: [168, 165, 157], repeat: [1, 1], amp: 56 }); return new THREE.MeshStandardMaterial({ map: c.map, bumpMap: c.bump, bumpScale: 3, roughness: 0.95 }); },
      stone: () => { const c = stoneMaps(29, [222, 208, 184]); return new THREE.MeshStandardMaterial({ map: c.map, bumpMap: c.bump, bumpScale: 2.4, roughness: 0.88 }); },
      timber: () => { const c = timberMaps(33, [190, 138, 88], [1, 1], 3); return new THREE.MeshStandardMaterial({ map: c.map, bumpMap: c.bump, bumpScale: 1.2, roughness: 0.62 }); },
      metal: () => { const c = metalMaps(37, [168, 160, 146]); return new THREE.MeshStandardMaterial({ map: c.map, bumpMap: c.bump, bumpScale: 0.8, roughness: 0.36, metalness: 0.9 }); },
    };
    if (kind === "glass") {
      scene.background = new THREE.Color(0x151a17);
      const back = box(g, 8, 6, 0.2, 0, 0, -1.2, new THREE.MeshStandardMaterial({ color: 0x2a3a34, roughness: 0.85 }));
      for (let i = 0; i < 9; i++) {
        const gm = new THREE.MeshPhysicalMaterial({ color: i % 3 === 0 ? 0xa9c4bc : 0xcfe0da, roughness: 0.03, metalness: 0, transmission: 0.0, transparent: true, opacity: 0.38, envMapIntensity: 2.2, side: THREE.DoubleSide });
        const pane = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.4, 0.12), gm);
        pane.position.set(-3.6 + i * 0.9, 0, -0.1 + (i % 3) * 0.5);
        pane.rotation.y = -0.38 + i * 0.02;
        pane.castShadow = true;
        g.add(pane);
      }
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 5.6, 0.06), m.copper);
      strip.position.set(3.6, 0, 0.8);
      g.add(strip);
      return [{ pos: [0, 0.4, 7], look: [0, 0, 0], fov: 38, w: 1600, h: 1200 }];
    }
    const mat = mk[kind]();
    const slab = box(g, 8, 6, 0.5, 0, 0, 0, mat);
    slab.rotation.y = 0.0;
    scene.children.find((c) => c.isDirectionalLight)?.position.set(-9, 7, 14);
    return [{ pos: [0.2, 0.1, 5.4], look: [0.2, 0, 0], fov: 38, w: 1600, h: 1200 }];
  };
}

// =====================================================================
// HERO (transparent, matches the live R3F sculpture)
// =====================================================================
function hero(scene, renderer, m) {
  scene.background = null;
  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x8a8478, 0.7));
  const sun = new THREE.DirectionalLight(0xfff0dc, 3.4);
  sun.position.set(-14, 20, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  const c = sun.shadow.camera;
  c.left = -18; c.right = 18; c.top = 18; c.bottom = -18; c.near = 1; c.far = 80;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 5;
  scene.add(sun);
  renderer.setClearColor(0x000000, 0);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.32 }));
  sh.rotation.x = -Math.PI / 2;
  sh.receiveShadow = true;
  scene.add(sh);
  const g = new THREE.Group();
  scene.add(g);
  buildMonolith(g, m);
  return [{ pos: [19, 10, 26], look: [0.3, 4.9, 0], fov: 30, w: 2000, h: 2000, alpha: true }];
}

export function buildMonolith(g, m) {
  // monumental stacked-slab sculpture with a central void and a cantilever
  box(g, 7, 0.6, 7, 0, 0.3, 0, m.concreteDark);
  box(g, 3.2, 8.4, 3.2, -1.8, 4.8, 0, m.concrete);
  box(g, 3.2, 5.2, 3.2, 1.9, 3.2, 0, m.concrete);
  box(g, 7.8, 1.5, 3.6, 0, 8.4, 0, m.concrete);
  box(g, 4.4, 1.2, 3.4, 3.4, 6.6, 0.0, m.concreteDark);
  box(g, 1.4, 4.2, 3.0, 0, 3.0, 0, m.timber);
  box(g, 2.2, 0.5, 6.4, -2.6, 9.4, 0.2, m.concrete);
}

// =====================================================================
// MODEL WORKSHOP (white massing models on a timber table)
// =====================================================================
function workshop(scene, renderer, m) {
  scene.background = new THREE.Color(0x24231f);
  scene.fog = new THREE.Fog(0x24231f, 22, 46);
  scene.add(new THREE.HemisphereLight(0xfff2e0, 0x2a2824, 0.5));
  const sun = new THREE.SpotLight(0xffecd0, 900, 60, 0.5, 0.8, 1.6);
  sun.position.set(-8, 16, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0002;
  sun.shadow.radius = 6;
  scene.add(sun, sun.target);
  const g = new THREE.Group();
  scene.add(g);
  box(g, 36, 0.8, 16, 0, -0.4, 0, m.timber);
  const w = m.white;
  // site model — topographic contour layers
  for (let i = 0; i < 9; i++) {
    const c = cyl(g, 5.2 - i * 0.55, 5.3 - i * 0.55, 0.22, -9 + i * 0.12, 0.11 + i * 0.22, 1 - i * 0.08, new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.1, 0.12, 0.8 - i * 0.025), roughness: 1 }), 64);
    c.scale.z = 0.7;
  }
  // massing models
  box(g, 2.4, 3.8, 2.4, -1.2, 1.9, 1, w);
  box(g, 3.8, 1.8, 2.4, 0.3, 4.7, 1, w);
  box(g, 5.0, 0.8, 3.2, 0.4, 0.4, 1.4, w);
  box(g, 1.6, 6.6, 1.6, 4.4, 3.3, -0.6, w);
  box(g, 3, 0.5, 3, 4.4, 6.9, -0.6, w);
  cyl(g, 1.8, 1.8, 3.4, 8.5, 1.7, 1.6, w, 64);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), w);
  dome.position.set(8.5, 3.4, 1.6);
  dome.castShadow = true;
  g.add(dome);
  // scale figures (tiny white)
  for (let i = 0; i < 6; i++) box(g, 0.14, 0.34, 0.14, -4 + i * 0.5, 0.17, 3.4, w);
  // sketch rolls & pencil
  const roll = cyl(g, 0.25, 0.25, 5, -13, 0.3, 4.5, new THREE.MeshStandardMaterial({ color: 0xf4f0e6, roughness: 0.9 }), 24);
  roll.rotation.z = Math.PI / 2;
  roll.rotation.y = 0.4;
  return [
    { pos: [-6, 9.5, 16], look: [1, 2.2, 0], fov: 32, w: 2400, h: 1350 },
    { pos: [13, 3.2, 8], look: [3, 3.4, 0.5], fov: 34, w: 2400, h: 1350 },
    { pos: [-9, 6.5, 12], look: [1.5, 2.4, 1], fov: 34, w: 1500, h: 2000 },
  ];
}

export const SCENES = {
  silent,
  horizon,
  courtyard,
  formLight,
  desert,
  observatory,
  hero,
  workshop,
  "mat-concrete": materialStudy("concrete"),
  "mat-stone": materialStudy("stone"),
  "mat-timber": materialStudy("timber"),
  "mat-glass": materialStudy("glass"),
  "mat-metal": materialStudy("metal"),
};
