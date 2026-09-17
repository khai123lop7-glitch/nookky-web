"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import styles from "./HoiAnModel.module.css";

type LightRig = { bulbs: THREE.MeshStandardMaterial[]; lamps: THREE.PointLight[] };

function buildModel() {
  const model = new THREE.Group();
  model.name = "Nook Ky - Pho vua len den Hoi An - concept 3D";
  const rig: LightRig = { bulbs: [], lamps: [] };
  const mat = (color: string, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });
  const plywood = mat("#c9a276");
  const cutEdge = mat("#755039");
  const plaster = mat("#d39a47");
  const plasterLight = mat("#e0b66b");
  const teal = mat("#275849");
  const tealLight = mat("#4e7564");
  const roof = mat("#353434");
  const roofEdge = mat("#645144");
  const stone = [mat("#756656"), mat("#95836c"), mat("#5e554d"), mat("#af9674")];

  const block = (
    parent: THREE.Object3D,
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    rotation: [number, number, number] = [0, 0, 0],
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Laser-cut plywood shell: front stays open, like the real book nook.
  block(model, 4.35, 0.2, 4.2, 0, 0.1, 0, plywood);
  block(model, 4.35, 0.2, 4.2, 0, 6.1, 0, plywood);
  block(model, 0.16, 6.1, 4.2, -2.1, 3.05, 0, plywood);
  block(model, 0.16, 6.1, 4.2, 2.1, 3.05, 0, plywood);
  block(model, 4.35, 6.1, 0.1, 0, 3.05, -2.07, plywood);
  for (const x of [-2.02, 2.02]) {
    block(model, 0.1, 6.06, 0.13, x, 3.05, 2.04, cutEdge);
    for (const y of [0.62, 1.85, 3.08, 4.31, 5.54]) {
      block(model, 0.08, 0.18, 0.055, x, y, 2.14, cutEdge);
    }
  }
  block(model, 4.25, 0.12, 0.16, 0, 6.0, 2.04, cutEdge);
  block(model, 4.25, 0.32, 0.2, 0, 0.24, 2.04, plywood);
  block(model, 4.05, 0.07, 0.13, 0, 0.51, 2.1, cutEdge);

  // Painted sunset and river form the last layer of the miniature.
  const sky = document.createElement("canvas");
  sky.width = 512;
  sky.height = 768;
  const ctx = sky.getContext("2d");
  if (ctx) {
    const sunset = ctx.createLinearGradient(0, 0, 0, 768);
    sunset.addColorStop(0, "#42475a");
    sunset.addColorStop(0.42, "#d3835b");
    sunset.addColorStop(0.63, "#f5bd77");
    sunset.addColorStop(0.64, "#694e47");
    sunset.addColorStop(1, "#243f4b");
    ctx.fillStyle = sunset;
    ctx.fillRect(0, 0, 512, 768);
    ctx.fillStyle = "#4a3d38";
    for (let i = 0; i < 11; i += 1) {
      const x = i * 52 - 10;
      const h = 38 + (i * 31) % 58;
      ctx.fillRect(x, 485 - h, 40, h);
      ctx.beginPath();
      ctx.moveTo(x - 5, 485 - h);
      ctx.lineTo(x + 20, 464 - h);
      ctx.lineTo(x + 45, 485 - h);
      ctx.fill();
      ctx.fillStyle = "#ffd18c";
      ctx.fillRect(x + 12, 468 - h, 5, 8);
      ctx.fillStyle = "#4a3d38";
    }
    for (let i = 0; i < 30; i += 1) {
      ctx.fillStyle = i % 3 === 0 ? "#f9bd77" : "#a26958";
      ctx.fillRect((i * 97) % 512, 520 + i * 8, 20 + (i % 4) * 14, 2);
    }
  }
  const skyTexture = new THREE.CanvasTexture(sky);
  skyTexture.colorSpace = THREE.SRGBColorSpace;
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(3.95, 5.65),
    new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.DoubleSide }),
  );
  backdrop.position.set(0, 3.04, -1.99);
  model.add(backdrop);

  // Cobbled alley narrows toward the painted river.
  block(model, 3.85, 0.12, 3.7, 0, 0.28, 0, mat("#51483e"));
  for (let row = 0; row < 12; row += 1) {
    const z = 1.69 - row * 0.29;
    const count = row % 2 === 0 ? 7 : 6;
    for (let column = 0; column < count; column += 1) {
      const x = -1.74 + column * (3.48 / count) + (row % 2) * 0.11;
      block(model, 3.28 / count, 0.025, 0.25, x, 0.355, z, stone[(row + column) % stone.length]);
    }
  }

  const windowSet = (x: number, y: number, z: number, width = 0.54) => {
    block(model, width, 0.92, 0.075, x, y, z, cutEdge);
    block(model, width - 0.09, 0.83, 0.08, x, y, z + 0.047, mat("#26342f"));
    block(model, 0.06, 0.88, 0.1, x, y, z + 0.1, tealLight);
    for (const side of [-1, 1]) {
      block(model, width * 0.39, 0.87, 0.07, x + side * width * 0.7, y, z + 0.115, teal, [0, side * 0.18, 0]);
      for (let slat = -2; slat <= 2; slat += 1) {
        block(model, width * 0.3, 0.018, 0.012, x + side * width * 0.7, y + slat * 0.13, z + 0.16, tealLight);
      }
    }
    block(model, width + 0.18, 0.08, 0.23, x, y - 0.5, z + 0.1, cutEdge);
  };

  const roofSet = (x: number, y: number, z: number, width: number) => {
    block(model, width, 0.12, 1.22, x, y, z, roof, [0.05, 0, x < 0 ? -0.24 : 0.24]);
    block(model, width + 0.12, 0.12, 0.14, x, y - 0.13, z + 0.62, roofEdge);
    for (let tile = 0; tile < 8; tile += 1) {
      const tx = x - width / 2 + 0.1 + tile * (width - 0.2) / 7;
      block(model, 0.025, 0.015, 1.06, tx, y + 0.075, z, roofEdge, [0.05, 0, x < 0 ? -0.24 : 0.24]);
    }
  };

  // Facades are deliberately offset to create genuine depth when orbiting.
  block(model, 1.5, 4.48, 2.05, -1.25, 2.65, -0.25, plaster);
  block(model, 1.53, 3.65, 1.65, 1.25, 2.22, 0.05, plasterLight);
  block(model, 0.9, 2.3, 0.6, -1.45, 1.52, 1.05, plasterLight);
  block(model, 0.94, 2.7, 0.65, 1.42, 1.73, 1.12, plaster);
  block(model, 1.42, 2.5, 1.32, -1.24, 3.6, -1.12, plasterLight);
  block(model, 1.32, 2.65, 1.25, 1.25, 3.72, -1.2, plaster);
  roofSet(-1.26, 4.86, 0.1, 1.72);
  roofSet(1.25, 4.28, 0.3, 1.75);
  roofSet(-1.28, 2.43, 1.12, 1.25);
  roofSet(1.4, 2.56, 1.18, 1.22);
  windowSet(-1.17, 3.5, 0.83, 0.57);
  windowSet(1.16, 3.05, 0.92, 0.57);
  windowSet(-1.32, 1.39, 1.42, 0.45);
  windowSet(1.4, 1.55, 1.49, 0.45);
  windowSet(1.2, 4.85, -0.52, 0.39);
  block(model, 0.58, 1.5, 0.11, -1.17, 1.18, 0.82, cutEdge);
  block(model, 0.46, 1.4, 0.12, -1.17, 1.18, 0.9, teal);
  block(model, 0.58, 1.5, 0.11, 1.25, 1.18, 0.88, cutEdge);
  block(model, 0.46, 1.4, 0.12, 1.25, 1.18, 0.95, teal);

  for (const x of [-1.22, 1.22]) {
    const y = x < 0 ? 2.48 : 2.23;
    block(model, 1.35, 0.09, 0.63, x, y, 1.18, cutEdge);
    block(model, 1.37, 0.08, 0.1, x, y + 0.65, 1.48, cutEdge);
    for (let index = 0; index < 6; index += 1) {
      block(model, 0.055, 0.62, 0.055, x - 0.57 + index * 0.23, y + 0.34, 1.48, teal);
    }
  }

  const lantern = (x: number, y: number, z: number, color: string, radius = 0.15) => {
    block(model, 0.46, 0.055, 0.055, x - 0.19, y + 0.52, z - 0.05, cutEdge);
    block(model, 0.022, 0.29, 0.022, x, y + 0.35, z, cutEdge);
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.85,
      roughness: 0.65,
    });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), bulbMaterial);
    bulb.scale.y = 1.4;
    bulb.position.set(x, y, z);
    model.add(bulb);
    rig.bulbs.push(bulbMaterial);
    for (const offset of [-0.055, 0.055]) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.76, 0.009, 5, 18), cutEdge);
      rib.rotation.y = Math.PI / 2;
      rib.scale.y = 1.43;
      rib.position.set(x + offset, y, z);
      model.add(rib);
    }
    block(model, 0.12, 0.05, 0.12, x, y + radius * 1.35, z, cutEdge);
    block(model, 0.12, 0.05, 0.12, x, y - radius * 1.35, z, cutEdge);
    block(model, 0.015, 0.18, 0.015, x, y - radius * 1.35 - 0.1, z, mat("#a14d34"));
    const lamp = new THREE.PointLight(color, 2, 1.9, 2);
    lamp.position.set(x, y, z + 0.1);
    model.add(lamp);
    rig.lamps.push(lamp);
  };
  lantern(-0.52, 3.66, 1.14, "#ff9d57", 0.18);
  lantern(0.51, 2.07, 1.68, "#ffac61", 0.18);
  lantern(-0.86, 1.58, 1.65, "#ffce65", 0.13);
  lantern(-0.48, 2.64, -0.6, "#ffd070", 0.095);
  lantern(0.36, 4.1, -0.92, "#ffb866", 0.11);

  // A small painted flowering canopy, with individual blossoms in space.
  const leaf = mat("#536344");
  const petal = mat("#b86f78");
  const petalLight = mat("#d79498");
  for (let i = 0; i < 23; i += 1) {
    const x = 0.58 + (i * 67 % 125) / 100;
    const y = 5.19 + (i * 43 % 78) / 100;
    const z = 1.25 - (i * 29 % 75) / 100;
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.17 + (i % 3) * 0.025, 7, 5), leaf);
    foliage.position.set(x, y, z);
    foliage.scale.set(1.35, 0.66, 0.64);
    model.add(foliage);
    if (i % 2 === 0) {
      for (let p = 0; p < 5; p += 1) {
        const a = p * Math.PI * 2 / 5;
        const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.055, 7, 5), p % 2 ? petal : petalLight);
        bloom.position.set(x + Math.cos(a) * 0.065, y + Math.sin(a) * 0.065, z + 0.09);
        model.add(bloom);
      }
    }
  }

  return { model, rig };
}

