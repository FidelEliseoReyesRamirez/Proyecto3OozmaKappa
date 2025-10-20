import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
<<<<<<< HEAD
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { router, Head, Link } from "@inertiajs/react";
=======
import TextInput from "@/Components/TextInput";
import { Link, useForm, Head } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
>>>>>>> 4262d04 (ultimos arreglos a proyectos)

export default function Form({ proyecto, clientes, responsables }: any) {
    const [data, setData] = useState({
        nombre: proyecto?.nombre || "",
        cliente_id: proyecto?.cliente_id || "",
        descripcion: proyecto?.descripcion || "",
        fecha_inicio: proyecto?.fecha_inicio || "",
        responsable_id: proyecto?.responsable_id || "",
        archivo_bim: null as File | null,
    });

<<<<<<< HEAD
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
=======
    const routeName = proyecto ? "proyectos.update" : "proyectos.store";

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Prevención: evita enviar si hay errores visibles
        if (!validarCampos()) return;

        if (proyecto) {
            post(route(routeName, proyecto.id), { forceFormData: true });
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
        } else {
            setLocalErrors({ ...localErrors, archivo_bim: "" });
            setData({ ...data, archivo_bim: file });
        }
    };

<<<<<<< HEAD
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
=======
    // ---------- VALIDACIONES FRONTEND AUTOMÁTICAS ----------

    const validarCampos = () => {
        if (data.nombre.trim() === "" || data.nombre.length > 150) {
            alert("El nombre no puede estar vacío ni superar 150 caracteres.");
            return false;
        }
        if (!data.cliente_id) {
            alert("Debe seleccionar un cliente válido.");
            return false;
        }
        if (!data.responsable_id) {
            alert("Debe seleccionar un responsable válido.");
            return false;
        }
        if (!data.fecha_inicio) {
            alert("Debe ingresar la fecha de inicio del proyecto.");
            return false;
        }

        if (data.archivo_bim) {
            const ext = data.archivo_bim.name.split(".").pop()?.toLowerCase();
            const validExt = ["bim", "ifc"];
            if (!validExt.includes(ext || "")) {
                alert("Formato de archivo no permitido. Solo .bim o .ifc");
                return false;
            }
            if (data.archivo_bim.size > 256 * 1024 * 1024) {
                alert("El archivo supera los 256 MB permitidos.");
                return false;
            }
        }
        return true;
    };

    // ---------- RESTRICCIONES INMEDIATAS EN INPUTS ----------

    const handleNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;

        // Evitar solo espacios o múltiples espacios consecutivos
        let limpio = valor.replace(/\s{2,}/g, " ").trimStart();

        // Máximo 150 caracteres
        if (limpio.length > 150) limpio = limpio.substring(0, 150);

        setData("nombre", limpio);
    };

    const handleDescripcion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Permite hasta 500 caracteres como buena práctica
        let texto = e.target.value.replace(/\s{2,}/g, " ").trimStart();
        if (texto.length > 500) texto = texto.substring(0, 500);
        setData("descripcion", texto);
    };

    // ---------- ESTILOS ----------

    const inputFieldStyles =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    // ---------- COMPONENTE ----------
>>>>>>> 4262d04 (ultimos arreglos a proyectos)

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Crear Proyecto" />
<<<<<<< HEAD
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">CREAR NUEVO PROYECTO</h2>
=======

            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-lg shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    {proyecto ? "EDITAR PROYECTO" : "CREAR NUEVO PROYECTO"}
                </h2>
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                <p className="mb-8 text-md text-[#B3E10F]">
                    ✨ Define los parámetros del proyecto y asigna a tu equipo principal.
                </p>

<<<<<<< HEAD
                <form onSubmit={submit} className="space-y-6">
                    {/* Nombre */}
=======
                <form onSubmit={submit} className="space-y-6" noValidate>
                    {/* NOMBRE */}
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" />
                        <TextInput
                            id="nombre"
                            value={data.nombre}
<<<<<<< HEAD
                            onChange={(e) => validateNombre(e.target.value)}
                            className={inputStyle}
                            placeholder="EJ: TORRE CENTRAL PARK"
                        />
                        <InputError message={localErrors.nombre || errors.nombre} className="mt-2 text-red-400" />
                    </div>

                    {/* Descripción */}
=======
                            onChange={handleNombre}
                            required
                            placeholder="Ej: Torre de Oficinas Central Park"
                            maxLength={150}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            {data.nombre.length}/150 caracteres
                        </p>
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>

                    {/* DESCRIPCIÓN */}
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción Detallada" />
                        <textarea
                            id="descripcion"
                            rows={4}
                            className={inputStyle}
                            value={data.descripcion}
<<<<<<< HEAD
                            onChange={(e) => validateDescripcion(e.target.value)}
                            placeholder="Breve resumen del proyecto..."
                        />
                        <InputError message={localErrors.descripcion || errors.descripcion} className="mt-2 text-red-400" />
                    </div>

                    {/* Cliente / Responsable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
=======
                            onChange={handleDescripcion}
                            placeholder="Breve resumen de los alcances y metas del proyecto."
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            {data.descripcion?.length || 0}/500 caracteres
                        </p>
                        <InputError className="mt-2" message={errors.descripcion} />
                    </div>

                    {/* CLIENTE Y RESPONSABLE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                        <div>
                            <InputLabel htmlFor="cliente_id" value="Cliente Asociado" />
                            <select
                                id="cliente_id"
                                value={data.cliente_id}
<<<<<<< HEAD
                                onChange={(e) => setData({ ...data, cliente_id: e.target.value })}
                                className={inputStyle}
=======
                                onChange={(e) => setData("cliente_id", e.target.value)}
                                required
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
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
<<<<<<< HEAD
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
=======

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio del Proyecto" className="text-gray-200 font-semibold" />
                            <TextInput
                                id="fecha_inicio"
                                type="date"
                                className={inputFieldStyles}
                                value={data.fecha_inicio}
                                onChange={(e) => setData("fecha_inicio", e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.fecha_inicio} />
                        </div>
                    </div>

                    {/* ARCHIVO BIM */}
                    <div className="pt-4 border-t border-gray-700">
                        <InputLabel htmlFor="archivo_bim" value="Archivo BIM Inicial (.ifc, .bim)" className="text-gray-200 font-semibold" />
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
<<<<<<< HEAD
                            onChange={(e) => validateFile(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0 file:text-sm file:font-bold
                            file:bg-[#2970E8] file:text-white hover:file:bg-indigo-600 transition duration-150 cursor-pointer"
=======
                            className="mt-1 block w-50% text-sm text-gray-300
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-bold
                                file:bg-[#2970E8] file:text-white
                                hover:file:bg-indigo-600 transition duration-150 cursor-pointer"
                            onChange={(e) => setData("archivo_bim", e.target.files?.[0] || null)}
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                        />
                        <InputError message={localErrors.archivo_bim || errors.archivo_bim} className="mt-2 text-red-400" />
                    </div>

<<<<<<< HEAD
                    {/* Botones */}
                    <div className="flex justify-between pt-6 border-t border-gray-700">
                        <button
                            className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
=======
                    {/* BOTONES */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <button
                            type="submit"
>>>>>>> 4262d04 (ultimos arreglos a proyectos)
                            disabled={processing}
                            className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30"
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
