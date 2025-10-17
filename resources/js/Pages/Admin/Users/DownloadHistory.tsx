// resources/js/Pages/Admin/DownloadHistory.tsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface DownloadRecord {
    id: number;
    documento_nombre: string;
    proyecto_nombre: string;
    usuario_descarga: string;
    downloaded_at: string;
}

interface DownloadHistoryProps {
    history: DownloadRecord[]; 
}

export default function DownloadHistory({ history }: DownloadHistoryProps) {
    
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-white">Historial de Descargas (Admin)</h2>}
        >
            <Head title="Historial de Descargas (Admin)" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl overflow-hidden">
                        <h1 className="text-3xl font-extrabold text-[#B3E10F] mb-6">
                            Historial Global de Descargas
                        </h1>

                        {history.length === 0 ? (
                            <p className="text-gray-400">No se ha registrado ninguna descarga en el sistema.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr className="text-gray-400 uppercase tracking-wider text-sm">
                                            <th className="px-6 py-3 text-left">Fecha/Hora Descarga</th>
                                            <th className="px-6 py-3 text-left">Usuario</th>
                                            <th className="px-6 py-3 text-left">Documento</th>
                                            <th className="px-6 py-3 text-left">Proyecto Asociado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {history.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-700 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                                                    {record.downloaded_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {record.usuario_descarga}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                    {record.documento_nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                    {record.proyecto_nombre}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}