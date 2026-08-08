/**
 * Enterprise Network Visualization — Synova 3D Hero Scene
 *
 * A procedural Three.js scene that renders an orbital network visualization
 * representing Synova's enterprise technology ecosystem. The scene features:
 *   - A glowing central core orb
 *   - 3 orbital rings at staggered angles with orbiting nodes
 *   - Connection lines between nearby nodes (dynamic web)
 *   - Floating particle field for depth
 *   - Mouse-responsive parallax
 *   - Auto-rotation
 *
 * Performance: automatically scales quality on mobile / small viewports.
 * Must be destroyed via the returned `destroy()` when the element unmounts.
 */

import * as THREE from 'three';

const ORBIT_COUNT = 3;
const NODES_PER_ORBIT = 9;
const PARTICLE_COUNT = 600;
const COLORS = {
  core: 0xf97316,       // corporate-orange
  orbitA: 0x2563eb,     // accent-blue
  orbitB: 0x10b981,     // accent-emerald
  orbitC: 0x06b6d4,     // accent-cyan
  link: 0xf97316,
  particle: 0xffffff,
};

/**
 * Create the enterprise 3D scene attached to a <canvas> element.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ renderScale?: number, disableAutoRotate?: boolean }} [opts]
 * @returns {{ destroy: () => void, setMouse: (x: number, y: number) => void }}
 */
