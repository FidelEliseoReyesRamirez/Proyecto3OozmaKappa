import { Link, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Versiones() {
    const { proyecto, versionesProyecto, versionesBim } = usePage().props as any;

    return (
        // Fondo principal ultra oscuro (casi negro)
        <section className="flex justify-center items-start pt-12 bg-gray-950 min-h-screen">
            {/* Contenedor principal con fondo muy oscuro y borde metálico */}
            <div className="w-full max-w-6xl bg-[#080D15] rounded-xl shadow-2xl p-8 text-white border border-gray-800/80">
                
                {/* Encabezado del Historial */}
                <header className="mb-8 border-b border-gray-700 pb-4">
                    <h2 className="text-3xl font-extrabold text-[#2970E8] tracking-wider">
                        HISTORIAL DE VERSIONES
                    </h2>
                    <p className="text-lg text-white/80 mt-1">
                        Proyecto: <span className="font-semibold text-[#B3E10F]">{proyecto.nombre}</span>
                    </p>
                </header>

                {/* VERSIONES DE PROYECTO (Metadatos) */}
                <h3 className="text-xl font-semibold text-[#B3E10F] mb-4">
                    Metadatos del Proyecto
                </h3>
                {versionesProyecto.length > 0 ? (
                    <div className="overflow-x-auto mb-10 border border-gray-800 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Versión</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Autor</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Descripción del cambio</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {versionesProyecto.map((v: any) => (
                                    <tr key={v.id} className="hover:bg-gray-800/50 transition duration-150">
                                        <td className="p-4 font-bold text-[#B3E10F]">{v.version}</td>
                                        <td className="p-4 text-gray-300">{v.autor?.name ?? "Sistema"}</td>
                                        <td className="p-4 text-gray-400 max-w-md">{v.descripcion_cambio}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(v.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic mb-10">
                        No se ha registrado el historial de versiones de los metadatos del proyecto.
                    </p>
                )}
                
                {/* -------------------------------------------------------------------------- */}
                
                {/* VERSIONES BIM (Archivos) */}
                <h3 className="text-xl font-semibold text-[#2970E8] mb-4">
                    Archivos BIM (Modelos Digitales)
                </h3>
                {versionesBim.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-800 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Versión</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Archivo</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Autor</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Fecha subida</th>
                                    <th className="p-4 text-left text-sm font-medium text-gray-400">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {versionesBim.map((v: any) => (
                                    <tr key={v.id} className="hover:bg-gray-800/50 transition duration-150">
                                        <td className="p-4 font-bold text-[#2970E8]">{v.version}</td>
                                        <td className="p-4 text-gray-300 font-mono text-sm">{v.nombre}</td>
                                        <td className="p-4 text-gray-400">{v.subido_por?.name ?? "—"}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(v.fecha_subida).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <a
                                                href={`/storage/${v.archivo_url}`}
                                                target="_blank"
                                                className="inline-flex items-center text-[#B3E10F] hover:text-lime-300 font-medium transition duration-150 border-b border-[#B3E10F] hover:border-lime-300"
                                            >
                                                Descargar
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay archivos BIM aún registrados.</p>
                )}

                {/* Botón Volver */}
                <div className="mt-8 flex justify-end">
                    <Link href={route("proyectos.index")}>
                        {/* El botón primario usa los colores DevelArq */}
                        <PrimaryButton className="bg-[#2970E8] hover:bg-indigo-600 focus:bg-indigo-600 active:bg-indigo-700 shadow-md shadow-[#2970E8]/30">Volver a Proyectos</PrimaryButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}