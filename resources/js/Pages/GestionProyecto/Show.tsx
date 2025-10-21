import React from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps as BasePageProps } from "@/types";

interface Proyecto {
    id: number;
    nombre: string;
    descripcion?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    cliente_id?: number;
    responsable_id?: number;
    cliente?: {
        name: string;
        apellido?: string;
    } | null;
    responsable?: {
        name: string;
        apellido?: string;
    } | null;
}

interface PageProps extends BasePageProps {
    proyecto: Proyecto;
}

export default function Show() {
    const { proyecto, auth } = usePage<PageProps>().props;
    const userRole = auth.user?.rol;
    const isEmployee = ["admin", "arquitecto", "ingeniero"].includes(userRole);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold leading-tight text-[#B3E10F] tracking-wider">
                    DETALLE DEL PROYECTO
                </h2>
            }
        >
            <Head title={`Proyecto: ${proyecto.nombre}`} />

            <div className="py-6 max-w-6xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-[#0B1120] border border-gray-800/80 shadow-2xl rounded-xl p-6 sm:p-8">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-4">
                        <h1 className="text-3xl font-bold text-white mb-2 sm:mb-0">
                            {proyecto.nombre}
                        </h1>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                proyecto.estado === "finalizado"
                                    ? "bg-green-600 text-white"
                                    : proyecto.estado === "en progreso"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-100"
                            }`}
                        >
                            {proyecto.estado?.toUpperCase()}
                        </span>
                    </div>

                    {/* Información del proyecto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 text-sm sm:text-base">
                        <p>
                            <span className="text-[#B3E10F] font-semibold">Cliente:</span>{" "}
                            {proyecto.cliente?.name ?? "No asignado"}
                        </p>
                        <p>
                            <span className="text-[#B3E10F] font-semibold">Responsable:</span>{" "}
                            {proyecto.responsable?.name ?? "No asignado"}
                        </p>
                        <p>
                            <span className="text-[#B3E10F] font-semibold">Fecha inicio:</span>{" "}
                            {proyecto.fecha_inicio ?? "No especificada"}
                        </p>
                        {proyecto.fecha_fin && (
                            <p>
                                <span className="text-[#B3E10F] font-semibold">Fecha fin:</span>{" "}
                                {proyecto.fecha_fin}
                            </p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className="mt-6">
                        <h3 className="text-[#B3E10F] text-lg font-semibold mb-2">
                            Descripción
                        </h3>
                        <p className="text-gray-300 leading-relaxed bg-[#080D15] border border-gray-700 rounded-lg p-4">
                            {proyecto.descripcion || "Sin descripción disponible."}
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
                        {isEmployee && (
                            <Link
                                href={route("proyectos.edit", proyecto.id)}
                                className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 font-bold text-sm shadow-md shadow-[#B3E10F]/30"
                            >
                                Editar Proyecto
                            </Link>
                        )}
                        <Link
                            href={route("proyectos.versiones", proyecto.id)}
                            className="bg-[#2970E8] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 font-semibold text-sm shadow-md shadow-[#2970E8]/30"
                        >
                            Ver Versiones
                        </Link>
                        {auth.user.id === proyecto.responsable_id && (
                            <Link
                                href={route("proyectos.permisos", proyecto.id)}
                                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150 font-semibold text-sm border border-transparent hover:border-gray-400 shadow-md"
                            >
                                Gestionar Permisos
                            </Link>
                        )}
                        <Link
                            href={route("proyectos.index")}
                            className="bg-gray-800 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-150 text-sm font-medium border border-gray-700"
                        >
                            Volver a la lista
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
