import React, { useState } from "react";
import { router, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type PermisoUsuario = {
    user_id: number;
    nombre: string;
    rol: string;
    permiso: "ninguno" | "editar";
};

export default function Permisos({ proyecto, usuarios, asignaciones }: any) {

    const inicial = usuarios.map((u: any) => {
        const asignado = asignaciones.find((a: any) => a.user_id === u.id);
        return {
            user_id: u.id,
            nombre: u.name,
            rol: u.rol,
            permiso: asignado ? asignado.permiso : "ninguno",
        };
    });

    const [permisos, setPermisos] = useState<PermisoUsuario[]>(inicial);
    const [busqueda, setBusqueda] = useState("");

    // PAGINACIÓN
    const porPagina = 20;
    const [pagina, setPagina] = useState(1);

    const filtrados = permisos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(filtrados.length / porPagina);
    const desde = (pagina - 1) * porPagina;
    const hasta = desde + porPagina;

    const visibles = filtrados.slice(desde, hasta);

    // MODAL PARA CLIENTE
    const [modalVisible, setModalVisible] = useState(false);
    const [usuarioAConfirmar, setUsuarioAConfirmar] = useState<PermisoUsuario | null>(null);

    const abrirModal = (user: PermisoUsuario) => {
        setUsuarioAConfirmar(user);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setUsuarioAConfirmar(null);
        setModalVisible(false);
    };

    const confirmarCliente = () => {
        if (usuarioAConfirmar) {
            setPermisos((prev) =>
                prev.map((p) =>
                    p.user_id === usuarioAConfirmar.user_id
                        ? { ...p, permiso: "editar" }
                        : p
                )
            );
        }
        cerrarModal();
    };

    const handleChange = (user: PermisoUsuario, nuevo: "ninguno" | "editar") => {

        if (user.user_id === proyecto.responsable_id) return;

        if (user.rol === "cliente" && nuevo === "editar") {
            abrirModal(user);
            return;
        }

        setPermisos((prev) =>
            prev.map((p) =>
                p.user_id === user.user_id ? { ...p, permiso: nuevo } : p
            )
        );
    };

    const submit = (e: any) => {
        e.preventDefault();
        router.post(route("proyectos.permisos.actualizar", proyecto.id), { permisos });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-white">
                    Permisos del Proyecto — {proyecto.nombre}
                </h2>
            }
        >
            <Head title={`Permisos - ${proyecto.nombre}`} />

            <section className="flex justify-center py-12 px-4 bg-[#0B1120] min-h-screen">

                <div className="w-full max-w-5xl bg-gray-900 border border-gray-800 p-10 rounded-xl shadow-xl">

                    <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1">
                        Gestión de Permisos
                    </h2>
                    <p className="mb-8 text-md text-[#B3E10F]">
                        Controla quién puede editar este proyecto.
                    </p>

                    {/* BUSCADOR */}
                    <div className="mb-5">
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setPagina(1);
                            }}
                            className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
                        />
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <table className="w-full text-gray-300 border border-gray-700">
                            <thead className="bg-gray-800 text-[#B3E10F]">
                                <tr>
                                    <th className="p-3 text-left">Usuario</th>
                                    <th className="p-3 text-left">Rol</th>
                                    <th className="p-3 text-left">Permiso</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibles.map((p) => (
                                    <tr key={p.user_id} className="border-t border-gray-700">

                                        {/* NOMBRE */}
                                        <td className="p-3 flex items-center gap-2">
                                            {p.user_id === proyecto.responsable_id && (
                                                <span className="px-2 py-1 bg-[#2970E8] text-white text-xs rounded-md">
                                                    Responsable
                                                </span>
                                            )}
                                            {p.nombre}
                                        </td>

                                        {/* ROL */}
                                        <td className="p-3 capitalize">
                                            {p.rol}
                                        </td>

                                        {/* PERMISO */}
                                        <td className="p-3">
                                            <select
                                                value={p.permiso}
                                                onChange={(e) =>
                                                    handleChange(p, e.target.value as any)
                                                }
                                                disabled={p.user_id === proyecto.responsable_id}
                                                className={`bg-gray-800 border border-gray-700 rounded-md text-white px-3 py-1 pr-8 
                                                ${p.user_id === proyecto.responsable_id ? "opacity-40 cursor-not-allowed" : ""}`}
                                            >
                                                <option value="ninguno">Sin acceso</option>
                                                <option value="editar">Puede editar</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PAGINACIÓN */}
                        <div className="flex justify-between mt-6 text-gray-300">
                            <button
                                type="button"
                                disabled={pagina === 1}
                                onClick={() => setPagina(pagina - 1)}
                                className={`px-3 py-1 rounded-md ${pagina === 1 ?
                                    "bg-gray-700 text-gray-500 cursor-not-allowed" :
                                    "bg-gray-800 hover:bg-gray-700"}`}
                            >
                                Anterior
                            </button>

                            <span className="text-sm">
                                Página {pagina} de {totalPaginas}
                            </span>

                            <button
                                type="button"
                                disabled={pagina === totalPaginas}
                                onClick={() => setPagina(pagina + 1)}
                                className={`px-3 py-1 rounded-md ${pagina === totalPaginas ?
                                    "bg-gray-700 text-gray-500 cursor-not-allowed" :
                                    "bg-gray-800 hover:bg-gray-700"}`}
                            >
                                Siguiente
                            </button>
                        </div>

                        {/* BOTONES */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                            <Link
                                href={route("proyectos.index")}
                                className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium text-white"
                            >
                                Cancelar
                            </Link>

                            <button
                                className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition font-bold text-sm"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* MODAL CONFIRMAR PERMISO A CLIENTE */}
            {modalVisible && usuarioAConfirmar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-96 text-center">

                        <h3 className="text-[#B3E10F] text-lg font-bold mb-3">
                            Confirmar Permiso
                        </h3>

                        <p className="text-gray-200 mb-6">
                            ¿Estás seguro de que deseas darle permiso <b>editar</b> al cliente <br />
                            <span className="text-white">{usuarioAConfirmar.nombre}</span>?
                        </p>

                        <div className="flex justify-around">
                            <button
                                onClick={cerrarModal}
                                className="bg-red-700 px-4 py-2 rounded-md text-white hover:bg-red-600"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={confirmarCliente}
                                className="bg-[#2970E8] px-4 py-2 rounded-md text-white hover:bg-[#1f5dc0]"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
