import { useEffect } from "react";

export default function HistorialModal({ open, onClose, historial }: any) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-[#0B1120] border border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-[#2970E8] mb-4 text-center">Historial de Cambios</h3>

                {historial.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="min-w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                            <thead className="bg-gray-800 text-[#B3E10F]">
                                <tr>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-left">Usuario</th>
                                    <th className="p-3 text-left">De</th>
                                    <th className="p-3 text-left">A</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((h: any) => (
                                    <tr key={h.id} className="border-b border-gray-700 hover:bg-gray-800/60">
                                        <td className="p-3">{new Date(h.fecha_cambio).toLocaleString()}</td>
                                        <td className="p-3">{h.usuario?.name || "—"}</td>
                                        <td className="p-3 text-gray-400">{h.estado_anterior}</td>
                                        <td className="p-3 text-[#B3E10F]">{h.estado_nuevo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No hay registros de cambios aún.</p>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#2970E8] hover:bg-indigo-600 rounded-lg font-semibold text-white transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
