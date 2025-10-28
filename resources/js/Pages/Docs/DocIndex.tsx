import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Documento {
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

interface DocIndexProps extends PageProps {
    documents: Documento[];
    projectsList: { id: number; name: string }[];
    userRole: 'admin' | 'arquitecto' | 'ingeniero' | 'cliente';
}

const DocIndex: React.FC = () => {
    const { documents, projectsList, userRole } = usePage<DocIndexProps>().props;

    const [search, setSearch] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [filterProyecto, setFilterProyecto] = useState('');
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');
    const [order, setOrder] = useState<'desc' | 'asc'>('desc');
    const [dateError, setDateError] = useState('');

    const [projectOpen, setProjectOpen] = useState(false);
    const [projectSearch, setProjectSearch] = useState('');
    const [modal, setModal] = useState<{ type: string; document: Documento | null }>({ type: '', document: null });

    const isInternalUser = ['admin', 'arquitecto', 'ingeniero'].includes(userRole);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.combo-proyectos')) setProjectOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    /* ✅ Descarga segura */
    function handleDownload(doc: Documento) {
        if (!doc.archivo_url) {
            console.warn('⚠️ No hay archivo para descargar.');
            return;
        }

        try {
            if (doc.tipo === 'URL' && doc.enlace_externo) {
                window.open(doc.enlace_externo, '_blank', 'noopener,noreferrer');
            } else {
                // Redirige directamente a la ruta de Laravel (sin Inertia)
                window.location.href = route('docs.download', doc.id);
            }
        } catch (error) {
            console.error('❌ Error al descargar el archivo:', error);
        }
    }

    /* ✅ Eliminar documento */
    /* ✅ Eliminar documento (limpio, sin alert ni logs) */
function confirmDelete(document: Documento) {
    if (!document) return;
    router.delete(route('docs.destroy', document.id));
}


    const handleCreateClick = () => router.get(route('docs.create'));

    const handleClearFilters = () => {
        setSearch('');
        setFilterTipo('');
        setFilterProyecto('');
        setFilterStart('');
        setFilterEnd('');
        setOrder('desc');
        setDateError('');
    };

    /* ✅ Filtros */
    const filteredDocuments = useMemo(() => {
        const term = search.toLowerCase().trim();
        const startDate = filterStart ? new Date(filterStart + 'T00:00:00') : null;
        const endDate = filterEnd ? new Date(filterEnd + 'T23:59:59') : null;

        if (startDate && endDate && endDate < startDate) {
            setDateError('La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
            return [];
        } else setDateError('');

        return documents
            .filter((doc) => {
                const matchesSearch =
                    doc.titulo.toLowerCase().includes(term) ||
                    doc.descripcion?.toLowerCase().includes(term) ||
                    doc.proyecto_nombre.toLowerCase().includes(term);
                const matchesTipo = !filterTipo || doc.tipo === filterTipo;
                const matchesProyecto = !filterProyecto || doc.proyecto_id === parseInt(filterProyecto);

                const [d, m, yH] = doc.fecha_subida.split('/');
                const [y, h] = yH.split(' ');
                const fechaDoc = new Date(`${y}-${m}-${d}T${h}`);

                const matchesFecha =
                    (!startDate || fechaDoc >= startDate) && (!endDate || fechaDoc <= endDate);

                return matchesSearch && matchesTipo && matchesProyecto && matchesFecha;
            })
            .sort((a, b) => {
                const parse = (str: string) => {
                    const [d, m, yH] = str.split('/');
                    const [y, h] = yH.split(' ');
                    return new Date(`${y}-${m}-${d}T${h}`);
                };
                const dateA = parse(a.fecha_subida).getTime();
                const dateB = parse(b.fecha_subida).getTime();
                return order === 'desc' ? dateB - dateA : dateA - dateB;
            });
    }, [documents, search, filterTipo, filterProyecto, filterStart, filterEnd, order]);

    const proyectosFiltrados = projectsList.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Documentos del Proyecto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">

                        {/* ENCABEZADO */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
                            <h1 className="text-3xl font-extrabold text-white tracking-wider text-center sm:text-left">
                                BIBLIOTECA DE DOCUMENTOS
                            </h1>

                            {isInternalUser && (
                                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                                    <button
                                        onClick={handleCreateClick}
                                        className="bg-[#B3E10F] hover:bg-lime-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-[#B3E10F]/30"
                                    >
                                        Subir Documento
                                    </button>

                                    <button
                                        onClick={() => router.get(route('docs.trash'))}
                                        className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-red-800/30"
                                    >
                                        Ver Papelera
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* FILTROS */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-3 justify-between items-center">
                            <input
                                type="text"
                                placeholder="Buscar título o descripción..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-grow min-w-[180px] px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8]"
                            />

                            <select
                                value={filterTipo}
                                onChange={(e) => setFilterTipo(e.target.value)}
                                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8] pr-8"
                            >
                                <option value="">Tipo: Todos</option>
                                <option value="PDF">PDF</option>
                                <option value="Word">Word</option>
                                <option value="Excel">Excel</option>
                                <option value="URL">URL</option>
                            </select>

                            {/* PROYECTO BUSCABLE */}
                            <div className="relative combo-proyectos min-w-[180px]">
                                <div
                                    className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm cursor-pointer"
                                    onClick={() => setProjectOpen(!projectOpen)}
                                >
                                    {filterProyecto
                                        ? projectsList.find((p) => p.id === parseInt(filterProyecto))?.name
                                        : 'Proyecto: Todos'}
                                </div>

                                {projectOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <input
                                            type="text"
                                            placeholder="Buscar proyecto..."
                                            value={projectSearch}
                                            onChange={(e) => setProjectSearch(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-800 text-gray-200 text-sm border-b border-gray-700 focus:outline-none"
                                        />
                                        <div
                                            onClick={() => {
                                                setFilterProyecto('');
                                                setProjectOpen(false);
                                            }}
                                            className="px-3 py-2 text-sm text-gray-300 hover:bg-[#2970E8] hover:text-white cursor-pointer"
                                        >
                                            Todos los proyectos
                                        </div>
                                        {proyectosFiltrados.map((proj) => (
                                            <div
                                                key={proj.id}
                                                onClick={() => {
                                                    setFilterProyecto(String(proj.id));
                                                    setProjectOpen(false);
                                                }}
                                                className={`px-3 py-2 text-sm cursor-pointer ${filterProyecto === String(proj.id)
                                                    ? 'bg-[#1f5dc0] text-white'
                                                    : 'text-gray-200 hover:bg-[#2970E8] hover:text-white'
                                                    }`}
                                            >
                                                {proj.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* FECHAS */}
                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <div className="flex flex-col">
                                    <label className="text-gray-400 text-xs mb-1">Desde</label>
                                    <input
                                        type="date"
                                        value={filterStart}
                                        onChange={(e) => setFilterStart(e.target.value)}
                                        className="px-2 py-1 rounded-md bg-[#080D15] text-white border border-gray-700 text-xs focus:ring-2 focus:ring-[#2970E8]"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-400 text-xs mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        value={filterEnd}
                                        onChange={(e) => setFilterEnd(e.target.value)}
                                        className="px-2 py-1 rounded-md bg-[#080D15] text-white border border-gray-700 text-xs focus:ring-2 focus:ring-[#2970E8]"
                                    />
                                </div>
                            </div>

                            <select
                                value={order}
                                onChange={(e) => setOrder(e.target.value as 'desc' | 'asc')}
                                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8] pr-8"
                            >
                                <option value="desc">Más recientes primero</option>
                                <option value="asc">Más antiguos primero</option>
                            </select>

                            <button
                                onClick={handleClearFilters}
                                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-md transition duration-150 font-semibold"
                            >
                                Limpiar filtros
                            </button>
                        </div>

                        {dateError && (
                            <p className="text-red-400 text-sm text-center mb-4">{dateError}</p>
                        )}

                        {/* TABLA */}
                        {filteredDocuments.length > 0 ? (
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
                                        {filteredDocuments.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-800/50 transition duration-150">
                                                <td className="px-6 py-4 text-sm font-semibold text-[#2970E8]">{doc.titulo}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-[#B3E10F]">{doc.proyecto_nombre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{doc.tipo}</td>
                                                <td className="px-6 py-4 text-sm text-blue-400 truncate max-w-[180px]">
                                                    {doc.tipo === 'URL' && doc.enlace_externo ? (
                                                        <a
                                                            href={doc.enlace_externo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-[#B3E10F] underline"
                                                        >
                                                            {doc.enlace_externo}
                                                        </a>
                                                    ) : doc.archivo_url ? (
                                                        <a
                                                            href={doc.archivo_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-[#B3E10F] underline"
                                                        >
                                                            {doc.archivo_url}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-500">–</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-400">{doc.fecha_subida}</td>
                                                <td className="px-6 py-4 border-t border-gray-800">
                                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full text-sm font-medium">
                                                        {doc.tipo === 'URL' ? (
                                                            <a
                                                                href={doc.archivo_url || doc.enlace_externo || '#'}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition"
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

                                                        {isInternalUser && (
                                                            <>
                                                                <Link
                                                                    href={route('docs.edit', doc.id)}
                                                                    className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition"
                                                                >
                                                                    Editar
                                                                </Link>

                                                                <button
                                                                    onClick={() => setModal({ type: 'delete', document: doc })}

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
                                No se encontraron documentos que coincidan con los filtros.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* ✅ MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {
                modal.type === 'delete' && modal.document && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl w-[90%] sm:w-[400px] text-center animate-fadeIn">
                            <h2 className="text-xl font-bold text-white mb-3">¿Eliminar documento?</h2>
                            <p className="text-gray-300 mb-6">
                                Estás a punto de eliminar{' '}
                                <span className="text-[#B3E10F] font-semibold">
                                    {modal.document?.titulo}
                                </span>.
                                <br />
                                Esta acción moverá el archivo a la papelera.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setModal({ type: '', document: null })}
                                    className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (modal.document) {
                                            confirmDelete(modal.document);
                                            setModal({ type: '', document: null });
                                        }
                                    }}
                                    className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white font-bold shadow-md shadow-red-800/40 transition"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </AuthenticatedLayout>
    );


};

export default DocIndex;
