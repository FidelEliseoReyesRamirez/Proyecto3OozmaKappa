import React, { useState, useMemo } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Plano {
    id: number;
    titulo: string;
    descripcion: string | null;
    tipo: string;
    fecha_eliminacion: string | null; 
    proyecto_nombre: string;
    dias_restantes: number | null;
}

interface PlanoTrashProps extends PageProps {
    planos: Plano[];
    userRole: string;
}

const PlanoTrash: React.FC = () => {
    const { planos } = usePage<PlanoTrashProps>().props;
    const [search, setSearch] = useState('');
    // Solo necesitamos modal para 'restore' y 'delete' (eliminación individual)
    const [modal, setModal] = useState<{ type: string; id: number | null }>({ type: '', id: null });
    
    // Usamos useForm para las operaciones DELETE (Eliminar individual)
    const { delete: inertiaDelete, processing } = useForm({});

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        return planos.filter(
            (p) =>
                p.titulo.toLowerCase().includes(term) ||
                p.descripcion?.toLowerCase().includes(term) ||
                p.proyecto_nombre.toLowerCase().includes(term)
        );
    }, [search, planos]);

    const openModal = (type: string, id: number) => setModal({ type, id });
    const closeModal = () => setModal({ type: '', id: null });

    const handleRestore = () => {
        if (modal.id) {
            router.patch(route('planos.restore', modal.id), {}, { onFinish: closeModal });
        }
    };

    const handleDelete = () => {
        if (modal.id) {
            // ELIMINACIÓN PERMANENTE INDIVIDUAL: usa planos.forceDestroy
            inertiaDelete(route('planos.forceDestroy', modal.id), { 
                onFinish: closeModal,
                preserveScroll: true,
            });
        }
    };

    // ❌ FUNCIÓN handlePurge ELIMINADA

    return (
        <AuthenticatedLayout>
            <Head title="Papelera de Planos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">

                        {/* ENCABEZADO */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
                            <h1 className="text-3xl font-extrabold text-white tracking-wider text-center sm:text-left">
                                PAPELERA DE PLANOS 📐
                            </h1>

                            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                                <button
                                    onClick={() => router.get(route('planos.index'))}
                                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md shadow-gray-800/40"
                                >
                                    Regresar
                                </button>
                                
                                {/* ❌ BOTÓN 'Purgar todo' ELIMINADO */}
                            </div>
                        </div>

                        {/* BUSCADOR */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-3 justify-between items-center">
                            <input
                                type="text"
                                placeholder="Buscar título o proyecto de plano..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-grow min-w-[180px] px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8]"
                            />
                        </div>

                        {/* TABLA */}
                        {filtered.length > 0 ? (
                            <div className="overflow-x-auto border border-gray-800 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-800 table-auto">
                                    <thead className="bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-800/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Título del Plano</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Proyecto</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Eliminado el</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Días restantes</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#080D15] divide-y divide-gray-800/50">
                                        {filtered.map((plano) => (
                                            <tr key={plano.id} className="hover:bg-gray-800/50 transition duration-150">
                                                <td className="px-6 py-4 text-sm font-semibold text-[#B3E10F]">{plano.titulo}</td>
                                                <td className="px-6 py-4 text-sm text-[#2970E8]">{plano.proyecto_nombre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{plano.tipo}</td>
                                                <td className="px-6 py-4 text-sm text-gray-400">{plano.fecha_eliminacion || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-200">
                                                    {plano.dias_restantes !== null ? `${Math.floor(plano.dias_restantes)} días` : '—'}
                                                </td>
                                                <td className="px-6 py-4 flex flex-wrap gap-2 text-sm font-medium">
                                                    <button
                                                        onClick={() => openModal('restore', plano.id)}
                                                        className="bg-lime-500 hover:bg-lime-400 px-3 py-1 rounded-md text-gray-900 font-bold transition disabled:opacity-50"
                                                        disabled={processing}
                                                    >
                                                        Restaurar
                                                    </button>
                                                    <button
                                                        onClick={() => openModal('delete', plano.id)}
                                                        className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md text-white transition disabled:opacity-50"
                                                        disabled={processing}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-10 italic">
                                No hay planos en la papelera.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALES */}
            {modal.type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#0F172A] text-center p-6 rounded-xl shadow-2xl border border-gray-700 w-11/12 max-w-md animate-fadeIn">
                        {modal.type === 'restore' && (
                            <>
                                <h2 className="text-xl font-bold text-lime-400 mb-3">Restaurar Plano</h2>
                                <p className="text-gray-300 mb-5 text-sm">
                                    ¿Deseas restaurar este plano a la biblioteca?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleRestore}
                                        className="bg-lime-500 hover:bg-lime-400 px-4 py-2 rounded-md text-gray-900 font-semibold disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Restaurar
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}

                        {modal.type === 'delete' && (
                            <>
                                <h2 className="text-xl font-bold text-red-400 mb-3">Eliminar Plano Definitivamente</h2>
                                <p className="text-gray-300 mb-5 text-sm">
                                    Esta acción eliminará el plano **permanentemente** y **no se puede deshacer**. ¿Deseas continuar?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ❌ MODAL DE PURGA TOTAL ELIMINADO */}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default PlanoTrash;