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
                backgroundColor: new THREE.Color(0x202020), // Fondo oscuro
            });
            
            // CONFIGURACIÓN WASM CRÍTICA
            viewer.IFC.setWasmPath('/wasm/'); 
            
            // 🚨 CARGA FORZADA DEL WORKER (Intento final para evitar LinkError por caché)
            try {
                // Genera la URL absoluta para el Worker
                const workerUrl = `${window.location.origin}/wasm/web-ifc-mt.worker.js`;
                const worker = new Worker(workerUrl);
                
                // Forzar la asignación del worker
                (viewer.IFC.loader.ifcManager as any).worker = worker;
                console.log('Worker IFC cargado y asignado forzosamente.');
            } catch (e) {
                console.error('No se pudo cargar o asignar el Worker IFC. Revise la ruta de los archivos en public/wasm.', e);
            }
            // -------------------------------------------------------------
            
            // Entorno
            viewer.axes.setAxes();
            viewer.grid.setGrid();
            
            // Habilitar post-producción
            (viewer.context.renderer.postProduction as any).enabled = true;

            // ILUMINACIÓN
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
        
        // --- LIMPIEZA DE ESCENA ---
        
        // CORRECCIÓN TS2352: Convertir a 'unknown' primero.
        const scene = viewer.context.scene as unknown as THREE.Scene; 
        
        // Limpiar modelos IFC previos
        viewer.context.items.ifcModels.forEach(model => scene.remove(model));
        viewer.context.items.ifcModels.length = 0;
        // --- FIN LIMPIEZA ---
        
        fileUrl = URL.createObjectURL(file);

        const loadIFC = async () => {
            try {
                // Usamos la API de IfcViewerAPI que gestiona el WASM y ajusta la cámara automáticamente
                await viewer.IFC.loadIfcUrl(fileUrl!, true); 
            } catch (error) {
                // Captura el error para ver la razón exacta (MIME type, CompileError, etc.)
                console.error('Error cargando IFC:', error);
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