export function HoiAnModel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<LightRig | null>(null);
  const resetRef = useRef<(() => void) | null>(null);
  const [lightsOn, setLightsOn] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const initialPosition = new THREE.Vector3(3.25, 3.75, 8.5);
    camera.position.copy(initialPosition);
    const target = new THREE.Vector3(0, 3.05, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-label", "Mô hình 3D phố Hội An, kéo để xoay và cuộn để phóng to");
    mount.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 6.5;
    controls.maxDistance = 13;
    controls.minPolarAngle = 0.7;
    controls.maxPolarAngle = 1.85;
    controls.minAzimuthAngle = -1.12;
    controls.maxAzimuthAngle = 1.12;
    controls.update();
    resetRef.current = () => {
      camera.position.copy(initialPosition);
      controls.target.copy(target);
      controls.update();
    };

    scene.add(new THREE.AmbientLight("#fff1d2", 1.6));
    const key = new THREE.DirectionalLight("#ffe1aa", 2.3);
    key.position.set(-4, 8, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 9;
    key.shadow.camera.bottom = -7;
    scene.add(key);
    const fill = new THREE.DirectionalLight("#a7c0ca", 0.85);
    fill.position.set(4, 5, -5);
    scene.add(fill);
    const { model, rig } = buildModel();
    rigRef.current = rig;
    scene.add(model);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (width < 700) {
        initialPosition.set(3.5, 3.85, 11.7);
        controls.minDistance = 8.8;
        camera.position.copy(initialPosition);
        controls.update();
      } else {
        initialPosition.set(3.25, 3.75, 8.5);
        controls.minDistance = 6.5;
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();
    let frame = 0;
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) animate();
    });
    visibilityObserver.observe(mount);
    function animate() {
      if (!visible) { frame = 0; return; }
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      visible = false;
      cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      controls.dispose();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          const list = Array.isArray(object.material) ? object.material : [object.material];
          list.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => {
        if (material instanceof THREE.MeshBasicMaterial && material.map) material.map.dispose();
        material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      rigRef.current = null;
      resetRef.current = null;
    };
  }, []);

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    rig.bulbs.forEach((bulb) => { bulb.emissiveIntensity = lightsOn ? 0.85 : 0.04; });
    rig.lamps.forEach((lamp) => { lamp.intensity = lightsOn ? 2 : 0; });
  }, [lightsOn]);

  return (
    <div className={styles.viewerShell}>
      <div className={styles.canvas} ref={mountRef} />
      <div className={styles.controls}>
        <span className={styles.hint}>Kéo để xoay · Cuộn để phóng gần</span>
        <div className={styles.actions}>
          <button type="button" onClick={() => setLightsOn((value) => !value)}>
            {lightsOn ? "Tắt đèn" : "Bật đèn"}
          </button>
          <button type="button" onClick={() => resetRef.current?.()}>Góc nhìn đầu</button>
        </div>
      </div>
    </div>
  );
}
