import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import ConfirmModal from "@/Components/ConfirmModal";

export default function Index() {
    const { proyectos } = usePage().props as any;
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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-white">Gestión de Proyectos</h2>}
        >

            <ConfirmModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                message={`¿Seguro que deseas cambiar el estado del proyecto "${proyectoSeleccionado?.nombre}" a "${estadoSeleccionado}"?`}
            />
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-6xl bg-[#0B1120] rounded-lg shadow-lg p-8 text-white border-white border">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <label className="mr-2 text-[#B3E10F]">Filtrar por estado:</label>
                            <select
                                className="bg-[#0B1120] border border-gray-600 rounded-md p-1 text-white"
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="activo">Activo</option>
                                <option value="en progreso">En progreso</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                        </div>
                        <Link href={route("proyectos.create")}>
                            <PrimaryButton>Nuevo Proyecto</PrimaryButton>
                        </Link>
                    </div>

                    <table className="min-w-full bg-[#0B1120] rounded-lg overflow-hidden">
                        <thead>
                            <tr className="text-[#B3E10F] text-left border-b border-gray-700">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Responsable</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyectosFiltrados.map((proyecto: any) => (
                                <tr key={proyecto.id} className="border-b border-gray-800">
                                    <td className="p-3">{proyecto.nombre}</td>
                                    <td className="p-3">{proyecto.cliente?.name || "Sin cliente"}</td>
                                    <td className="p-3">{proyecto.responsable?.name}</td>
                                    <td className="p-3">{proyecto.descripcion || "Sin descripción"}</td>
                                    <td className="p-3">
                                        <select
                                            className="bg-[#0B1120] border border-gray-600 rounded-md p-1 text-white"
                                            value={proyecto.estado}
                                            onChange={(e) => {
                                                setProyectoSeleccionado(proyecto);
                                                setEstadoSeleccionado(e.target.value);
                                                setModalOpen(true);
                                            }}
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="en progreso">En progreso</option>
                                            <option value="finalizado">Finalizado</option>
                                        </select>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <Link
                                            href={route("proyectos.edit", proyecto.id)}
                                            className="text-[#B3E10F] hover:underline"
                                        >
                                            Editar
                                        </Link>
                                        <Link
                                            href={route("proyectos.versiones", proyecto.id)}
                                            className="text-[#2970E8] hover:underline"
                                        >
                                            Ver versiones
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
