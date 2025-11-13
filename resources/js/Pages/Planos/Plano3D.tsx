// resources/js/Pages/Planos/Plano3D.tsx

import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    planoId: number;
}

const Plano3D: React.FC = () => {

    // 🔇 Desactivar logs SOLO aquí (evita ruido del UnityLoader)
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};

    const { planoId } = usePage<Props>().props;

    useEffect(() => {
        const timer = setTimeout(() => {
            const iframe = document.querySelector("iframe");

            if (!iframe) return;

            // Enviar ID al Unity Viewer
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

            <div className="py-12 flex justify-center">
                <iframe
                    src="/unity-viewer/index.html"
                    title="Unity 3D Viewer"
                    className="w-[92%] h-[80vh] border border-gray-700 rounded-xl shadow-lg shadow-black/40 bg-black"
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Plano3D;
