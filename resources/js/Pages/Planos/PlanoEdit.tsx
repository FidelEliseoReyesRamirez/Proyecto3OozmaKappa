// resources/js/Pages/Planos/PlanoEdit.tsx

import React, { FormEventHandler, useMemo, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

// Importación requerida del componente FBXViewer
import FBXViewer from './FBXViewer'; 

// --- 🛠️ TIPOS ---
type FileType = 'PDF' | 'Otro' | 'ZIP' | 'URL' | 'BIM-FBX';

interface ProjectOption {
    id: number;
    name: string;
}

interface PlanoBimData {
    id: number;
    titulo: string; 
    descripcion: string;
    proyecto_id: number | null;
    tipo: FileType;
    enlace_externo: string | null; 
    archivo_url: string | null; 
}

interface PlanoEditProps extends PageProps {
    plano: PlanoBimData;
    projectsList: ProjectOption[];
}

const PlanoEdit: React.FC = () => {
    
    const { plano, projectsList } = usePage<PlanoEditProps>().props;

    // --- Lógica de Inicialización ---
    
    const validFileTypes: FileType[] = ['PDF', 'Otro', 'ZIP', 'URL', 'BIM-FBX'];
    
    const initialType: FileType = 
        (plano?.tipo && validFileTypes.includes(plano.tipo))
            ? plano.tipo
            : 'PDF';

    const initialUploadMode: 'archivo' | 'enlace' = 
        (plano?.enlace_externo && plano.tipo === 'URL') ? 'enlace' : 'archivo';

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        titulo: plano?.titulo ?? '', 
        descripcion: plano?.descripcion ?? '',
        proyecto_id: plano?.proyecto_id?.toString() ?? '', 
        
        archivo: null as File | null,
        enlace_externo: plano?.enlace_externo ?? '', 
        archivo_tipo: initialType, 
        
        archivo_actual: plano?.archivo_url ?? plano?.enlace_externo ?? 'Ninguno', 
    });

    // Estado para manejar la URL de objeto local del archivo subido (ya no se usa para FBXViewer directamente)
    const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [frontendError, setFrontendError] = useState('');
    
    const [uploadMode, setUploadMode] = useState<'archivo' | 'enlace'>(initialUploadMode);
    
    const [projectSearch, setProjectSearch] = useState('');

    useEffect(() => {
        let url: string | null = null;
        
        if (data.archivo && data.archivo_tipo !== 'BIM-FBX') { // Solo si no es FBX, ya que FBXViewer lo manejará internamente
            url = URL.createObjectURL(data.archivo);
            setLocalFileUrl(url);
        } else {
            setLocalFileUrl(null);
        }
        
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [data.archivo, data.archivo_tipo]);
    
    const fbxPreviewData = useMemo((): File | null => {
        // Solo consideraremos previsualización de FBX si el tipo seleccionado ES FBX
        if (data.archivo_tipo !== 'BIM-FBX') {
            return null;
        }

        // Si hay un archivo recién seleccionado, ese es el que se previsualiza.
        if (data.archivo) {
            return data.archivo; 
        }
        
        return null; // No hay un File para previsualizar.
    }, [data.archivo, data.archivo_tipo]);


    // 🛠️ TIPOS PERMITIDOS
    const allowedTypes = useMemo(
        () => [
            { label: 'Plano (DWG/DXF)', value: 'DWG' as FileType, extensions: ['.dwg', '.dxf', '.dwf'] },
            { label: 'Modelo BIM (FBX)', value: 'BIM-FBX' as FileType, extensions: ['.fbx'] },
            { label: 'Documento PDF', value: 'PDF' as FileType, extensions: ['.pdf'] },
            { label: 'Otro/Zip', value: 'Otro' as FileType, extensions: ['.zip', '.rar', '.7z', '.tar'] }, 
        ],
        []
    );

    const allAllowedExtensions = allowedTypes.flatMap(t => t.extensions);

    const acceptFileTypes = allowedTypes
        .find((t) => t.value === data.archivo_tipo)
        ?.extensions.join(',') || allAllowedExtensions.join(',');

    const isValidURL = (url: string): boolean => /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(url);

    const isValidFileType = (fileName: string): boolean => {
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return allAllowedExtensions.includes(ext);
    };

    const filteredProjects = projectsList.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    const getFileNameFromUrl = (url: string | null): string => {
        if (!url) return 'N/A';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };
    
    const currentFileName = useMemo(() => {
        if (plano?.enlace_externo && plano?.tipo === 'URL') {
            return `Enlace externo: ${plano.enlace_externo}`;
        }
        if (plano?.archivo_url) {
            return getFileNameFromUrl(plano.archivo_url);
        }
        return 'Ningún archivo asociado';
    }, [plano]);


    // --- Función de Envío ---
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFrontendError('');
        clearErrors();
        
        if (!plano || !plano.id) {
            setFrontendError('Error crítico: La información del plano no está disponible. No se puede actualizar.');
            return;
        }

        const hasNewFile = !!data.archivo;
        const hasAnyCurrentResource = !!plano?.archivo_url || !!plano?.enlace_externo;

        if (uploadMode === 'archivo') {
            // Limpiar enlace si cambiamos a modo archivo
            if (data.enlace_externo) {
                setData('enlace_externo', '');
            }
            if (!hasNewFile && !hasAnyCurrentResource) {
                setFrontendError('Este plano no tiene un archivo o enlace asociado. Debes subir un archivo para que sea válido.');
                return;
            }
            // Si hay un archivo nuevo, verificar que coincida con el tipo seleccionado
            if (data.archivo) {
                const selectedTypeExtensions = allowedTypes.find(t => t.value === data.archivo_tipo)?.extensions || [];
                const fileExt = data.archivo.name.toLowerCase().substring(data.archivo.name.lastIndexOf('.'));
                
                if (!selectedTypeExtensions.includes(fileExt)) {
                   setFrontendError(`El archivo seleccionado no coincide con el Tipo de Plano BIM: "${data.archivo_tipo}".`);
                   return;
                }
            }
        }

        if (uploadMode === 'enlace') {
            if (!data.enlace_externo) {
                setFrontendError('Debes ingresar un enlace externo válido o cambiar a modo archivo.');
                return;
            }
            if (!isValidURL(data.enlace_externo)) {
                setFrontendError('El enlace externo no es válido. Debe comenzar con http:// o https://');
                return;
            }
            // Limpiar archivo si cambiamos a modo enlace
            if (data.archivo) {
                setData('archivo', null);
            }
            // Forzar el tipo a 'URL' si está en modo enlace
            if (data.archivo_tipo !== 'URL') {
                setData('archivo_tipo', 'URL');
            }
        }

        // LLAMADA PUT:
        put(route('planos.update', plano.id), { 
            onSuccess: () => router.visit(route('planos.index')),
            onError: (errors) => console.error("Error de servidor:", errors), 
        });
    };

    // --- Estilos y Renderizado (Se mantiene el JSX) ---
    const inputStyle =
        'mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm transition duration-150';
    const labelStyle = 'block text-sm font-bold text-gray-300';

    if (!plano) {
        // ... (Manejo de error de plano nulo)
        return (
            <AuthenticatedLayout
                header={<h2 className="font-extrabold text-xl text-[#B3E10F] leading-tight tracking-wider">ERROR AL CARGAR PLANO</h2>}
            >
                <Head title="Error" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80 text-red-400">
                            No se pudo cargar la información del plano. Por favor, asegúrate de que el plano exista y tengas permisos para editarlo.
                            <button 
                                onClick={() => router.visit(route('planos.index'))}
                                className="mt-4 bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 text-white"
                            >
                                Volver a la lista de planos
                            </button>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F] leading-tight tracking-wider">EDITAR PLANO BIM</h2>}
        >
            <Head title={`Editar Plano: ${data.titulo || 'Sin título'}`} /> 

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* SECCIÓN DE PREVISUALIZACIÓN 3D (SOLO FBX) */}
                            {/* Se muestra si el tipo es BIM-FBX y hay un archivo nuevo (fbxPreviewData) O un archivo existente (plano.archivo_url) */}
                            {(data.archivo_tipo === 'BIM-FBX' && (fbxPreviewData || (plano?.archivo_url && plano.tipo === 'BIM-FBX'))) && (
                                <div className="mb-6 p-4 bg-[#080D15] rounded-lg border border-[#2970E8]">
                                    <h3 className="text-lg font-bold text-[#B3E10F] mb-3">
                                        Vista Previa del Modelo (FBX)
                                    </h3>
                                    <div className="h-[500px] w-full"> 
                                        <FBXViewer file={fbxPreviewData} /> 
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        * Se muestra el archivo recién seleccionado. Si no hay un archivo nuevo, se usa el archivo guardado (si aplica).
                                    </p>
                                </div>
                            )}
                            
                            {/* Título */}
                            <div>
                                <label htmlFor="titulo" className={labelStyle}>
                                    Título del Plano BIM
                                </label>
                                <input
                                    id="titulo"
                                    type="text"
                                    value={data.titulo} 
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    required
                                    className={inputStyle}
                                />
                                {errors.titulo && <p className="text-red-400 text-sm mt-1">{errors.titulo}</p>}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className={labelStyle}>
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    className={inputStyle}
                                />
                            </div>

                            {/* Proyecto Asociado */}
                            <div>
                                <label htmlFor="proyecto_id" className={labelStyle}>
                                    Proyecto Asociado
                                </label>
                                <input
                                    type="text"
                                    maxLength={100}
                                    placeholder="Buscar proyecto..."
                                    value={projectSearch}
                                    onChange={(e) => setProjectSearch(e.target.value)}
                                    className="mt-1 mb-2 w-full border border-gray-700 bg-[#080D15] text-white rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-[#B3E10F]/70 focus:border-[#B3E10F]/70"
                                />
                                <select
                                    id="proyecto_id"
                                    value={data.proyecto_id}
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    className={inputStyle}
                                >
                                    <option value="">(Sin proyecto asociado)</option> 
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Sin resultados</option>
                                    )}
                                </select>
                                {errors.proyecto_id && <p className="text-red-400 text-sm mt-1">{errors.proyecto_id}</p>}
                            </div>

                            {/* Tipo de Plano BIM */}
                            <div>
                                <label htmlFor="archivo_tipo" className={labelStyle}>
                                    Tipo de Plano BIM
                                </label>
                                <select
                                    id="archivo_tipo"
                                    value={uploadMode === 'enlace' ? 'URL' : data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as FileType)}
                                    className={inputStyle}
                                    disabled={uploadMode === 'enlace'} 
                                >
                                    {allowedTypes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                    {(uploadMode === 'enlace') && (
                                        <option value="URL">Enlace Externo (URL)</option> 
                                    )}
                                </select>
                                {uploadMode === 'enlace' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        El tipo es forzado a **"Enlace Externo (URL)"** cuando se selecciona el modo "Enlace externo".
                                    </p>
                                )}
                                {errors.archivo_tipo && <p className="text-red-400 text-sm mt-1">{errors.archivo_tipo}</p>}
                            </div>

                            {/* Modo de actualización */}
                            <div>
                                <label className={labelStyle}>Modo de actualización</label>
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center gap-2 text-gray-200">
                                        <input
                                            type="radio"
                                            name="uploadMode"
                                            checked={uploadMode === 'archivo'}
                                            onChange={() => {
                                                setUploadMode('archivo');
                                                setData('enlace_externo', '');
                                                if (data.archivo_tipo === 'URL') setData('archivo_tipo', 'PDF');
                                            }}
                                            className="accent-[#B3E10F]"
                                        />
                                        Subir nuevo archivo
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-200">
                                        <input
                                            type="radio"
                                            name="uploadMode"
                                            checked={uploadMode === 'enlace'}
                                            onChange={() => {
                                                setUploadMode('enlace');
                                                setData('archivo', null);
                                                setData('archivo_tipo', 'URL'); 
                                            }}
                                            className="accent-[#2970E8]"
                                        />
                                        Enlace externo
                                    </label>
                                </div>
                            </div>
                            
                            {/* Información del Archivo Actual */}
                            <div className="p-3 bg-[#080D15] border border-gray-700 rounded-md">
                                <p className="text-sm font-semibold text-gray-400 mb-1">Archivo / Enlace Actual:</p>
                                <p className="text-sm text-lime-300 truncate">
                                    {currentFileName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    * {uploadMode === 'archivo' && 'Si no seleccionas un nuevo archivo, se mantendrá el actual.'}
                                    {uploadMode === 'enlace' && 'Se actualizará el enlace al guardar.'}
                                </p>
                            </div>

                            {/* Campos de Entrada Condicionales */}
                            {uploadMode === 'archivo' ? (
                                <div>
                                    <label htmlFor="archivo" className={labelStyle}>
                                        **Subir NUEVO Archivo** (Opcional, reemplaza el actual)
                                    </label>
                                    
                                    {/* Mostrar el nombre del archivo si ya está cargado en el estado */}
                                    {data.archivo && (
                                        <p className="mt-1 mb-2 text-sm text-[#B3E10F] font-semibold flex items-center gap-2">
                                            📂 Archivo seleccionado: <span className="text-white truncate">{data.archivo.name}</span>
                                        </p>
                                    )}

                                    <input
                                        id="archivo"
                                        type="file"
                                        accept={acceptFileTypes}
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            
                                            if (!file) {
                                                setData('archivo', null); 
                                                return;
                                            }
                                            
                                            // Validaciones de frontend (tamaño y tipo general)
                                            if (!isValidFileType(file.name)) {
                                                setShowTypeModal(true);
                                                e.target.value = ''; 
                                                return;
                                            }
                                            if (file.size > 50 * 1024 * 1024) { // 50 MB
                                                setShowSizeModal(true);
                                                e.target.value = '';
                                                return;
                                            }
                                            
                                            setData('archivo', file);
                                        }}
                                        className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2970E8] file:text-white hover:file:bg-blue-600 transition duration-150"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Tipos aceptados para **{data.archivo_tipo}**: {acceptFileTypes}</p>
                                    {errors.archivo && <p className="text-red-400 text-sm mt-1">{errors.archivo}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="enlace_externo" className={labelStyle}>
                                        **Enlace Externo**
                                    </label>
                                    <input
                                        id="enlace_externo"
                                        type="url"
                                        value={data.enlace_externo}
                                        onChange={(e) => setData('enlace_externo', e.target.value)}
                                        placeholder="https://drive.google.com/..."
                                        className={inputStyle}
                                    />
                                    {errors.enlace_externo && <p className="text-red-400 text-sm mt-1">{errors.enlace_externo}</p>}
                                </div>
                            )}

                            {frontendError && (
                                <p className="text-red-400 font-semibold text-sm mt-2 text-center">{frontendError}</p>
                            )}

                            {/* Botones */}
                            <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('planos.index'))}
                                    className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="ml-4 bg-[#B3E10F] text-gray-900 px-3 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modales (se mantienen igual) */}
            {showSizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-lime-400/50 w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-lime-400 mb-2">Archivo demasiado grande</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            No se pueden subir archivos mayores a <span className="text-white font-semibold">50 MB</span>.<br />
                            Usa un <span className="text-lime-300">enlace externo</span> como Drive o OneDrive.
                        </p>
                        <button
                            onClick={() => setShowSizeModal(false)}
                            className="bg-lime-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-lime-300 transition duration-150"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {showTypeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-red-500/50 w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Tipo de archivo no permitido</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Solo se permiten formatos BIM o documentos reales: <span className="text-white font-semibold">FBX, DWG, DXF, PDF o archivos comprimidos</span>.<br />
                            Asegúrate de haber seleccionado el **Tipo de Plano BIM** correcto.
                        </p>
                        <button
                            onClick={() => setShowTypeModal(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-400 transition duration-150"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default PlanoEdit;