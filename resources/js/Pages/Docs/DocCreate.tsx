import React, { FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// Interfaz para los datos pasados por Inertia
interface DocCreateProps extends PageProps {
    projectsList: { id: number; name: string }[];
}

const DocCreate: React.FC = () => {
    // Obtener la lista de proyectos desde el controlador
    const { projectsList } = usePage<DocCreateProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        descripcion: '',
        proyecto_id: projectsList.length > 0 ? projectsList[0].id.toString() : '', // Seleccionar el primero por defecto
        archivo: null as File | null,
        archivo_tipo: 'PDF', // Valor por defecto
    });

    // Tipos de archivos permitidos (deben coincidir con la validación del backend)
    const allowedTypes = [
        { label: 'Documento PDF', value: 'PDF' },
        { label: 'Hoja de Cálculo (Excel)', value: 'Excel' },
        { label: 'Documento de Word', value: 'Word' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // El método POST con files establece automáticamente el encabezado 'multipart/form-data'
        post(route('docs.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-white leading-tight">Subir Nuevo Documento</h2>}
        >
            <Head title="Subir Documento" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Selector de Proyecto */}
                            <div>
                                <label htmlFor="proyecto_id" className="block text-sm font-medium text-gray-700">
                                    Proyecto
                                </label>
                                <select
                                    id="proyecto_id"
                                    name="proyecto_id"
                                    value={data.proyecto_id}
                                    autoComplete="proyecto_id"
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {projectsList.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.proyecto_id} className="mt-2" />
                            </div>

                            {/* Título */}
                            <div>
                                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <InputError message={errors.titulo} className="mt-2" />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={data.descripcion}
                                    autoComplete="descripcion"
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                ></textarea>
                                <InputError message={errors.descripcion} className="mt-2" />
                            </div>

                            {/* Tipo de Archivo */}
                            <div>
                                <label htmlFor="archivo_tipo" className="block text-sm font-medium text-gray-700">
                                    Tipo de Documento (Requerido para extensión)
                                </label>
                                <select
                                    id="archivo_tipo"
                                    name="archivo_tipo"
                                    value={data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as 'PDF' | 'Excel' | 'Word')}
                                    required
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {allowedTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.archivo_tipo} className="mt-2" />
                            </div>

                            {/* Campo de Archivo */}
                            <div>
                                <label htmlFor="archivo" className="block text-sm font-medium text-gray-700">
                                    Seleccionar Archivo (Máx. 10MB)
                                </label>
                                <input
                                    id="archivo"
                                    name="archivo"
                                    type="file"
                                    onChange={(e) => setData('archivo', e.target.files ? e.target.files[0] : null)}
                                    required
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <InputError message={errors.archivo} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing}>
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