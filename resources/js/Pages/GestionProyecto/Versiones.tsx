import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, usePage } from "@inertiajs/react";
import { useState, useMemo, useEffect, useRef } from "react";

/* -------------------- TIPOS -------------------- */
type EventoTipo = "bim" | "metadato" | "documento" | "tarea" | "hito" | "auditoria";

type EventoTimeline = {
    tipo: EventoTipo;
    fecha: string;
    version?: string;
    archivo?: string;
    descripcion?: string;
    titulo?: string;
    estado?: string;
    estado_anterior?: string;
    estado_nuevo?: string;
    accion?: string;
    autor?: string;
    usuario?: string;
    archivo_url?: string;
    [key: string]: any;
};

/* -------------------- COLORES -------------------- */
const colores: Record<EventoTipo, string> = {
    bim: "#2970E8",
    metadato: "#F59E0B",
    documento: "#EAB308",
    tarea: "#22C55E",
    hito: "#A855F7",
    auditoria: "#EF4444",
};

/* -------------------- ETIQUETAS -------------------- */
const etiquetas: Record<EventoTipo, string> = {
    bim: "BIM",
    metadato: "Metadatos",
    documento: "Documento",
    tarea: "Tarea",
    hito: "Hito",
    auditoria: "Auditoría",
};

