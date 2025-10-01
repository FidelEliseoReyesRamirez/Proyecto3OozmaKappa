import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UsersEliminados() {
    const { usuarios } = usePage().props as any;
    const [userId, setUserId] = useState<number | null>(null);

    const confirmRestaurar = (id: number) => setUserId(id);
    const closeModal = () => setUserId(null);
    const restore = () => {
        if (userId) {
            router.patch(route('users.restaurar', userId));
            closeModal();
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-white">Usuarios Eliminados</h2>}>
            <Head title="Usuarios eliminados" />

            <div className="py-6 max-w-7xl mx-auto sm:px-4 lg:px-8">
                
                <div className="bg-black border border-gray-800 p-4 sm:p-6 shadow-2xl rounded-xl mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                        <h3 className="font-bold text-lg text-white">Usuarios eliminados</h3>
                        
                        <Link 
                            href={route('users.index')} 
                            className="bg-[#2970E8] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150 text-sm font-semibold shadow-md"
                        >
                            Volver a usuarios
                        </Link>
                    </div>

                    <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg">
                        <table className="w-full border-collapse text-sm text-gray-200">
                            <thead>
                                <tr className="bg-[#2970E8] text-white text-center shadow-lg">
                                    <th className="p-3 border border-blue-700">Nombre</th>
                                    <th className="p-3 border border-blue-700">Correo</th>
                                    <th className="p-3 border border-blue-700">Rol</th>
                                    <th className="p-3 border border-blue-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u: any) => (
                                    <tr 
                                        key={u.id} 
                                        className="text-center bg-gray-900 hover:bg-gray-800 transition duration-150"
                                    >
                                        <td className="p-2 border border-gray-800">{u.name} {u.apellido}</td>
                                        <td className="p-2 border border-gray-800">{u.email}</td>
                                        <td className="p-2 border border-gray-800">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                u.rol === 'admin' ? 'bg-red-800 text-red-100' : 
                                                u.rol === 'cliente' ? 'bg-[#B3E10F]/20 text-[#B3E10F]' :
                                                'bg-indigo-800 text-indigo-100'
                                            }`}>
                                                {u.rol}
                                            </span>
                                        </td>
                                        <td className="p-2 border border-gray-800">
                                            <button 
                                                onClick={() => confirmRestaurar(u.id)} 
                                                className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-150 text-sm font-medium"
                                            >
                                                Restaurar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {userId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 text-white border border-gray-700">
                            <h2 className="text-xl font-bold mb-4 text-[#2970E8]">Restaurar usuario</h2>
                            <p className="mb-6 text-gray-300">¿Seguro que deseas restaurar este usuario?</p>
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={closeModal} 
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-150 font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={restore} 
                                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition duration-150 font-semibold"
                                >
                                    Restaurar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}