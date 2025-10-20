import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { router, Head, Link } from "@inertiajs/react";

export default function Form({ proyecto, clientes, responsables }: any) {
    const [data, setData] = useState({
        nombre: proyecto?.nombre || "",
        cliente_id: proyecto?.cliente_id || "",
        descripcion: proyecto?.descripcion || "",
        fecha_inicio: proyecto?.fecha_inicio || "",
        responsable_id: proyecto?.responsable_id || "",
        archivo_bim: null as File | null,
    });

    const [errors, setErrors] = useState<any>({});
    const [localErrors, setLocalErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const inputStyle =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    // Validaciones locales (como en tareas)
    const validateNombre = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();

        if (/[^A-Z0-9() ]/i.test(clean)) {
            setLocalErrors({ ...localErrors, nombre: "Solo se permiten letras, números y paréntesis." });
            clean = clean.replace(/[^A-Z0-9() ]/gi, "");
        } else setLocalErrors({ ...localErrors, nombre: "" });

        clean = clean.toUpperCase();

        if (clean.length > 50) {
            setLocalErrors({ ...localErrors, nombre: "Máximo 50 caracteres permitidos." });
            clean = clean.slice(0, 50);
        }

        setData({ ...data, nombre: clean });
    };

    const validateDescripcion = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();

        if (/[^A-Z0-9 ]/i.test(clean)) {
            setLocalErrors({
                ...localErrors,
                descripcion: "Solo se permiten letras y números, sin símbolos ni paréntesis.",
            });
            clean = clean.replace(/[^A-Z0-9 ]/gi, "");
        } else setLocalErrors({ ...localErrors, descripcion: "" });

        if (clean.length > 200) {
            setLocalErrors({ ...localErrors, descripcion: "Máximo 200 caracteres permitidos." });
            clean = clean.slice(0, 200);
        }

        setData({ ...data, descripcion: clean });
    };

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const validateFile = (file: File | null) => {
        if (!file) return;
        const validExt = [".bim", ".ifc"];
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!validExt.includes(ext) || file.size > 256 * 1024 * 1024) {
            setLocalErrors({
                ...localErrors,
                archivo_bim: "Archivo inválido. Solo se permiten .bim o .ifc menores a 256 MB.",
            });
            setData({ ...data, archivo_bim: null });
        } else {
            setLocalErrors({ ...localErrors, archivo_bim: "" });
            setData({ ...data, archivo_bim: file });
        }
    };

    const validateBeforeSubmit = () => {
        const errs: any = {};

        if (!data.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
        if (!data.descripcion.trim()) errs.descripcion = "La descripción es obligatoria.";
        if (!data.cliente_id) errs.cliente_id = "Debe seleccionar un cliente.";
        if (!data.responsable_id) errs.responsable_id = "Debe seleccionar un responsable.";
        if (!data.fecha_inicio) errs.fecha_inicio = "Debe seleccionar una fecha de inicio.";

        if (data.fecha_inicio) {
            const f = new Date(data.fecha_inicio);
            if (f < today) {
                errs.fecha_inicio = "La fecha no puede ser anterior a hoy.";
            } else if (f > maxDate) {
                errs.fecha_inicio = "La fecha no puede superar 30 días desde hoy.";
            }
        }

        if (!data.archivo_bim) errs.archivo_bim = "Debe subir un archivo BIM.";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;
        if (!validateBeforeSubmit()) return;

        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value as any);
        });

        router.post(
            route(proyecto ? "proyectos.update" : "proyectos.store", proyecto?.id),
            formData,
            {
                forceFormData: true,
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(false);
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Crear Proyecto" />
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">CREAR NUEVO PROYECTO</h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    ✨ Define los parámetros del proyecto y asigna a tu equipo principal.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" />
                        <TextInput
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => validateNombre(e.target.value)}
                            className={inputStyle}
                            placeholder="EJ: TORRE CENTRAL PARK"
                        />
                        <InputError message={localErrors.nombre || errors.nombre} className="mt-2 text-red-400" />
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción Detallada" />
                        <textarea
                            id="descripcion"
                            rows={4}
                            className={inputStyle}
                            value={data.descripcion}
                            onChange={(e) => validateDescripcion(e.target.value)}
                            placeholder="Breve resumen del proyecto..."
                        />
                        <InputError message={localErrors.descripcion || errors.descripcion} className="mt-2 text-red-400" />
                    </div>

                    {/* Cliente / Responsable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="cliente_id" value="Cliente Asociado" />
                            <select
                                id="cliente_id"
                                value={data.cliente_id}
                                onChange={(e) => setData({ ...data, cliente_id: e.target.value })}
                                className={inputStyle}
                            >
                                <option value="">-- Seleccione un cliente --</option>
                                {clientes.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.cliente_id} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="responsable_id" value="Responsable Principal" />
                            <select
                                id="responsable_id"
                                value={data.responsable_id}
                                onChange={(e) => setData({ ...data, responsable_id: e.target.value })}
                                className={inputStyle}
                            >
                                <option value="">-- Seleccione un responsable --</option>
                                {responsables.map((r: any) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.responsable_id} className="mt-2 text-red-400" />
                        </div>
                    </div>

                    {/* Fecha */}
                    <div>
                        <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" />
                        <TextInput
                            type="date"
                            id="fecha_inicio"
                            min={todayStr}
                            max={maxDateStr}
                            value={data.fecha_inicio}
                            onChange={(e) => setData({ ...data, fecha_inicio: e.target.value })}
                            className={inputStyle}
                        />
                        <InputError message={errors.fecha_inicio} className="mt-2 text-red-400" />
                    </div>

                    {/* Archivo BIM */}
                    <div>
                        <InputLabel htmlFor="archivo_bim" value="Archivo BIM Inicial (.ifc, .bim)" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            onChange={(e) => validateFile(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0 file:text-sm file:font-bold
                            file:bg-[#2970E8] file:text-white hover:file:bg-indigo-600 transition duration-150 cursor-pointer"
                        />
                        <InputError message={localErrors.archivo_bim || errors.archivo_bim} className="mt-2 text-red-400" />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between pt-6 border-t border-gray-700">
                        <button
                            className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "GUARDAR PROYECTO"}
                        </button>
                        <Link
                            href={route("proyectos.index")}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold text-white"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
