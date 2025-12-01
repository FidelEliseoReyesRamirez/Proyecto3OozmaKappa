import React, { useState, useEffect } from "react";
import { router, Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import ModalMensaje from "./ModalMensaje";

export default function Form({ proyectos, usuarios, proyectoSeleccionado, responsablePorDefecto }: any) {

    const [tarea, setTarea] = useState({
        proyecto_id: proyectoSeleccionado ?? "",
        titulo: "",
        descripcion: "",
        fecha_limite: "",
        prioridad: "media",
        asignado_id: responsablePorDefecto ?? ""
    });

    const [errors, setErrors] = useState<any>({});
    const [localErrors, setLocalErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const [openResponsable, setOpenResponsable] = useState(false);
    const [busquedaResponsable, setBusquedaResponsable] = useState("");

    const [modal, setModal] = useState({ visible: false, tipo: "", mensaje: "" });

    const inputStyle =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition";

    const dropdownStyle =
        "absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto";

    const usuariosFiltrados = usuarios.filter((u: any) =>
        u.name.toLowerCase().includes(busquedaResponsable.toLowerCase())
    );

    // cerrar el dropdown al hacer click fuera
    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".combo-responsables")) setOpenResponsable(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    // === VALIDACIONES =================================================================

    const validateTitulo = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();
        clean = clean.toUpperCase();
        if (clean.length > 50) clean = clean.slice(0, 50);
        setTarea({ ...tarea, titulo: clean });
    };

    const validateDescripcion = (value: string) => {
        let clean = value.replace(/\s+/g, " ").trimStart();
        if (clean.length > 200) clean = clean.slice(0, 200);
        setTarea({ ...tarea, descripcion: clean });
    };

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
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const mostrarModal = (tipo: string, mensaje: string) => {
        setModal({ visible: true, tipo, mensaje });
        setTimeout(() => setModal({ visible: false, tipo: "", mensaje: "" }), 3000);
    };

    const closeModal = () => setModal({ visible: false, tipo: "", mensaje: "" });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;

        if (!validateBeforeSubmit()) return;

        setProcessing(true);

        router.post(route("tareas.store"), tarea, {
            preserveScroll: true,
            onSuccess: () => {
                mostrarModal("exito", "Tarea creada correctamente");
                setTimeout(() => {
                    router.visit(route("tareas.index", { proyecto_id: tarea.proyecto_id }));
                }, 1200);
            },
            onError: (errors: any) => {
                mostrarModal("error", errors.asignado_id || "Error al crear tarea");
                setProcessing(false);
            },
        });
    };

    // === UI ===========================================================================

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-white">Crear Tarea</h2>}
        >
            <Head title="DEVELARQ | Crear Tarea" />

            <section className="flex justify-center py-10 px-4 bg-[#0B1120] min-h-screen">
                <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-xl">

                    <h2 className="text-2xl font-bold text-[#2970E8] mb-1">CREAR TAREA</h2>
                    <p className="text-[#B3E10F] mb-8">Asigna una nueva tarea al proyecto.</p>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Proyecto */}
                        <div>
                            <InputLabel value="Proyecto" className="text-gray-200" />

                            <TextInput
                                value={
                                    proyectos.find((p: any) => p.id == tarea.proyecto_id)?.nombre ||
                                    "Proyecto seleccionado"
                                }
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-300"
                                disabled
                            />

                            <InputError message={errors.proyecto_id} className="mt-2" />
                        </div>

                        {/* Título */}
                        <div>
                            <InputLabel value="Título" className="text-gray-200" />
                            <TextInput
                                value={tarea.titulo}
                                onChange={(e) => validateTitulo(e.target.value)}
                                className={inputStyle}
                                placeholder="Ej. MODELADO ESTRUCTURAL DEL NIVEL 2"
                            />
                            <InputError message={errors.titulo} className="mt-2" />
                        </div>

                        {/* Descripción */}
                        <div>
                            <InputLabel value="Descripción" className="text-gray-200" />
                            <textarea
                                value={tarea.descripcion}
                                onChange={(e) => validateDescripcion(e.target.value)}
                                className={inputStyle}
                                rows={3}
                            />
                            <InputError message={errors.descripcion} className="mt-2" />
                        </div>

                        {/* Fecha y prioridad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Fecha límite" className="text-gray-200" />
                                <TextInput
                                    type="date"
                                    min={today}
                                    max={maxDateStr}
                                    value={tarea.fecha_limite}
                                    onChange={(e) => setTarea({ ...tarea, fecha_limite: e.target.value })}
                                    className={inputStyle}
                                />
                                <InputError message={errors.fecha_limite} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Prioridad" className="text-gray-200" />
                                <select
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
                        <div className="relative combo-responsables">
                            <InputLabel value="Responsable" className="text-gray-200" />

                            <div
                                className={inputStyle + " cursor-pointer px-3 py-2.5"}
                                onClick={() => setOpenResponsable(!openResponsable)}
                            >
                                {usuarios.find((u: any) => u.id == tarea.asignado_id)?.name ||
                                    "Seleccione un responsable"}
                            </div>

                            {openResponsable && (
                                <div className={dropdownStyle}>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full px-3 py-2 bg-gray-800 text-gray-200 border-b border-gray-700"
                                        placeholder="Buscar responsable..."
                                        value={busquedaResponsable}
                                        onChange={(e) => setBusquedaResponsable(e.target.value)}
                                    />

                                    {usuariosFiltrados.length ? (
                                        usuariosFiltrados.map((u: any) => (
                                            <div
                                                key={u.id}
                                                onClick={() => {
                                                    setTarea({ ...tarea, asignado_id: u.id });
                                                    setOpenResponsable(false);
                                                    setBusquedaResponsable("");
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-[#2970E8] cursor-pointer"
                                            >
                                                {u.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-gray-500 text-sm">
                                            Sin resultados
                                        </div>
                                    )}
                                </div>
                            )}

                            <InputError message={errors.asignado_id} className="mt-2" />
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between pt-6 border-t border-gray-800">
                            <button
                                className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-lime-300"
                                disabled={processing}
                            >
                                {processing ? "Creando..." : "CREAR TAREA"}
                            </button>

                            <Link
                                href={route("tareas.index")}
                                className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>

                <ModalMensaje
                    visible={modal.visible}
                    tipo={modal.tipo as any}
                    mensaje={modal.mensaje}
                    onClose={closeModal}
                />
            </section>
        </AuthenticatedLayout>
    );
}
