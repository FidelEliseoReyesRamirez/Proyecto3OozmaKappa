import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { router, Head, Link } from "@inertiajs/react";

export default function Form({ proyectos, usuarios, proyectoSeleccionado }: any) {
    const [tarea, setTarea] = useState({
        proyecto_id: proyectoSeleccionado ?? "",
        titulo: "",
        descripcion: "",
        fecha_limite: "",
        prioridad: "media",
        asignado_id: "",
    });
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const inputStyle =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    const handleChange = (e: any) => {
        setTarea({ ...tarea, [e.target.name]: e.target.value });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return; // Previene doble clic
        setProcessing(true);
        setErrors({});

        router.post(route("tareas.store"), tarea, {
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Crear Tarea" />
            <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">CREAR TAREA</h2>
                <p className="mb-8 text-md text-[#B3E10F]">Asigna una nueva tarea a un proyecto existente.</p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Proyecto */}
                    <div>
                        <InputLabel htmlFor="proyecto_id" value="Proyecto" className="text-gray-200 font-semibold" />
                        {proyectoSeleccionado ? (
                            <TextInput
                                id="proyecto_id"
                                value={proyectos.find((p: any) => p.id == proyectoSeleccionado)?.nombre || "Proyecto seleccionado"}
                                disabled
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 cursor-not-allowed"
                            />
                        ) : (
                            <select
                                name="proyecto_id"
                                value={tarea.proyecto_id}
                                onChange={handleChange}
                                className={inputStyle}
                            >
                                <option value="">-- Selecciona un proyecto --</option>
                                {proyectos.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        )}
                        <InputError message={errors.proyecto_id} className="mt-2" />
                    </div>

                    {/* Título */}
                    <div>
                        <InputLabel htmlFor="titulo" value="Título" className="text-gray-200 font-semibold" />
                        <TextInput
                            name="titulo"
                            value={tarea.titulo}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="Ej. Render preliminar del edificio A"
                        />
                        <InputError message={errors.titulo} className="mt-2" />
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción" className="text-gray-200 font-semibold" />
                        <textarea
                            name="descripcion"
                            value={tarea.descripcion}
                            onChange={handleChange}
                            className={inputStyle}
                            rows={3}
                            placeholder="Describe brevemente la tarea..."
                        />
                        <InputError message={errors.descripcion} className="mt-2" />
                    </div>

                    {/* Fecha y Prioridad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="fecha_limite" value="Fecha Límite" className="text-gray-200 font-semibold" />
                            <TextInput
                                type="date"
                                name="fecha_limite"
                                value={tarea.fecha_limite}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                            <InputError message={errors.fecha_limite} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="prioridad" value="Prioridad" className="text-gray-200 font-semibold" />
                            <select
                                name="prioridad"
                                value={tarea.prioridad}
                                onChange={handleChange}
                                className={inputStyle}
                            >
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>

                    {/* Responsable */}
                    <div>
                        <InputLabel htmlFor="asignado_id" value="Responsable" className="text-gray-200 font-semibold" />
                        <select
                            name="asignado_id"
                            value={tarea.asignado_id}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option value="">-- Selecciona un usuario --</option>
                            {usuarios.length > 0 ? (
                                usuarios.map((u: any) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No hay usuarios disponibles</option>
                            )}
                        </select>
                        <InputError message={errors.asignado_id} className="mt-2" />
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <PrimaryButton
                            className="bg-[#2970E8] hover:bg-indigo-600 focus:bg-indigo-600 active:bg-indigo-700 shadow-md shadow-[#2970E8]/40 transform hover:scale-[1.02]"
                            disabled={processing}
                        >
                            {processing ? "Creando..." : "CREAR TAREA"}
                        </PrimaryButton>
                        <Link
                            href={route("tareas.index")}
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