export function createEnterpriseScene(canvas, opts = {}) {
  // ── Detect mobile / small viewport ──────────────────────────────
  const isSmall = window.innerWidth < 640;
  const particleCount = isSmall ? Math.round(PARTICLE_COUNT * 0.25) : PARTICLE_COUNT;
  const orbitsToRender = isSmall ? 2 : ORBIT_COUNT;
  const adjustScale = isSmall ? 0.6 : 1;

  // Canvas is kept hidden (x-show) while the scene boots, so its own
  // clientWidth/clientHeight are 0 at creation time. Fall back to the
  // parent (the hero section, always laid out) so we never size a 0×0
  // renderer — and never call setSize(w, h) with updateStyle=true, which
  // would stamp inline width/height over the Tailwind w-full h-full.
  function getCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.parentElement?.clientWidth || window.innerWidth;
    const h = rect.height || canvas.parentElement?.clientHeight || window.innerHeight;
    return { w, h };
  }

  // ── Scene setup ─────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = null; // transparent — CSS handles the hero gradient

  const { w: initW, h: initH } = getCanvasSize();
  const camera = new THREE.PerspectiveCamera(45, initW / Math.max(initH, 1), 0.1, 100);
  camera.position.set(0, 1.2, 7);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isSmall,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // updateStyle=false: keep CSS sizing (w-full h-full) authoritative.
  renderer.setSize(initW, initH, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // ── Lights ──────────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0x404060, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(4, 6, 3);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x2563eb, 0.4);
  fillLight.position.set(-3, -1, 2);
  scene.add(fillLight);

  // ── Central core (glowing orb) ──────────────────────────────────
  const coreGeo = new THREE.IcosahedronGeometry(0.45 * adjustScale, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: COLORS.core,
    emissive: COLORS.core,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.4,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Core glow aura (larger, transparent, pulsing)
  const auraGeo = new THREE.IcosahedronGeometry(0.6 * adjustScale, 2);
  const auraMat = new THREE.MeshBasicMaterial({
    color: COLORS.core,
    transparent: true,
    opacity: 0.15,
    wireframe: true,
  });
  const aura = new THREE.Mesh(auraGeo, auraMat);
  scene.add(aura);

  // Core outer glow (soft sphere)
  const glowGeo = new THREE.SphereGeometry(0.85 * adjustScale, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: COLORS.core,
    transparent: true,
    opacity: 0.08,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // ── Orbital rings with nodes ────────────────────────────────────
  const orbitAngles = [
    { tiltX: 0, tiltZ: 0.3, color: COLORS.orbitA },       // horizontal
    { tiltX: 0.6, tiltZ: -0.2, color: COLORS.orbitB },     // tilted
    { tiltX: -0.4, tiltZ: 0.7, color: COLORS.orbitC },     // vertical-ish
  ];

  const nodeGroups = []; // { group, radius, speed, color, nodeMeshes, connectionLines }
  const allNodes = [];   // flat { mesh, worldPos }

  for (let o = 0; o < orbitsToRender; o++) {
    const cfg = orbitAngles[o];
    const radius = (1.6 + o * 0.7) * adjustScale;
    const speed = (0.15 + o * 0.05) * (o % 2 === 0 ? 1 : -1);
    const nodes = NODES_PER_ORBIT - (isSmall ? 3 : 0);

    const group = new THREE.Group();
    group.rotation.x = cfg.tiltX;
    group.rotation.z = cfg.tiltZ;
    scene.add(group);

    const nodeMeshes = [];

    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Slight position jitter for organic feel
      const jitter = 0.04;
      const size = (0.06 + Math.random() * 0.1) * adjustScale;

      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x + (Math.random() - 0.5) * jitter, (Math.random() - 0.5) * jitter, z + (Math.random() - 0.5) * jitter);
      mesh.userData.baseAngle = angle;
      mesh.userData.radius = radius;
      mesh.userData.orbitIndex = o;
      group.add(mesh);
      nodeMeshes.push(mesh);
      allNodes.push({ mesh, worldPos: new THREE.Vector3() });
    }

    // Ring line (dashed ellipse)
    const ringPoints = [];
    const ringSegments = 48;
    for (let i = 0; i <= ringSegments; i++) {
      const a = (i / ringSegments) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: 0.15 + o * 0.05,
    });
    const ringLine = new THREE.Line(ringGeo, ringMat);
    group.add(ringLine);

    nodeGroups.push({ group, radius, speed, color: cfg.color, nodeMeshes });
  }

  // ── Connection lines between nearby nodes ───────────────────────
  // We'll compute connections each frame based on current node positions
  const connectionLineMat = new THREE.LineBasicMaterial({
    color: COLORS.link,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
  });

  // Pre-allocate line geometry (we'll update positions each frame)
  const maxConnections = 24;
  const connectionPositions = new Float32Array(maxConnections * 6); // 2 points per connection
  const connGeo = new THREE.BufferGeometry();
  connGeo.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
  const connectionLines = new THREE.LineSegments(connGeo, connectionLineMat);
  scene.add(connectionLines);

  // ── Particle field ──────────────────────────────────────────────
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleSpread = 7 * adjustScale;

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * particleSpread;
    particlePos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    particlePos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.6;
    particlePos[i * 3 + 2] = Math.cos(phi) * r;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: isSmall ? 0.012 : 0.018,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Interaction state ───────────────────────────────────────────
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let time = 0;

  // ── Resize handler ──────────────────────────────────────────────
  function resize() {
    const { w, h } = getCanvasSize();
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(canvas);

  window.addEventListener('resize', resize);

  // The hero canvas itself is pointer-events-none (so the CTA/content
  // above it stay clickable), so mousemove must be tracked on window.
  function onPointerMove(e) {
    const x = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    const y = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
    const w = window.innerWidth;
    const h = window.innerHeight;
    mouseX = (x / w) * 2 - 1;
    mouseY = -(y / h) * 2 + 1;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // ── Animation loop ──────────────────────────────────────────────
  // Delta is derived from the rAF timestamp so animation speed is
  // consistent across 60Hz/120Hz displays and when tabs are throttled.
  let lastFrameTime = performance.now();
  let rafId = 0;

  function animate(timestamp = performance.now()) {
    const delta = Math.min((timestamp - lastFrameTime) / 1000, 0.05); // clamp large pauses
    lastFrameTime = timestamp;
    time += delta;

    // Auto-rotation
    if (!opts.disableAutoRotate) {
      targetRotY += delta * 0.12;
      targetRotX = Math.sin(time * 0.08) * 0.08 + mouseY * 0.12;
    }

    // Smooth camera / group rotation
    const groupRotY = targetRotY + mouseX * 0.15;
    const groupRotX = targetRotX;

    // Rotate the whole node container group (we'll rotate each orbit group's parent)
    // Actually easier: rotate the scene group containing nodes
    nodeGroups.forEach((g) => {
      g.group.rotation.y += g.speed * delta;

      // Update node flashing
      g.nodeMeshes.forEach((mesh, i) => {
        const pulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 1.5 + i * 2.1 + g.group.rotation.y));
        mesh.material.emissiveIntensity = pulse * 0.4;
      });
    });

    // Core / aura animation
    core.rotation.x += delta * 0.3;
    core.rotation.y += delta * 0.5;
    aura.rotation.x += delta * 0.2;
    aura.rotation.y += delta * 0.35;
    const pulse = 0.5 + 0.5 * Math.sin(time * 1.2);
    aura.material.opacity = 0.08 + pulse * 0.12;
    glow.material.opacity = 0.04 + pulse * 0.06;
    core.material.emissiveIntensity = 0.4 + pulse * 0.4;

    // Camera position (respond to mouse + auto-orbit)
    const camX = Math.sin(time * 0.03 + mouseX * 0.3) * 0.3 * adjustScale;
    const camY = 1.2 + mouseY * 0.4 * adjustScale;
    const camZ = 6.5 + Math.sin(time * 0.04) * 0.2 * adjustScale;
    camera.position.x += (camX - camera.position.x) * 0.04;
    camera.position.y += (camY - camera.position.y) * 0.04;
    camera.position.z += (camZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);

    // Particles slow drift
    particles.rotation.y += delta * 0.01;
    particles.rotation.x += delta * 0.003;

    // ── Dynamic connection lines ──────────────────────────────────
    // Collect all node world positions
    let connIdx = 0;
    allNodes.forEach((n) => {
      n.mesh.getWorldPosition(n.worldPos);
    });

    for (let i = 0; i < allNodes.length && connIdx < maxConnections; i++) {
      for (let j = i + 1; j < allNodes.length && connIdx < maxConnections; j++) {
        const dist = allNodes[i].worldPos.distanceTo(allNodes[j].worldPos);
        if (dist < 2.2 && dist > 0.3) {
          const idx = connIdx * 6;
          connectionPositions[idx] = allNodes[i].worldPos.x;
          connectionPositions[idx + 1] = allNodes[i].worldPos.y;
          connectionPositions[idx + 2] = allNodes[i].worldPos.z;
          connectionPositions[idx + 3] = allNodes[j].worldPos.x;
          connectionPositions[idx + 4] = allNodes[j].worldPos.y;
          connectionPositions[idx + 5] = allNodes[j].worldPos.z;
          connIdx++;
        }
      }
    }
    connGeo.attributes.position.needsUpdate = true;
    connGeo.setDrawRange(0, connIdx * 2);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  rafId = requestAnimationFrame(animate);

  // ── Public API ──────────────────────────────────────────────────
  return {
    destroy() {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      scene.traverse((obj) => {
        obj.geometry?.dispose?.();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material].filter(Boolean);
        mats.forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}