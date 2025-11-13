// resources/js/Pages/Planos/FBXViewer.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

type FBXViewerProps = {
   file: File | string | null | undefined;
};

const FBXViewer: React.FC<FBXViewerProps> = ({ file }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Almacenamos las instancias de Three.js directamente en la referencia
    const sceneRef = useRef<THREE.Scene | null>(null); 
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null); 

    // --- 1. Configuración de la Escena (Se ejecuta una vez) ---
    useEffect(() => {
        if (!containerRef.current) return;

        // Inicializar Scene, Camera, Renderer
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0x202020);

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const aspect = width / height;
        
        const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000); 
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current = renderer;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Controles de Cámara
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls; 

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // Loop de Renderizado
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Manejo de Redimensionamiento
        const onResize = () => {
            if (containerRef.current) {
                const w = containerRef.current.clientWidth;
                const h = containerRef.current.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        };
        window.addEventListener('resize', onResize);

        // Limpieza
        return () => {
            window.removeEventListener('resize', onResize);
            // ✅ CORRECCIÓN 2: Acceder directamente a la instancia del renderizador
            const currentRenderer = rendererRef.current;
            if (containerRef.current && currentRenderer) {
                containerRef.current.removeChild(currentRenderer.domElement);
                currentRenderer.dispose();
            }
        };

    }, []);

    // --- 2. Función de Ajuste a la Vista (Fit to view) ---
    const fitCameraToModel = (model: THREE.Object3D) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 1. Calcular la distancia necesaria para encuadrar el modelo
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

        // 2. Ajustar el factor para evitar que el modelo toque el borde de la vista
        cameraDistance *= 1.2; 
        
        // 3. Establecer la posición objetivo (target) de la cámara y controles en el centro del modelo
        controls.target.copy(center);
        
        // 4. Calcular la nueva posición de la cámara 
        // Partimos de una posición por defecto (lejos del modelo)
        const offset = new THREE.Vector3(0, 0, cameraDistance);
        
        // Mover la cámara a la nueva posición relativa al centro del modelo
        camera.position.copy(center).add(offset);


        // Asegurar que los cambios se apliquen y los controles se actualicen
        camera.updateProjectionMatrix();
        controls.update();
    };

    // --- 3. Lógica de Carga de FBX (Se ejecuta con el cambio de archivo) ---
    useEffect(() => {
        const scene = sceneRef.current;
        if (!file || !scene) return;

        // Determinar un nombre válido tanto para File como para string (URL/ruta)
        const name = typeof file === 'string' ? file.split(/[#?]/)[0] : file.name;
        const ext = name.split('.').pop()?.toLowerCase() || '';

if (ext !== 'fbx') {
    console.warn('Se intenta cargar un archivo no FBX, se intentará de todos modos.');
}

        setIsLoading(true);
        let fileUrl: string | null = null;
        let createdObjectUrl = false;
        
        // Limpiar modelos existentes (remover todos los objetos excepto luces y cámara)
        scene.children
            .filter(child => child instanceof THREE.Group || child instanceof THREE.Mesh)
            .forEach(object => scene.remove(object));
        
        // Si nos pasaron una URL/route en string la usamos directamente, si es File creamos un objeto URL.
        if (typeof file === 'string') {
            fileUrl = file;
        } else {
            fileUrl = URL.createObjectURL(file);
            createdObjectUrl = true;
        }

        const loader = new FBXLoader();
        
        loader.load(
            fileUrl,
            (fbx) => {
                scene.add(fbx);
                
                // 🚀 AJUSTE CLAVE: Llamar a la función de encuadre
                fitCameraToModel(fbx); 
                
                setIsLoading(false);
            },
            (xhr) => {
                const progress = (xhr.loaded / (xhr.total || 1)) * 100;
                // console.log(`Cargando FBX: ${progress.toFixed(2)}%`); // Deshabilitado para reducir spam en la consola
            },
            (error) => {
                console.error('Error cargando FBX.', error);
                setIsLoading(false);
            }
        );

        // Limpieza: Revocar la URL del objeto temporal si fue creada.
        return () => {
            if (createdObjectUrl && fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };

    }, [file]); 

    return (
        <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-gray-900">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold z-10">
                    Cargando modelo FBX...
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
};

export default FBXViewer;