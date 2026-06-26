"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ModelStageProps {
  modelUrl: string;
  fallbackUrl: string;
  mood: string;
  isActive: boolean;
}

export function ModelStage({
  modelUrl,
  fallbackUrl,
  mood,
  isActive,
}: ModelStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frame = 0;
    let model: THREE.Object3D | null = null;
    let baseModelY = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.18, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    container.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2.2, 3.2, 3.8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffc7df, 1.15);
    fillLight.position.set(-2.8, 1.4, 2.4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x9ef7ff, 1.55);
    rimLight.position.set(0.2, 2.4, -3.5);
    scene.add(rimLight);

    const ambient = new THREE.HemisphereLight(0xfff6fb, 0x12343a, 1.55);
    scene.add(ambient);

    function fitCameraToModel() {
      if (!model) return;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov =
        2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const verticalDistance = size.y / (2 * Math.tan(verticalFov / 2));
      const horizontalDistance = size.x / (2 * Math.tan(horizontalFov / 2));
      const distance = Math.max(verticalDistance, horizontalDistance, 1) * 1.28;

      camera.position.set(0, 0.18, distance);
      camera.lookAt(0, 0.04, 0);
    }

    function resize() {
      if (!container) return;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      fitCameraToModel();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;

        model = gltf.scene;
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.castShadow = false;
          child.receiveShadow = false;
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.transparent = material.transparent || material.opacity < 1;
            });
          } else if (child.material) {
            child.material.transparent =
              child.material.transparent || child.material.opacity < 1;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const targetHeight = 3.35;
        const scale = targetHeight / Math.max(size.y, 1);

        model.scale.setScalar(scale);
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

        model.position.sub(scaledCenter);
        baseModelY = model.position.y;
        model.rotation.y = 0;

        scene.add(model);
        fitCameraToModel();
        setLoadState("ready");
      },
      undefined,
      () => {
        if (!disposed) setLoadState("error");
      }
    );

    const clock = new THREE.Clock();
    function animate() {
      frame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (model) {
        const targetRotation = Math.sin(elapsed * 0.55) * 0.12;
        model.rotation.y += (targetRotation - model.rotation.y) * 0.04;
        model.position.y =
          baseModelY + Math.sin(elapsed * 1.35) * (isActive ? 0.055 : 0.03);
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      });
      renderer.domElement.remove();
    };
  }, [isActive, modelUrl]);

  return (
    <div
      className="relative h-full min-h-[180px] w-full overflow-hidden"
      aria-label={`UIT Waifu 3D avatar stage, ${mood} mood`}
    >
      <div
        className={[
          "absolute inset-x-0 bottom-0 mx-auto h-[92%] w-full bg-contain bg-bottom bg-no-repeat blur-[0.2px] transition-opacity duration-500",
          loadState === "ready" ? "opacity-0" : "opacity-60",
        ].join(" ")}
        style={{ backgroundImage: `url(${fallbackUrl})` }}
      />
      <div ref={containerRef} className="absolute inset-0" />
      {loadState !== "ready" && (
        <div className="absolute inset-x-0 bottom-4 mx-auto w-max rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/65 backdrop-blur">
          {loadState === "error" ? "Model unavailable" : "Loading model"}
        </div>
      )}
    </div>
  );
}
