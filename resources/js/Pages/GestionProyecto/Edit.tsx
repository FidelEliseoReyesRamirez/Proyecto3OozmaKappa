import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { router, Link, Head } from "@inertiajs/react";
import ConfirmModal from "@/Components/ConfirmModal";

export default function Edit({ proyecto, clientes, responsables }: any) {
    const nombre = proyecto.nombre || "";
    const cliente_id = String(proyecto.cliente_id ?? "");
    const fecha_inicio = proyecto.fecha_inicio
        ? new Date(proyecto.fecha_inicio).toISOString().split("T")[0]
        : "";

    const [descripcion, setDescripcion] = useState(proyecto.descripcion || "");
    const [responsable_id, setResponsableId] = useState(String(proyecto.responsable_id ?? ""));
    const [archivoBim, setArchivoBim] = useState<File | null>(null);
    const [mantenerArchivo, setMantenerArchivo] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);
    const [localErrors, setLocalErrors] = useState<{ descripcion?: string; archivo_bim?: string }>({});

    const inputFieldStyles =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    // 🧠 Validar descripción igual que en "crear"
    const validateDescripcion = (value: string) => {
        const clean = value.replace(/\s+/g, " ").trimStart();
        if (/[^A-Z0-9 ]/i.test(clean)) {
            setLocalErrors({
                descripcion: "Solo se permiten letras y números, sin símbolos o paréntesis.",
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

    const validateFile = (file: File | null) => {
        if (!file) return;
        const validExt = [".bim", ".ifc"];
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!validExt.includes(ext) || file.size > 256 * 1024 * 1024) {
            setLocalErrors({
                archivo_bim: "Archivo inválido. Solo se permiten .bim o .ifc menores a 256 MB.",
            });
            setArchivoBim(null);
        } else {
            setLocalErrors({ archivo_bim: "" });
            setArchivoBim(file);
        }
    };
    const validateBeforeSubmit = () => {
        const errs: any = {};

        if (!responsable_id) errs.responsable_id = "Debe seleccionar un responsable.";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;
        if (!validateBeforeSubmit()) return;
        setProcessing(true);
        setErrors({});

        const fd = new FormData();
        fd.append("_method", "PATCH");
        fd.append("nombre", nombre);
        fd.append("descripcion", descripcion ?? "");
        fd.append("cliente_id", cliente_id);
        fd.append("responsable_id", responsable_id ?? "");
        fd.append("fecha_inicio", fecha_inicio ?? "");

        if (archivoBim && !mantenerArchivo) {
            fd.append("archivo_bim", archivoBim);
        } else if (mantenerArchivo) {
            fd.append("mantener_archivo", "true");
        }

        router.post(route("proyectos.update", proyecto.id), fd, {
            onError: (errs: any) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleCheckboxChange = () => {
        // Si ya subió un archivo nuevo, preguntar antes de sobreescribirlo
        if (archivoBim) {
            setModalOpen(true);
        } else {
            setMantenerArchivo(!mantenerArchivo);
        }
    };

    const handleConfirmMantener = () => {
        setMantenerArchivo(true);
        setArchivoBim(null); // descartar archivo nuevo
        setModalOpen(false);
    };

    const handleCancelMantener = () => {
        setModalOpen(false);
    };

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950">
            <Head title="DEVELARQ | Editar Proyecto" />
            <ConfirmModal
                open={modalOpen}
                onClose={handleCancelMantener}
                onConfirm={handleConfirmMantener}
                message="Marcar esta opción hará que el nuevo documento BIM no se guarde y se mantenga el antiguo. ¿Deseas continuar?"
                confirmText="Mantener antiguo"
                cancelText="Cancelar"
            />

            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-xl shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    EDITAR PROYECTO
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    Actualiza la información del proyecto o sube una nueva versión BIM.
                </p>

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    {/* Nombre y Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-gray-700">
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="nombre" value="Nombre del Proyecto" />
                            <TextInput
                                id="nombre"
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 cursor-not-allowed"
                                value={nombre}
                                disabled
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                El nombre y el cliente se establecen al crear el proyecto.
                            </p>
                        </div>

                        <div>
                            <InputLabel htmlFor="cliente" value="Cliente Asociado" />
                            <select
                                id="cliente"
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                                value={cliente_id}
                                disabled
                            >
                                <option>
                                    {clientes.find((c: any) => c.id == cliente_id)?.name || "N/A"}
                                </option>
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" />
                            <TextInput
                                id="fecha_inicio"
                                type="date"
                                className="mt-1 block w-full bg-gray-700/50 border-gray-700 text-gray-400 cursor-not-allowed"
                                value={fecha_inicio}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción (Editable)" />
                        <textarea
                            id="descripcion"
                            className={inputFieldStyles}
                            rows={3}
                            value={descripcion}
                            onChange={(e) => setDescripcion(validateDescripcion(e.target.value))}
                            placeholder="Actualiza la descripción del proyecto."
                        />
                        <InputError message={localErrors.descripcion || errors.descripcion} />
                    </div>

                    {/* Responsable */}
                    <div>
                        <InputLabel htmlFor="responsable" value="Responsable Principal" />
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
                        <InputError message={errors.responsable_id} className="mt-2 text-red-400" />
                    </div>

                    {/* Archivo BIM */}
                    <div className="pt-4 border-t border-gray-700">
                        <InputLabel htmlFor="archivo_bim" value="Nueva Versión BIM (Opcional)" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            onChange={(e) => validateFile(e.target.files?.[0] ?? null)}
                            disabled={mantenerArchivo}
                            className={`mt-1 block w-full text-sm text-gray-300 transition duration-150 cursor-pointer ${mantenerArchivo
                                ? "opacity-50 cursor-not-allowed"
                                : "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2970E8] file:text-white hover:file:bg-indigo-600"
                                }`}
                        />
                        <InputError message={localErrors.archivo_bim || errors.archivo_bim} />
                    </div>

                    {/* Checkbox Mantener */}
                    <div className="mt-3 flex items-center space-x-2">
                        <input
                            id="mantener_archivo"
                            type="checkbox"
                            checked={mantenerArchivo}
                            onChange={handleCheckboxChange}
                            className="accent-[#2970E8]"
                        />
                        <label htmlFor="mantener_archivo" className="text-sm text-gray-400">
                            Mantener el documento BIM anterior
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <button
                            className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                            disabled={processing}
                        >
                            {processing ? "Actualizando..." : "GUARDAR CAMBIOS"}
                        </button>
                        <Link
                            href={route("proyectos.index")}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold text-white transition duration-150"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
