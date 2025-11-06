import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props as any; 
    const rol = auth?.user?.rol;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-white">Dashboard</h2>}>
            <Head title="Dashboard" />
            <div className="py-12 bg-[#121212]"> 
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-900 shadow-sm sm:rounded-lg p-6 text-white border-white border">

                        <p>Bienvenido, {auth.user.name} 👋</p>
                        <p className="mt-1">Tu rol es: <strong className="text-[#B3E10F]">{rol}</strong></p>
                        {rol === 'admin' && (
                            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded text-red-100">
                                <h3 className="font-bold text-red-300">Sección de administración</h3>
                                <p>Aquí van las opciones exclusivas para administradores.</p>
                            </div>
                        )}
                        {rol === 'arquitecto' && (
                            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded text-blue-100">
                                <h3 className="font-bold text-blue-300">Sección de arquitectos</h3>
                                <p>Opciones exclusivas para arquitectos.</p>
                            </div>
                        )}
                        {rol === 'ingeniero' && (
                            <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded text-green-100">
                                <h3 className="font-bold text-green-300">Sección de ingenieros</h3>
                                <p>Opciones exclusivas para ingenieros.</p>
                            </div>
                        )}
                        {rol === 'cliente' && (
                            <div className="mt-4 p-4 bg-[#B3E10F]/20 border border-[#B3E10F]/50 rounded text-white">
                                <h3 className="font-bold text-[#B3E10F]">Sección de clientes</h3>
                                <p>Opciones exclusivas para clientes.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}