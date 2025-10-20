import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Link, useForm, Head } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";

export default function Form({ proyecto, clientes, responsables }: any) {
    const { data, setData, post, processing, errors } = useForm<{
        nombre: string;
        cliente_id: string;
        descripcion?: string;
        fecha_inicio: string;
        responsable_id: string;
        archivo_bim: File | null;
    }>({
        nombre: proyecto?.nombre || "",
        cliente_id: proyecto?.cliente_id || "",
        descripcion: proyecto?.descripcion || "",
        fecha_inicio: proyecto?.fecha_inicio || "",
        responsable_id: proyecto?.responsable_id || "",
        archivo_bim: null,
    });

    const routeName = proyecto ? "proyectos.update" : "proyectos.store";

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Prevención: evita enviar si hay errores visibles
        if (!validarCampos()) return;

        if (proyecto) {
            post(route(routeName, proyecto.id), { forceFormData: true });
        } else {
            post(route(routeName));
        }
    };

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

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Crear Proyecto" />

            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-lg shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    {proyecto ? "EDITAR PROYECTO" : "CREAR NUEVO PROYECTO"}
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    ✨ Define los parámetros del proyecto y asigna a tu equipo principal.
                </p>

                <form onSubmit={submit} className="space-y-6" noValidate>
                    {/* NOMBRE */}
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" className="text-gray-200 font-semibold" />
                        <TextInput
                            id="nombre"
                            className={inputFieldStyles}
                            value={data.nombre}
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
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción Detallada del Proyecto" className="text-gray-200 font-semibold" />
                        <textarea
                            id="descripcion"
                            rows={4}
                            className={inputFieldStyles}
                            value={data.descripcion}
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
                        <div>
                            <InputLabel htmlFor="cliente" value="Cliente Asociado" className="text-gray-200 font-semibold" />
                            <select
                                id="cliente"
                                className={inputFieldStyles}
                                value={data.cliente_id}
                                onChange={(e) => setData("cliente_id", e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Seleccione un cliente --</option>
                                {clientes.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <InputError className="mt-2" message={errors.cliente_id} />
                        </div>

                        <div>
                            <InputLabel htmlFor="responsable" value="Responsable Principal" className="text-gray-200 font-semibold" />
                            <select
                                id="responsable"
                                className={inputFieldStyles}
                                value={data.responsable_id}
                                onChange={(e) => setData("responsable_id", e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Seleccione un responsable --</option>
                                {responsables.map((r: any) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            <InputError className="mt-2" message={errors.responsable_id} />
                        </div>

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
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            className="mt-1 block w-50% text-sm text-gray-300
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-bold
                                file:bg-[#2970E8] file:text-white
                                hover:file:bg-indigo-600 transition duration-150 cursor-pointer"
                            onChange={(e) => setData("archivo_bim", e.target.files?.[0] || null)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Formatos soportados: .ifc, .bim. Máx. 256MB.
                        </p>
                        <InputError className="mt-2" message={errors.archivo_bim} />
                    </div>

                    {/* BOTONES */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                        >
                            {proyecto ? "ACTUALIZAR PROYECTO" : "GUARDAR PROYECTO"}
                        </button>
                        <Link
                            href={route("proyectos.index")}
                            className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                        >
                            Cancelar y Volver
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
