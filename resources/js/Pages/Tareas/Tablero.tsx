import { useState, useEffect } from "react";
import { router, Link, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Tablero() {
    const pageProps = usePage().props as any;
    const { proyectos, auth } = pageProps;
    const [usuarios, setUsuarios] = useState<any[]>(pageProps.usuarios || []);
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
                .then(data => {
                    setTareas(data.tareas);
                    setUsuarios(data.usuarios);
                });
        }
    }, [proyectoSeleccionado]);



    const onDrop = (_e: any, nuevoEstado: string) => {
        if (!dragged) return;

        const tareaId = dragged.id;

        setTareas(prev => prev.map(t => t.id === tareaId ? { ...t, estado: nuevoEstado } : t));

        router.patch(
            route("tareas.estado", tareaId),
            { estado: nuevoEstado },
            {
                preserveScroll: true,
                onSuccess: () => {

                    console.log("Estado actualizado correctamente");
                },
                onError: (err) => {
                    console.error("Error al actualizar estado", err);
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

            <div className="flex justify-center mt-10 px-2 sm:px-4">
                <div className="w-full max-w-7xl bg-[#0B1120] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white border border-gray-800 overflow-x-auto">

                    {/* ENCABEZADO */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-2 sm:px-6 mt-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 w-full sm:w-auto gap-4">
                            <div className="w-full sm:w-auto">
                                <label className="block sm:inline mr-2 text-[#B3E10F] font-semibold">Proyecto:</label>
                                <select
                                    className="bg-[#0B1120] border border-gray-700 rounded-md p-2 text-white w-full sm:w-auto"
                                    value={proyectoSeleccionado}
                                    onChange={(e) => setProyectoSeleccionado(e.target.value)}
                                >
                                    <option value="">-- Selecciona un proyecto --</option>
                                    {proyectos.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full sm:w-auto">
                                <label className="block sm:inline mr-2 text-[#B3E10F] font-semibold">Responsable:</label>
                                <select
                                    className="bg-[#0B1120] border border-gray-700 rounded-md p-2 text-white w-full sm:w-auto"
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
                            <Link
                                href={route("tareas.create", { proyecto_id: proyectoSeleccionado })}
                                className="mt-4 sm:mt-0 bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                            >
                                Crear Tarea
                            </Link>
                        )}
                    </div>

                    {/* GRID DE COLUMNAS */}
                    {proyectoSeleccionado ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4 lg:px-6 pb-8">
                            {columnas.map((col) => (
                                <div
                                    key={col}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, col)}
                                    className="bg-[#0B1120] border border-gray-700 p-4 rounded-xl min-h-[400px] sm:min-h-[500px]"
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
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("id", String(t.id));
                                                    setDragged(t);
                                                }}
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
                        <p className="text-gray-400 text-center mt-20">
                            Selecciona un proyecto para ver su tablero de tareas.
                        </p>
                    )}

                    {/* MODAL DE HISTORIAL */}
                    {mostrarModal && (
                        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                            <div className="bg-[#0B1120] border border-gray-700 rounded-xl shadow-lg w-full max-w-lg p-6 relative mx-4">
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
                                        className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium transition duration-150 text-white"
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
