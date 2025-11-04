// resources/js/Pages/Planos/IFCViewer.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

type IFCViewerProps = {
    file: File | null;
};

const IFCViewer: React.FC<IFCViewerProps> = ({ file }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<IfcViewerAPI | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- 1. Inicialización del Visualizador Base (Mejoras de Luz) ---
    useEffect(() => {
        if (!containerRef.current) return;

        if (!viewerRef.current) {
            const viewer = new IfcViewerAPI({
                container: containerRef.current,
                backgroundColor: new THREE.Color(0x202020),
            });
            
            // CONFIGURACIÓN WASM
            viewer.IFC.setWasmPath('/wasm/');
            viewer.axes.setAxes();
            viewer.grid.setGrid();
            
            // Corrección de tipado: Habilitar post-producción
            (viewer.context.renderer.postProduction as any).enabled = true;

            // MEJORA DE ILUMINACIÓN
            const scene = viewer.context.scene;

            // Luz Ambiental (para evitar áreas completamente negras)
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
            scene.add(ambientLight);

            // Luz Direccional Principal (más fuerte)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
            directionalLight.position.set(10, 10, 10);
            scene.add(directionalLight);
            
            viewerRef.current = viewer;
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
        };

    }, []);

    // Función auxiliar para obtener extensión
    const getExtension = (file: File | null) => {
        if (!file) return '';
        return file.name.split('.').pop()?.toLowerCase() || '';
    };

    // --- 2. Lógica de Carga del Modelo (FBX/IFC y Escala) ---
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!file || !viewer) return;
        
        setIsLoading(true);

        const ext = getExtension(file);
        let fileUrl: string | null = null;
        
        // --- LIMPIEZA DE ESCENA ---
        // Casting a THREE.Scene para acceder a 'children' y 'remove'
        const scene = viewer.context.scene as any as THREE.Scene; 
        
        // 1. Limpiar modelos IFC previos
        viewer.context.items.ifcModels.forEach(model => scene.remove(model));
        viewer.context.items.ifcModels.length = 0;
        
        // 2. Limpiar otros modelos (FBX, etc.)
        if (scene && scene.children) {
            const objectsToRemove = scene.children.filter(c => (c as any).isMesh || (c as any).isGroup);
            
            if (objectsToRemove.length > 0) {
                scene.remove(...objectsToRemove); 
            }
        }
        // --- FIN LIMPIEZA ---
        
        fileUrl = URL.createObjectURL(file);

        const loadFBX = () => {
            const loader = new FBXLoader();
            loader.load(
                fileUrl!,
                (object) => {
                    scene.add(object);
                    
                    // CORRECCIÓN DE ESCALA Y POSICIÓN
                    const box = new THREE.Box3().setFromObject(object);
                    const center = box.getCenter(new THREE.Vector3());
                    
                    // Centrar el objeto en el origen (0, 0, 0)
                    object.position.sub(center); 
                    
                    // CORRECCIÓN DE TIPADO: Casting a 'any' para acceder a fitModel
                    (viewer.context.ifcCamera as any).fitModel(object); 

                    setIsLoading(false);
                },
                undefined,
                (err) => {
                    console.error('Error cargando FBX:', err);
                    setIsLoading(false);
                }
            );
        };

        const loadIFC = async () => {
            try {
                // El flag 'true' ajusta la cámara automáticamente al cargar el IFC
                await viewer.IFC.loadIfcUrl(fileUrl!, true);
            } catch (error) {
                console.error('Error cargando IFC:', error);
            }
            setIsLoading(false);
        };

        if (ext === 'fbx') loadFBX();
        else if (ext === 'ifc') loadIFC();
        else {
            console.warn('Formato no soportado para previsualización 3D:', ext);
            setIsLoading(false);
        }

        // Limpieza: Revocar la URL del objeto temporal.
        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };

    }, [file]); 

    return (
        <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-gray-900">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold z-10">
                    Cargando modelo 3D/BIM...
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
};

export default IFCViewer;