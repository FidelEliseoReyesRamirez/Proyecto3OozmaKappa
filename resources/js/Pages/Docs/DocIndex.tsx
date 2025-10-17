import React, { useState } from 'react';
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

    // Controla la visibilidad y tipo de modal
    const [modal, setModal] = useState<{ type: string; document: Documento | null }>({ type: '', document: null });

    const isInternalUser = ['admin', 'arquitecto', 'ingeniero'].includes(userRole);

    // Abrir modal
    const openModal = (type: string, document: Documento) => setModal({ type, document });

    // Cerrar modal
    const closeModal = () => setModal({ type: '', document: null });

    // Confirmar eliminación
    const confirmDelete = () => {
        if (!modal.document) return;
        const docId = modal.document.id;

        router.delete(route('docs.destroy', docId), {
            onSuccess: () => setModal({ type: 'success', document: modal.document }),
            onError: () => setModal({ type: 'error', document: modal.document }),
        });
    };

    // Descargar documento
    const handleDownload = (documento: Documento) => {
        window.open(documento.archivo_url, '_blank');
    };

    // Redirigir a formulario de creación
    const handleCreateClick = () => {
        router.get(route('docs.create')); 
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }).replace(',', '');
        } catch {
            return dateString;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Documentos del Proyecto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] overflow-hidden shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">
                        
                        {/* Encabezado y botón de crear */}
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
                        
                        {/* Tabla de documentos */}
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
                                                            onClick={() => openModal('delete', doc)}
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

            {/* Modal de confirmación de eliminación */}
            {modal.type === 'delete' && modal.document && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 text-white border border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-[#B3E10F]">Confirmar eliminación</h2>
                        <p className="mb-6 text-gray-300">
                            ¿Estás seguro de que deseas eliminar el documento <strong>{modal.document.titulo}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-150 font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-[#B3E10F] text-black rounded-lg hover:bg-lime-500 transition duration-150 font-semibold"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de éxito */}
            {modal.type === 'success' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 text-white border-t-4 border-[#B3E10F]">
                        <h2 className="text-xl font-bold mb-4 text-[#B3E10F]">Operación exitosa</h2>
                        <p className="mb-6 text-gray-300">El documento se eliminó correctamente.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-blue-600 transition duration-150 font-semibold"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de error */}
            {modal.type === 'error' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 text-white border-t-4 border-red-700">
                        <h2 className="text-xl font-bold mb-4 text-red-500">Error al eliminar</h2>
                        <p className="mb-6 text-gray-300">
                            Ocurrió un error al intentar eliminar el documento. Intenta nuevamente más tarde.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-blue-600 transition duration-150 font-semibold"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default DocIndex;
