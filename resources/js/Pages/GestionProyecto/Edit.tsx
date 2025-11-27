import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { router, Link, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ proyecto, clientes, responsables }: any) {
    const { auth } = usePage().props;

    const [nombre, setNombre] = useState(proyecto.nombre || "");
    const [cliente_id, setClienteId] = useState(String(proyecto.cliente_id ?? ""));
    const fecha_inicio = proyecto.fecha_inicio
        ? new Date(proyecto.fecha_inicio).toISOString().split("T")[0]
        : "";

    const [descripcion, setDescripcion] = useState(proyecto.descripcion || "");
    const [responsable_id, setResponsableId] = useState(String(proyecto.responsable_id ?? ""));

    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);
    const [localErrors, setLocalErrors] = useState<{ descripcion?: string }>({});

    const inputFieldStyles =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition placeholder-gray-500";

    // LIMPIAR DESCRIPCIÓN
    const validateDescripcion = (value: string) => {
        const clean = value.replace(/\s+/g, " ").trimStart();
        if (/[^A-Z0-9 ]/i.test(clean)) {
            setLocalErrors({
                descripcion: "Solo se permiten letras y números.",
            });
            return clean.replace(/[^A-Z0-9 ]/gi, "");
        }
        if (clean.length > 200) {
            setLocalErrors({
                descripcion: "Máximo 200 caracteres permitidos.",
            });
            return clean.slice(0, 200);
        }
        setLocalErrors({ descripcion: "" });
        return clean;
    };

    const validateBeforeSubmit = () => {
        const errs: any = {};
        if (!responsable_id) errs.responsable_id = "Debe seleccionar un responsable.";
        if (!nombre.trim()) errs.nombre = "El nombre no puede estar vacío.";
        if (!cliente_id) errs.cliente_id = "Debe seleccionar un cliente.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;
        if (!validateBeforeSubmit()) return;

        setProcessing(true);
        const fd = new FormData();

        fd.append("_method", "PATCH");
        fd.append("nombre", nombre);
        fd.append("descripcion", descripcion ?? "");
        fd.append("cliente_id", cliente_id);
        fd.append("responsable_id", responsable_id ?? "");
        fd.append("fecha_inicio", fecha_inicio);

        router.post(route("proyectos.update", proyecto.id), fd, {
            onError: (errs: any) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold leading-tight text-[#B3E10F] tracking-wider">
                    EDITAR PROYECTO
                </h2>
            }
        >
            <Head title="DEVELARQ | Editar Proyecto" />

            <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
                <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl">

                    <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1">
                        EDITAR PROYECTO
                    </h2>

                    <p className="mb-8 text-md text-[#B3E10F]">
                        Actualiza la información del proyecto.
                    </p>

                    <form onSubmit={submit} className="space-y-6">

                        {/* BLOQUE 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-gray-700">

                            <div className="md:col-span-2 color-white">
                                <InputLabel value="Nombre del Proyecto" />
                                <TextInput
                                    disabled={true}
                                    className={inputFieldStyles}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                <InputError message={errors.nombre} />
                            </div>

                            <div>
                                <InputLabel value="Cliente Asociado" />
                                <select
                                    disabled={true}
                                    className={inputFieldStyles}
                                    value={cliente_id}
                                    onChange={(e) => setClienteId(e.target.value)}
                                >
                                    <option value="">-- Seleccione un cliente --</option>
                                    {clientes.map((c: any) => (
                                        <option key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.cliente_id} />
                            </div>

                            <div>
                                <InputLabel value="Fecha de Inicio" />
                                <TextInput
                                    type="date"
                                    className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 cursor-not-allowed"
                                    value={fecha_inicio}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                            <InputLabel value="Descripción del Proyecto" />
                            <textarea
                                className={inputFieldStyles}
                                rows={3}
                                value={descripcion}
                                onChange={(e) => setDescripcion(validateDescripcion(e.target.value))}
                            />
                            <InputError message={localErrors.descripcion || errors.descripcion} />
                        </div>

                        {/* RESPONSABLE */}
                        <div>
                            <InputLabel value="Responsable Principal" />
                            <select
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
                            <InputError message={errors.responsable_id} />
                        </div>

                        {/* BOTONES */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                            <button
                                className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition text-sm font-bold shadow-md"
                                disabled={processing}
                            >
                                {processing ? "Actualizando..." : "GUARDAR CAMBIOS"}
                            </button>

                            <Link
                                href={route("proyectos.index")}
                                className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold text-white transition"
                            >
                                Cancelar
                            </Link>
                        </div>

                    </form>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
