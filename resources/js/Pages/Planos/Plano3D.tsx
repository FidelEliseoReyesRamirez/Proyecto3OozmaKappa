import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types'; // 👈 importa esto

interface Props extends PageProps {
  planoId: number;
}

const Plano3D: React.FC = () => {
  const { planoId } = usePage<Props>().props;

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
