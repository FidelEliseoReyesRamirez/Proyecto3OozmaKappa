import { Link, usePage, router, Head } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function HitosIndex() {
    const { proyecto, hitos } = usePage().props as any;

    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [formEdit, setFormEdit] = useState({
        id: "",
        nombre: "",
        fecha_hito: "",
        descripcion: "",
        estado: ""
    });

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "pendiente":
                return "bg-yellow-500/20 text-yellow-300 border border-yellow-700";
            case "en progreso":
                return "bg-blue-500/20 text-blue-300 border border-blue-700";
            case "completado":
                return "bg-green-500/20 text-green-300 border border-green-700";
            default:
                return "bg-gray-700/20 text-gray-300";
        }
    };

    const abrirEditar = (h: any) => {
        const fechaFormateada = h.fecha_hito
            ? h.fecha_hito.substring(0, 10)
            : "";

        setFormEdit({
            id: h.id,
            nombre: h.nombre,
            fecha_hito: fechaFormateada,
            descripcion: h.descripcion,
            estado: h.estado
        });

        setOpenEdit(true);
    };

    const guardarEdicion = () => {
        router.put(
            route("hitos.update", { proyecto_id: proyecto.id, id: formEdit.id }),
            formEdit,
            { onSuccess: () => setOpenEdit(false) }
        );
    };

    const abrirEliminar = (id: number) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const confirmarEliminar = () => {
        if (!deleteId) return;
        router.delete(
            route("hitos.destroy", { proyecto_id: proyecto.id, id: deleteId }),
            { onSuccess: () => setOpenDelete(false) }
        );
    };

    // FILTRO POR ESTADO + BUSCADOR
    const hitosFiltrados = hitos.filter((h: any) => {
        const coincideEstado =
            filtro === "todos" ? true : h.estado === filtro;

        const coincideBusqueda =
            h.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            h.descripcion.toLowerCase().includes(busqueda.toLowerCase());

        return coincideEstado && coincideBusqueda;
    });

    return (
        <AuthenticatedLayout>
            <Head title={"Hitos – " + proyecto.nombre} />

            <section className="min-h-screen bg-[#0A0F1E] py-10 px-6 text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold mb-10 text-purple-400 tracking-wide drop-shadow-lg">
                        Hitos del Proyecto: {proyecto.nombre}
                    </h2>

                    {/* FILTROS */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <label className="text-sm text-gray-300 font-semibold">Estado:</label>
                            <select
                                className="bg-[#141B33] border border-gray-700 p-2 rounded-lg text-sm"
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en progreso">En Progreso</option>
                                <option value="completado">Completado</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-[#141B33] border border-gray-700 p-2 rounded-lg text-sm w-full sm:w-56"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <Link
                            href={route("hitos.create", proyecto.id)}
                            className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-purple-800/40 transition"
                        >
                            Nuevo Hito
                        </Link>
                    </div>

                    {/* TABLA */}
                    <div className="bg-[#0F152A] rounded-xl border border-gray-700 shadow-xl shadow-black/40 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#141B33] text-purple-300 border-b border-gray-700">
                                    <th className="p-4 text-left">Nombre</th>
                                    <th className="p-4 text-left">Fecha</th>
                                    <th className="p-4 text-left">Estado</th>
                                    <th className="p-4 text-left">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {hitosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center text-gray-400 italic">
                                            No se encontraron resultados.
                                        </td>
                                    </tr>
                                )}

                                {hitosFiltrados.map((h: any) => (
                                    <tr
                                        key={h.id}
                                        className="border-b border-gray-800 hover:bg-gray-800/30 transition"
                                    >
                                        <td className="p-4 font-medium text-gray-200">{h.nombre}</td>

                                        <td className="p-4 text-gray-400">
                                            {h.fecha_hito.substring(0, 10)}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                                                    h.estado
                                                )}`}
                                            >
                                                {h.estado}
                                            </span>
                                        </td>

                                        <td className="p-4 flex gap-3">
                                            <button
                                                onClick={() => abrirEditar(h)}
                                                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-xs font-semibold shadow shadow-blue-900/40 transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => abrirEliminar(h.id)}
                                                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-xs font-semibold shadow shadow-red-900/40 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8">
                        <Link
                            href={route("proyectos.index")}
                            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm shadow shadow-gray-900/40 transition"
                        >
                            Volver
                        </Link>
                    </div>
                </div>

                {/* MODAL ELIMINAR */}
                {openDelete && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-[#141B33] p-6 rounded-xl w-80 border border-gray-700">
                            <p className="text-center mb-6">¿Eliminar este hito?</p>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setOpenDelete(false)}
                                    className="px-4 py-2 bg-gray-700 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminar}
                                    className="px-4 py-2 bg-red-600 rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL EDITAR */}
                {openEdit && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-[#141B33] p-6 rounded-xl w-[420px] border border-gray-700 space-y-4">
                            <h3 className="text-lg font-semibold text-purple-300">Editar Hito</h3>

                            <input
                                value={formEdit.nombre}
                                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                                className="w-full bg-gray-800 p-2 rounded"
                            />

                            <input
                                type="date"
                                value={formEdit.fecha_hito}
                                onChange={(e) => setFormEdit({ ...formEdit, fecha_hito: e.target.value })}
                                className="w-full bg-gray-800 p-2 rounded"
                            />

                            <select
                                value={formEdit.estado}
                                onChange={(e) => setFormEdit({ ...formEdit, estado: e.target.value })}
                                className="w-full bg-gray-800 p-2 rounded"
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="en progreso">En progreso</option>
                                <option value="completado">Completado</option>
                            </select>

                            <textarea
                                value={formEdit.descripcion}
                                onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                                className="w-full bg-gray-800 p-2 min-h-[100px] rounded"
                            />

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setOpenEdit(false)}
                                    className="px-4 py-2 bg-gray-700 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={guardarEdicion}
                                    className="px-4 py-2 bg-blue-600 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </AuthenticatedLayout>
    );
}
