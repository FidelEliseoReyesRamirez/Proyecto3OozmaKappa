import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FBXViewer from '@/Pages/Planos/FBXViewer';

// INTERFAZ
interface PlanoBim {
        id: number;
        titulo: string;
        descripcion: string | null;
        archivo_url: string | null;
        enlace_externo?: string | null;
        // He ampliado los tipos para incluir la nueva constante BIM-IFC
        tipo: 'DWG' | 'DXF' | 'IFC' | 'PDF' | 'URL' | 'Otro' | 'BIM-FBX' | 'BIM-IFC' | 'Excel' | 'Word' | 'Imagen' | 'ZIP';
        extension: string;
        fecha_subida: string;
        proyecto_id: number;
        proyecto_nombre: string;
}

// PROPIEDADES DE LA PÁGINA
interface PlanoIndexProps extends PageProps {
        planos: PlanoBim[];
        projectsList: { id: number; name: string }[];
        userRole: 'admin' | 'arquitecto' | 'ingeniero' | 'cliente';
}


const PlanoIndex: React.FC = () => {
        const { planos, projectsList, userRole } = usePage<PlanoIndexProps>().props;

        const [search, setSearch] = useState('');
        const [filterTipo, setFilterTipo] = useState('');
        const [filterProyecto, setFilterProyecto] = useState('');
        const [filterStart, setFilterStart] = useState('');
        const [filterEnd, setFilterEnd] = useState('');
        const [order, setOrder] = useState<'desc' | 'asc'>('desc');
        const [dateError, setDateError] = useState('');

        const [projectOpen, setProjectOpen] = useState(false);
        const [projectSearch, setSearchProject] = useState('');
        // El modal ahora solo necesita el plano completo para pasar la URL
        const [modal, setModal] = useState<{ type: string; plano: PlanoBim | null }>({ type: '', plano: null });

        const isInternalUser = ['admin', 'arquitecto', 'ingeniero'].includes(userRole);

        useEffect(() => {
                const close = (e: MouseEvent) => {
                        const target = e.target as HTMLElement;
                        if (!target.closest('.combo-proyectos')) setProjectOpen(false);
                };
                document.addEventListener('click', close);
                return () => document.removeEventListener('click', close);
        }, []);

        /* Descarga segura */
        function handleDownload(plano: PlanoBim) {
                if (!plano.archivo_url) {
                        console.warn('⚠️ No hay archivo para descargar.');
                        return;
                }

                try {
                        if (plano.tipo === 'URL' && plano.archivo_url) {
                                // Si es un enlace externo, simplemente abrir
                                window.open(plano.archivo_url, '_blank', 'noopener,noreferrer');
                        } else if (plano.archivo_url) {
                                // Asume que esta ruta maneja la descarga de archivos locales (que no son 'URL')
                                window.location.href = route('planos.download', plano.id);
                        }
                } catch (error) {
                        console.error('❌ Error al descargar el plano BIM:', error);
                }
        }

        /* Eliminar plano */
        function confirmDelete(plano: PlanoBim) {
                if (!plano) return;
                // Asume que la ruta de eliminación es correcta
                router.delete(route('planos.destroy', plano.id));
        }

        const handleCreateClick = () => router.get(route('planos.create'));

        const handleClearFilters = () => {
                setSearch('');
                setFilterTipo('');
                setFilterProyecto('');
                setFilterStart('');
                setFilterEnd('');
                setOrder('desc');
                setDateError('');
        };

        /* Filtros */
        const filteredPlanos = useMemo(() => {
                const term = search.toLowerCase().trim();
                const startDate = filterStart ? new Date(filterStart + 'T00:00:00') : null;
                const endDate = filterEnd ? new Date(filterEnd + 'T23:59:59') : null;

                if (startDate && endDate && endDate < startDate) {
                        setDateError('La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
                        return [];
                } else setDateError('');

                return planos
                        .filter((plano) => {
                                const matchesSearch =
                                        plano.titulo.toLowerCase().includes(term) ||
                                        plano.descripcion?.toLowerCase().includes(term) ||
                                        plano.proyecto_nombre.toLowerCase().includes(term);
                                const matchesTipo = !filterTipo || plano.tipo === filterTipo;
                                const matchesProyecto = !filterProyecto || plano.proyecto_id === parseInt(filterProyecto);

                                // Lógica de parseo de fecha d/m/y H:i:s
                                // Se asume que el formato de fecha_subida es **d/m/y H:i:s**
                                const [d, m, yH] = plano.fecha_subida.split('/');
                                const [y, h] = yH.split(' ');
                                const fechaPlano = new Date(`${y}-${m}-${d}T${h}`);

                                const matchesFecha =
                                        (!startDate || fechaPlano >= startDate) && (!endDate || fechaPlano <= endDate);

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
        }, [planos, search, filterTipo, filterProyecto, filterStart, filterEnd, order]);

        const proyectosFiltrados = projectsList.filter((p) =>
                p.name.toLowerCase().includes(projectSearch.toLowerCase())
        );

        // Función para verificar si es un tipo 3D
        const is3DFile = (plano: PlanoBim) => {
                const ext = (plano.extension ?? '').toLowerCase();
                const tipo = (plano.tipo ?? '').toLowerCase();

                const threeDExts = ['fbx', 'glb', 'gltf', 'ifc'];
                const threeDTypes = ['bim-fbx', 'bim-glb', 'bim-gltf', 'bim-ifc'];

                return threeDExts.includes(ext) || threeDTypes.includes(tipo);
        };


        return (
                <AuthenticatedLayout>
                        <Head title="Biblioteca de Planos BIM" />

                        <div className="py-12">
                                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                        <div className="bg-[#0B1120] shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">

                                                {/* ENCABEZADO */}
                                                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
                                                        <h1 className="text-3xl font-extrabold text-white tracking-wider text-center sm:text-left">
                                                                BIBLIOTECA DE **PLANOS BIM**
                                                        </h1>

                                                        {isInternalUser && (
                                                                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                                                                        <button
                                                                                onClick={handleCreateClick}
                                                                                className="bg-[#B3E10F] hover:bg-lime-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-[#B3E10F]/30"
                                                                        >
                                                                                Subir Plano BIM
                                                                        </button>

                                                                        <button
                                                                                onClick={() => router.get(route('planos.trash'))}
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

                                                        {/* SELECT TIPO DE ARCHIVO */}
                                                        <select
                                                                value={filterTipo}
                                                                onChange={(e) => setFilterTipo(e.target.value)}
                                                                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8] pr-8"
                                                        >
                                                                <option value="">Tipo: Todos</option>
                                                                <option value="DWG">DWG (AutoCAD)</option>
                                                                <option value="DXF">DXF</option>
                                                                <option value="IFC">IFC (Modelado BIM)</option>
                                                                <option value="BIM-FBX">BIM-FBX (3D)</option>
                                                                <option value="BIM-IFC">BIM-IFC</option>
                                                                <option value="PDF">PDF</option>
                                                                <option value="URL">URL / Enlace</option>
                                                                <option value="Otro">Otro</option>
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
                                                                                        onChange={(e) => setSearchProject(e.target.value)}
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
                                                {filteredPlanos.length > 0 ? (
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
                                                                                {filteredPlanos.map((plano) => (
                                                                                        <tr key={plano.id} className="hover:bg-gray-800/50 transition duration-150">
                                                                                                <td className="px-6 py-4 text-sm font-semibold text-[#2970E8]">{plano.titulo}</td>
                                                                                                <td className="px-6 py-4 text-sm font-medium text-[#B3E10F]">{plano.proyecto_nombre}</td>
                                                                                                <td className="px-6 py-4 text-sm text-gray-300">{plano.extension}</td>
                                                                                                <td className="px-6 py-4 text-sm text-blue-400 truncate max-w-[180px]">
                                                                                                        {plano.tipo === 'URL' || plano.archivo_url ? (
                                                                                                                <a
                                                                                                                        href={plano.archivo_url || plano.enlace_externo || '#'} // Usar enlace_externo si archivo_url es nulo
                                                                                                                        target="_blank"
                                                                                                                        rel="noopener noreferrer"
                                                                                                                        className="hover:text-[#B3E10F] underline"
                                                                                                                >
                                                                                                                        {plano.tipo === 'URL' ? 'Ver Enlace' : 'Ver Archivo'}
                                                                                                                </a>
                                                                                                        ) : (
                                                                                                                <span className="text-gray-500">–</span>
                                                                                                        )}
                                                                                                </td>

                                                                                                <td className="px-6 py-4 text-sm text-gray-400">{plano.fecha_subida}</td>

                                                                                                {/* LÓGICA DE ACCIONES */}
                                                                                                <td className="px-6 py-4 border-t border-gray-800">
                                                                                                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full text-sm font-medium">

                                                                                                                {/* === ARCHIVOS 3D === */}
                                                                                                                {is3DFile(plano) ? (
                                                                                                                        <>
                                                                                                                                {/* Botón VER 3D */}
                                                                                                                                <button
                                                                                                                                        onClick={() => setModal({ type: 'view3d', plano })}
                                                                                                                                        className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-md text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-600/30 transition"
                                                                                                                                >
                                                                                                                                        Ver 3D
                                                                                                                                </button>

                                                                                                                                {/* Botón VER EN PROFUNDIDAD */}
                                                                                                                                <Link
                                                                                                                                        href={route('planos.3d', plano.id)}
                                                                                                                                        className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-md text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/30 transition"
                                                                                                                                >
                                                                                                                                        Ver en profundidad
                                                                                                                                </Link>
                                                                                                                        </>
                                                                                                                ) : (
                                                                                                                        <>
                                                                                                                                {/* === NO ES 3D === */}
                                                                                                                                {/* PDF / Imágenes / Word / Excel / ZIP / etc */}
                                                                                                                                {plano.archivo_url && (
                                                                                                                                        <button
                                                                                                                                                onClick={() => window.open(plano.enlace_externo ?? undefined, '_blank')}
                                                                                                                                                className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white transition"
                                                                                                                                        >
                                                                                                                                                Abrir
                                                                                                                                        </button>
                                                                                                                                )}

                                                                                                                                {/* Links externos */}
                                                                                                                                {plano.tipo === 'URL' && plano.enlace_externo && (
                                                                                                                                        <button
                                                                                                                                                onClick={() => window.open(plano.enlace_externo!, '_blank')}
                                                                                                                                                className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white transition"
                                                                                                                                        >
                                                                                                                                                Abrir Enlace
                                                                                                                                        </button>
                                                                                                                                )}

                                                                                                                                {/* Descargar archivos locales */}
                                                                                                                                {plano.archivo_url && plano.tipo !== 'URL' && (
                                                                                                                                        <button
                                                                                                                                                onClick={() => handleDownload(plano)}
                                                                                                                                                className="bg-[#B3E10F] hover:bg-lime-300 text-gray-900 px-3 py-1 rounded-md text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30 transition"
                                                                                                                                        >
                                                                                                                                                Descargar
                                                                                                                                        </button>
                                                                                                                                )}
                                                                                                                        </>
                                                                                                                )}
                                                                                                                {/* 3. Acciones de Edición/Eliminación */}
                                                                                                                {isInternalUser && (
                                                                                                                        <>
                                                                                                                                <Link
                                                                                                                                        href={route('planos.edit', plano.id)}
                                                                                                                                        className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition"
                                                                                                                                >
                                                                                                                                        Editar
                                                                                                                                </Link>

                                                                                                                                <button
                                                                                                                                        onClick={() => setModal({ type: 'delete', plano: plano })}
                                                                                                                                        className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md text-xs sm:text-sm font-medium text-white w-full sm:w-auto text-center transition"
                                                                                                                                >
                                                                                                                                        Eliminar
                                                                                                                                </button>
                                                                                                                        </>
                                                                                                                )}
                                                                                                        </div>
                                                                                                </td>
                                                                                                {/* FIN DE LA LÓGICA DE ACCIONES */}

                                                                                        </tr>
                                                                                ))}
                                                                        </tbody>
                                                                </table>
                                                        </div>
                                                ) : (
                                                        <p className="text-gray-500 text-center py-10 italic">
                                                                No se encontraron planos que coincidan con los filtros.
                                                        </p>
                                                )}
                                        </div>
                                </div>
                        </div>

                        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
                        {modal.type === 'delete' && modal.plano && (
                                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl w-[90%] sm:w-[400px] text-center animate-fadeIn">
                                                <h2 className="text-xl font-bold text-white mb-3">¿Eliminar plano BIM?</h2>
                                                <p className="text-gray-300 mb-6">
                                                        Estás a punto de eliminar{' '}
                                                        <span className="text-[#B3E10F] font-semibold">
                                                                {modal.plano?.titulo}
                                                        </span>.
                                                        <br />
                                                        Esta acción moverá el archivo a la papelera.
                                                </p>
                                                <div className="flex justify-center gap-4">
                                                        <button
                                                                onClick={() => setModal({ type: '', plano: null })}
                                                                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                                                        >
                                                                Cancelar
                                                        </button>
                                                        <button
                                                                onClick={() => {
                                                                        if (modal.plano) {
                                                                                confirmDelete(modal.plano);
                                                                                setModal({ type: '', plano: null });
                                                                        }
                                                                }}
                                                                className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white font-bold shadow-md shadow-red-800/40 transition"
                                                        >
                                                                Confirmar
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}

                        {/* 🚀 MODAL DE VISUALIZACIÓN 3D */}
                        {modal.type === 'view3d' && modal.plano && (
                                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl w-[95%] max-w-4xl h-[95%] flex flex-col animate-fadeIn">

                                                {/* ENCABEZADO */}
                                                <div className="flex justify-between items-center mb-4">
                                                        <h2 className="text-xl font-bold text-white">
                                                                Visualizando: <span className="text-[#B3E10F]">{modal.plano.titulo}</span>
                                                        </h2>
                                                        <button
                                                                onClick={() => setModal({ type: '', plano: null })}
                                                                className="text-gray-300 hover:text-white text-xl font-bold transition"
                                                        >
                                                                ✕
                                                        </button>
                                                </div>

                                                {/* VISOR 3D */}
                                                <div className="flex-grow rounded-lg overflow-hidden bg-black border border-gray-700">
                                                        <FBXViewer
                                                                key={modal.plano.id}
                                                                // Usamos archivo_url directamente
                                                                file={modal.plano.archivo_url || undefined}

                                                        />
                                                </div>

                                                {/* PIE DEL MODAL */}
                                                <div className="mt-4 flex justify-end">
                                                        <button
                                                                onClick={() => setModal({ type: '', plano: null })}
                                                                className="bg-red-700 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition"
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

export default PlanoIndex;