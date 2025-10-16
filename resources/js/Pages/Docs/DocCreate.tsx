import React, { FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface DocCreateProps extends PageProps {
    projectsList: { id: number; name: string }[];
}

const DocCreate: React.FC = () => {
    const { projectsList } = usePage<DocCreateProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        descripcion: '',
        proyecto_id: projectsList.length > 0 ? projectsList[0].id.toString() : '', 
        archivo: null as File | null,
        archivo_tipo: 'PDF', 
    });

    const allowedTypes = [
        { label: 'Documento PDF', value: 'PDF' },
        { label: 'Hoja de Cálculo (Excel)', value: 'Excel' },
        { label: 'Documento de Word', value: 'Word' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('docs.store'));
    };

    const inputStyle = "mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm transition duration-150";
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
                            
                            {/* Selector de Proyecto */}
                            <div>
                                <label htmlFor="proyecto_id" className={labelStyle}>
                                    Proyecto Asociado
                                </label>
                                <select
                                    id="proyecto_id"
                                    name="proyecto_id"
                                    value={data.proyecto_id}
                                    autoComplete="proyecto_id"
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    className={inputStyle}
                                >
                                    {projectsList.map((project) => (
                                        <option key={project.id} value={project.id} className="bg-gray-800 text-white">
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.proyecto_id} className="mt-2 text-red-400" />
                            </div>

                            {/* Título */}
                            <div>
                                <label htmlFor="titulo" className={labelStyle}>
                                    Título del Documento
                                </label>
                                <input
                                    id="titulo"
                                    name="titulo"
                                    type="text"
                                    value={data.titulo}
                                    autoComplete="titulo"
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    required
                                    className={inputStyle}
                                />
                                <InputError message={errors.titulo} className="mt-2 text-red-400" />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className={labelStyle}>
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={data.descripcion}
                                    autoComplete="descripcion"
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    className={inputStyle}
                                ></textarea>
                                <InputError message={errors.descripcion} className="mt-2 text-red-400" />
                            </div>

                            {/* Tipo de Archivo */}
                            <div>
                                <label htmlFor="archivo_tipo" className={labelStyle}>
                                    Categoría de Documento (Requerido para extensión)
                                </label>
                                <select
                                    id="archivo_tipo"
                                    name="archivo_tipo"
                                    value={data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as 'PDF' | 'Excel' | 'Word')}
                                    required
                                    className={inputStyle}
                                >
                                    {allowedTypes.map((type) => (
                                        <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.archivo_tipo} className="mt-2 text-red-400" />
                            </div>

                            {/* Campo de Archivo */}
                            <div>
                                <label htmlFor="archivo" className={labelStyle}>
                                    Seleccionar Archivo (Máx. 10MB)
                                </label>
                                <input
                                    id="archivo"
                                    name="archivo"
                                    type="file"
                                    onChange={(e) => setData('archivo', e.target.files ? e.target.files[0] : null)}
                                    required
                                    className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2970E8] file:text-white hover:file:bg-blue-600 transition duration-150"
                                />
                                <InputError message={errors.archivo} className="mt-2 text-red-400" />
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                                <PrimaryButton 
                                    disabled={processing}
                                    className="bg-[#2970E8] hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-[#2970E8]/30"
                                >
                                    {processing ? 'Subiendo...' : 'Subir Documento'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DocCreate;