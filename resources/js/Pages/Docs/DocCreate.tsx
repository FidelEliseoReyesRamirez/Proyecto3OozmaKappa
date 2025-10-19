// resources/js/Pages/Docs/DocCreate.tsx

import React, { FormEventHandler, useMemo } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';

// Definición de tipos permitidos para el archivo
type FileType = 'PDF' | 'Excel' | 'Word' | 'Otro'; // 'Otro' se deja solo si es necesario en otro contexto, pero lo omitiremos en el selector

// ====================================================================
// 1. Definición de Tipos para las Props del Componente
// ====================================================================
interface DocCreateProps extends PageProps {
    projectsList: { id: number; name: string }[];
}

const handleCreateClick = () => {
    router.get(route('docs.index')); 
};

// ====================================================================
// 2. Componente Funcional DocCreate
// ====================================================================
const DocCreate: React.FC = () => {
    const { projectsList } = usePage<DocCreateProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        descripcion: '',
        // Establece el primer proyecto como valor inicial por defecto
        proyecto_id: projectsList.length > 0 ? projectsList[0].id.toString() : '', 
        archivo: null as File | null,
        archivo_tipo: 'PDF' as FileType, // Inicializamos con 'PDF'
    });

    // 💡 Definición de Tipos y sus extensiones (MIME types)
    const allowedTypes = useMemo(() => ([
        { label: 'Documento PDF', value: 'PDF' as FileType, extensions: '.pdf' },
        // Usamos las extensiones más comunes de Excel
        { label: 'Hoja de Cálculo (Excel)', value: 'Excel' as FileType, extensions: '.xls,.xlsx,.xlsm' },
        // Usamos las extensiones más comunes de Word
        { label: 'Documento de Word', value: 'Word' as FileType, extensions: '.doc,.docx' },
    ]), []);

    // 💡 Función para obtener la cadena 'accept' basada en el tipo seleccionado
    const getAcceptAttribute = (selectedType: FileType): string => {
        const typeInfo = allowedTypes.find(t => t.value === selectedType);
        // Devuelve las extensiones, si no encuentra o el tipo es 'Otro', permite todo
        return typeInfo ? typeInfo.extensions : '*/*'; 
    };

    // Obtenemos el valor de 'accept' dinámicamente para el input file
    const acceptFileTypes = getAcceptAttribute(data.archivo_tipo);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // La subida de archivos requiere que Inertia envíe los datos como multipart/form-data
        post(route('docs.store'), {
            onSuccess: () => {
                router.get(route('docs.index'));
            },
            onError: (err) => {
                console.error("Error al subir el documento:", err);
            }
        });
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

                            {/* Tipo de Archivo (Selector) */}
                            <div>
                                <label htmlFor="archivo_tipo" className={labelStyle}>
                                    Categoría de Documento (Define la extensión permitida)
                                </label>
                                <select
                                    id="archivo_tipo"
                                    name="archivo_tipo"
                                    value={data.archivo_tipo}
                                    onChange={(e) => setData('archivo_tipo', e.target.value as FileType)}
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

                            {/* Campo de Archivo (APLICACIÓN DEL FILTRO) */}
                            <div>
                                <label htmlFor="archivo" className={labelStyle}>
                                    Seleccionar Archivo (Sólo {data.archivo_tipo})
                                </label>
                                <input
                                    id="archivo"
                                    name="archivo"
                                    type="file"
                                    // 🚀 APLICACIÓN CLAVE: Filtramos el diálogo de archivo con la extensión correcta
                                    accept={acceptFileTypes}
                                    onChange={(e) => setData('archivo', e.target.files ? e.target.files[0] : null)}
                                    required
                                    className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2970E8] file:text-white hover:file:bg-blue-600 transition duration-150"
                                />
                                <p className='mt-1 text-xs text-gray-400'>
                                    Extensiones aceptadas: <span className='font-mono text-white/80'>{acceptFileTypes}</span>
                                </p>
                                <InputError message={errors.archivo} className="mt-2 text-red-400" />
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30 disabled:opacity-50"
                                >
                                    {processing ? 'Subiendo...' : 'Subir Documento'}
                                </button>
                                <button onClick={handleCreateClick}
                                    type="button"
                                    className="ml-4 bg-red-700 hover:bg-red-600 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white">
                                    Regresar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DocCreate;