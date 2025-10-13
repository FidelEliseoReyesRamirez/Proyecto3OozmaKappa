import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { PageProps } from '@/types';

interface Documento {
    id: number;
    titulo: string;
    // 💡 AÑADIDO: La descripción
    descripcion: string | null;
    archivo_url: string;
    // 💡 AÑADIDO: El tipo/extensión ya procesado por el controlador
    tipo: string; // Tipo original (PDF, Excel, Word)
    extension: string; // Extensión real (PDF, XLSX, DOCX)
    fecha_subida: string; 
    proyecto_id: number;
    proyecto_nombre: string;
}

interface DocIndexProps extends PageProps {
    documents: Documento[];
    projectsList: { id: number; name: string }[];
    userRole: 'admin' | 'arquitecto' | 'ingeniero' | 'cliente';
}

const DocIndex: React.FC = () => {
    // Asegúrate de actualizar la estructura de documents en el controlador PHP
    const { documents, userRole } = usePage<DocIndexProps>().props; 

    const isInternalUser = ['admin', 'arquitecto', 'ingeniero'].includes(userRole);

    const handleDownload = (documento: Documento) => {
        window.open(documento.archivo_url, '_blank');
    };

    const handleDelete = (documentoId: number) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el documento "${documents.find(d => d.id === documentoId)?.titulo}"?`)) {
            
            router.delete(route('docs.destroy', documentoId), {
                onSuccess: () => {
                    alert('Documento eliminado con éxito.');
                },
                onError: (errors) => {
                    console.error('Error al eliminar:', errors);
                    alert('Hubo un error al eliminar el documento.');
                },
            });
        }
    };
    
    const handleCreateClick = () => {
        router.get(route('docs.create')); 
    };

    return (
        <AuthenticatedLayout>
            <Head title="Documentos del Proyecto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Documentos
                            </h1>
                            
                            {isInternalUser && (
                                <button
                                    onClick={handleCreateClick}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                                >
                                    Subir Nuevo Documento
                                </button>
                            )}
                        </div>
                        {documents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Subida</th>
                                            <th className="relative px-6 py-3">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {doc.titulo}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                    {doc.descripcion || 'Sin descripción'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.proyecto_nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.extension || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.fecha_subida}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Descargar
                                                    </button>
                                                    
                                                    {isInternalUser && (
                                                        <button
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-10">
                                No se encontraron documentos asociados a tus proyectos.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DocIndex;