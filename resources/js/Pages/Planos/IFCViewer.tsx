// resources/js/Pages/Planos/IFCViewer.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

type IFCViewerProps = {
    file: File | null;
};

const IFCViewer: React.FC<IFCViewerProps> = ({ file }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<IfcViewerAPI | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- 1. Inicialización del Visualizador y Entorno ---
    useEffect(() => {
        if (!containerRef.current) return;

        if (!viewerRef.current) {
            const viewer = new IfcViewerAPI({
                container: containerRef.current,
                backgroundColor: new THREE.Color(0x202020),
            });
            
            // 🚨 CORRECCIÓN CRÍTICA FINAL: Forzar modo Single-Thread.
            // Deshabilita explícitamente el uso de IFC Workers (hilos), 
            // eliminando el 'LinkError' relacionado con la compilación del WASM multihilo.
            (viewer.IFC.loader.ifcManager as any).useIfcWorkers = false;

            // 1. Configuración de la carpeta WASM
            viewer.IFC.setWasmPath('/wasm/'); 
            
            // 2. Configuración del Entorno
            viewer.axes.setAxes();
            viewer.grid.setGrid();
            
            (viewer.context.renderer.postProduction as any).enabled = true;

            // 3. Iluminación
            const scene = viewer.context.scene;
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
            scene.add(ambientLight);

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

    // --- 2. Lógica de Carga del Modelo (Solo IFC) ---
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!file || !viewer) return;
        
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (ext !== 'ifc') {
            console.warn('Solo se soporta el formato IFC en este visor.');
            return;
        }

        setIsLoading(true);
        let fileUrl: string | null = null;
        
        // Limpieza de escena
        const scene = viewer.context.scene as unknown as THREE.Scene; 
        viewer.context.items.ifcModels.forEach(model => scene.remove(model));
        viewer.context.items.ifcModels.length = 0;
        
        fileUrl = URL.createObjectURL(file);

        const loadIFC = async () => {
            try {
                // Usamos la API de IfcViewerAPI que gestiona el WASM
                await viewer.IFC.loadIfcUrl(fileUrl!, true); 
            } catch (error) {
                // La causa del error ahora es *muy* probable que no sea la carga WASM.
                console.error('Error cargando IFC.', error);
            }
            setIsLoading(false);
        };

        loadIFC();

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
                    Cargando modelo BIM (IFC)...
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
};

export default IFCViewer;