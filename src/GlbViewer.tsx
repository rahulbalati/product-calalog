import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export type GlbAttachment = {
  id: string;
  path: string;
  enabled: boolean;
  scale: number;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
};

type GlbViewerProps = {
  modelPath?: string;
  modelScale?: number;
  attachments?: GlbAttachment[];
  className?: string;
  autoRotate?: boolean;
};

function setupShadows(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      try {
        child.geometry.dispose();
      } catch (e) {}
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        try {
          material.dispose();
        } catch (e) {}
      });
    }
  });
}

export default function GlbViewer({
  modelPath = '/assets/BP-51C.glb',
  modelScale = 0.7,
  attachments = [],
  className = '',
  autoRotate = false
}: GlbViewerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const attachmentObjectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const fitViewRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const mainDeviceRef = useRef<THREE.Object3D | null>(null);
  const currentModelPathRef = useRef<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const assemblyGroupRef = useRef<THREE.Group | null>(null);

  // Unique key for attachments to avoid unnecessary work
  const attachmentLoadKey = useMemo(
    () => attachments.map((a) => `${a.id}:${a.path}:${a.enabled}`).join('|'),
    [attachments]
  );

  // Mount: build scene/renderer/controls once
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let animationFrame = 0;

    setStatus('loading');

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const assemblyGroup = new THREE.Group();
    assemblyGroupRef.current = assemblyGroup;
    scene.add(assemblyGroup);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 1.5, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // three@0.184 uses outputColorSpace
    try { (renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace; } catch {}
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.7;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.12;
    controls.maxPolarAngle = Math.PI * 0.9;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 80),
      new THREE.ShadowMaterial({ opacity: 0.14 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, true);
      fitViewRef.current?.();
    };

    const fitViewToAssembly = () => {
      const box = new THREE.Box3().setFromObject(assemblyGroup);
      if (box.isEmpty()) return;

      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const fitFov = Math.min(verticalFov, horizontalFov);
      const distance = (sphere.radius / Math.sin(fitFov / 2)) * 1.22;
      const viewDirection = new THREE.Vector3(0.25, 0.18, 1).normalize();

      camera.position.copy(center).add(viewDirection.multiplyScalar(distance));
      camera.near = Math.max(distance / 100, 0.01);
      camera.far = distance * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(center);
      controls.minDistance = Math.max(distance * 0.45, 0.35);
      controls.maxDistance = distance * 2.8;
      controls.update();

      floor.position.y = box.min.y - 0.015;
      floor.scale.setScalar(Math.max(size.x, size.z, 1) / 4.8);
    };
    fitViewRef.current = fitViewToAssembly;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    // Setup loader with optional decoders
    const baseLoader = new GLTFLoader();
    try {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      baseLoader.setDRACOLoader(dracoLoader);
    } catch {}
    try {
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath('/basis/');
      ktx2Loader.detectSupport(renderer);
      baseLoader.setKTX2Loader(ktx2Loader);
    } catch {}
    try {
      if ((GLTFLoader as any).setMeshoptDecoder) {
        (GLTFLoader as any).setMeshoptDecoder(MeshoptDecoder);
      } else if ((baseLoader as any).setMeshoptDecoder) {
        (baseLoader as any).setMeshoptDecoder(MeshoptDecoder);
      }
    } catch {}

    const loadGLBWith = (loader: GLTFLoader, path: string) =>
      new Promise<THREE.Object3D>((resolve, reject) => {
        loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
      });

    // Load main device helper
    const loadMainDevice = async (path: string, scale: number) => {
      if (disposed) return;
      if (mainDeviceRef.current && currentModelPathRef.current === path) {
        mainDeviceRef.current.scale.setScalar(scale);
        return;
      }

      if (mainDeviceRef.current) {
        try { assemblyGroup.remove(mainDeviceRef.current); disposeObject(mainDeviceRef.current); } catch (e) {}
        mainDeviceRef.current = null;
        currentModelPathRef.current = null;
      }

      try {
        const main = await loadGLBWith(baseLoader, path);
        if (disposed) return;
        main.scale.setScalar(scale);
        main.position.set(0, 0, 0);
        setupShadows(main);
        assemblyGroup.add(main);
        mainDeviceRef.current = main;
        currentModelPathRef.current = path;
      } catch (e) {
        // ignore
      }
    };

    // Ensure an attachment is loaded/updated
    const ensureAttachment = async (attachment: GlbAttachment) => {
      if (disposed) return;
      const existing = attachmentObjectsRef.current.get(attachment.id);
      if (existing) {
        const existingPath = (existing.userData && existing.userData._path) || '';
        if (existingPath === attachment.path) {
          existing.scale.setScalar(attachment.scale);
          existing.position.set(attachment.position.x, attachment.position.y, attachment.position.z);
          if (attachment.rotation) existing.rotation.set(attachment.rotation.x, attachment.rotation.y, attachment.rotation.z);
          existing.visible = attachment.enabled;
          return;
        }
        try { assemblyGroup.remove(existing); disposeObject(existing); } catch (e) {}
        attachmentObjectsRef.current.delete(attachment.id);
      }

      try {
        const model = await loadGLBWith(baseLoader, attachment.path);
        if (disposed) return;
        model.scale.setScalar(attachment.scale);
        model.position.set(attachment.position.x, attachment.position.y, attachment.position.z);
        if (attachment.rotation) model.rotation.set(attachment.rotation.x, attachment.rotation.y, attachment.rotation.z);
        model.visible = attachment.enabled;
        setupShadows(model);
        (model.userData as any) = { _path: attachment.path };
        attachmentObjectsRef.current.set(attachment.id, model);
        assemblyGroup.add(model);
      } catch (e) {
        // ignore per-attachment load errors
      }
    };

    // Initial load
    (async () => {
      try {
        await loadMainDevice(modelPath, modelScale);
        await Promise.all(attachments.map((a) => ensureAttachment(a)));
        fitViewToAssembly();
        setStatus('ready');
      } catch (e) {
        setStatus('error');
      }
    })();

    // Render loop
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      fitViewRef.current = null;
      resizeObserver.disconnect();
      try { controls.dispose(); } catch (e) {}
      try { renderer.dispose(); } catch (e) {}
      try { renderer.domElement.remove(); } catch (e) {}
      // dispose main and attachments
      if (mainDeviceRef.current) try { assemblyGroup.remove(mainDeviceRef.current); disposeObject(mainDeviceRef.current); } catch (e) {}
      attachmentObjectsRef.current.forEach((obj) => { try { assemblyGroup.remove(obj); disposeObject(obj); } catch (e) {} });
      attachmentObjectsRef.current.clear();
      try { floor.geometry.dispose(); } catch (e) {}
      if (Array.isArray(floor.material)) {
        floor.material.forEach((material) => { try { material.dispose(); } catch (e) {} });
      } else {
        try { floor.material.dispose(); } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to modelPath / modelScale changes (reload main only)
  useEffect(() => {
    const path = modelPath;
    const scale = modelScale;
    const renderer = rendererRef.current;
    if (!sceneRef.current || !renderer) return;
    setStatus('loading');

    const loader = new GLTFLoader();
    try { const dracoLoader = new DRACOLoader(); dracoLoader.setDecoderPath('/draco/'); loader.setDRACOLoader(dracoLoader); } catch {}
    const loadGLB = (p: string) => new Promise<THREE.Object3D>((resolve, reject) => loader.load(p, (g) => resolve(g.scene), undefined, reject));

    (async () => {
      try {
        if (mainDeviceRef.current && currentModelPathRef.current !== path) {
          try { assemblyGroupRef.current!.remove(mainDeviceRef.current); disposeObject(mainDeviceRef.current); } catch (e) {}
          mainDeviceRef.current = null;
          currentModelPathRef.current = null;
        }
        if (!mainDeviceRef.current) {
          const main = await loadGLB(path);
          if (!main) return;
          main.scale.setScalar(scale);
          main.position.set(0,0,0);
          setupShadows(main);
          assemblyGroupRef.current!.add(main);
          mainDeviceRef.current = main;
          currentModelPathRef.current = path;
        } else {
          mainDeviceRef.current.scale.setScalar(scale);
        }
        fitViewRef.current?.();
        setStatus('ready');
      } catch (e) { setStatus('error'); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelPath, modelScale]);

  // React to attachments changes: update visibility, transforms, and load/unload specific attachments
  useEffect(() => {
    if (!assemblyGroupRef.current) return;
    setStatus('loading');
    let cancelled = false;

    const loader = new GLTFLoader();
    try { const dracoLoader = new DRACOLoader(); dracoLoader.setDecoderPath('/draco/'); loader.setDRACOLoader(dracoLoader); } catch {}
    const loadGLB = (p: string) => new Promise<THREE.Object3D>((resolve, reject) => loader.load(p, (g) => resolve(g.scene), undefined, reject));

    (async () => {
      await Promise.all(attachments.map(async (a) => {
        const existing = attachmentObjectsRef.current.get(a.id);
        if (existing) {
          const existingPath = (existing.userData && existing.userData._path) || '';
          if (existingPath === a.path) {
            existing.scale.setScalar(a.scale);
            existing.position.set(a.position.x, a.position.y, a.position.z);
            if (a.rotation) existing.rotation.set(a.rotation.x, a.rotation.y, a.rotation.z);
            existing.visible = a.enabled;
            return;
          }
          try { assemblyGroupRef.current!.remove(existing); disposeObject(existing); } catch (e) {}
          attachmentObjectsRef.current.delete(a.id);
        }

        try {
          const model = await loadGLB(a.path);
          if (cancelled) return;
          model.scale.setScalar(a.scale);
          model.position.set(a.position.x, a.position.y, a.position.z);
          if (a.rotation) model.rotation.set(a.rotation.x, a.rotation.y, a.rotation.z);
          model.visible = a.enabled;
          setupShadows(model);
          (model.userData as any) = { _path: a.path };
          attachmentObjectsRef.current.set(a.id, model);
          assemblyGroupRef.current!.add(model);
        } catch (e) {
          // ignore per-attachment load error
        }
      }));

      // Remove attachments that are no longer present
      const ids = new Set(attachments.map((a) => a.id));
      Array.from(attachmentObjectsRef.current.keys()).forEach((id) => {
        if (!ids.has(id)) {
          const obj = attachmentObjectsRef.current.get(id)!;
          try { assemblyGroupRef.current!.remove(obj); disposeObject(obj); } catch (e) {}
          attachmentObjectsRef.current.delete(id);
        }
      });

      if (!cancelled) {
        fitViewRef.current?.();
        setStatus('ready');
      }
    })().catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [attachmentLoadKey]);

  // Quick visibility sync when attachments toggled
  useEffect(() => {
    attachments.forEach((attachment) => {
      const attachmentModel = attachmentObjectsRef.current.get(attachment.id);
      if (attachmentModel) attachmentModel.visible = attachment.enabled;
    });
    fitViewRef.current?.();
  }, [attachments]);

  return (
    <div ref={hostRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Loading 3D model
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
          3D model unavailable
        </div>
      )}
    </div>
  );
}
