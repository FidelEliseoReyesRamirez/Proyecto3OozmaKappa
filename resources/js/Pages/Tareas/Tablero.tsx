import { useState, useEffect } from "react";
import { router, Link, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Tablero() {
    const pageProps = usePage().props as any;
    const { proyectos, auth, flash, ultimoProyecto } = pageProps;

    const url = usePage().url;
    const params = new URLSearchParams(url.split("?")[1] || "");
    const proyectoFromUrl = params.get("proyecto_id");

    const initialProjectId = proyectoFromUrl || ultimoProyecto || null;

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(initialProjectId);

    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [tareas, setTareas] = useState<any[]>([]);
    const [usuarioFiltro, setUsuarioFiltro] = useState("todos");
    const [dragged, setDragged] = useState<any>(null);

    const [historial, setHistorial] = useState<any[]>([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState<any>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const [busquedaProyecto, setBusquedaProyecto] = useState("");
    const [openProyecto, setOpenProyecto] = useState(false);

    const userRole = auth.user?.rol;
    const isEmployee = ["admin", "arquitecto", "ingeniero"].includes(userRole);

    // ============================================================
    // ▶ CARGAR TAREAS Y USUARIOS DEL PROYECTO
    // ============================================================
    useEffect(() => {
        if (!proyectoSeleccionado) return;

        fetch(`/tareas/proyecto/${proyectoSeleccionado}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setTareas(data.tareas || []);
                    setUsuarios(data.usuarios || []);
                }
            })
            .catch(() => {
                setTareas([]);
                setUsuarios([]);
            });
    }, [proyectoSeleccionado]);

    useEffect(() => {
        if (flash?.success) console.log("FLASH:", flash.success);
    }, [flash]);

    // ============================================================
    // ▶ MANEJO DE DRAG & DROP
    // ============================================================
    const onDrop = (_e: any, nuevoEstado: string) => {
        if (!dragged) return;

        const tareaId = dragged.id;
        const estadoAnterior = dragged.estado;

        setTareas((prev) =>
            prev.map((t) =>
                t.id === tareaId ? { ...t, estado: nuevoEstado } : t
            )
        );

        router.patch(
            route("tareas.estado", tareaId),
            { estado: nuevoEstado },
            {
                preserveScroll: true,
                onError: () => {
                    setTareas((prev) =>
                        prev.map((t) =>
                            t.id === tareaId
                                ? { ...t, estado: estadoAnterior }
                                : t
                        )
                    );
                },
            }
        );

        setDragged(null);
    };

    // ============================================================
    // ▶ HISTORIAL DE TAREA
    // ============================================================
    const verHistorial = (tarea: any) => {
        setTareaSeleccionada(tarea);
        setMostrarModal(true);
        setHistorial([]);

        fetch(`/tareas/${tarea.id}/historial`)
            .then((res) => res.json())
            .then((data) => setHistorial(data));
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setTareaSeleccionada(null);
        setHistorial([]);
    };

    // ============================================================
    // ▶ FILTROS
    // ============================================================
    const tareasFiltradas = tareas.filter((t: any) => {
        if (usuarioFiltro === "todos") return true;
        return t.asignado_id === parseInt(usuarioFiltro);
    });

    const proyectosFiltrados = proyectos.filter((p: any) =>
        p.nombre.toLowerCase().includes(busquedaProyecto.toLowerCase())
    );

    // cerrar dropdown si se hace click fuera
    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".combo-proyecto")) setOpenProyecto(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const columnas = ["pendiente", "en progreso", "completado"];

    // ============================================================
    // ▶ INTERFAZ
    // ============================================================
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-white">
                    Tablero Kanban
                </h2>
            }
        >
            <Head title="DEVELARQ | Tablero Kanban" />

            <div className="flex justify-center mt-10 px-2 sm:px-4">
                <div className="w-full max-w-7xl bg-[#0B1120] rounded-lg shadow-lg p-6 text-white border border-gray-800 overflow-x-auto">
                    
                    {/* ===========================
                        HEADER
                    =========================== */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        
                        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 w-full sm:w-auto gap-4">

                            {/* COMBO PROYECTO */}
                            <div className="relative combo-proyecto w-64">
                                <label className="text-[#B3E10F] font-semibold">
                                    Proyecto:
                                </label>

                                <div
                                    onClick={() => setOpenProyecto(!openProyecto)}
                                    className="bg-[#080D15] border border-gray-600 rounded-lg p-2 mt-1 cursor-pointer flex justify-between items-center"
                                >
                                    <span>
                                        {
                                            proyectos.find(
                                                (p: any) =>
                                                    String(p.id) ===
                                                    String(proyectoSeleccionado)
                                            )?.nombre || 
                                            "Selecciona un proyecto..."
                                        }
                                    </span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 text-gray-400"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>

                                {openProyecto && (
                                    <div className="absolute z-50 bg-[#0B1120] border border-gray-700 rounded-lg mt-1 w-full shadow-xl">
                                        <input
                                            type="text"
                                            placeholder="Buscar proyecto..."
                                            className="w-full px-3 py-2 bg-gray-800 text-gray-200 border-b border-gray-700 text-sm"
                                            value={busquedaProyecto}
                                            onChange={(e) =>
                                                setBusquedaProyecto(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        {proyectosFiltrados.length ? (
                                            proyectosFiltrados.map(
                                                (p: any) => (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => {
                                                            setProyectoSeleccionado(
                                                                p.id
                                                            );
                                                            setOpenProyecto(
                                                                false
                                                            );
                                                            setBusquedaProyecto(
                                                                ""
                                                            );
                                                        }}
                                                        className={`px-3 py-2 cursor-pointer text-sm ${
                                                            p.id ==
                                                            proyectoSeleccionado
                                                                ? "bg-[#2970E8] text-white"
                                                                : "hover:bg-[#1f5dc0] text-gray-200"
                                                        }`}
                                                    >
                                                        {p.nombre}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500 text-sm">
                                                Sin resultados
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* RESPONSABLE */}
                            <div>
                                <label className="text-[#B3E10F] font-semibold">
                                    Responsable:
                                </label>

                                <select
                                    className="bg-[#080D15] border border-gray-600 rounded-lg p-2 text-white text-sm w-full sm:w-auto mt-1"
                                    value={usuarioFiltro}
                                    onChange={(e) =>
                                        setUsuarioFiltro(e.target.value)
                                    }
                                >
                                    <option value="todos">Todos</option>

                                    {usuarios.map((u: any) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* BOTÓN CREAR */}
                        {proyectoSeleccionado && isEmployee && (
                            <Link
                                href={route("tareas.create", {
                                    proyecto_id: proyectoSeleccionado,
                                })}
                                className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-lime-300 mt-4 sm:mt-0"
                            >
                                Crear Tarea
                            </Link>
                        )}
                    </div>

                    {/* ===========================
                        KANBAN GRID
                    =========================== */}
                    {proyectoSeleccionado ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {columnas.map((col) => (
                                <div
                                    key={col}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, col)}
                                    className="bg-[#0B1120] border border-gray-700 p-4 rounded-xl min-h-[460px]"
                                >
                                    <h3 className="text-center text-[#B3E10F] font-semibold capitalize mb-3">
                                        {col}
                                    </h3>

                                    {tareasFiltradas
                                        .filter((t) => t.estado === col)
                                        .map((t) => (
                                            <div
                                                key={t.id}
                                                draggable
                                                onDragStart={() =>
                                                    setDragged(t)
                                                }
                                                className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3 cursor-grab shadow hover:shadow-[#2970E8]"
                                            >
                                                <p className="font-semibold text-[#2970E8]">
                                                    {t.titulo}
                                                </p>

                                                <p className="text-sm text-gray-400">
                                                    {t.descripcion}
                                                </p>

                                                <div className="text-xs text-gray-500 mt-2">
                                                    <p>
                                                        <strong>Prioridad:</strong>{" "}
                                                        {t.prioridad}
                                                    </p>
                                                    <p>
                                                        <strong>Fecha límite:</strong>{" "}
                                                        {t.fecha_limite}
                                                    </p>
                                                    <p>
                                                        <strong>Responsable:</strong>{" "}
                                                        {t.asignado?.name ??
                                                            "Sin asignar"}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        verHistorial(t)
                                                    }
                                                    className="text-xs text-[#B3E10F] underline mt-3"
                                                >
                                                    Ver historial
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p className="text-gray-400 text-center mt-20">
                            Selecciona un proyecto para ver su tablero.
                        </p>
                    )}

                    {/* ===========================
                        MODAL HISTORIAL
                    =========================== */}
                    {mostrarModal && (
                        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
                            <div className="bg-[#0B1120] border border-gray-700 rounded-xl p-6 w-full max-w-lg">

                                <h2 className="text-xl font-bold text-[#2970E8] mb-4">
                                    Historial — {tareaSeleccionada?.titulo}
                                </h2>

                                {historial.length ? (
                                    <ul className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                                        {historial.map((h: any) => (
                                            <li
                                                key={h.id}
                                                className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm"
                                            >
                                                <p>
                                                    <span className="text-[#B3E10F] font-semibold">
                                                        {h.usuario?.name ??
                                                            "Desconocido"}
                                                    </span>{" "}
                                                    cambió de{" "}
                                                    {h.estado_anterior} a{" "}
                                                    <span className="text-[#2970E8]">
                                                        {h.estado_nuevo}
                                                    </span>
                                                </p>

                                                <p className="text-gray-500 text-xs mt-1">
                                                    {new Date(
                                                        h.fecha_cambio
                                                    ).toLocaleString()}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">
                                        Sin registros aún.
                                    </p>
                                )}

                                <div className="flex justify-end mt-5">
                                    <button
                                        onClick={cerrarModal}
                                        className="bg-red-700 px-4 py-2 rounded text-white hover:bg-red-600"
                                    >
                                        Cerrar
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
