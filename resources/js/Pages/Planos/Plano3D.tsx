import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
  planoId: number;
}

const Plano3D: React.FC = () => {
  const { planoId } = usePage<Props>().props;

  useEffect(() => {
    console.log("📤 Enviando mensaje a Unity...");

    // Esperar 1.5s para asegurar que Unity ya está cargado
    const timer = setTimeout(() => {
      const iframe = document.querySelector("iframe");

      if (!iframe) {
        console.error("❌ No se encontró el iframe de Unity");
        return;
      }

      iframe.contentWindow?.postMessage(
        {
          type: "LOAD_MODEL",
          id: planoId,
        },
        "*"
      );

      console.log("✅ Mensaje enviado a Unity:", { type: "LOAD_MODEL", id: planoId });
    }, 1500);

    return () => clearTimeout(timer);
  }, [planoId]);

  return (
    <AuthenticatedLayout>
      <Head title={`Visor 3D - Plano ${planoId}`} />
      <div className="py-12 flex justify-center">
        <iframe
          src="/unity-viewer/index.html"
          title="Unity 3D Viewer"
          className="w-[90%] h-[80vh] border border-gray-700 rounded-lg shadow-lg"
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Plano3D;
