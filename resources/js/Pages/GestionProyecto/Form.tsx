import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, Head } from "@inertiajs/react";
import { FormEventHandler } from "react";

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const routeName = proyecto ? 'proyectos.update' : 'proyectos.store';

        if (proyecto) {
            post(route(routeName, proyecto.id), {
                forceFormData: true,
            });
        } else {
            post(route(routeName));
        }
    };

    // Estilos consistentes para select y textarea
    const inputFieldStyles = "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";


    return (
        // Contenedor principal con fondo muy oscuro
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Crear Proyecto" />
            {/* Contenedor del formulario con un borde sutil para destacar */}
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-lg shadow-gray-900/50">

                {/* Encabezado con colores de marca */}
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    {proyecto ? "EDITAR PROYECTO" : "CREAR NUEVO PROYECTO"}
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    ✨ Define los parámetros del proyecto y asigna a tu equipo principal.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Sección 1: Nombre y Descripción */}
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" className="text-gray-200 font-semibold" />
                        <TextInput
                            id="nombre"
                            className={inputFieldStyles}
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                            placeholder="Ej: Torre de Oficinas Central Park"
                        />
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>

                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción Detallada del Proyecto" className="text-gray-200 font-semibold" />
                        <textarea
                            id="descripcion"
                            rows={4}
                            className={inputFieldStyles}
                            value={data.descripcion}
                            onChange={(e) => setData("descripcion", e.target.value)}
                            placeholder="Breve resumen de los alcances y metas del proyecto."
                        />
                        <InputError className="mt-2" message={errors.descripcion} />
                    </div>

                    {/* Sección 2: Grid de 2 Columnas para Asignaciones y Fecha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">

                        {/* Cliente */}
                        <div>
                            <InputLabel htmlFor="cliente" value="Cliente Asociado" className="text-gray-200 font-semibold" />
                            <select
                                id="cliente"
                                className={inputFieldStyles}
                                value={data.cliente_id}
                                onChange={(e) => setData("cliente_id", e.target.value)}
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

                        {/* Responsable */}
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

                        {/* Fecha de Inicio (Full width si es necesario, aquí lo mantenemos en 2 columnas) */}
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

                    {/* Sección 3: Archivo BIM */}
                    <div className="pt-4 border-t border-gray-700">
                        <InputLabel htmlFor="archivo_bim" value="Archivo BIM Inicial (.ifc, .bim)" className="text-gray-200 font-semibold" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            // Estilo de botón de archivo más corporativo y visible
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

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <PrimaryButton
                            className="bg-[#2970E8] hover:bg-indigo-600 focus:bg-indigo-600 active:bg-indigo-700 shadow-md shadow-[#2970E8]/40 transform hover:scale-[1.02]"
                            disabled={processing}
                        >
                            {proyecto ? "ACTUALIZAR PROYECTO" : "GUARDAR PROYECTO"}
                        </PrimaryButton>
                        <Link
                            href={route("proyectos.index")}
                            className="text-[#B3E10F] hover:text-lime-400 font-semibold transition duration-150 ml-4"
                        >
                            Cancelar y Volver
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
