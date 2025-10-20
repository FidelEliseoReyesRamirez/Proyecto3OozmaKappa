import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
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
    const [localErrors, setLocalErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const inputStyle =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    // 🔍 Validaciones personalizadas
    const validateTitulo = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();

        // Solo letras, números y paréntesis
        if (/[^A-Z0-9() ]/i.test(clean)) {
            setLocalErrors({ ...localErrors, titulo: "Solo se permiten letras, números y paréntesis." });
            clean = clean.replace(/[^A-Z0-9() ]/gi, "");
        } else {
            setLocalErrors({ ...localErrors, titulo: "" });
        }

        // Convertir a mayúsculas
        clean = clean.toUpperCase();

        // Límite de 50 caracteres
        if (clean.length > 50) {
            setLocalErrors({ ...localErrors, titulo: "Máximo 50 caracteres permitidos." });
            clean = clean.slice(0, 50);
        }

        setTarea({ ...tarea, titulo: clean });
    };

    const validateDescripcion = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();

        // Sin símbolos ni paréntesis
        if (/[^A-Z0-9 ]/i.test(clean)) {
            setLocalErrors({ ...localErrors, descripcion: "Solo se permiten letras y números, sin símbolos ni paréntesis." });
            clean = clean.replace(/[^A-Z0-9 ]/gi, "");
        } else {
            setLocalErrors({ ...localErrors, descripcion: "" });
        }

        // Límite de 200 caracteres
        if (clean.length > 200) {
            setLocalErrors({ ...localErrors, descripcion: "Máximo 200 caracteres permitidos." });
            clean = clean.slice(0, 200);
        }

        setTarea({ ...tarea, descripcion: clean });
    };

    // 📅 Fechas válidas: desde hoy hasta 1 mes máximo
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    // 🧠 Validar antes de enviar
    const validateBeforeSubmit = () => {
        const errs: any = {};

        if (!tarea.proyecto_id) errs.proyecto_id = "Debe seleccionar un proyecto.";
        if (!tarea.titulo.trim()) errs.titulo = "El título es obligatorio.";
        if (!tarea.descripcion.trim()) errs.descripcion = "La descripción es obligatoria.";
        if (!tarea.asignado_id) errs.asignado_id = "Debe seleccionar un responsable.";
        if (!tarea.fecha_limite) errs.fecha_limite = "Debe seleccionar una fecha límite.";

        // Validar rango de fecha
        if (tarea.fecha_limite) {
            const f = new Date(tarea.fecha_limite);
            if (f < new Date(today)) {
                errs.fecha_limite = "La fecha no puede ser anterior a hoy.";
            } else if (f > maxDate) {
                errs.fecha_limite = "La fecha no puede superar 30 días desde hoy.";
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;

        if (!validateBeforeSubmit()) return;

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
                                onChange={(e) => setTarea({ ...tarea, proyecto_id: e.target.value })}
                                className={inputStyle}
                            >
                                <option value="">-- Selecciona un proyecto --</option>
                                {proyectos.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        )}
                        <InputError message={errors.proyecto_id} className="mt-2" />
                    </div>

                    {/* Título */}
                    <div>
                        <InputLabel htmlFor="titulo" value="Título de la tarea" className="text-gray-200 font-semibold" />
                        <TextInput
                            id="titulo"
                            value={tarea.titulo}
                            onChange={(e) => validateTitulo(e.target.value)}
                            className={inputStyle}
                            placeholder="Ej. RENDER PRELIMINAR DEL EDIFICIO A"
                            maxLength={50}
                        />
                        <InputError message={localErrors.titulo || errors.titulo} className="mt-2 text-red-400" />
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción" className="text-gray-200 font-semibold" />
                        <textarea
                            id="descripcion"
                            value={tarea.descripcion}
                            onChange={(e) => validateDescripcion(e.target.value)}
                            className={inputStyle}
                            rows={3}
                            placeholder="Describe brevemente la tarea..."
                            maxLength={200}
                        />
                        <InputError message={localErrors.descripcion || errors.descripcion} className="mt-2 text-red-400" />
                    </div>

                    {/* Fecha y Prioridad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="fecha_limite" value="Fecha límite" className="text-gray-200 font-semibold" />
                            <TextInput
                                type="date"
                                id="fecha_limite"
                                name="fecha_limite"
                                min={today}
                                max={maxDateStr}
                                value={tarea.fecha_limite}
                                onChange={(e) => setTarea({ ...tarea, fecha_limite: e.target.value })}
                                className={inputStyle}
                            />
                            <InputError message={errors.fecha_limite} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="prioridad" value="Prioridad" className="text-gray-200 font-semibold" />
                            <select
                                id="prioridad"
                                name="prioridad"
                                value={tarea.prioridad}
                                onChange={(e) => setTarea({ ...tarea, prioridad: e.target.value })}
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
                            id="asignado_id"
                            name="asignado_id"
                            value={tarea.asignado_id}
                            onChange={(e) => setTarea({ ...tarea, asignado_id: e.target.value })}
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
                        <InputError message={errors.asignado_id || (tarea.asignado_id === "" ? "Debe seleccionar un responsable." : "")} className="mt-2 text-red-400" />
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <button
                            className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                            disabled={processing}
                        >
                            {processing ? "Creando..." : "CREAR TAREA"}
                        </button>
                        <Link
                            href={route("tareas.index")}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold transition duration-150 text-white"
                        >
                            Cancelar y volver
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
