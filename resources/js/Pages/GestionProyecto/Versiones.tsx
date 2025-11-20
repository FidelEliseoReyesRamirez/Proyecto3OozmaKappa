import { Link, usePage } from "@inertiajs/react";
import { useState, useMemo, useEffect, useRef } from "react";

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

const colores: Record<EventoTipo, string> = {
    bim: "#2970E8",
    metadato: "#F59E0B",
    documento: "#EAB308",
    tarea: "#22C55E",
    hito: "#A855F7",
    auditoria: "#EF4444",
};

const etiquetas: Record<EventoTipo, string> = {
    bim: "BIM",
    metadato: "Metadatos",
    documento: "Documento",
    tarea: "Tarea",
    hito: "Hito",
    auditoria: "Auditoría",
};

export default function Versiones() {
    const { proyecto, timeline, versionesProyecto, versionesBim } =
        usePage().props as unknown as {
            proyecto: any;
            timeline: EventoTimeline[];
            versionesProyecto: any[];
            versionesBim: any[];
        };


    const [filters, setFilters] = useState<Record<EventoTipo, boolean>>({
        bim: true,
        metadato: true,
        documento: true,
        tarea: true,
        hito: true,
        auditoria: true,
    });

    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [userFilter, setUserFilter] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const [openTipos, setOpenTipos] = useState(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Lista de usuarios (autor) únicos para el filtro
    const usuarios = useMemo(() => {
        const set = new Set<string>();
        (timeline || []).forEach((item: EventoTimeline) => {
            const nombre = item.autor || item.usuario;
            if (nombre) set.add(nombre);
        });
        return Array.from(set).sort();
    }, [timeline]);

    // Timeline filtrado y ordenado de antiguo -> reciente
    const filteredTimeline = useMemo(() => {
        const lowerSearch = search.trim().toLowerCase();

        const base = (timeline || []).filter((item: EventoTimeline) => {
            const tipo = item.tipo as EventoTipo;
            if (!filters[tipo]) return false;

            const eventDate = new Date(item.fecha);

            if (dateStart) {
                const start = new Date(dateStart + "T00:00:00");
                if (eventDate < start) return false;
            }

            if (dateEnd) {
                const end = new Date(dateEnd + "T23:59:59");
                if (eventDate > end) return false;
            }

            const autorNombre = (item.autor || item.usuario || "").toString();
            if (userFilter && autorNombre !== userFilter) return false;

            if (lowerSearch) {
                const texto =
                    (
                        item.descripcion ||
                        item.archivo ||
                        item.accion ||
                        item.titulo ||
                        item.version ||
                        autorNombre ||
                        ""
                    )
                        .toString()
                        .toLowerCase();

                if (!texto.includes(lowerSearch)) return false;
            }

            return true;
        });

        // Ordenar por fecha ascendente: lo antiguo primero, lo reciente al final
        return [...base].sort(
            (a, b) =>
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
    }, [timeline, filters, dateStart, dateEnd, userFilter, search]);

    // Al cambiar el timeline filtrado, hacer scroll al final (evento más reciente)
    useEffect(() => {
        if (scrollRef.current) {
            const el = scrollRef.current;
            el.scrollLeft = el.scrollWidth;
        }
    }, [filteredTimeline.length]);

    const toggleTipo = (tipo: EventoTipo) => {
        setFilters((prev) => ({
            ...prev,
            [tipo]: !prev[tipo],
        }));
    };

    const countTiposActivos = Object.values(filters).filter(Boolean).length;

    const renderContenido = (e: EventoTimeline) => {
        switch (e.tipo) {
            case "bim":
                return (
                    <>
                        <p className="text-sm text-gray-300">
                            Archivo: {e.archivo}
                        </p>
                        {e.autor && (
                            <p className="text-xs text-gray-400 mt-1">
                                Subido por: {e.autor}
                            </p>
                        )}
                    </>
                );
            case "metadato":
                return (
                    <>
                        <p className="text-sm text-gray-300">
                            {e.descripcion}
                        </p>
                        {e.autor && (
                            <p className="text-xs text-gray-400 mt-1">
                                Responsable: {e.autor}
                            </p>
                        )}
                    </>
                );
            case "documento":
                return (
                    <>
                        <p className="text-sm text-gray-300">{e.archivo}</p>
                        {e.descripcion && (
                            <p className="text-xs text-gray-400 mt-1">
                                {e.descripcion}
                            </p>
                        )}
                        {e.autor && (
                            <p className="text-xs text-gray-400 mt-1">
                                Subido por: {e.autor}
                            </p>
                        )}
                    </>
                );
            case "tarea":
                return (
                    <>
                        <p className="text-sm text-gray-300">
                            Estado: {e.estado_anterior} → {e.estado_nuevo}
                        </p>
                        {e.autor && (
                            <p className="text-xs text-gray-400 mt-1">
                                Usuario: {e.autor}
                            </p>
                        )}
                    </>
                );
            case "hito":
                return (
                    <>
                        <p className="text-sm text-gray-300">
                            Estado: {e.estado}
                        </p>
                        {e.autor && (
                            <p className="text-xs text-gray-400 mt-1">
                                Encargado: {e.autor}
                            </p>
                        )}
                    </>
                );
            case "auditoria":
                return (
                    <>
                        <p className="text-sm text-gray-300">
                            {e.accion}
                        </p>
                        {(e.autor || e.usuario) && (
                            <p className="text-xs text-gray-400 mt-1">
                                Usuario: {e.autor || e.usuario}
                            </p>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const tituloEvento = (e: EventoTimeline) => {
        const base = etiquetas[e.tipo];
        if (e.tipo === "bim" && e.version) return `${base} ${e.version}`;
        if (e.tipo === "metadato" && e.version)
            return `${base} ${e.version}`;
        if (e.titulo) return e.titulo;
        return base.toUpperCase();
    };

    return (
        <section className="flex justify-center items-start pt-12 bg-gray-950 min-h-screen">
            <div className="w-full max-w-7xl bg-[#080D15] rounded-xl shadow-2xl p-8 text-white border border-gray-800/80">

                {/* ENCABEZADO */}
                <header className="mb-10 border-b border-gray-700 pb-4">
                    <h2 className="text-3xl font-extrabold text-[#2970E8] tracking-wider uppercase">
                        Historial del Proyecto – Timeline 
                    </h2>
                    <p className="text-lg text-white/80 mt-1">
                        Proyecto:{" "}
                        <span className="text-[#B3E10F] font-bold">
                            {proyecto.nombre}
                        </span>
                    </p>
                </header>

                {/* FILTROS */}
                <div className="mb-8 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold text-[#B3E10F] mb-4">
                        Filtros
                    </h3>

                    {/* Fila: tipos (combobox), usuario, búsqueda */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Combo de tipos */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setOpenTipos((v) => !v)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-700 bg-gray-900/80 text-sm hover:border-[#2970E8] hover:bg-gray-900 transition"
                            >
                                <span>Tipos de evento</span>
                                <span className="text-xs text-gray-400">
                                    {countTiposActivos ===
                                    Object.keys(filters).length
                                        ? "Todos"
                                        : `${countTiposActivos} seleccionados`}
                                </span>
                            </button>

                            {openTipos && (
                                <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-700 bg-[#050815] shadow-lg">
                                    <div className="p-3 space-y-2 text-sm">
                                        {(Object.keys(
                                            colores
                                        ) as EventoTipo[]).map((tipo) => (
                                            <label
                                                key={tipo}
                                                className="flex items-center justify-between gap-2 cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className="inline-block w-3 h-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                colores[tipo],
                                                        }}
                                                    />
                                                    {etiquetas[tipo]}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={filters[tipo]}
                                                    onChange={() =>
                                                        toggleTipo(tipo)
                                                    }
                                                    className="accent-lime-400"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filtro por usuario */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1">
                                Usuario
                            </label>
                            <select
                                value={userFilter}
                                onChange={(e) =>
                                    setUserFilter(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white"
                            >
                                <option value="">
                                    Todos los usuarios
                                </option>
                                {usuarios.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Búsqueda textual */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1">
                                Búsqueda
                            </label>
                            <input
                                type="text"
                                placeholder="Buscar en descripción, archivo, versión…"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white"
                            />
                        </div>
                    </div>

                    {/* Fila: fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className="block text-gray-400 mb-1">
                                Desde:
                            </label>
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) =>
                                    setDateStart(e.target.value)
                                }
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1">
                                Hasta:
                            </label>
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) =>
                                    setDateEnd(e.target.value)
                                }
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* TIMELINE HORIZONTAL */}
                <h3 className="text-2xl font-semibold text-[#B3E10F] mb-6">
                    Línea de Tiempo (Horizontal)
                </h3>

                {filteredTimeline.length === 0 ? (
                    <p className="text-gray-500 italic mb-10">
                        No hay eventos según los filtros.
                    </p>
                ) : (
                    <div
                        ref={scrollRef}
                        className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-[#2970E8] scrollbar-track-gray-900"
                    >
                        <div className="relative min-w-max py-8 px-6">
                            {/* Línea base */}
                            <div className="absolute top-8 left-0 right-0 h-[3px] bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />

                            {/* Items */}
                            <div className="flex gap-10">
                                {filteredTimeline.map(
                                    (e: EventoTimeline, idx: number) => {
                                        const color =
                                            colores[e.tipo as EventoTipo];

                                        return (
                                            <div
                                                key={idx}
                                                className="flex flex-col items-center min-w-[260px]"
                                            >
                                                {/* Punto sobre la línea */}
                                                <div className="flex flex-col items-center -mt-1 mb-3">
                                                    <div className="relative">
                                                        <div
                                                            className="absolute inset-0 rounded-full opacity-70 blur-sm"
                                                            style={{
                                                                backgroundColor:
                                                                    color,
                                                            }}
                                                        />
                                                        <div
                                                            className="w-4 h-4 rounded-full border-2 shadow-[0_0_14px_4px_rgba(0,0,0,0.7)]"
                                                            style={{
                                                                borderColor:
                                                                    color,
                                                                backgroundColor:
                                                                    "#0b1220",
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Fecha */}
                                                <p className="text-[11px] text-gray-400 mb-2 text-center">
                                                    {new Date(
                                                        e.fecha
                                                    ).toLocaleString()}
                                                </p>

                                                {/* Card */}
                                                <div
                                                    className="bg-gray-900/80 border border-gray-700 rounded-xl px-5 py-4 shadow-xl hover:-translate-y-1 hover:shadow-[0_0_20px_4px_rgba(0,0,0,0.9)] transition-all duration-200 w-full"
                                                    style={{
                                                        borderColor: color,
                                                    }}
                                                >
                                                    <p
                                                        className="text-sm font-bold text-center mb-2 uppercase tracking-wide"
                                                        style={{
                                                            color,
                                                        }}
                                                    >
                                                        {tituloEvento(e)}
                                                    </p>

                                                    {renderContenido(e)}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TABLA METADATOS */}
                <h3 className="text-xl font-semibold text-[#B3E10F] mb-4">
                    Metadatos del Proyecto
                </h3>

                {versionesProyecto.length > 0 ? (
                    <div className="overflow-x-auto mb-10 border border-gray-800 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-800 text-sm">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="p-3 text-left text-gray-400">
                                        Versión
                                    </th>
                                    <th className="p-3 text-left text-gray-400">
                                        Autor
                                    </th>
                                    <th className="p-3 text-left text-gray-400">
                                        Descripción
                                    </th>
                                    <th className="p-3 text-left text-gray-400">
                                        Fecha
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {versionesProyecto.map((v: any, i: number) => (
                                    <tr key={i}>
                                        <td className="p-3 font-bold text-[#B3E10F]">
                                            {v.version}
                                        </td>
                                        <td className="p-3">
                                            {v.autor ?? "Sistema"}
                                        </td>
                                        <td className="p-3 text-gray-400">
                                            {v.descripcion}
                                        </td>
                                        <td className="p-3 text-gray-500 text-xs">
                                            {new Date(
                                                v.fecha
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic mb-10">
                        Sin cambios de metadatos.
                    </p>
                )}

                {/* TABLA BIM CON DESCARGAS */}
                <h3 className="text-xl font-semibold text-[#2970E8] mb-4">
                    Archivos BIM (Modelos Digitales)
                </h3>

                {versionesBim.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-800 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-800 text-sm">
                            <thead className="bg-gray-900">
                                <tr>
                         
                                    <th className="p-3 text-left text-gray-400">
                                        Archivo
                                    </th>
                                    <th className="p-3 text-left text-gray-400">
                                        Autor
                                    </th>
                                    <th className="p-3 text-left text-gray-400">
                                        Fecha
                                    </th>
                                    <th className="p-3 text-left text-gray-400">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {versionesBim.map((v: any, i: number) => (
                                    <tr key={i}>
                                 
                                        <td className="p-3 text-gray-300 font-mono text-xs">
                                            {v.archivo}
                                        </td>
                                        <td className="p-3 text-gray-400">
                                            {v.autor ?? "—"}
                                        </td>
                                        <td className="p-3 text-gray-500 text-xs">
                                            {new Date(
                                                v.fecha
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-3">
                                            {v.archivo_url && (
                                                <a
                                                    href={`/storage/${v.archivo_url}`}
                                                    target="_blank"
                                                    className="text-[#B3E10F] hover:text-lime-300 border-b border-[#B3E10F] hover:border-lime-300"
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
                ) : (
                    <p className="text-gray-500 italic">
                        No hay archivos BIM registrados.
                    </p>
                )}

                <div className="mt-8 flex justify-end">
                    <Link href={route("proyectos.index")}>
                        <button className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-xs sm:text-sm text-white">
                            Volver a Proyectos
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
