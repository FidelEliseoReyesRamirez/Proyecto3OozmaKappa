import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    planoId: number;
    galeria: any[];
    proyectoId: number;
}

const Plano3D: React.FC = () => {

    // Mantener Unity call quiet
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};

    const { planoId, galeria } = usePage<Props>().props;

    useEffect(() => {
        const timer = setTimeout(() => {
            const iframe = document.querySelector("iframe");

            if (!iframe) return;

            iframe.contentWindow?.postMessage(
                {
                    type: "LOAD_MODEL",
                    id: planoId,
                },
                "*"
            );
        }, 1200);

        return () => clearTimeout(timer);
    }, [planoId]);

    return (
        <AuthenticatedLayout>
            <Head title={`Visor 3D - Plano ${planoId}`} />

            {/* ============================
                VISOR UNITY
            ============================ */}
            <div className="py-12 flex justify-center">
                <iframe
                    src="/unity-viewer/index.html"
                    title="Unity 3D Viewer"
                    className="w-[92%] h-[80vh] border border-gray-700 rounded-xl shadow-lg shadow-black/40 bg-black"
                />
            </div>

            {/* ============================
                GALERÍA DE IMÁGENES
            ============================ */}
            <div className="max-w-6xl mx-auto mt-10 px-4">
                <h2 className="text-2xl font-bold text-lime-300 mb-6">
                    Galería del Proyecto
                </h2>

                {galeria.length === 0 ? (
                    <p className="text-gray-400 italic">No hay imágenes en la galería.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {galeria.map((img: any) => (
                            <div
                                key={img.id}
                                className="bg-[#0F152A] p-3 rounded-xl border border-gray-700 shadow-md hover:shadow-lg transition"
                            >
                                <img
                                    src={`/storage/${img.archivo_url}`}
                                    alt={img.titulo || "Imagen"}
                                    className="rounded-lg w-full h-40 object-cover"
                                />

                                {img.titulo && (
                                    <p className="text-sm text-center text-gray-300 mt-2">
                                        {img.titulo}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Plano3D;
