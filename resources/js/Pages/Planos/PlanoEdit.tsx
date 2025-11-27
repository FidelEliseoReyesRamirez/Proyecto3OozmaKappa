// resources/js/Pages/Planos/PlanoEdit.tsx

import React, { FormEventHandler, useMemo, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

// --- TIPOS PERMITIDOS ---
type FileType = 'BIM-FBX' | 'BIM-GLB' | 'BIM-GLTF';

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
    archivo_url: string | null;
}

interface PlanoEditProps extends PageProps {
    plano: PlanoBimData;
    projectsList: ProjectOption[];
}

const PlanoEdit: React.FC = () => {

    const { plano, projectsList } = usePage<PlanoEditProps>().props;

    // VALIDA TIPO INICIAL
    const initialType: FileType = ['BIM-FBX', 'BIM-GLB', 'BIM-GLTF'].includes(plano.tipo)
        ? plano.tipo
        : 'BIM-FBX';

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        titulo: plano.titulo,
        descripcion: plano.descripcion,
        proyecto_id: plano.proyecto_id ? plano.proyecto_id.toString() : '',
        archivo: null as File | null,
        archivo_tipo: initialType,
        archivo_actual: plano.archivo_url ?? 'Ninguno',
    });

    const [projectSearch, setProjectSearch] = useState('');
    const [frontendError, setFrontendError] = useState('');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);

    // TIPOS PERMITIDOS (SOLO 3D)
    const allowedTypes = [
        { label: 'Modelo FBX', value: 'BIM-FBX' as FileType, extensions: ['.fbx'] },
        { label: 'Modelo GLB', value: 'BIM-GLB' as FileType, extensions: ['.glb'] },
        { label: 'Modelo GLTF', value: 'BIM-GLTF' as FileType, extensions: ['.gltf'] },
    ];

    const allExtensions = allowedTypes.flatMap(t => t.extensions);

    const acceptFileTypes =
        allowedTypes.find(t => t.value === data.archivo_tipo)?.extensions.join(',') ||
        allExtensions.join(',');

    const isValidFileType = (fileName: string): boolean => {
        const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
        const validExt = allowedTypes.find(t => t.value === data.archivo_tipo)?.extensions || [];
        return validExt.includes(ext);
    };

    const filteredProjects = projectsList.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    const getFileNameFromUrl = (url: string | null): string => {
        if (!url) return 'Sin archivo';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFrontendError('');
        clearErrors();

        const hasNewFile = !!data.archivo;

        // Si no hay archivo nuevo ni archivo actual → error
        if (!hasNewFile && !plano.archivo_url) {
            setFrontendError('Debes subir un archivo FBX/GLB/GLTF.');
            return;
        }

        // Si hay archivo nuevo → validar tipo
        if (hasNewFile) {
            const file = data.archivo!;
            const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

            const allowedExt = allowedTypes.find(t => t.value === data.archivo_tipo)?.extensions || [];

            if (!allowedExt.includes(ext)) {
                setShowTypeModal(true);
                return;
            }

            // Tamaño máximo 150 MB
            if (file.size > 150 * 1024 * 1024) {
                setShowSizeModal(true);
                return;
            }
        }

        put(route('planos.update', plano.id), {
            onSuccess: () => router.visit(route('planos.index')),
        });
    };

    const inputStyle =
        'mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm';
    const labelStyle = 'block text-sm font-bold text-gray-300';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F]">EDITAR MODELO BIM</h2>}
        >
            <Head title={`Editar: ${data.titulo}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] p-8 border border-gray-800/80 rounded-xl shadow-2xl">

                        <form onSubmit={submit} className="space-y-6">

                            {/* TITULO */}
                            <div>
                                <label className={labelStyle}>Título</label>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className={inputStyle}
                                />
                                {errors.titulo && <p className="text-red-400 text-sm">{errors.titulo}</p>}
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div>
                                <label className={labelStyle}>Descripción</label>
                                <textarea
                                    rows={3}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className={inputStyle}
                                />
                            </div>

                            {/* PROYECTO */}
                            <div>
                                <label className={labelStyle}>Proyecto</label>

                                <input
                                    type="text"
                                    placeholder="Buscar proyecto..."
                                    className="mt-1 mb-2 w-full bg-[#080D15] border border-gray-700 text-white rounded-md py-1 px-3 text-sm"
                                    value={projectSearch}
                                    onChange={(e) => setProjectSearch(e.target.value)}
                                />

                                <select
                                    value={data.proyecto_id}
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    className={inputStyle}
                                >
                                    <option value="">(Sin proyecto asociado)</option>

                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Sin resultados</option>
                                    )}
                                </select>
                            </div>

                            {/* TIPO 3D */}
                            <div>
                                <label className={labelStyle}>Tipo de modelo 3D</label>
                                <select
                                    value={data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as FileType)}
                                    className={inputStyle}
                                >
                                    {allowedTypes.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ARCHIVO ACTUAL */}
                            <div className="p-3 rounded-md bg-[#080D15] border border-gray-700">
                                <p className="text-sm text-gray-300">Archivo actual:</p>
                                <p className="text-lime-300 text-sm font-semibold truncate">
                                    {getFileNameFromUrl(plano.archivo_url)}
                                </p>
                            </div>

                            {/* SUBIR NUEVO ARCHIVO */}
                            <div>
                                <label className={labelStyle}>Reemplazar archivo (opcional)</label>

                                {data.archivo && (
                                    <p className="text-[#B3E10F] text-sm mb-2">
                                        Archivo seleccionado: {data.archivo.name}
                                    </p>
                                )}

                                <input
                                    type="file"
                                    accept={acceptFileTypes}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        if (!file) return;

                                        if (!isValidFileType(file.name)) {
                                            setShowTypeModal(true);
                                            e.target.value = '';
                                            return;
                                        }
                                        if (file.size > 150 * 1024 * 1024) {
                                            setShowSizeModal(true);
                                            e.target.value = '';
                                            return;
                                        }

                                        setData('archivo', file);
                                    }}
                                    className="mt-1 block w-full text-sm text-gray-300 file:bg-[#2970E8] file:text-white file:px-4 file:py-2 file:rounded-lg"
                                />

                                <p className="text-xs text-gray-400 mt-1">
                                    Permitido: {acceptFileTypes}
                                </p>
                            </div>

                            {frontendError && (
                                <p className="text-red-400 text-center text-sm font-semibold">
                                    {frontendError}
                                </p>
                            )}

                            {/* BOTONES */}
                            <div className="flex justify-end border-t pt-4 border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('planos.index'))}
                                    className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-3 bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-lime-300 text-sm"
                                >
                                    {processing ? 'Guardando…' : 'Guardar Cambios'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {/* MODALES */}
            {showSizeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#0F172A] p-6 rounded-xl border border-lime-400/50 text-center">
                        <h2 className="text-lime-400 text-xl font-bold">Archivo demasiado grande</h2>
                        <p className="text-gray-300 mt-4">
                            El tamaño máximo permitido es <b>150 MB</b>.
                        </p>
                        <button
                            onClick={() => setShowSizeModal(false)}
                            className="mt-4 bg-lime-400 text-black px-4 py-2 rounded-md font-bold"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {showTypeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#0F172A] p-6 rounded-xl border border-red-500/50 text-center">
                        <h2 className="text-red-400 text-xl font-bold">Tipo no permitido</h2>
                        <p className="text-gray-300 mt-4">
                            Solo se permiten modelos 3D: <b>FBX / GLB / GLTF</b>.
                        </p>
                        <button
                            onClick={() => setShowTypeModal(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md font-bold"
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
