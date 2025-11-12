import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
  planoId: number;
}

const Plano3D: React.FC = () => {

  // 🔇 Desactivar todo tipo de logs SOLO en este componente
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  
  const { planoId } = usePage<Props>().props;

  useEffect(() => {

    const timer = setTimeout(() => {
      const iframe = document.querySelector("iframe");

      if (!iframe) {
        return; // no logs
      }

      iframe.contentWindow?.postMessage(
        {
          type: "LOAD_MODEL",
          id: planoId,
        },
        "*"
      );

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
