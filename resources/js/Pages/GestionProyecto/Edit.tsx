// resources/js/Pages/Proyectos/Edit.tsx
import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/react";

export default function Edit({ proyecto, clientes, responsables }: any) {
    // Usamos estado local en vez de useForm para controlar exactamente lo que enviamos.
    const [nombre] = useState(proyecto.nombre || "");
    const [descripcion, setDescripcion] = useState(proyecto.descripcion || "");
    const [cliente_id] = useState(String(proyecto.cliente_id ?? ""));
    const [responsable_id, setResponsableId] = useState(String(proyecto.responsable_id ?? ""));
    const [fecha_inicio] = useState(proyecto.fecha_inicio || "");
    const [archivoBim, setArchivoBim] = useState<File | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const fd = new FormData();
        // Laravel espera PATCH -> lo enviamos como override
        fd.append("_method", "PATCH");
        fd.append("nombre", nombre);
        fd.append("descripcion", descripcion ?? "");
        fd.append("cliente_id", cliente_id);
        fd.append("responsable_id", responsable_id ?? "");
        fd.append("fecha_inicio", fecha_inicio ?? "");
        if (archivoBim) fd.append("archivo_bim", archivoBim);

        Inertia.post(route("proyectos.update", proyecto.id), fd, {
            headers: { "Content-Type": "multipart/form-data" },
            onError: (errs: any) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <section className="flex justify-center items-start mt-10">
            <div className="w-full max-w-3xl bg-black p-8 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium text-[#2970E8]">Editar Proyecto</h2>
                <p className="mt-1 text-sm text-[#B3E10F]">Actualiza los datos del proyecto o adjunta una nueva versión BIM.</p>

                <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                    {/* Nombre: visible pero no editable */}
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" className="text-white" />
                        <TextInput id="nombre" className="mt-1 block w-full" value={nombre} disabled={true} />
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción" className="text-white" />
                        <textarea
                            id="descripcion"
                            className="mt-1 block w-full bg-[#0B1120] text-white border border-gray-600 rounded-md p-2"
                            rows={3}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Agrega una breve descripción del proyecto..."
                        />
                        <InputError className="mt-2" message={errors.descripcion} />
                    </div>

                    {/* Responsable */}
                    <div>
                        <InputLabel htmlFor="responsable" value="Responsable" className="text-white" />
                        <select
                            id="responsable"
                            className="mt-1 block w-full bg-[#0B1120] text-white border border-gray-600 rounded-md"
                            value={responsable_id}
                            onChange={(e) => setResponsableId(e.target.value)}
                        >
                            <option value="">Seleccione...</option>
                            {responsables.map((r: any) => (
                                <option key={r.id} value={String(r.id)}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.responsable_id} />
                    </div>

                    {/* Archivo BIM */}
                    <div>
                        <InputLabel htmlFor="archivo_bim" value="Nueva versión BIM" className="text-white" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            className="mt-1 block w-full text-white"
                            onChange={(e) => setArchivoBim(e.target.files?.[0] ?? null)}
                        />
                        <InputError className="mt-2" message={errors.archivo_bim} />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <PrimaryButton disabled={processing}>Guardar Cambios</PrimaryButton>
                        <Link href={route("proyectos.index")} className="text-[#B3E10F] hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
