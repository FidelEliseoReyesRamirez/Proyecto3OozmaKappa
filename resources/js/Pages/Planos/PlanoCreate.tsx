// resources/js/Pages/Planos/PlanoCreate.tsx

import React, { FormEventHandler, useMemo, useState, useRef } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FBXViewer from './FBXViewer';

// Definición de tipos
type FileType = 'PDF' | 'Excel' | 'Word' | 'Imagen' | 'BIM-FBX'; 

interface Project {
    id: number;
    name: string;
}

interface PlanoCreateProps extends PageProps {
    projectsList: Project[];
}

const PlanoCreate: React.FC = () => {
    // Asumiendo que 'projectsList' se pasa desde el controlador de Laravel
    const { projectsList } = usePage<PlanoCreateProps>().props;
    
    // Hook de formulario de Inertia
    const { data, setData, post, processing, clearErrors, errors } = useForm({
        titulo: '',
        descripcion: '',
        // Establecer el primer proyecto como valor inicial si la lista no está vacía
        proyecto_id: projectsList.length > 0 ? projectsList[0].id.toString() : '',
        archivo: null as File | null,
        enlace_externo: '',
        archivo_tipo: 'PDF' as FileType,
    });

    const [projectSearch, setProjectSearch] = useState('');
    
    // ✅ CORRECCIÓN: Los dos estados de modal ahora tienen nombres únicos
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false); 
    
    const [frontendError, setFrontendError] = useState('');
    
    // Referencia para limpiar el input de tipo file
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tipos de archivo permitidos
    const allowedTypes = useMemo(() => [
        { label: 'Plano en PDF', value: 'PDF' as FileType, extensions: ['.pdf'] },
        { label: 'Información Excel', value: 'Excel' as FileType, extensions: ['.xls', '.xlsx', '.xlsm'] },
        { label: 'Imagen de Plano (JPG/PNG)', value: 'Imagen' as FileType, extensions: ['.jpg', '.jpeg', '.png'] },
        // Soporte BIM/3D para FBX
        { label: 'Modelo BIM/3D (FBX)', value: 'BIM-FBX' as FileType, extensions: ['.fbx'] },
    ], []);
    
    const allValidExtensions = allowedTypes.flatMap(t => t.extensions);

    const getAcceptAttribute = (selectedType: FileType): string => {
        const typeInfo = allowedTypes.find(t => t.value === selectedType);
        return typeInfo ? typeInfo.extensions.join(',') : allValidExtensions.join(',');
    };

    const acceptFileTypes = getAcceptAttribute(data.archivo_tipo);

    const isValidURL = (url: string): boolean => /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(url);

    const isValidFileType = (fileName: string): boolean => {
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        const currentAllowedExtensions = allowedTypes.find(t => t.value === data.archivo_tipo)?.extensions || allValidExtensions;
        return currentAllowedExtensions.includes(ext);
    };

    const filteredProjects = projectsList.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );
    
    const handleFileChange = (file: File | null) => {
        if (file) {
            // Si se carga un archivo, limpiamos el enlace externo
            setData((prevData) => ({ ...prevData, enlace_externo: '' })); 
        }
        setData('archivo', file);
        setFrontendError('');
    };

    const handleEnlaceChange = (value: string) => {
        if (value) {
            // Si se pone un enlace, limpiamos el archivo local
            setData((prevData) => ({ ...prevData, archivo: null })); 
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        setData('enlace_externo', value);
        setFrontendError('');
    };
    
    const handleTipoChange = (newType: FileType) => {
        setData('archivo_tipo', newType);
        // Resetea archivo y enlace al cambiar de tipo
        setData('archivo', null);
        setData('enlace_externo', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFrontendError(''); 
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFrontendError('');
        clearErrors();

        if (!data.archivo && !data.enlace_externo) {
            setFrontendError('Debes subir un archivo de plano o ingresar un enlace externo.');
            return;
        }

        if (data.enlace_externo && !isValidURL(data.enlace_externo)) {
            setFrontendError('El enlace proporcionado no es válido. Debe comenzar con http:// o https://');
            return;
        }

        // Envío del formulario (Inertia gestiona la subida del archivo 'data.archivo')
        post(route('planos.store'), { 
            onSuccess: () => router.visit(route('planos.index')),
            onError: (errors) => console.error("Error al subir el plano:", errors)
        });
    };

    const inputStyle =
        "mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm transition duration-150";
    const labelStyle = "block text-sm font-bold text-gray-300";


    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F] leading-tight tracking-wider">SUBIR NUEVO PLANO</h2>}
        >
            <Head title="Subir Plano" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        <form onSubmit={submit} className="space-y-6">

                            {/* PROYECTO BUSCABLE */}
                            {/* ... (código del proyecto) ... */}
                            <div>
                                <label htmlFor="proyecto_id" className={labelStyle}>Proyecto Asociado</label>
                                <input
                                    type="text"
                                    placeholder="Buscar proyecto..."
                                    value={projectSearch}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(0, 100);
                                        setProjectSearch(value);
                                    }}
                                    className="mt-1 mb-2 w-full border border-gray-700 bg-[#080D15] text-white rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-[#B3E10F]/70 focus:border-[#B3E10F]/70"
                                />
                                <select
                                    id="proyecto_id"
                                    name="proyecto_id"
                                    value={data.proyecto_id}
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    required
                                    className={inputStyle}
                                >
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Sin resultados</option>
                                    )}
                                </select>
                                {errors.proyecto_id && <p className="text-red-400 text-xs mt-1">{errors.proyecto_id}</p>}
                            </div>

                            {/* TITULO */}
                            <div>
                                <label htmlFor="titulo" className={labelStyle}>Título del Plano</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    required
                                    className={inputStyle}
                                />
                                {errors.titulo && <p className="text-red-400 text-xs mt-1">{errors.titulo}</p>}
                            </div>

                            {/* DESCRIPCION */}
                            <div>
                                <label htmlFor="descripcion" className={labelStyle}>Descripción (Opcional)</label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    className={inputStyle}
                                />
                                {errors.descripcion && <p className="text-red-400 text-xs mt-1">{errors.descripcion}</p>}
                            </div>

                            {/* TIPO */}
                            <div>
                                <label htmlFor="archivo_tipo" className={labelStyle}>Tipo de Archivo del Plano</label>
                                <select
                                    id="archivo_tipo"
                                    value={data.archivo_tipo}
                                    onChange={(e) => handleTipoChange(e.target.value as FileType)}
                                    required
                                    className={inputStyle}
                                >
                                    {allowedTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ARCHIVO */}
                            <div>
                                <label htmlFor="archivo" className={labelStyle}>
                                    Subir Archivo de Plano (Máx. 50 MB)
                                </label>
                                <input
                                    ref={fileInputRef} 
                                    id="archivo"
                                    type="file"
                                    accept={acceptFileTypes}
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        if (!file) return;

                                        // Validaciones de tipo y tamaño
                                        if (!isValidFileType(file.name)) {
                                            // Usamos la función de actualización corregida
                                            setShowTypeModal(true); 
                                            e.target.value = ''; 
                                            return;
                                        }
                                        if (file.size > 50 * 1024 * 1024) {
                                            setShowSizeModal(true);
                                            e.target.value = ''; 
                                            return;
                                        }

                                        handleFileChange(file); 
                                    }}
                                    className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2970E8] file:text-white hover:file:bg-blue-600 transition duration-150"
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Extensiones aceptadas para **{data.archivo_tipo}**: <span className="font-mono text-white/80">{getAcceptAttribute(data.archivo_tipo)}</span>
                                </p>
                                {errors.archivo && <p className="text-red-400 text-xs mt-1">{errors.archivo}</p>}
                            </div>

                            {/* PREVISUALIZADOR 3D (FBX) */}
                            {data.archivo_tipo === 'BIM-FBX' && data.archivo && (
                                <div className="p-4 bg-[#080D15] rounded-lg border border-gray-700/80">
                                    <h3 className="text-lg font-bold text-[#B3E10F] mb-3">Previsualización del Modelo 3D (FBX)</h3>
                                    <FBXViewer file={data.archivo} />
                                </div>
                            )}

                            {/* ENLACE */}
                            <div>
                                <label htmlFor="enlace_externo" className={labelStyle}>Enlace Externo (Drive, OneDrive, etc.)</label>
                                <input
                                    id="enlace_externo"
                                    type="url"
                                    value={data.enlace_externo}
                                    onChange={(e) => {
                                        handleEnlaceChange(e.target.value); 
                                    }}
                                    placeholder="https://drive.google.com/..."
                                    className={inputStyle}
                                />
                                {(data.archivo || data.enlace_externo) && (
                                    <p className={`mt-1 text-xs font-semibold ${data.archivo ? 'text-lime-400' : 'text-gray-400'}`}>
                                        {data.archivo 
                                            ? `Archivo local seleccionado: ${data.archivo.name} (Se ignorará el enlace).`
                                            : `Enlace externo: ${data.enlace_externo}`
                                        }
                                    </p>
                                )}
                                {errors.enlace_externo && <p className="text-red-400 text-xs mt-1">{errors.enlace_externo}</p>}
                            </div>

                            {frontendError && (
                                <p className="text-red-400 font-semibold text-sm mt-2 text-center">{frontendError}</p>
                            )}

                            {/* BOTONES */}
                            <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="bg-[#B3E10F] text-gray-900 px-3 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30 disabled:opacity-50"
                                >
                                    {processing ? 'Subiendo...' : 'Subir Plano'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('planos.index'))}
                                    className="ml-4 bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* MODALES */}
            {showSizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-lime-400/50 w-11/12 max-w-md animate-fadeIn">
                        <h2 className="text-xl font-bold text-lime-400 mb-2">Archivo demasiado grande</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            No se pueden subir archivos de plano mayores a <span className="text-white font-semibold">50 MB</span>.
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
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-red-500/50 w-11/12 max-w-md animate-fadeIn">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Tipo de archivo no permitido</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Solo se permiten los tipos de archivo especificados para **{data.archivo_tipo}**.<br />
                            Extensiones aceptadas: <span className="text-white font-semibold">{getAcceptAttribute(data.archivo_tipo)}</span>
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

export default PlanoCreate;