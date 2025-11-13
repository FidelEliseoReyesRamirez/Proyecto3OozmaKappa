// resources/js/Pages/Planos/FBXViewer.tsx

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

type FBXViewerProps = {
    file: File | string | null | undefined;
    extension?: string | null;
};

const FBXViewer: React.FC<FBXViewerProps> = ({ file, extension }) => {

    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    console.log("🟦 Inicializando FBXViewer...");

    // ------------------------------------------
    // 1) CREAR ESCENA UNA SOLA VEZ
    // ------------------------------------------
    useEffect(() => {
        if (!containerRef.current) return;

        console.log("🎨 Configurando escena 3D...");

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x202020);
        sceneRef.current = scene;

        // Camera
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
        camera.position.set(0, 1, 4);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls;

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 1.2);
        directional.position.set(5, 10, 7);
        scene.add(directional);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const resizeHandler = () => {
            if (!containerRef.current || !camera || !renderer) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener("resize", resizeHandler);

        // Cleanup
        return () => {
            window.removeEventListener("resize", resizeHandler);
            if (renderer && renderer.domElement && containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
                renderer.dispose();
            }
        };

    }, []);

    // ------------------------------------------
    // 2) FIT CAMERA TO MODEL
    // ------------------------------------------
    const fitCameraToModel = (model: THREE.Object3D) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = (camera.fov * Math.PI) / 180;

        let distance = maxDim / Math.tan(fov / 2);
        distance *= 1.4; // margen

        camera.position.copy(center);
        camera.position.z += distance;
        camera.position.y += distance * 0.2;

        controls.target.copy(center);
        camera.updateProjectionMatrix();
        controls.update();
    };

    // ------------------------------------------
    // 3) CARGA DEL FBX
    // ------------------------------------------
    useEffect(() => {
        const scene = sceneRef.current;
        if (!file || !scene) return;

        console.log("📄 Archivo recibido desde PHP:", file);
        console.log("🔍 Extensión REAL proporcionada:", extension);

        const ext = extension?.toLowerCase() || "";

        if (ext !== "fbx") {
            console.warn("⛔ Tipo no compatible con FBXViewer:", ext);
            return;
        }

        console.log("🟦 Preparando carga del archivo FBX...");

        setIsLoading(true);

        // Limpiar modelos anteriores (solo Mesh o Group)
        scene.children = scene.children.filter(obj => {
            if (obj instanceof THREE.Mesh || obj instanceof THREE.Group) return false;
            return true;
        });

        let fileUrl: string | null;
        let created = false;

        if (typeof file === "string") {
            fileUrl = file;
        } else {
            fileUrl = URL.createObjectURL(file);
            created = true;
        }

        console.log("➡️ Cargando FBX desde:", fileUrl);

        const loader = new FBXLoader();

        loader.load(
            fileUrl,
            (fbx) => {
                console.log("✅ FBX cargado exitosamente.");
                scene.add(fbx);
                fitCameraToModel(fbx);
                setIsLoading(false);
            },
            (xhr) => {
                const progress = ((xhr.loaded / (xhr.total || 1)) * 100).toFixed(1);
                console.log(`📦 Progreso carga FBX: ${progress}%`);
            },
            (error) => {
                console.error("❌ Error al cargar FBX:", error);
                setIsLoading(false);
            }
        );

        return () => {
            if (created && fileUrl) URL.revokeObjectURL(fileUrl);
        };

    }, [file, extension]);

    // ------------------------------------------
    // RENDER
    // ------------------------------------------
    return (
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gray-900">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg font-semibold">
                    Cargando modelo FBX...
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
};

export default FBXViewer;
