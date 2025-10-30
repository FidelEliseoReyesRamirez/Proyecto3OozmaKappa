// PlanosEdit.tsx
import React, { FormEventHandler, useMemo, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Asumiendo que esta es la ruta real
import { PageProps } from '@/types'; // Asumiendo que esta es la ruta real

// Definiciones de tipos adaptadas para Planos
type FileType = 'PDF' | 'Excel' | 'Word' | 'Otro';

interface ProjectOption {
    id: number;
    name: string;
}

// Interfaz del objeto que viene del controlador
interface PlanoData {
    id: number;
    titulo: string;
    descripcion: string;
    proyecto_id: number | null;
    tipo: string; 
    enlace_externo: string | null;
}

// 💡 CORRECCIÓN 1: La interfaz de Props debe esperar 'document'
interface PlanosEditProps extends PageProps {
    document: PlanoData; // Antes se llamaba 'plano'
    projectsList: ProjectOption[];
    // Aquí puedes añadir maxFileSize y acceptedMimes si los pasas desde el controlador
}

// Objeto de valor por defecto para evitar el error de 'undefined'
const defaultPlano: PlanoData = {
    id: 0,
    titulo: 'Plano Desconocido',
    descripcion: '',
    proyecto_id: null,
    tipo: 'PDF',
    enlace_externo: null,
};

const PlanosEdit: React.FC = () => {
    
    // 💡 CORRECCIÓN 2: Extraer 'document' (no 'plano') de las props
    const { document: propDocument, projectsList: propProjectsList } = usePage<PlanosEditProps>().props;

    // 💡 CORRECCIÓN 3: Usar la prop extraída o el valor por defecto
    const plano = propDocument || defaultPlano;
    const projectsList = propProjectsList || [];
    
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        // Ahora 'plano.titulo' funcionará porque 'plano' está correctamente asignado
        titulo: plano.titulo,
        descripcion: plano.descripcion,
        proyecto_id: plano.proyecto_id ? plano.proyecto_id.toString() : '',
        archivo: null as File | null,
        enlace_externo: plano.enlace_externo || '',
        archivo_tipo: (plano.tipo as FileType) || 'PDF',
        _method: 'put', 
    });

    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [frontendError, setFrontendError] = useState('');
    
    const [uploadMode, setUploadMode] = useState<'archivo' | 'enlace'>(
        plano.enlace_externo ? 'enlace' : 'archivo'
    );
    const [projectSearch, setProjectSearch] = useState('');

    const allowedTypes = useMemo(
        () => [
            { label: 'Plano PDF (.pdf)', value: 'PDF' as FileType, extensions: ['.pdf'] },
            { label: 'Tabla/Datos (Excel)', value: 'Excel' as FileType, extensions: ['.xls', '.xlsx', '.xlsm'] },
            { label: 'Especificaciones (Word)', value: 'Word' as FileType, extensions: ['.doc', '.docx'] },
        ],
        []
    );

    const acceptFileTypes = allowedTypes
        .find((t) => t.value === data.archivo_tipo)
        ?.extensions.join(',') || '.pdf,.xls,.xlsx,.xlsm,.doc,.docx';

    const isValidURL = (url: string): boolean => /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(url);

    const isValidFileType = (fileName: string): boolean => {
        const validExtensions = allowedTypes.flatMap(t => t.extensions);
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return validExtensions.includes(ext);
    };

    const filteredProjects = projectsList.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFrontendError('');
        clearErrors();

        if (uploadMode === 'archivo' && data.archivo) {
            // Si hay archivo, enviamos el formulario completo con 'post' y '_method: put'
            // 'plano.id' es seguro de usar aquí
            post(route('planos.update', plano.id));
            return;
        }

        if (uploadMode === 'enlace' && (!data.enlace_externo || !isValidURL(data.enlace_externo))) {
            setFrontendError('El enlace externo no es válido. Debe comenzar con http:// o https://');
            return;
        }

        if (uploadMode === 'enlace' || (uploadMode === 'archivo' && !data.archivo)) {
            // Si es modo enlace, o si es modo archivo SIN archivo nuevo, usamos router.put
            router.put(route('planos.update', plano.id), {
                titulo: data.titulo,
                descripcion: data.descripcion,
                proyecto_id: data.proyecto_id,
                enlace_externo: data.enlace_externo,
                archivo_tipo: data.archivo_tipo,
                // No enviamos 'archivo: null' para que el backend no lo interprete
            }, {
                onSuccess: () => router.visit(route('planos.index')),
            });
        }
    };

    const inputStyle =
        'mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm transition duration-150';
    const labelStyle = 'block text-sm font-bold text-gray-300';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F] leading-tight tracking-wider">EDITAR PLANO</h2>}
        >
            <Head title={`Editar: ${plano.titulo || 'Plano sin título'}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Título */}
                            <div>
                                <label htmlFor="titulo" className={labelStyle}>
                                    Título del Plano
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

                            {/* Proyecto (combo buscable) */}
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
                                    <option value="">(Sin asignar)</option>
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
                            </div>

                            {/* Tipo de Plano */}
                            <div>
                                <label htmlFor="archivo_tipo" className={labelStyle}>
                                    Formato del Archivo (Para filtrado)
                                </label>
                                <select
                                    id="archivo_tipo"
                                    value={data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as FileType)}
                                    className={inputStyle}
                                >
                                    {allowedTypes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Modo de subida */}
                            <div>
                                <label className={labelStyle}>Modo de Contenido</label>
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center gap-2 text-gray-200">
                                        <input
                                            type="radio"
                                            name="uploadMode"
                                            checked={uploadMode === 'archivo'}
                                            onChange={() => {
                                                setUploadMode('archivo');
                                                setData('enlace_externo', '');
                                            }}
                                            className="accent-[#B3E10F]"
                                        />
                                        Actualizar con un nuevo archivo
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-200">
                                        <input
                                            type="radio"
                                            name="uploadMode"
                                            checked={uploadMode === 'enlace'}
                                            onChange={() => {
                                                setUploadMode('enlace');
                                                setData('archivo', null);
                                            }}
                                            className="accent-[#2970E8]"
                                        />
                                        Usar un enlace externo
                                    </label>
                                </div>
                            </div>

                            {/* Archivo o enlace */}
                            {uploadMode === 'archivo' ? (
                                <div>
                                    <label htmlFor="archivo" className={labelStyle}>
                                        Subir Nuevo Plano (Máx. 50 MB, si no selecciona uno se mantiene el actual)
                                    </label>
                                    <input
                                        id="archivo"
                                        type="file"
                                        accept={acceptFileTypes}
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if (!file) {
                                                setData('archivo', null); // Permite deseleccionar
                                                return;
                                            }

                                            if (!isValidFileType(file.name)) {
                                                setShowTypeModal(true);
                                                e.target.value = '';
                                                setData('archivo', null);
                                                return;
                                            }
                                            if (file.size > 50 * 1024 * 1024) {
                                                setShowSizeModal(true);
                                                e.target.value = '';
                                                setData('archivo', null);
                                                return;
                                            }
                                            setData('archivo', file);
                                        }}
                                        className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2970E8] file:text-white hover:file:bg-blue-600 transition duration-150"
                                    />
                                    {data.archivo && (
                                        <p className="text-sm text-lime-400 mt-2">
                                            Archivo seleccionado: **{data.archivo.name}**
                                        </p>
                                    )}
                                    {!data.archivo && !plano.enlace_externo && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Plano actual: **Archivo subido anteriormente** (No se reemplazará a menos que selecciones uno nuevo).
                                        </p>
                                    )}

                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="enlace_externo" className={labelStyle}>
                                        Enlace Externo (Drive, OneDrive, etc.)
                                    </label>
                                    <input
                                        id="enlace_externo"
                                        type="url"
                                        value={data.enlace_externo || ''} // Aseguramos que no sea null
                                        onChange={(e) => setData('enlace_externo', e.target.value)}
                                        placeholder="https://drive.google.com/..."
                                        className={inputStyle}
                                    />
                                </div>
                            )}

                            {frontendError && (
                                <p className="text-red-400 font-semibold text-sm mt-2 text-center">{frontendError}</p>
                            )}

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
                                    {processing ? 'Guardando...' : 'Guardar Cambios del Plano'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: tamaño excedido */}
            {showSizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-lime-400/50 w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-lime-400 mb-2">Archivo demasiado grande</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            No se pueden subir planos mayores a <span className="text-white font-semibold">50 MB</span>.<br />
                            Usa el modo <span className="text-lime-300">enlace externo</span> como Drive o OneDrive para archivos más grandes.
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

            {/* Modal: tipo inválido */}
            {showTypeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-red-500/50 w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Tipo de archivo no permitido</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Solo se permiten formatos de planos/documentos: <span className="text-white font-semibold">PDF, Word o Excel</span>.<br />
                            No se aceptan imágenes, videos, ni archivos de CAD nativos aquí.
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

export default PlanosEdit;