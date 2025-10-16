// resources/js/Pages/Proyectos/Edit.tsx
import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { router } from "@inertiajs/react";

import { Link, Head } from "@inertiajs/react";


export default function Edit({ proyecto, clientes, responsables }: any) {
    // Campos no editables se inicializan y se usan directamente en FormData
    const nombre = proyecto.nombre || "";
    const cliente_id = String(proyecto.cliente_id ?? "");
    const fecha_inicio = proyecto.fecha_inicio
        ? new Date(proyecto.fecha_inicio).toISOString().split("T")[0]
        : "";

    // Campos editables usan useState
    const [descripcion, setDescripcion] = useState(proyecto.descripcion || "");
    const [responsable_id, setResponsableId] = useState(String(proyecto.responsable_id ?? ""));
    const [archivoBim, setArchivoBim] = useState<File | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    // Estilos consistentes para select y textarea
    const inputFieldStyles = "mt-1 block w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";
    const [mantenerArchivo, setMantenerArchivo] = useState(true);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const fd = new FormData();
        // Laravel espera PATCH para update
        fd.append("_method", "PATCH");
        // Enviamos todos los datos requeridos por la validación del controlador
        fd.append("nombre", nombre);
        fd.append("descripcion", descripcion ?? "");
        fd.append("cliente_id", cliente_id);
        fd.append("responsable_id", responsable_id ?? "");
        fd.append("fecha_inicio", fecha_inicio ?? "");
        if (archivoBim) {
            fd.append("archivo_bim", archivoBim);
        } else if (mantenerArchivo) {
            fd.append("mantener_archivo", "true");
        }


        router.post(route("proyectos.update", proyecto.id), fd, {
            // No es estrictamente necesario, Inertia/FormData lo maneja, pero se mantiene si es por seguridad
            // headers: { "Content-Type": "multipart/form-data" },
            onError: (errs: any) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        // Contenedor principal con fondo muy oscuro (Develarq)
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Editar Proyecto" />
            {/* Contenedor del formulario */}
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">

                {/* Encabezado */}
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    EDITAR PROYECTO
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    Actualiza la información del proyecto o sube una nueva versión BIM.
                </p>

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                    {/* Campos No Editables (Grid para Nombre y Cliente/Fecha) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-gray-700">

                        {/* Nombre del Proyecto (Deshabilitado) */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="nombre" value="Nombre del Proyecto" className="text-gray-400 font-semibold" />
                            <TextInput
                                id="nombre"
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 cursor-not-allowed"
                                value={nombre}
                                disabled={true}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                El nombre y el cliente se establecen al crear el proyecto.
                            </p>
                        </div>

                        {/* Cliente (Deshabilitado) */}
                        <div>
                            <InputLabel htmlFor="cliente" value="Cliente Asociado" className="text-gray-400 font-semibold" />
                            <select
                                id="cliente"
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                                value={cliente_id}
                                disabled={true}
                            >
                                <option value="">{clientes.find((c: any) => c.id == cliente_id)?.name || 'N/A'}</option>
                            </select>
                        </div>

                        {/* Fecha de Inicio (Deshabilitado) */}
                        <div>
                            <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" className="text-gray-400 font-semibold" />
                            <TextInput
                                id="fecha_inicio"
                                type="date"
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 cursor-not-allowed"
                                value={fecha_inicio}
                                disabled={true}
                            />
                        </div>
                    </div>


                    {/* Sección Editable */}

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción (Editable)" className="text-gray-200 font-semibold" />
                        <textarea
                            id="descripcion"
                            className={inputFieldStyles}
                            rows={3}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Actualiza la descripción o los detalles clave del proyecto."
                        />
                        <InputError className="mt-2" message={errors.descripcion} />
                    </div>

                    {/* Responsable */}
                    <div>
                        <InputLabel htmlFor="responsable" value="Responsable Principal" className="text-gray-200 font-semibold" />
                        <select
                            id="responsable"
                            className={inputFieldStyles}
                            value={responsable_id}
                            onChange={(e) => setResponsableId(e.target.value)}
                        >
                            <option value="">-- Seleccione un responsable --</option>
                            {responsables.map((r: any) => (
                                <option key={r.id} value={String(r.id)}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.responsable_id} />
                    </div>

                    {/* Archivo BIM */}
                    <div className="pt-4 border-t border-gray-700">
                        <InputLabel htmlFor="archivo_bim" value="Nueva Versión BIM (Opcional)" className="text-gray-200 font-semibold" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            // Estilo de botón de archivo con color primario
                            className="mt-1 block w-50% text-sm text-gray-300
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-bold
                                file:bg-[#2970E8] file:text-white
                                hover:file:bg-indigo-600 transition duration-150 cursor-pointer"
                            onChange={(e) => setArchivoBim(e.target.files?.[0] ?? null)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Subir un archivo generará automáticamente una nueva versión BIM.
                        </p>
                        <InputError className="mt-2" message={errors.archivo_bim} />
                    </div>

                    <div className="mt-3 flex items-center space-x-2">
                        <input
                            id="mantener_archivo"
                            type="checkbox"
                            checked={mantenerArchivo}
                            onChange={() => setMantenerArchivo(!mantenerArchivo)}
                            className="accent-[#2970E8]"
                        />
                        <label htmlFor="mantener_archivo" className="text-sm text-gray-400">
                            Mantener el documento BIM anterior
                        </label>
                    </div>


                    {/* Botones de Acción */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <PrimaryButton
                            className="bg-[#2970E8] hover:bg-indigo-600 focus:bg-indigo-600 active:bg-indigo-700 shadow-md shadow-[#2970E8]/40 transform hover:scale-[1.02]"
                            disabled={processing}
                        >
                            {processing ? "Actualizando..." : "GUARDAR CAMBIOS"}
                        </PrimaryButton>
                        <Link
                            href={route("proyectos.index")}
                            className="text-[#B3E10F] hover:text-lime-400 font-semibold transition duration-150 ml-4"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
