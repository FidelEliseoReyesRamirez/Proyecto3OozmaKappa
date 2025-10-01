import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props as any; 
    const rol = auth?.user?.rol;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 text-gray-900">

                        <p>Bienvenido, {auth.user.name} 👋</p>
                        <p>Tu rol es: <strong>{rol}</strong></p>

                        {rol === 'admin' && (
                            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
                                <h3 className="font-bold">Sección de administración</h3>
                                <p>Aquí van las opciones exclusivas para administradores.</p>
                            </div>
                        )}

                        {rol === 'arquitecto' && (
                            <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
                                <h3 className="font-bold">Sección de arquitectos</h3>
                                <p>Opciones exclusivas para arquitectos.</p>
                            </div>
                        )}

                        {rol === 'ingeniero' && (
                            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
                                <h3 className="font-bold">Sección de ingenieros</h3>
                                <p>Opciones exclusivas para ingenieros.</p>
                            </div>
                        )}

                        {rol === 'cliente' && (
                            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                                <h3 className="font-bold">Sección de clientes</h3>
                                <p>Opciones exclusivas para clientes.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
