import React, { useState, FormEventHandler } from 'react'; // Importar useState y FormEventHandler
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { PageProps } from '@/types';

interface PlanosCreateProps extends PageProps {
    projectsList: { id: number; name: string }[];
}

// Función de utilidad para validar URL
const isValidURL = (str: string): boolean => {
    try {
        // La validación simple que pediste: debe comenzar con http:// o https://
        // Esto es una simplificación, ya que el navegador ya valida el input type="url"
        return str.startsWith('http://') || str.startsWith('https://');
    } catch (e) {
        return false;
    }
};

const PlanosCreate: React.FC = () => {
    const { projectsList } = usePage<PlanosCreateProps>().props;
    
    // 1. Nuevo estado para manejar errores de validación de frontend
    const [frontendError, setFrontendError] = useState<string>(''); 

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        titulo: '',
        descripcion: '',
        proyecto_id: '' as string | number,
        version: '',
        archivo: null as File | null,
        enlace_externo: '',
        archivo_tipo: 'OTRO',
    });

    // 2. Lógica de Submit adaptada
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        setFrontendError('');
        clearErrors();

        // 2.1. Validación: Debe haber archivo o enlace externo
        if (!data.archivo && !data.enlace_externo) {
            setFrontendError('Debes subir un archivo o ingresar un enlace externo válido.');
            // Enfocar el scroll al error si es necesario, o simplemente retornar
            return;
        }

        // 2.2. Validación: Si hay enlace externo, debe ser una URL válida
        if (data.enlace_externo && !isValidURL(data.enlace_externo)) {
            setFrontendError('El enlace proporcionado no es válido. Debe comenzar con http:// o https://');
            return;
        }

        // Si la validación de frontend pasa, enviar la data
        post(route('planos.store'), {
            forceFormData: true, 
            // 3. Rutas de Planos implementadas
            onSuccess: () => {
                reset('archivo'); // Limpiar solo el archivo después de éxito
                router.visit(route('planos.index'));
            },
            // Opcional: Manejar errores del servidor
            onError: (errors) => {
                // Los errores de Laravel se mostrarán automáticamente vía `InputError`
                console.error('Error del servidor:', errors);
            }
        });
    };
    
    // ... (handleFileChange y handleUrlChange se mantienen igual)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData(prev => ({
            ...prev,
            archivo: file,
            enlace_externo: '',
            archivo_tipo: file ? 'ARCHIVO' : 'OTRO',
        }));
        setFrontendError(''); // Limpiar error de frontend al cambiar
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setData(prev => ({ 
            ...prev, 
            enlace_externo: url,
            archivo: null,
            archivo_tipo: url ? 'URL' : 'OTRO',
        }));
        setFrontendError(''); // Limpiar error de frontend al cambiar
    };
    
    // ... (isDisabled se mantiene igual)
    const isDisabled = processing || 
        data.proyecto_id === '' || 
        data.titulo === '' || 
        (!data.archivo && !data.enlace_externo);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-white leading-tight">Subir Nuevo Plano BIM</h2>}
        >
            <Head title="Subir Plano" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] shadow-2xl sm:rounded-lg p-6 border border-gray-800/80">
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
                            Información del Plano
                        </h3>

                        <form onSubmit={submit}>
                            
                            {/* Mostrar el error de validación de frontend (si existe) */}
                            {frontendError && (
                                <div className="mb-4 p-3 bg-red-800 border border-red-500 text-white rounded-md">
                                    {frontendError}
                                </div>
                            )}
                            
                            {/* ... (Resto de los campos: Titulo, Proyecto, Versión, Descripción) ... */}
                            <div className="mb-4">
                                <InputLabel htmlFor="titulo" value="Título del Plano" className="text-gray-300" />
                                <TextInput
                                    id="titulo"
                                    type="text"
                                    name="titulo"
                                    value={data.titulo}
                                    className="mt-1 block w-full bg-[#080D15] text-black border-gray-700 focus:border-[#2970E8] focus:ring-[#2970E8]"
                                    autoComplete="titulo"
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    required
                                />
                                <InputError message={errors.titulo} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="proyecto_id" value="Proyecto Asociado" className="text-gray-300" />
                                <select
                                    id="proyecto_id"
                                    name="proyecto_id"
                                    value={data.proyecto_id}
                                    onChange={(e) => setData('proyecto_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md shadow-sm bg-[#080D15] text-white border-gray-700 focus:border-[#2970E8] focus:ring-[#2970E8]"
                                    required
                                >
                                    <option value="" disabled>Seleccione un proyecto</option>
                                    {projectsList.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.proyecto_id} className="mt-2" />
                            </div>
                            
                            <div className="mb-4">
                                <InputLabel htmlFor="version" value="Versión (Opcional)" className="text-gray-300" />
                                <TextInput
                                    id="version"
                                    type="text"
                                    name="version"
                                    value={data.version || ''}
                                    className="mt-1 block w-full bg-[#080D15] text-black border-gray-700 focus:border-[#2970E8] focus:ring-[#2970E8]"
                                    autoComplete="version"
                                    onChange={(e) => setData('version', e.target.value)}
                                />
                                <InputError message={errors.version} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="descripcion" value="Descripción Detallada (Opcional)" className="text-gray-300" />
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    rows={3}
                                    value={data.descripcion}
                                    className="mt-1 block w-full rounded-md shadow-sm bg-[#080D15] text-white border-gray-700 focus:border-[#2970E8] focus:ring-[#2970E8]"
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                />
                                <InputError message={errors.descripcion} className="mt-2" />
                            </div>
                            {/* FIN de campos */}

                            <div className="border-t border-gray-700 pt-6">
                                <h4 className="text-lg font-semibold text-white mb-4">Fuente del Plano</h4>
                                
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="archivo" value="Subir Archivo (BIM/CAD)" className="text-gray-300" />
                                        <input
                                            type="file"
                                            id="archivo"
                                            name="archivo"
                                            onChange={handleFileChange}
                                            className="mt-1 block w-full rounded-md text-sm text-gray-400
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-[#B3E10F] file:text-gray-900
                                                        hover:file:bg-lime-400"
                                            disabled={!!data.enlace_externo} 
                                        />
                                        <InputError message={errors.archivo} className="mt-2" />
                                    </div>

                                    <div className="flex items-center text-gray-500">
                                        <div className="flex-grow border-t border-gray-700"></div>
                                        <span className="flex-shrink mx-4">O</span>
                                        <div className="flex-grow border-t border-gray-700"></div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="enlace_externo" value="Usar Enlace Externo (URL)" className="text-gray-300" />
                                        <TextInput
                                            id="enlace_externo"
                                            type="url"
                                            name="enlace_externo"
                                            value={data.enlace_externo}
                                            className="mt-1 block w-full bg-[#080D15] text-black border-gray-700 focus:border-[#2970E8] focus:ring-[#2970E8]"
                                            autoComplete="enlace_externo"
                                            placeholder="https://enlace.a.modelo.bim"
                                            onChange={handleUrlChange}
                                            disabled={!!data.archivo}
                                        />
                                        <InputError message={errors.enlace_externo} className="mt-2" />
                                    </div>
                                </div>
                                
                                <div className="mt-6 p-3 bg-gray-800 rounded-lg text-sm text-gray-400 border border-gray-700">
                                    <p className="font-semibold text-[#B3E10F] mb-1">Requisitos de Subida:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>**Formatos BIM/CAD Aceptados:** IFC, RVT, DWG, DXF, PDF, etc.</li>
                                        <li>**Límite de Tamaño (Archivo):** Máximo 1 GB.</li>
                                        <li>**Asociación:** El plano debe estar asociado a un proyecto.</li>
                                        <li>**Nota:** Puedes subir un **Archivo** o ingresar un **Enlace Externo**, pero no ambos.</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end mt-8">
                                <a
                                    href={route('planos.index')}
                                    className="ml-4 text-sm text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition duration-150 shadow-md shadow-red-600/30"
                                >
                                    Cancelar
                                </a>
                                <button 
                                    type="submit" 
                                    className="ml-4 bg-[#B3E10F] hover:bg-[#859f29] text-black font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-[#B3E10F]/30 disabled:opacity-50"
                                    disabled={isDisabled}
                                >
                                    {processing ? 'Subiendo...' : 'Subir Plano'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PlanosCreate;