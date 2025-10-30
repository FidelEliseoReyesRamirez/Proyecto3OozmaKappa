// PlanosIndex.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import PlanosFilters from './PlanosFilters';
import PlanosTable from './PlanosTable';

// Interfaz para el objeto Plano
interface Plano {
    id: number;
    titulo: string;
    descripcion: string | null;
    archivo_url: string | null; // Esta es la URL de DESCARGA (si es archivo) o NULL (si es enlace)
    enlace_externo?: string | null; // Esta es la URL del ENLACE (si es tipo URL)
    tipo: string; 
    extension: string;
    fecha_subida: string;
    proyecto_id: number;
    proyecto_nombre: string;
}

// Interfaz para las props de la página
interface PlanosIndexProps extends PageProps {
    documents: Plano[]; 
    projectsList: { id: number; name: string }[];
    userRole: 'admin' | 'arquitecto' | 'ingeniero' | 'cliente';
}

const PlanosIndex: React.FC = () => {
    const { documents, projectsList, userRole } = usePage<PlanosIndexProps>().props;

    // --- ESTADOS ---
    const [search, setSearch] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [filterProyecto, setFilterProyecto] = useState('');
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');
    const [order, setOrder] = useState<'desc' | 'asc'>('desc');
    const [dateError, setDateError] = useState('');
    const [projectOpen, setProjectOpen] = useState(false);
    const [projectSearch, setProjectSearch] = useState('');
    const [modal, setModal] = useState<{ type: string; document: Plano | null }>({ type: '', document: null });

    const isInternalUser = ['admin', 'arquitecto', 'ingeniero'].includes(userRole);

    // --- LÓGICA / MANEJADORES ---

    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.combo-proyectos')) setProjectOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    // 
    // 💡 *** CORRECCIÓN CRÍTICA DE LA FUNCIÓN DE DESCARGA ***
    // 
    const handleDownload = useCallback((doc: Plano) => {
        try {
            // Caso 1: Es un enlace externo (Tipo URL)
            // Debe comprobar esto PRIMERO.
            if (doc.tipo === 'URL' && doc.enlace_externo) {
                window.open(doc.enlace_externo, '_blank', 'noopener,noreferrer');
                return;
            }

            // Caso 2: Es un archivo descargable (Tipo PDF, DWG, etc.)
            // La prop 'doc.archivo_url' YA CONTIENE la ruta de descarga generada por Laravel (ej: /planos/123/download)
            if (doc.archivo_url) {
                // Simplemente redirigimos a esa URL para que el backend maneje la descarga.
                window.location.href = doc.archivo_url;
                return;
            }
            
            // Caso 3: No hay nada que descargar
            console.warn('Este plano no tiene un enlace externo ni un archivo descargable adjunto.', doc);

        } catch (error) {
            console.error('Error al procesar la descarga:', error);
        }
    }, []); // No se necesitan dependencias

    // Función de eliminación (usada por PlanosTable y el modal)
    const handleConfirmDelete = useCallback(() => {
        if (modal.document) {
            router.delete(route('planos.destroy', modal.document.id), { onFinish: () => setModal({ type: '', document: null }) });
        }
    }, [modal.document]);

    const handleClearFilters = useCallback(() => {
        setSearch('');
        setFilterTipo('');
        setFilterProyecto('');
        setFilterStart('');
        setFilterEnd('');
        setOrder('desc');
        setDateError('');
    }, []);

    // --- FILTRADO Y ORDENAMIENTO (useMemo) ---
    const filteredPlanos = useMemo(() => {
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

                // Manejo de error si la fecha_subida es nula o inválida
                if (!doc.fecha_subida) return false; 
                
                try {
                    const [d, m, yH] = doc.fecha_subida.split('/');
                    if (!yH) return false; // Salida temprana si el formato es incorrecto
                    
                    const [y, h] = yH.split(' ');
                    if (!h) return false; // Salida temprana

                    const fechaDoc = new Date(`${y}-${m}-${d}T${h}`); 
                    if (isNaN(fechaDoc.getTime())) return false; // Comprobar si la fecha es válida

                    const matchesFecha =
                        (!startDate || fechaDoc >= startDate) && (!endDate || fechaDoc <= endDate);

                    return matchesSearch && matchesTipo && matchesProyecto && matchesFecha;

                } catch (e) {
                    console.error("Error parseando fecha:", doc.fecha_subida, e);
                    return false;
                }
            })
            .sort((a, b) => {
                const parse = (str: string) => {
                    if (!str) return 0;
                    try {
                        const [d, m, yH] = str.split('/');
                        const [y, h] = yH.split(' ');
                        return new Date(`${y}-${m}-${d}T${h}`).getTime();
                    } catch (e) {
                        return 0;
                    }
                };
                const dateA = parse(a.fecha_subida);
                const dateB = parse(b.fecha_subida);
                return order === 'desc' ? dateB - dateA : dateA - dateB;
            });
    }, [documents, search, filterTipo, filterProyecto, filterStart, filterEnd, order]);

    const proyectosFiltrados = projectsList.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    // --- RENDERIZADO DEL CONTENEDOR ---
    return (
        <AuthenticatedLayout>
            <Head title="Biblioteca de Planos BIM" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">

                        {/* ENCABEZADO Y BOTONES PRINCIPALES */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
                            <h1 className="text-3xl font-extrabold text-white tracking-wider text-center sm:text-left">
                                BIBLIOTECA DE PLANOS BIM
                            </h1>

                            {isInternalUser && (
                                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                                    <button
                                        onClick={() => router.get(route('planos.create'))}
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

                        {/* COMPONENTE DE FILTROS EXTRAÍDO */}
                        <PlanosFilters
                            search={search}
                            setSearch={setSearch}
                            filterTipo={filterTipo}
                            setFilterTipo={setFilterTipo}
                            filterProyecto={filterProyecto}
                            setFilterProyecto={setFilterProyecto}
                            filterStart={filterStart}
                            setFilterStart={setFilterStart}
                            filterEnd={filterEnd}
                            setFilterEnd={setFilterEnd}
                            order={order}
                            setOrder={setOrder}
                            handleClearFilters={handleClearFilters}
                            projectsList={projectsList}
                            projectOpen={projectOpen}
                            setProjectOpen={setProjectOpen}
                            projectSearch={projectSearch}
                            setProjectSearch={setProjectSearch}
                            proyectosFiltrados={proyectosFiltrados}
                        />

                        {dateError && (
                            <p className="text-red-400 text-sm text-center mb-4">{dateError}</p>
                        )}

                        {/* COMPONENTE DE TABLA EXTRAÍDO */}
                        <PlanosTable
                            filteredPlanos={filteredPlanos}
                            handleDownload={handleDownload}
                            isInternalUser={isInternalUser}
                            openDeleteModal={(doc) => setModal({ type: 'delete', document: doc })}
                        />
                    </div>
                </div>
            </div>

            {/* MODAL DE ELIMINACIÓN */}
            {modal.type === 'delete' && modal.document && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-gray-700 w-11/11/12 max-w-md animate-fadeIn">
                        <h2 className="text-xl font-bold text-red-400 mb-3">Eliminar Plano: {modal.document.titulo}</h2>
                        <p className="text-gray-300 mb-5 text-sm">
                            ¿Estás seguro de que deseas mover este plano a la papelera? Podrás restaurarlo más tarde.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-white font-semibold"
                            >
                                Mover a Papelera
                            </button>
                            <button
                                onClick={() => setModal({ type: '', document: null })}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default PlanosIndex;