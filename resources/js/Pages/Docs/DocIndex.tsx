import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { PageProps } from '@/types';

interface Documento {
    id: number;
    titulo: string;
    descripcion: string | null;
    archivo_url: string;
    tipo: string; 
    extension: string;
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
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                return dateString; 
            }
            return date.toLocaleTimeString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }).replace(',', ''); 

        } catch (error) {
            console.error("Error al formatear la fecha:", error);
            return dateString; 
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Documentos del Proyecto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h1 className="text-3xl font-extrabold text-white tracking-wider">
                                BIBLIOTECA DE DOCUMENTOS
                            </h1>
                            
                            {isInternalUser && (
                                <button
                                    onClick={handleCreateClick}
                                    className="bg-[#B3E10F] hover:bg-lime-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-[#B3E10F]/30"
                                >
                                    <span className="hidden sm:inline">Subir Nuevo </span> Documento
                                </button>
                            )}
                        </div>
                        
                        {documents.length > 0 ? (
                            <div className="overflow-x-auto border border-gray-800 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-800">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Proyecto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ext.</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha Subida</th>
                                            <th className="relative px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#080D15] divide-y divide-gray-800/50">
                                        {documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-800/50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#2970E8]">
                                                    {doc.titulo}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                                                    {doc.descripcion || '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#B3E10F]">
                                                    {doc.proyecto_nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                                                    .{doc.extension || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(doc.fecha_subida)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        className="text-[#2970E8] hover:text-indigo-400 font-medium transition duration-150 mr-4 border-b border-transparent hover:border-[#2970E8]"
                                                    >
                                                        Descargar
                                                    </button>
                                                    
                                                    {isInternalUser && (
                                                        <button
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="text-red-600 hover:text-red-400 transition duration-150 border-b border-transparent hover:border-red-600"
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
                            <p className="text-gray-500 text-center py-10 italic">
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