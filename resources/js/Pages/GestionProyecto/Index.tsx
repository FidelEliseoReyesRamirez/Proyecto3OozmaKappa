import { Link, router, usePage, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import ConfirmModal from "@/Components/ConfirmModal";

export default function ProyectosIndex() {
    const { proyectos, auth } = usePage().props as any;

    const userRole = auth.user?.rol;
    const isEmployee = ["admin", "arquitecto", "ingeniero"].includes(userRole);

    const [filtro, setFiltro] = useState("todos");
    const [modalOpen, setModalOpen] = useState(false);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<any>(null);

    const proyectosFiltrados =
        filtro === "todos"
            ? proyectos
            : proyectos.filter((p: any) => p.estado === filtro);

    const handleConfirm = () => {
        if (proyectoSeleccionado && estadoSeleccionado) {
            router.patch(route("proyectos.cambiarEstado", proyectoSeleccionado.id), {
                estado: estadoSeleccionado,
            });
        }
        setModalOpen(false);
    };

    const handleEstadoChange = (proyecto: any, nuevoEstado: string) => {
        if (isEmployee) {
            setProyectoSeleccionado(proyecto);
            setEstadoSeleccionado(nuevoEstado);
            setModalOpen(true);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold leading-tight text-[#B3E10F] tracking-wider">
                    GESTIÓN DE PROYECTOS
                </h2>
            }
        >
            <Head title="Proyectos" />

            <ConfirmModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                message={`¿Seguro que deseas cambiar el estado del proyecto "${proyectoSeleccionado?.nombre}" a "${estadoSeleccionado}"?`}
            />

            <div className="py-6 max-w-7xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-[#0B1120] p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-800/80">
                    {/* --- Encabezado --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 border-b border-gray-700 pb-4">
                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                            <label className="text-[#B3E10F] font-semibold">
                                Filtrar por estado:
                            </label>
                            <select
                                className="bg-[#080D15] border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-[#B3E10F] focus:border-[#B3E10F]"
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="activo">Activo</option>
                                <option value="en progreso">En progreso</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                        </div>

                        {isEmployee && (
                            <Link
                                href={route("proyectos.create")}
                                className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                            >
                                Nuevo Proyecto
                            </Link>
                        )}
                    </div>

                    {/* --- Tabla --- */}
                    <div className="overflow-x-auto bg-[#080D15] border border-gray-700 rounded-lg">
                        <table className="w-full border-collapse text-sm text-gray-200">
                            <thead>
                                <tr className="bg-[#2970E8] text-white text-center shadow-lg shadow-[#2970E8]/20">
                                    <th className="p-3 border border-blue-700">Nombre</th>
                                    <th className="p-3 border border-blue-700">Cliente</th>
                                    <th className="p-3 border border-blue-700">Responsable</th>
                                    <th className="p-3 border border-blue-700">Descripción</th>
                                    <th className="p-3 border border-blue-700">Estado</th>
                                    <th className="p-3 border border-blue-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyectosFiltrados.map((proyecto: any) => (
                                    <tr
                                        key={proyecto.id}
                                        className="text-center bg-[#080D15] hover:bg-gray-800/70 transition duration-150 border-t border-gray-800"
                                    >
                                        <td className="p-3 border border-gray-800 font-semibold text-white">
                                            {proyecto.nombre}
                                        </td>
                                        <td className="p-3 border border-gray-800 text-gray-400">
                                            {proyecto.cliente?.name || "Sin cliente"}
                                        </td>
                                        <td className="p-3 border border-gray-800 text-gray-400">
                                            {proyecto.responsable?.name || "—"}
                                        </td>
                                        <td className="p-3 border border-gray-800 text-gray-400 text-xs sm:text-sm">
                                            {proyecto.descripcion || "Sin descripción"}
                                        </td>
                                        <td className="p-3 border border-gray-800">
                                            <select
                                                value={proyecto.estado}
                                                onChange={(e) =>
                                                    handleEstadoChange(proyecto, e.target.value)
                                                }
                                                disabled={!isEmployee}
                                                className={`rounded-md p-1 text-sm sm:text-base font-medium ${
                                                    isEmployee
                                                        ? "bg-[#0B1120] border-gray-600 hover:border-[#B3E10F] text-white"
                                                        : "bg-gray-800 border-gray-800 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="en progreso">En progreso</option>
                                                <option value="finalizado">Finalizado</option>
                                            </select>
                                        </td>

                                        <td className="p-3 border border-gray-800 space-y-1 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center items-center">
                                            {isEmployee && (
                                                <Link
                                                    href={route("proyectos.edit", proyecto.id)}
                                                    className="bg-[#B3E10F] text-gray-900 px-3 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                                                >
                                                    Editar
                                                </Link>
                                            )}
                                            <Link
                                                href={route("proyectos.versiones", proyecto.id)}
                                                className="bg-[#2970E8] text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-150 text-xs sm:text-sm font-semibold shadow-md shadow-[#2970E8]/30"
                                            >
                                                Versiones
                                            </Link>
                                            {auth.user.id === proyecto.responsable_id && (
                                                <Link
                                                    href={route("proyectos.permisos", proyecto.id)}
                                                    className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-150 text-xs sm:text-sm font-semibold border border-transparent hover:border-gray-400 shadow-md"
                                                >
                                                    Permisos
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
