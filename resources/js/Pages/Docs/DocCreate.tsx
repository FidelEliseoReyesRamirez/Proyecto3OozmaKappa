import React, { FormEventHandler, useMemo, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

type FileType = 'PDF' | 'Excel' | 'Word';

interface DocCreateProps extends PageProps {
    projectsList: { id: number; name: string }[];
}

const DocCreate: React.FC = () => {
    const { projectsList } = usePage<DocCreateProps>().props;
    const { data, setData, post, processing, clearErrors } = useForm({
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

    const allowedTypes = useMemo(() => [
        { label: 'Documento PDF', value: 'PDF' as FileType, extensions: ['.pdf'] },
        { label: 'Hoja de Cálculo (Excel)', value: 'Excel' as FileType, extensions: ['.xls', '.xlsx', '.xlsm'] },
        { label: 'Documento de Word', value: 'Word' as FileType, extensions: ['.doc', '.docx'] },
    ], []);

    const getAcceptAttribute = (selectedType: FileType): string => {
        const typeInfo = allowedTypes.find(t => t.value === selectedType);
        return typeInfo ? typeInfo.extensions.join(',') : '.pdf,.xls,.xlsx,.xlsm,.doc,.docx';
    };

    const acceptFileTypes = getAcceptAttribute(data.archivo_tipo);

    const isValidURL = (url: string): boolean => /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(url);

    const isValidFileType = (fileName: string): boolean => {
        const validExtensions = ['.pdf', '.xls', '.xlsx', '.xlsm', '.doc', '.docx'];
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

        if (!data.archivo && !data.enlace_externo) {
            setFrontendError('Debes subir un archivo o ingresar un enlace externo (Drive, OneDrive, etc.).');
            return;
        }

        if (data.enlace_externo && !isValidURL(data.enlace_externo)) {
            setFrontendError('El enlace proporcionado no es válido. Debe comenzar con http:// o https://');
            return;
        }

        post(route('docs.store'), {
            onSuccess: () => router.visit(route('docs.index')),
        });
    };

    const inputStyle =
        "mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm transition duration-150";
    const labelStyle = "block text-sm font-bold text-gray-300";

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F] leading-tight tracking-wider">SUBIR NUEVO DOCUMENTO</h2>}
        >
            <Head title="Subir Documento" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        <form onSubmit={submit} className="space-y-6">

                            {/* PROYECTO BUSCABLE */}
                            <div>
                                <label htmlFor="proyecto_id" className={labelStyle}>Proyecto Asociado</label>
                                <input
                                    type="text"
                                    placeholder="Buscar proyecto..."
                                    value={projectSearch}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(0, 100); // Máximo 100 caracteres
                                        setProjectSearch(value);
                                    }}
                                    className="mt-1 mb-2 w-full border border-gray-700 bg-[#080D15] text-white rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-[#B3E10F]/70 focus:border-[#B3E10F]/70"
                                />
                                <select
                                    id="proyecto_id"
                                    name="proyecto_id"
                                    value={data.proyecto_id}
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
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
                            </div>

                            {/* TITULO */}
                            <div>
                                <label htmlFor="titulo" className={labelStyle}>Título del Documento</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    required
                                    className={inputStyle}
                                />
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
                            </div>

                            {/* TIPO */}
                            <div>
                                <label htmlFor="archivo_tipo" className={labelStyle}>Tipo de Documento</label>
                                <select
                                    id="archivo_tipo"
                                    value={data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as FileType)}
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
                                    Subir Archivo (PDF, Word o Excel, máx. 50 MB)
                                </label>
                                <input
                                    id="archivo"
                                    type="file"
                                    accept={acceptFileTypes}
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
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
                                        setData('archivo', file);
                                    }}
                                    className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2970E8] file:text-white hover:file:bg-blue-600 transition duration-150"
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Extensiones aceptadas: <span className="font-mono text-white/80">{acceptFileTypes}</span>
                                </p>
                            </div>

                            {/* ENLACE */}
                            <div>
                                <label htmlFor="enlace_externo" className={labelStyle}>Enlace Externo (Drive, OneDrive, etc.)</label>
                                <input
                                    id="enlace_externo"
                                    type="url"
                                    value={data.enlace_externo}
                                    onChange={(e) => setData('enlace_externo', e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className={inputStyle}
                                />
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
                                    {processing ? 'Subiendo...' : 'Subir Documento'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('docs.index'))}
                                    className="ml-4 bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* MODAL: Tamaño excedido */}
            {showSizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-lime-400/50 w-11/12 max-w-md animate-fadeIn">
                        <h2 className="text-xl font-bold text-lime-400 mb-2">Archivo demasiado grande</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            No se pueden subir archivos mayores a <span className="text-white font-semibold">50 MB</span>.<br />
                            Usa un <span className="text-lime-300">enlace externo</span> como Google Drive o OneDrive.
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

            {/* MODAL: Tipo inválido */}
            {showTypeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-red-500/50 w-11/12 max-w-md animate-fadeIn">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Tipo de archivo no permitido</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Solo se permiten documentos reales: <span className="text-white font-semibold">PDF, Word o Excel</span>.<br />
                            No se aceptan imágenes, videos ni ejecutables.
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

export default DocCreate;
