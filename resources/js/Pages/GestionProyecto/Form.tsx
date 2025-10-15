import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
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
        post(route("proyectos.store"));
    };

    return (
        <section className="flex justify-center items-start mt-10 bg-black min-h-screen">
            <div className="w-full max-w-3xl bg-[#0B1120] p-8 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium text-[#2970E8]">
                    {proyecto ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
                </h2>
                <p className="mt-1 text-sm text-[#B3E10F]">
                    Rellena la información del proyecto y adjunta el plano BIM inicial.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" className="text-white" />
                        <TextInput
                            id="nombre"
                            className="mt-1 block w-full"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>

                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción del proyecto" className="text-white" />
                        <TextInput
                            id="descripcion"
                            className="mt-1 block w-full"
                            value={data.descripcion}
                            onChange={(e) => setData("descripcion", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.descripcion} />
                    </div>

                    <div>
                        <InputLabel htmlFor="cliente" value="Cliente Asociado" className="text-white" />
                        <select
                            id="cliente"
                            className="mt-1 block w-full bg-[#0B1120] text-white border border-gray-600 rounded-md"
                            value={data.cliente_id}
                            onChange={(e) => setData("cliente_id", e.target.value)}
                        >
                            <option value="">Seleccione...</option>
                            {clientes.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.cliente_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="responsable" value="Responsable" className="text-white" />
                        <select
                            id="responsable"
                            className="mt-1 block w-full bg-[#0B1120] text-white border border-gray-600 rounded-md"
                            value={data.responsable_id}
                            onChange={(e) => setData("responsable_id", e.target.value)}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {responsables.map((r: any) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.responsable_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="fecha_inicio" value="Fecha de inicio" className="text-white" />
                        <TextInput
                            id="fecha_inicio"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.fecha_inicio}
                            onChange={(e) => setData("fecha_inicio", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.fecha_inicio} />
                    </div>

                    <div>
                        <InputLabel htmlFor="archivo_bim" value="Archivo BIM inicial" className="text-white" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            className="mt-1 block w-full text-white"
                            onChange={(e) => setData("archivo_bim", e.target.files?.[0] || null)}
                        />
                        <InputError className="mt-2" message={errors.archivo_bim} />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <PrimaryButton disabled={processing}>Guardar Proyecto</PrimaryButton>
                        <Link
                            href={route("proyectos.index")}
                            className="text-[#B3E10F] hover:underline"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
