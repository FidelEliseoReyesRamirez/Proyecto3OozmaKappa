import React from 'react';
import { Link } from '@inertiajs/react';

interface Plano {
    id: number;
    titulo: string;
    descripcion: string | null;
    archivo_url: string | null;
    enlace_externo?: string | null;
    tipo: string; 
    extension: string;
    fecha_subida: string;
    proyecto_id: number;
    proyecto_nombre: string;
}

interface PlanosTableProps {
    filteredPlanos: Plano[];
    handleDownload: (doc: Plano) => void;
    isInternalUser: boolean;
    openDeleteModal: (doc: Plano) => void;
}

const PlanosTable: React.FC<PlanosTableProps> = ({
    filteredPlanos,
    handleDownload,
    isInternalUser,
    openDeleteModal,
}) => {
    return (
        filteredPlanos.length > 0 ? (
            <div className="overflow-x-auto border border-gray-800 rounded-lg">
                <table className="min-w-full divide-y divide-gray-800 table-auto">
                    <thead className="bg-[#2970E8] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#2970E8]/30">
                        <tr>
                            <th className="px-6 py-3 text-left uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left uppercase tracking-wider">Proyecto</th>
                            <th className="px-6 py-3 text-left uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left uppercase tracking-wider">URL / Enlace</th>
                            <th className="px-6 py-3 text-left uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-[#080D15] divide-y divide-gray-800/50">
                        {filteredPlanos.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-800/50 transition duration-150">
                                
                                <td className="px-6 py-4 text-sm font-semibold text-[#2970E8]">{doc.titulo}</td>
                                <td className="px-6 py-4 text-sm font-medium text-[#B3E10F]">{doc.proyecto_nombre}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{doc.tipo}</td>
                                
                                {/* Columna URL / Enlace */}
                                <td className="px-6 py-4 text-sm text-blue-400 truncate max-w-[180px]">
                                    {doc.tipo === 'URL' && doc.archivo_url ? ( // Usamos archivo_url si contiene el enlace externo
                                        <a 
                                            href={doc.archivo_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="hover:underline"
                                            title={doc.archivo_url}
                                        >
                                            {doc.archivo_url}
                                        </a>
                                    ) : (
                                        doc.archivo_url ? `Archivo: ${doc.extension.toUpperCase()}` : 'N/A'
                                    )}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-400">{doc.fecha_subida}</td>

                                {/* Columna Acciones */}
                                <td className="px-6 py-4 border-t border-gray-800">
                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full text-sm font-medium">
                                        
                                        {/* Botón Abrir Enlace o Descargar */}
                                        {doc.tipo === 'URL' && doc.archivo_url ? (
                                            <a 
                                                href={doc.archivo_url} // Navegación directa al enlace
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition cursor-pointer"
                                            >
                                                Abrir Enlace
                                            </a>
                                        ) : (
                                            doc.archivo_url && (
                                                <button
                                                    onClick={() => handleDownload(doc)}
                                                    className="bg-[#B3E10F] text-gray-900 px-3 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30 w-full sm:w-auto text-center"
                                                >
                                                    Descargar
                                                </button>
                                            )
                                        )}

                                        {/* Botones de Administrador (Editar y Eliminar) */}
                                        {isInternalUser && (
                                            <>
                                                <Link
                                                    href={route('planos.edit', doc.id)}
                                                    className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteModal(doc)}
                                                    className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition"
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-gray-500 text-center py-10 italic">
                No se encontraron planos que coincidan con los filtros.
            </p>
        )
    );
};

export default PlanosTable;