/* -------------------- COMPONENTE -------------------- */
export default function Versiones() {

    const { proyecto, timeline, versionesProyecto, versionesBim, auth } =
        usePage().props as unknown as {
            proyecto: any;
            timeline: EventoTimeline[];
            versionesProyecto: any[];
            versionesBim: any[];
            auth: any;
        };

    const isAdmin = auth.user?.rol === "admin";

    /* ---------------------------------------------------
       FILTROS
    --------------------------------------------------- */
    const initialFilters: Record<EventoTipo, boolean> = {
        bim: true,
        metadato: true,
        documento: true,
        tarea: true,
        hito: true,
        auditoria: isAdmin,
    };

    const [filters, setFilters] = useState(initialFilters);
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [userFilter, setUserFilter] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [openTipos, setOpenTipos] = useState(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    /* ---------------------------------------------------
       LISTA DE USUARIOS ÚNICOS
    --------------------------------------------------- */
    const usuarios = useMemo(() => {
        const set = new Set<string>();
        (timeline || []).forEach((item) => {
            const nombre = item.autor || item.usuario;
            if (nombre) set.add(nombre);
        });
        return Array.from(set).sort();
    }, [timeline]);

    /* ---------------------------------------------------
       FILTRADO PRINCIPAL
    --------------------------------------------------- */
    const filteredTimeline = useMemo(() => {
        const lower = search.trim().toLowerCase();

        const base = timeline.filter((item) => {
            if (!isAdmin && item.tipo === "auditoria") return false;
            if (!filters[item.tipo]) return false;

            const fecha = new Date(item.fecha);

            if (dateStart && fecha < new Date(dateStart + "T00:00:00")) return false;
            if (dateEnd && fecha > new Date(dateEnd + "T23:59:59")) return false;

            const autorNombre = (item.autor || item.usuario || "").toLowerCase();
            if (userFilter && autorNombre !== userFilter.toLowerCase()) return false;

            if (lower) {
                const texto = (
                    item.descripcion ||
                    item.archivo ||
                    item.accion ||
                    item.titulo ||
                    item.version ||
                    autorNombre
                )
                    ?.toString()
                    ?.toLowerCase();

                if (!texto.includes(lower)) return false;
            }

            return true;
        });

        return [...base].sort(
            (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
    }, [timeline, filters, dateStart, dateEnd, userFilter, search, isAdmin]);

    /* Scroll automático al final */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [filteredTimeline.length]);

    /* ---------------------------------------------------
       TOGGLE TIPOS
    --------------------------------------------------- */
    const toggleTipo = (tipo: EventoTipo) => {
        if (!isAdmin && tipo === "auditoria") return;
        setFilters((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
    };

    const tiposVisibles = (Object.keys(filters) as EventoTipo[]).filter(
        (t) => isAdmin || t !== "auditoria"
    );
    const activos = tiposVisibles.filter((t) => filters[t]).length;

    /* ---------------------------------------------------
       RENDER CONTENIDO
    --------------------------------------------------- */
    const renderContenido = (e: EventoTimeline) => {
        switch (e.tipo) {
            case "bim":
                return (
                    <div>
                        <p className="text-sm text-gray-300">Archivo: {e.archivo}</p>
                        {e.autor && <p className="text-xs text-gray-400 mt-1">Subido por: {e.autor}</p>}
                    </div>
                );
            case "metadato":
                return (
                    <div>
                        <p className="text-sm text-gray-300">{e.descripcion}</p>
                        {e.autor && <p className="text-xs text-gray-400 mt-1">Responsable: {e.autor}</p>}
                    </div>
                );
            case "documento":
                return (
                    <div>
                        <p className="text-sm text-gray-300">{e.archivo}</p>
                        {e.descripcion && <p className="text-xs text-gray-400">{e.descripcion}</p>}
                    </div>
                );
            case "tarea":
                return (
                    <div>
                        <p className="text-sm text-gray-300">Estado: {e.estado_anterior} → {e.estado_nuevo}</p>
                    </div>
                );
            case "hito":
                return (
                    <div>
                        <p className="text-sm text-gray-300">Estado: {e.estado}</p>
                    </div>
                );
            case "auditoria":
                if (!isAdmin) return null;
                return (
                    <div>
                        <p className="text-sm text-gray-300">{e.accion}</p>
                    </div>
                );
        }
    };

    const tituloEvento = (e: EventoTimeline) => {
        if (!isAdmin && e.tipo === "auditoria") return "";
        const base = etiquetas[e.tipo];
        if (e.version) return `${base} ${e.version}`;
        return e.titulo || base.toUpperCase();
    };

    /* ---------------------------------------------------
       RETURN COMPLETO CON AuthenticatedLayout
    --------------------------------------------------- */

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-extrabold text-[#B3E10F] tracking-wide">
                    Historial del Proyecto – Timeline
                </h2>
            }
        >
            <section className="pt-10 pb-16 bg-gray-950 min-h-screen">
                <div className="w-full max-w-7xl mx-auto bg-[#080D15] rounded-xl shadow-xl p-8 text-white border border-gray-800/70">

                    {/* SUBTÍTULO */}
                    <p className="text-lg text-white/80 mb-6">
                        Proyecto: <span className="text-[#B3E10F] font-bold">{proyecto.nombre}</span>
                    </p>

                    {/* ---------------------------------------------------
                       FILTROS
                    --------------------------------------------------- */}
                    <div className="mb-10 p-4 bg-gray-900/40 rounded-lg border border-gray-700">

                        <h3 className="text-xl font-semibold text-[#B3E10F] mb-4">
                            Filtros
                        </h3>

                        {/* FILA 1: TIPOS / USUARIO / SEARCH */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

                            {/* TIPOS */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpenTipos((v) => !v)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-700 bg-gray-900/80 text-sm"
                                >
                                    <span>Tipos de evento</span>
                                    <span className="text-xs text-gray-400">
                                        {activos === tiposVisibles.length
                                            ? "Todos"
                                            : `${activos} seleccionados`}
                                    </span>
                                </button>

                                {openTipos && (
                                    <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-700 bg-[#050815] shadow-xl">
                                        <div className="p-3 space-y-2 text-sm">
                                            {(Object.keys(colores) as EventoTipo[])
                                                .filter((t) => isAdmin || t !== "auditoria")
                                                .map((tipo) => (
                                                    <label
                                                        key={tipo}
                                                        className="flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className="inline-block w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: colores[tipo] }}
                                                            />
                                                            {etiquetas[tipo]}
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            checked={filters[tipo]}
                                                            onChange={() => toggleTipo(tipo)}
                                                            className="accent-lime-400"
                                                        />
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* USUARIO */}
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">
                                    Usuario
                                </label>
                                <select
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                                >
                                    <option value="">Todos</option>
                                    {usuarios.map((u) => (
                                        <option key={u}>{u}</option>
                                    ))}
                                </select>
                            </div>

                            {/* BUSCAR */}

                            <div>
                                <label className="block text-gray-400 text-xs mb-1">
                                    Búsqueda
                                </label>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar archivo, usuario, descripción…"
                                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                                />
                            </div>
                        </div>

                        {/* FILA 2: FECHAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Desde:</label>
                                <input
                                    type="date"
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Hasta:</label>
                                <input
                                    type="date"
                                    value={dateEnd}
                                    onChange={(e) => setDateEnd(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------------
                       TIMELINE HORIZONTAL
                    --------------------------------------------------- */}
                    <h3 className="text-2xl font-semibold text-[#B3E10F] mb-6">
                        Línea de Tiempo
                    </h3>

                    {filteredTimeline.length === 0 ? (
                        <p className="text-gray-500 italic mb-10">
                            No se encontraron eventos con los filtros.
                        </p>
                    ) : (
                        <div
                            ref={scrollRef}
                            className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-[#2970E8]"
                        >
                            <div className="relative min-w-max py-8 px-6">
                                <div className="absolute top-8 left-0 right-0 h-[3px] bg-gray-700" />

                                <div className="flex gap-10">
                                    {filteredTimeline.map((e, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center min-w-[260px]"
                                        >
                                            <div className="relative mb-3">
                                                <div
                                                    className="absolute inset-0 rounded-full blur-sm opacity-70"
                                                    style={{ backgroundColor: colores[e.tipo] }}
                                                />
                                                <div
                                                    className="w-4 h-4 rounded-full border-2"
                                                    style={{
                                                        borderColor: colores[e.tipo],
                                                        backgroundColor: "#0b1220",
                                                    }}
                                                />
                                            </div>

                                            <p className="text-[11px] text-gray-400 mb-2 text-center">
                                                {new Date(e.fecha).toLocaleString()}
                                            </p>

                                            <div
                                                className="bg-gray-900/80 border border-gray-700 rounded-xl px-5 py-4 w-full"
                                                style={{ borderColor: colores[e.tipo] }}
                                            >
                                                <p
                                                    className="text-sm font-bold text-center mb-2 uppercase"
                                                    style={{ color: colores[e.tipo] }}
                                                >
                                                    {tituloEvento(e)}
                                                </p>

                                                {renderContenido(e)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ---------------------------------------------------
                       METADATOS
                    --------------------------------------------------- */}

                    <h3 className="text-xl font-semibold text-[#B3E10F] mb-4">
                        Metadatos del Proyecto
                    </h3>

                    {versionesProyecto.length === 0 ? (
                        <p className="text-gray-500 italic mb-10">Sin metadatos registrados.</p>
                    ) : (
                        <div className="overflow-x-auto mb-10 border border-gray-800 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-800 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="p-3 text-left text-gray-400">Versión</th>
                                        <th className="p-3 text-left text-gray-400">Autor</th>
                                        <th className="p-3 text-left text-gray-400">Descripción</th>
                                        <th className="p-3 text-left text-gray-400">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {versionesProyecto.map((v, i) => (
                                        <tr key={i} className="border-t border-gray-800">
                                            <td className="p-3 text-[#B3E10F] font-bold">
                                                {v.version}
                                            </td>
                                            <td className="p-3">{v.autor ?? "—"}</td>
                                            <td className="p-3 text-gray-400">{v.descripcion}</td>
                                            <td className="p-3 text-gray-500 text-xs">
                                                {new Date(v.fecha).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ---------------------------------------------------
                       BIM
                    --------------------------------------------------- */}

                    <h3 className="text-xl font-semibold text-[#2970E8] mb-4">
                        Archivos BIM
                    </h3>

                    {versionesBim.length === 0 ? (
                        <p className="text-gray-500 italic mb-10">No hay archivos BIM.</p>
                    ) : (
                        <div className="overflow-x-auto border border-gray-800 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-800 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="p-3 text-left text-gray-400">Archivo</th>
                                        <th className="p-3 text-left text-gray-400">Autor</th>
                                        <th className="p-3 text-left text-gray-400">Fecha</th>
                                        <th className="p-3 text-left text-gray-400">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {versionesBim.map((v, i) => (
                                        <tr key={i} className="border-t border-gray-800">
                                            <td className="p-3 text-gray-300 font-mono text-xs">{v.archivo}</td>
                                            <td className="p-3 text-gray-400">{v.autor ?? "—"}</td>
                                            <td className="p-3 text-gray-500 text-xs">
                                                {new Date(v.fecha).toLocaleString()}
                                            </td>
                                            <td className="p-3">
                                                {v.archivo_url && (
                                                    <a
                                                        href={`/storage/${v.archivo_url}`}
                                                        target="_blank"
                                                        className="text-[#B3E10F] border-b border-[#B3E10F] hover:text-lime-300"
                                                    >
                                                        Descargar
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-10 flex justify-end">
                        <Link href={route("proyectos.index")}>
                            <button className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded text-white text-sm">
                                Volver a Proyectos
                            </button>
                        </Link>
                    </div>

                </div>
            </section>
        </AuthenticatedLayout>
    );
}
