import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { router, Head, Link } from "@inertiajs/react";
// Importar el nuevo componente modular
import ModalMensaje from "./ModalMensaje"; // Asegúrate de que la ruta sea correcta

export default function Form({ proyectos, usuarios, proyectoSeleccionado }: any) {
    // ... (Mantener todos los estados, constantes y funciones de lógica)
    
    // ESTADOS
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
    const [openResponsable, setOpenResponsable] = useState(false);
    const [busquedaResponsable, setBusquedaResponsable] = useState("");

    // estado del modal
    const [modal, setModal] = useState({ visible: false, tipo: "", mensaje: "" });

    // CONSTANTES DE ESTILO
    const inputStyle =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    const dropdownStyle =
        "absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto";

    // DATOS FILTRADOS
    const usuariosFiltrados = usuarios.filter((u: any) =>
        u.name.toLowerCase().includes(busquedaResponsable.toLowerCase())
    );

    // EFECTOS
    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".combo-responsables")) setOpenResponsable(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    // FUNCIONES DE VALIDACIÓN
    const validateTitulo = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();
        if (/[^A-Z0-9() ]/i.test(clean)) {
            setLocalErrors({ ...localErrors, titulo: "Solo se permiten letras, números y paréntesis." });
            clean = clean.replace(/[^A-Z0-9() ]/gi, "");
        } else setLocalErrors({ ...localErrors, titulo: "" });

        clean = clean.toUpperCase();
        if (clean.length > 50) {
            setLocalErrors({ ...localErrors, titulo: "Máximo 50 caracteres permitidos." });
            clean = clean.slice(0, 50);
        }
        setTarea({ ...tarea, titulo: clean });
    };

    const validateDescripcion = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();
        if (/[^A-Z0-9 ]/i.test(clean)) {
            setLocalErrors({ ...localErrors, descripcion: "Solo se permiten letras y números, sin símbolos." });
            clean = clean.replace(/[^A-Z0-9 ]/gi, "");
        } else setLocalErrors({ ...localErrors, descripcion: "" });

        if (clean.length > 200) {
            setLocalErrors({ ...localErrors, descripcion: "Máximo 200 caracteres permitidos." });
            clean = clean.slice(0, 200);
        }
        setTarea({ ...tarea, descripcion: clean });
    };

    // CÁLCULO DE FECHAS
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const validateBeforeSubmit = () => {
        const errs: any = {};
        if (!tarea.proyecto_id) errs.proyecto_id = "Debe seleccionar un proyecto.";
        if (!tarea.titulo.trim()) errs.titulo = "El título es obligatorio.";
        if (!tarea.descripcion.trim()) errs.descripcion = "La descripción es obligatoria.";
        if (!tarea.asignado_id) errs.asignado_id = "Debe seleccionar un responsable.";
        if (!tarea.fecha_limite) errs.fecha_limite = "Debe seleccionar una fecha límite.";

        if (tarea.fecha_limite) {
            const f = new Date(tarea.fecha_limite);
            if (f < new Date(today)) errs.fecha_limite = "La fecha no puede ser anterior a hoy.";
            else if (f > maxDate) errs.fecha_limite = "La fecha no puede superar 30 días desde hoy.";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const mostrarModal = (tipo: "exito" | "error", mensaje: string) => {
        setModal({ visible: true, tipo, mensaje });
        setTimeout(() => setModal({ visible: false, tipo: "", mensaje: "" }), 3500);
    };

    const closeModal = () => setModal({ visible: false, tipo: "", mensaje: "" });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;
        if (!validateBeforeSubmit()) return;

        setProcessing(true);
        setErrors({});

        router.post(route("tareas.store"), tarea, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                setProcessing(false);
                mostrarModal("exito", "Tarea creada correctamente ✅");
                setTimeout(() => {
                    router.visit(route("tareas.index", { proyecto_id: tarea.proyecto_id }));
                }, 2000);
            },
            onError: (errors: any) => {
                const msg = errors?.message || "Este usuario no tiene permiso de acceder a esta tarea.";
                setProcessing(false);
                mostrarModal("error", msg);
            },
        });
    };

    // JSX DEL COMPONENTE
    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950 relative">
            <Head title="DEVELARQ | Crear Tarea" />
            <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">CREAR TAREA</h2>
                <p className="mb-8 text-md text-[#B3E10F]">Asigna una nueva tarea a un proyecto existente.</p>

                <form onSubmit={submit} className="space-y-6">
                    {/* ... (Contenido del formulario idéntico) */}
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

                    {/* Fecha y prioridad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="fecha_limite" value="Fecha límite" className="text-gray-200 font-semibold" />
                            <TextInput
                                type="date"
                                id="fecha_limite"
                                min={today}
                                max={maxDateStr}
                                value={tarea.fecha_limite}
                                onChange={(e) => setTarea({ ...tarea, fecha_limite: e.target.value })}
                                className={`${inputStyle} text-white [&::-webkit-calendar-picker-indicator]:invert`}
                                style={{ colorScheme: "dark" }}
                            />

                            <InputError message={errors.fecha_limite} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="prioridad" value="Prioridad" className="text-gray-200 font-semibold" />
                            <select
                                id="prioridad"
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

                    {/* RESPONSABLE */}
                    <div className="relative combo-responsables">
                        <InputLabel htmlFor="asignado_id" value="Responsable" className="text-gray-200 font-semibold" />
                        <div
                            className={inputStyle + " cursor-pointer px-3 py-2.5 min-h-[42px] flex items-center text-sm"}
                            onClick={() => setOpenResponsable(!openResponsable)}
                        >
                            {usuarios.find((u: any) => u.id === tarea.asignado_id)?.name || "Seleccione o escriba un responsable..."}
                        </div>

                        {openResponsable && (
                            <div className={dropdownStyle}>
                                <input
                                    type="text"
                                    autoFocus
                                    maxLength={50}
                                    className="w-full px-3 py-2.5 bg-gray-800 text-gray-200 text-sm border-b border-gray-700 focus:outline-none"
                                    placeholder="Buscar responsable..."
                                    value={busquedaResponsable}
                                    onChange={(e) => setBusquedaResponsable(e.target.value)}
                                />
                                {usuariosFiltrados.length > 0 ? (
                                    usuariosFiltrados.map((u: any) => (
                                        <div
                                            key={u.id}
                                            onClick={() => {
                                                setTarea({ ...tarea, asignado_id: u.id });
                                                setOpenResponsable(false);
                                                setBusquedaResponsable("");
                                            }}
                                            className={`px-3 py-2 text-sm hover:bg-[#2970E8] hover:text-white cursor-pointer ${u.id === tarea.asignado_id
                                                    ? "bg-[#1f5dc0] text-white"
                                                    : "text-gray-200"
                                                }`}
                                        >
                                            {u.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-gray-500 text-sm">Sin resultados</div>
                                )}
                            </div>
                        )}
                        <InputError message={errors.asignado_id} className="mt-2 text-red-400" />
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

            <ModalMensaje
                visible={modal.visible}
                tipo={modal.tipo as "exito" | "error" | ""}
                mensaje={modal.mensaje}
                onClose={closeModal}
            />

        </section>
    );
}