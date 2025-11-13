// resources/js/Pages/Planos/PlanoCreate.tsx

import React, { FormEventHandler, useMemo, useState, useRef, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

type FileType = 'PDF' | 'Excel' | 'Word' | 'Imagen' | 'BIM-FBX';

interface Project {
    id: number;
    name: string;
}

interface PlanoCreateProps extends PageProps {
    projectsList: Project[];
}

const PlanoCreate: React.FC = () => {

    const { projectsList } = usePage<PlanoCreateProps>().props;

    const { data, setData, post, processing, clearErrors, errors } = useForm({
        titulo: '',
        descripcion: '',
        proyecto_id: projectsList.length > 0 ? projectsList[0].id.toString() : '',
        archivo: null as File | null,
        enlace_externo: '',
        archivo_tipo: 'PDF' as FileType,
    });

    const [projectSearch, setProjectSearch] = useState('');

    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);

    const [frontendError, setFrontendError] = useState('');

    // BLOQUEO MODELO 3D
    const [tieneModelo3D, setTieneModelo3D] = useState(false);
    const [showModelo3DModal, setShowModelo3DModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // TIPOS PERMITIDOS
    const allowedTypes = useMemo(() => [
        { label: 'Plano en PDF', value: 'PDF' as FileType, extensions: ['.pdf'] },
        { label: 'Información Excel', value: 'Excel' as FileType, extensions: ['.xls', '.xlsx', '.xlsm'] },
        { label: 'Imagen de Plano (JPG/PNG)', value: 'Imagen' as FileType, extensions: ['.jpg', '.jpeg', '.png'] },

        { label: 'Modelo FBX', value: 'BIM-FBX' as FileType, extensions: ['.fbx'] },
        { label: 'Modelo GLB', value: 'BIM-GLB' as FileType, extensions: ['.glb'] },
        { label: 'Modelo GLTF', value: 'BIM-GLTF' as FileType, extensions: ['.gltf'] },
        { label: 'Modelo IFC', value: 'BIM-IFC' as FileType, extensions: ['.ifc'] },
    ], []);

    const allValidExtensions = allowedTypes.flatMap(t => t.extensions);

    const getAcceptAttribute = (selectedType: FileType): string => {
        const info = allowedTypes.find(t => t.value === selectedType);
        return info ? info.extensions.join(',') : allValidExtensions.join(',');
    };

    const acceptFileTypes = getAcceptAttribute(data.archivo_tipo);

    // VALIDADORES
    const isValidURL = (url: string): boolean =>
        /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(url);

    const isValidFileType = (fileName: string): boolean => {
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        const allowed = allowedTypes.find(t => t.value === data.archivo_tipo)?.extensions || allValidExtensions;
        return allowed.includes(ext);
    };

    const filteredProjects = projectsList.filter(p =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    const handleFileChange = (file: File | null) => {
        if (file) {
            setData(prev => ({ ...prev, enlace_externo: '' }));
        }
        setData('archivo', file);
        setFrontendError('');
    };

    const handleEnlaceChange = (value: string) => {
        if (value) {
            setData(prev => ({ ...prev, archivo: null }));
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
        setData('enlace_externo', value);
        setFrontendError('');
    };

    const handleTipoChange = (newType: FileType) => {
        setData('archivo_tipo', newType);
        setData('archivo', null);
        setData('enlace_externo', '');

        if (fileInputRef.current) fileInputRef.current.value = '';

        clearErrors();
        setFrontendError('');
    };

    // 🔎 CONSULTA SI EL PROYECTO YA TIENE MODELO 3D
    useEffect(() => {
        if (!data.proyecto_id) return;

        fetch(`/api/proyecto/${data.proyecto_id}/tiene-modelo3d`)
            .then(r => r.json())
            .then(res => {
                setTieneModelo3D(res.tiene3D);

                if (res.tiene3D && data.archivo_tipo === 'BIM-FBX') {
                    setShowModelo3DModal(true);
                }
            });
    }, [data.proyecto_id, data.archivo_tipo]);

    // SUBMIT
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFrontendError('');
        clearErrors();

        // 🚫 BLOQUEO MODELO 3D
        if (tieneModelo3D && ['BIM-FBX', 'BIM-GLB', 'BIM-GLTF', 'BIM-IFC'].includes(data.archivo_tipo)) {

            setShowModelo3DModal(true);
            return;
        }


        if (!data.archivo && !data.enlace_externo) {
            setFrontendError('Debes subir un archivo o ingresar un enlace externo.');
            return;
        }

        if (data.enlace_externo && !isValidURL(data.enlace_externo)) {
            setFrontendError('El enlace proporcionado no es válido.');
            return;
        }

        post(route('planos.store'), {
            onSuccess: () => router.visit(route('planos.index')),
        });
    };

    const inputStyle =
        "mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm";
    const labelStyle = "block text-sm font-bold text-gray-300";


    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F]">SUBIR NUEVO PLANO</h2>}
        >
            <Head title="Subir Plano" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] p-8 border border-gray-800/80 rounded-xl shadow-2xl">

                        <form onSubmit={submit} className="space-y-6">

                            {/* BUSCAR PROYECTO */}
                            <div>
                                <label className={labelStyle}>Proyecto Asociado</label>

                                <input
                                    type="text"
                                    placeholder="Buscar proyecto..."
                                    value={projectSearch}
                                    onChange={(e) => setProjectSearch(e.target.value.slice(0, 100))}
                                    className="mt-1 mb-2 w-full border border-gray-700 bg-[#080D15] text-white rounded-md py-1.5 px-3 text-sm"
                                />

                                <select
                                    value={data.proyecto_id}
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    className={inputStyle}
                                >
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Sin resultados</option>
                                    )}
                                </select>
                            </div>

                            {/* TITULO */}
                            <div>
                                <label className={labelStyle}>Título del Plano</label>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={e => setData('titulo', e.target.value)}
                                    required
                                    className={inputStyle}
                                />
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div>
                                <label className={labelStyle}>Descripción (Opcional)</label>
                                <textarea
                                    rows={3}
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    className={inputStyle}
                                />
                            </div>

                            {/* TIPO */}
                            <div>
                                <label className={labelStyle}>Tipo de Archivo</label>
                                <select
                                    value={data.archivo_tipo}
                                    onChange={(e) => handleTipoChange(e.target.value as FileType)}
                                    className={inputStyle}
                                >
                                    {allowedTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ARCHIVO */}
                            <div>
                                <label className={labelStyle}>Subir Archivo (50 MB máx.)</label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={acceptFileTypes}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        if (!isValidFileType(file.name)) {
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
                                    className="mt-1 block w-full text-sm text-gray-300 file:bg-[#2970E8] file:text-white file:px-4 file:py-2 file:rounded-lg"
                                />

                                <p className="text-xs text-gray-400 mt-1">
                                    Extensiones permitidas: {acceptFileTypes}
                                </p>
                            </div>

                            {/* ENLACE */}
                            <div>
                                <label className={labelStyle}>Enlace Externo (Opcional)</label>

                                <input
                                    type="url"
                                    value={data.enlace_externo}
                                    onChange={(e) => handleEnlaceChange(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className={inputStyle}
                                />

                                {data.archivo && (
                                    <p className="text-xs text-lime-400 mt-1 font-semibold">
                                        Archivo local seleccionado: {data.archivo.name}
                                    </p>
                                )}
                            </div>

                            {frontendError && (
                                <p className="text-red-400 text-center text-sm font-semibold">
                                    {frontendError}
                                </p>
                            )}

                            {/* BOTONES */}
                            <div className="flex justify-end border-t border-gray-700 pt-4">
                                <button
                                    disabled={processing}
                                    className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md font-bold text-sm hover:bg-lime-300"
                                >
                                    {processing ? 'Subiendo...' : 'Subir Plano'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.visit(route('planos.index'))}
                                    className="ml-3 bg-red-700 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                                >
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {/* MODAL: ARCHIVO GRANDE */}
            {showSizeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#0F172A] p-6 rounded-xl text-center border border-lime-400/50">
                        <h2 className="text-xl font-bold text-lime-400 mb-2">Archivo demasiado grande</h2>
                        <p className="text-gray-300 text-sm mb-4">Máximo permitido: <b>50 MB</b></p>
                        <button
                            onClick={() => setShowSizeModal(false)}
                            className="bg-lime-400 text-gray-900 px-4 py-2 rounded-md font-semibold"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: TIPO NO PERMITIDO */}
            {showTypeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#0F172A] p-6 rounded-xl text-center border border-red-500/50">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Tipo no permitido</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Extensiones aceptadas: <b>{acceptFileTypes}</b>
                        </p>
                        <button
                            onClick={() => setShowTypeModal(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: MODELO 3D YA EXISTE */}
            {showModelo3DModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#0F172A] p-6 rounded-xl text-center border border-yellow-500/60 w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-yellow-400 mb-2">
                            Ya existe un modelo 3D
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Solo se permite un modelo 3D por proyecto
                            (FBX / GLB / GLTF / IFC).
                            Para subir otro debes eliminar o editar el existente.
                        </p>

                        <button
                            onClick={() => setShowModelo3DModal(false)}
                            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-yellow-300"
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
