import React, { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Usuario {
    id: number;
    name: string;
    email: string;
}

interface Auditoria {
    id: number;
    user_id: number | null;
    user?: Usuario | null;
    accion: string;
    descripcion_detallada?: string | null;
    tabla_afectada: string | null;
    id_registro_afectado: number | null;
    ip_address?: string | null;
    fecha_accion: string;
    eliminado: boolean;
}

interface AuditoriaPagination {
    data: Auditoria[];
    current_page: number;
    last_page: number;
    total: number;
}

interface AuditPageProps extends PageProps {
    auditorias: AuditoriaPagination;
    filtros?: {
        search?: string;
        tabla?: string;
    };
    tablas?: string[];
}

const AuditIndex: React.FC = () => {
    const { auditorias, filtros } = usePage<AuditPageProps>().props;

    const [search, setSearch] = useState(filtros?.search || '');
    const [filterAccion, setFilterAccion] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [dateError, setDateError] = useState('');

    const [selected, setSelected] = useState<Auditoria | null>(null);

    const accionesUnicas = useMemo(() => {
        const allAcciones = auditorias.data.map((a) => a.accion);
        const setAcciones = new Set<string>();
        allAcciones.forEach((accion) => {
            const base = accion.replace(/['"]/g, '').split(' ')[0].trim();
            if (base.length > 0) setAcciones.add(base);
        });
        return Array.from(setAcciones);
    }, [auditorias]);

    const usuariosUnicos = useMemo(() => {
        const setUsers = new Map<number, string>();
        auditorias.data.forEach((a) => {
            if (a.user && a.user.name) {
                setUsers.set(a.user.id, a.user.name);
            }
        });
        return Array.from(setUsers.entries()).map(([id, name]) => ({ id, name }));
    }, [auditorias]);

    const filteredAudits = useMemo(() => {
        const term = search.toLowerCase().trim();
        const startDate = filterStart ? new Date(filterStart + 'T00:00:00') : null;
        const endDate = filterEnd ? new Date(filterEnd + 'T23:59:59') : null;

        if (startDate && endDate && endDate < startDate) {
            setDateError('La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
            return [];
        } else setDateError('');

        return auditorias.data
            .filter((a: Auditoria) => {
                const fecha = new Date(a.fecha_accion);

                const matchesSearch =
                    a.accion.toLowerCase().includes(term) ||
                    a.user?.name?.toLowerCase().includes(term) ||
                    String(a.id_registro_afectado ?? '').toLowerCase().includes(term);

                const matchesUser =
                    !filterUser || a.user?.name?.toLowerCase() === filterUser.toLowerCase();

                const matchesAccion =
                    !filterAccion ||
                    a.accion.toLowerCase().startsWith(filterAccion.toLowerCase()) ||
                    a.accion.toLowerCase().includes(filterAccion.toLowerCase());

                const matchesFecha =
                    (!startDate || fecha >= startDate) && (!endDate || fecha <= endDate);

                return (
                    matchesSearch &&
                    matchesAccion &&
                    matchesFecha &&
                    matchesUser
                );
            })
            .sort((a, b) => {
                const fa = new Date(a.fecha_accion).getTime();
                const fb = new Date(b.fecha_accion).getTime();
                return order === 'desc' ? fb - fa : fa - fb;
            });
    }, [auditorias, search, filterAccion, filterUser, filterStart, filterEnd, order]);

    const handleClearFilters = () => {
        setSearch('');
        setFilterAccion('');
        setFilterUser('');
        setFilterStart('');
        setFilterEnd('');
        setOrder('desc');
        setDateError('');
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > auditorias.last_page) return;
        router.get(
            route('auditoria.index'),
            { page },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Auditoría del Sistema" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#0B1120] shadow-2xl sm:rounded-xl p-8 border border-gray-800/80">

                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
                            <h1 className="text-3xl font-extrabold text-white tracking-wider text-center sm:text-left">
                                REGISTROS DE AUDITORÍA
                            </h1>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-3 justify-between items-center">
                            <input
                                type="text"
                                placeholder="Buscar (acción, usuario, ID registro)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-grow min-w-[180px] px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#B3E10F]"
                            />

                            <div className="relative">
                                <input
                                    type="text"
                                    list="usuarios-list"
                                    placeholder="Filtrar por usuario..."
                                    value={filterUser}
                                    onChange={(e) => setFilterUser(e.target.value)}
                                    className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#B3E10F] w-48"
                                />
                                <datalist id="usuarios-list">
                                    {usuariosUnicos.map((u) => (
                                        <option key={u.id} value={u.name} />
                                    ))}
                                </datalist>
                            </div>

                            <select
                                value={filterAccion}
                                onChange={(e) => setFilterAccion(e.target.value)}
                                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#B3E10F] pr-8"
                            >
                                <option value="">Todas las acciones</option>
                                {accionesUnicas.map((tipo, i) => (
                                    <option key={i} value={tipo}>
                                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <div className="flex flex-col">
                                    <label className="text-gray-400 text-xs mb-1">Desde</label>
                                    <input
                                        type="date"
                                        value={filterStart}
                                        onChange={(e) => setFilterStart(e.target.value)}
                                        className="px-2 py-1 rounded-md bg-[#080D15] text-white border border-gray-700 text-xs focus:ring-2 focus:ring-[#B3E10F]"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-400 text-xs mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        value={filterEnd}
                                        onChange={(e) => setFilterEnd(e.target.value)}
                                        className="px-2 py-1 rounded-md bg-[#080D15] text-white border border-gray-700 text-xs focus:ring-2 focus:ring-[#B3E10F]"
                                    />
                                </div>
                            </div>

                            <select
                                value={order}
                                onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#B3E10F] pr-8"
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

                        {filteredAudits.length > 0 ? (
                            <div className="overflow-x-auto border border-gray-800 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-800 table-auto">
                                    <thead className="bg-[#B3E10F] text-black text-xs sm:text-sm font-semibold shadow-md shadow-[#B3E10F]/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Usuario</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Acción</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Registro</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#080D15] divide-y divide-gray-800/50">
                                        {filteredAudits.map((a) => (
                                            <tr key={a.id} className="hover:bg-gray-800/50 transition duration-150">
                                                <td className="px-6 py-4 text-sm font-semibold text-[#B3E10F]">
                                                    {a.user?.name || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-200">
                                                    {a.accion}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {a.id_registro_afectado || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {new Date(a.fecha_accion).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => setSelected(a)}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs"
                                                    >
                                                        Ver
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-10 italic">
                                No se encontraron registros de auditoría que coincidan con los filtros.
                            </p>
                        )}

                        <div className="mt-4 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={auditorias.current_page <= 1}
                                    onClick={() => goToPage(auditorias.current_page - 1)}
                                    className={`px-3 py-1 rounded-md text-sm font-semibold ${
                                        auditorias.current_page <= 1
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#B3E10F] text-black hover:bg-lime-400 transition'
                                    }`}
                                >
                                    ← Anterior
                                </button>

                                <button
                                    disabled={auditorias.current_page >= auditorias.last_page}
                                    onClick={() => goToPage(auditorias.current_page + 1)}
                                    className={`px-3 py-1 rounded-md text-sm font-semibold ${
                                        auditorias.current_page >= auditorias.last_page
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#B3E10F] text-black hover:bg-lime-400 transition'
                                    }`}
                                >
                                    Siguiente →
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <span>Página {auditorias.current_page} de {auditorias.last_page}</span>
                                <span>Total: {auditorias.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-[#0B1120] p-6 rounded-xl w-full max-w-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-[#B3E10F] mb-4">
                            Detalle del Registro
                        </h2>

                        <div className="space-y-2 text-gray-300 text-sm">
                            <p><strong>Usuario:</strong> {selected.user?.name || '—'}</p>
                            <p><strong>Acción:</strong> {selected.accion}</p>
                            <p><strong>ID Registro:</strong> {selected.id_registro_afectado || '—'}</p>
                            <p><strong>IP:</strong> {selected.ip_address || '—'}</p>
                            <p><strong>Fecha:</strong> {new Date(selected.fecha_accion).toLocaleString()}</p>

                            {selected.descripcion_detallada && (
                                <div>
                                    <strong>Descripción:</strong>
                                    <p className="whitespace-pre-line text-gray-400 mt-1">
                                        {selected.descripcion_detallada}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setSelected(null)}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white"
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

export default AuditIndex;
