import React, { useState } from "react";
import { router, Link, Head } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

type PermisoUsuario = {
    user_id: number;
    nombre: string;
    permiso: "ver" | "editar";
};

export default function Permisos({ proyecto, usuarios, asignaciones }: any) {
    const [permisos, setPermisos] = useState<PermisoUsuario[]>(
        usuarios.map((u: any) => {
            const asignado = asignaciones.find((a: any) => a.user_id === u.id);
            return {
                user_id: u.id,
                nombre: u.name,
                permiso: asignado ? asignado.permiso : "ver",
            };
        })
    );

    const handleChange = (user_id: number, nuevo: "ver" | "editar") => {
        setPermisos((prev: PermisoUsuario[]) =>
            prev.map((p: PermisoUsuario) =>
                p.user_id === user_id ? { ...p, permiso: nuevo } : p
            )
        );
    };

    const submit = (e: any) => {
        e.preventDefault();
        router.post(route("proyectos.permisos.actualizar", proyecto.id), { permisos });
    };

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title={`Permisos - ${proyecto.nombre}`} />
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    Permisos de Proyecto
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">Gestiona quién puede ver o editar este proyecto.</p>

                <form onSubmit={submit} className="space-y-6">
                    <table className="w-full text-gray-300 border border-gray-700">
                        <thead className="bg-gray-800 text-[#B3E10F]">
                            <tr>
                                <th className="p-3 text-left">Usuario</th>
                                <th className="p-3 text-left">Permiso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permisos.map((p) => (
                                <tr key={p.user_id} className="border-t border-gray-700">
                                    <td className="p-3">{p.nombre}</td>
                                    <td className="p-3">
                                        <select
                                            value={p.permiso}
                                            onChange={(e) => handleChange(p.user_id, e.target.value as "ver" | "editar")}
                                            className="bg-gray-800 border border-gray-700 rounded-md text-white px-3 py-1"
                                        >
                                            <option value="ninguno">Sin acceso</option>
                                            <option value="editar">Puede editar</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                        <Link
                            href={route("proyectos.index")}
                            className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                        >
                            Cancelar
                        </Link>
                        <button className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
