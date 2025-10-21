// resources/js/Pages/Docs/DocEdit.tsx

import React, { FormEventHandler } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { PageProps } from '@/types';
import InputError from '@/Components/InputError'; 
interface ProjectOption {
    id: number;
    name: string;
}

interface DocumentData {
    id: number;
    titulo: string;
    descripcion: string;
    proyecto_id: number | null;
    tipo: string;
}

interface DocEditProps extends PageProps {
    document: DocumentData;
    projectsList: ProjectOption[];
}

const DocEdit: React.FC = () => {
    const { document, projectsList } = usePage<DocEditProps>().props;
    
    const safeProjectId = (document.proyecto_id ?? '').toString(); 

    const { data, setData, put, processing, errors } = useForm({
        titulo: document.titulo ?? '', 
        descripcion: document.descripcion ?? '', 
        proyecto_id: safeProjectId,
        archivo: null as File | null,          
        archivo_tipo: document.tipo ?? '',     
    });

    const inputStyle = "mt-1 block w-full border border-gray-700 bg-[#080D15] text-white rounded-md shadow-inner py-2 px-3 focus:outline-none focus:ring-[#2970E8] focus:border-[#2970E8] sm:text-sm transition duration-150";
    const labelStyle = "block text-sm font-bold text-gray-300";
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        put(route('docs.update', document.id), {
            onSuccess: () => {
                router.get(route('docs.index'));
            },
            onError: (err) => {
                console.error("Error al actualizar el documento:", err);
            }
        });
    };
    
    const handleBack = () => {
        router.get(route('docs.index'));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('archivo', file);

        if (file) {
            const name = file.name.toLowerCase();
            let tipo = 'Otro';
            if (name.endsWith('.pdf')) {
                tipo = 'PDF';
            } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
                tipo = 'Excel';
            } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
                tipo = 'Word';
            }
            setData('archivo_tipo', tipo);
        } else {
            setData('archivo_tipo', document.tipo ?? ''); 
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-xl text-[#B3E10F] leading-tight tracking-wider">EDITAR DOCUMENTO</h2>}
        >
            <Head title={`Editar: ${document.titulo || 'Documento sin título'}`} /> 

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Campo Título */}
                            <div>
                                <label htmlFor="titulo" className={labelStyle}>
                                    Título del Documento
                                </label>
                                <input
                                    id="titulo"
                                    name="titulo"
                                    type="text"
                                    value={data.titulo} 
                                    autoComplete="off" 
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className={inputStyle}
                                />
                                <InputError message={errors.titulo} className="mt-2 text-red-400" />
                            </div>

                            {/* Campo Descripción (ya era opcional) */}
                            <div>
                                <label htmlFor="descripcion" className={labelStyle}>
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={data.descripcion} 
                                    autoComplete="off"
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    className={inputStyle}
                                ></textarea>
                                <InputError message={errors.descripcion} className="mt-2 text-red-400" />
                            </div>

                            {/* Grupo de Radio Buttons para seleccionar Proyecto */}
                            <div>
                                <label className={`${labelStyle} mb-2`}>
                                    Proyecto Asociado
                                </label>
                                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-4 bg-[#080D15] border border-gray-700 rounded-md shadow-inner">
                                    {projectsList.map(project => (
                                        <div key={project.id} className="flex items-center">
                                            <input
                                                id={`project-${project.id}`}
                                                name="proyecto_id"
                                                type="radio"
                                                value={project.id.toString()}
                                                checked={data.proyecto_id === project.id.toString()} 
                                                onChange={(e) => setData('proyecto_id', e.target.value)}
                                                className="h-4 w-4 text-[#B3E10F] bg-gray-900 border-gray-600 focus:ring-[#B3E10F]"
                                            />
                                            <label 
                                                htmlFor={`project-${project.id}`} 
                                                className="ml-3 block text-sm font-medium text-gray-300 cursor-pointer"
                                            >
                                                {project.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.proyecto_id} className="mt-2 text-red-400" />
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleBack}
                                    type="button" 
                                    className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 text-white"
                                >
                                    Cancelar y Regresar
                                </button>
                                
                                <button
                                    type="submit" 
                                    disabled={processing}
                                    className="ml-4 bg-[#B3E10F] text-gray-900 px-3 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DocEdit;