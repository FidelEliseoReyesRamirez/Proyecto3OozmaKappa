import { useForm, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function HitosCreate({ proyecto }: any) {
    const { data, setData, post, processing } = useForm({
        nombre: "",
        fecha_hito: "",
        descripcion: "",
        estado: "pendiente",
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route("hitos.store", proyecto.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nuevo Hito" />

            <section className="min-h-screen bg-[#0A0F1E] py-10 px-6 text-white">
                <div className="max-w-3xl mx-auto">

                    <h2 className="text-4xl font-extrabold mb-8 text-purple-400 tracking-wide drop-shadow-lg">
                        Nuevo Hito – {proyecto.nombre}
                    </h2>

                    <form
                        onSubmit={submit}
                        className="bg-[#0F152A] p-8 rounded-2xl border border-gray-700 shadow-xl shadow-black/40 space-y-6"
                    >
                        <div>
                            <label className="text-sm font-semibold text-gray-300">
                                Nombre del hito
                            </label>
                            <input
                                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mt-1"
                                value={data.nombre}
                                onChange={(e) => setData("nombre", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-300">
                                Fecha del hito
                            </label>
                            <input
                                type="date"
                                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mt-1"
                                value={data.fecha_hito}
                                onChange={(e) => setData("fecha_hito", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-300">
                                Estado
                            </label>
                            <select
                                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mt-1"
                                value={data.estado}
                                onChange={(e) => setData("estado", e.target.value)}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="en progreso">En progreso</option>
                                <option value="completado">Completado</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-300">Descripción</label>
                            <textarea
                                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mt-1 min-h-[120px]"
                                value={data.descripcion}
                                onChange={(e) => setData("descripcion", e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <Link
                                href={route("hitos.index", proyecto.id)}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm shadow shadow-gray-900/40 transition"
                            >
                                Volver
                            </Link>

                            <button
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-purple-900/40 transition"
                            >
                                Guardar Hito
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
