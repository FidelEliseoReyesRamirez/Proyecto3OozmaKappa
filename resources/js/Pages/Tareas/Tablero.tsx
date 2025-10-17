import { useState, useEffect } from "react";
import { router, Link, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Tablero() {
    const { proyectos, auth, usuarios } = usePage().props as any;
    const userRole = auth.user?.rol;
    const isEmployee = ["admin", "arquitecto", "ingeniero"].includes(userRole);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");
    const [tareas, setTareas] = useState<any[]>([]);
    const [usuarioFiltro, setUsuarioFiltro] = useState("todos");
    const [dragged, setDragged] = useState<any>(null);
    const [historial, setHistorial] = useState<any[]>([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState<any>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        if (proyectoSeleccionado) {
            fetch(`/tareas/proyecto/${proyectoSeleccionado}`)
                .then(res => res.json())
                .then(data => setTareas(data))
                .catch(err => console.error("Error cargando tareas:", err));
        } else {
            setTareas([]);
        }
    }, [proyectoSeleccionado]);

    const onDrop = (_e: any, nuevoEstado: string) => {
        if (!dragged) return;

        const tareaId = dragged.id;

        // Optimista: actualizar UI localmente
        setTareas(prev => prev.map(t => t.id === tareaId ? { ...t, estado: nuevoEstado } : t));

        // Usamos router.patch (Inertia). Como el controlador responde con redirect, Inertia lo acepta.
        router.patch(
            route("tareas.estado", tareaId),
            { estado: nuevoEstado },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // opcional: volver a refrescar tareas desde servidor si quieres fuente de verdad
                    // fetch(`/tareas/proyecto/${proyectoSeleccionado}`).then(...)

                    console.log("Estado actualizado correctamente");
                },
                onError: (err) => {
                    console.error("Error al actualizar estado", err);
                    // revertir cambio visual si error
                    setTareas(prev => prev.map(t => t.id === tareaId ? { ...t, estado: dragged.estado } : t));
                },
            }
        );

        setDragged(null);
    };

    const verHistorial = (tarea: any) => {
        setTareaSeleccionada(tarea);
        setMostrarModal(true);
        setHistorial([]);

        fetch(`/tareas/${tarea.id}/historial`)
            .then(res => res.json())
            .then(data => setHistorial(data))
            .catch(err => console.error("Error cargando historial:", err));
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setTareaSeleccionada(null);
        setHistorial([]);
    };

    // Aplicar filtro por usuario antes de renderizar
    const tareasFiltradas = tareas.filter((t: any) => {
        if (usuarioFiltro === "todos") return true;
        return t.asignado_id === parseInt(usuarioFiltro);
    });

    const columnas = ["pendiente", "en progreso", "completado"];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-white">Tablero Kanban</h2>}
        >
            <Head title="DEVELARQ | Tablero Kanban" />
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-6xl bg-[#0B1120] rounded-lg shadow-lg p-8 text-white border-white border">
                    <div className="flex justify-between items-center mb-6 px-10 mt-10">
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="mr-2 text-[#B3E10F] font-semibold">Seleccionar Proyecto:</label>
                                <select
                                    className="bg-[#0B1120] border border-gray-700 rounded-md p-2 text-white"
                                    value={proyectoSeleccionado}
                                    onChange={(e) => setProyectoSeleccionado(e.target.value)}
                                >
                                    <option value="">-- Selecciona un proyecto --</option>
                                    {proyectos.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mr-2 text-[#B3E10F]">Responsable:</label>
                                <select
                                    className="bg-[#0B1120] border border-gray-600 rounded-md p-1 text-white"
                                    value={usuarioFiltro}
                                    onChange={(e) => setUsuarioFiltro(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    {usuarios.map((u: any) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {proyectoSeleccionado && isEmployee && (
                            <Link href={route("tareas.create", { proyecto_id: proyectoSeleccionado })}>
                                <PrimaryButton className="bg-[#2970E8] hover:bg-indigo-600">
                                    Crear Tarea
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>

                    {proyectoSeleccionado ? (
                        <div className="grid grid-cols-3 gap-6 px-10 pb-10">
                            {columnas.map((col) => (
                                <div
                                    key={col}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, col)}
                                    className="bg-[#0B1120] border border-gray-700 p-4 rounded-xl min-h-[500px]"
                                >
                                    <h3 className="text-[#B3E10F] font-semibold capitalize mb-3 text-center">
                                        {col}
                                    </h3>

                                    {tareasFiltradas
                                        .filter((t) => t.estado === col)
                                        .map((t) => (
                                            <div
                                                key={t.id}
                                                draggable
                                                onDragStart={(e) => { e.dataTransfer.setData("id", String(t.id)); setDragged(t); }}
                                                className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3 shadow hover:shadow-[#2970E8]/40 transition cursor-grab"
                                            >
                                                <p className="font-semibold text-[#2970E8]">{t.titulo}</p>
                                                <p className="text-sm text-gray-400">{t.descripcion}</p>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    <p><strong>Prioridad:</strong> {t.prioridad}</p>
                                                    <p><strong>Fecha límite:</strong> {t.fecha_limite}</p>
                                                    <p><strong>Responsable:</strong> {t.asignado?.name}</p>
                                                </div>

                                                <button
                                                    onClick={() => verHistorial(t)}
                                                    className="mt-3 text-xs text-[#B3E10F] hover:text-lime-400 underline"
                                                >
                                                    Ver historial
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center mt-20">Selecciona un proyecto para ver su tablero de tareas.</p>
                    )}

                    {/* Modal de Historial */}
                    {mostrarModal && (
                        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                            <div className="bg-[#0B1120] border border-gray-700 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
                                <h2 className="text-xl font-bold text-[#2970E8] mb-4">
                                    Historial — {tareaSeleccionada?.titulo}
                                </h2>

                                {historial.length > 0 ? (
                                    <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {historial.map((h: any) => (
                                            <li key={h.id} className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-sm">
                                                <p>
                                                    <span className="text-[#B3E10F] font-semibold">
                                                        {h.usuario?.name ?? "Usuario desconocido"}
                                                    </span>{" "}
                                                    cambió el estado de{" "}
                                                    <span className="text-gray-300">{h.estado_anterior}</span> a{" "}
                                                    <span className="text-[#2970E8]">{h.estado_nuevo}</span>
                                                </p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    {new Date(h.fecha_cambio).toLocaleString()}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">No hay registros en el historial.</p>
                                )}

                                <div className="flex justify-end mt-5">
                                    <button
                                        onClick={cerrarModal}
                                        className="bg-[#2970E8] hover:bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold transition"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
