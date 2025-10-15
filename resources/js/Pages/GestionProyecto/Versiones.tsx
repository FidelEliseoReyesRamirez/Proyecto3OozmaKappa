import { Link, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Versiones() {
    const { proyecto, versionesProyecto, versionesBim } = usePage().props as any;

    return (
        <section className="flex justify-center items-start mt-10 bg-black min-h-screen">
            <div className="w-full max-w-5xl bg-[#0B1120] rounded-lg shadow-lg p-8 text-white border border-white mt-5">
                <h2 className="text-lg font-medium text-[#2970E8] mb-4">
                    Historial del proyecto — {proyecto.nombre}
                </h2>

                {/* VERSIONES DE PROYECTO */}
                <h3 className="text-[#B3E10F] text-md mb-3">Versiones del Proyecto</h3>
                {versionesProyecto.length > 0 ? (
                    <table className="min-w-full bg-[#0B1120] rounded-lg mb-8">
                        <thead>
                            <tr className="text-[#B3E10F] text-left border-b border-gray-700">
                                <th className="p-3">Versión</th>
                                <th className="p-3">Autor</th>
                                <th className="p-3">Descripción del cambio</th>
                                <th className="p-3">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versionesProyecto.map((v: any) => (
                                <tr key={v.id} className="border-b border-gray-800">
                                    <td className="p-3">{v.version}</td>
                                    <td className="p-3">{v.autor?.name ?? "—"}</td>
                                    <td className="p-3">{v.descripcion_cambio}</td>
                                    <td className="p-3">
                                        {new Date(v.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-400 mb-8">
                        No hay versiones registradas del proyecto.
                    </p>
                )}

                {/* VERSIONES BIM */}
                <h3 className="text-[#B3E10F] text-md mb-3">Versiones BIM</h3>
                {versionesBim.length > 0 ? (
                    <table className="min-w-full bg-[#0B1120] rounded-lg">
                        <thead>
                            <tr className="text-[#B3E10F] text-left border-b border-gray-700">
                                <th className="p-3">Versión</th>
                                <th className="p-3">Archivo</th>
                                <th className="p-3">Autor</th>
                                <th className="p-3">Fecha subida</th>
                                <th className="p-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versionesBim.map((v: any) => (
                                <tr key={v.id} className="border-b border-gray-800">
                                    <td className="p-3">{v.version}</td>
                                    <td className="p-3">{v.nombre}</td>
                                    <td className="p-3">{v.subido_por?.name ?? "—"}</td>
                                    <td className="p-3">{new Date(v.fecha_subida).toLocaleString()}</td>
                                    <td className="p-3">
                                        <a
                                            href={`/storage/${v.archivo_url}`}
                                            target="_blank"
                                            className="text-[#2970E8] hover:underline"
                                        >
                                            Descargar
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-400">No hay archivos BIM aún.</p>
                )}

                <div className="mt-6 flex justify-end">
                    <Link href={route("proyectos.index")}>
                        <PrimaryButton>Volver</PrimaryButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
