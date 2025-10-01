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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Usuarios Eliminados</h2>}>
            <Head title="Usuarios eliminados" />

            <div className="py-6 max-w-7xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-white p-4 sm:p-6 shadow rounded mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                        <h3 className="font-bold text-lg">Usuarios eliminados</h3>
                        <Link href={route('users.index')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">
                            Volver a usuarios
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th className="p-2 border">Nombre</th>
                                    <th className="p-2 border">Correo</th>
                                    <th className="p-2 border">Rol</th>
                                    <th className="p-2 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u: any) => (
                                    <tr key={u.id} className="text-center hover:bg-gray-50">
                                        <td className="p-2 border">{u.name} {u.apellido}</td>
                                        <td className="p-2 border">{u.email}</td>
                                        <td className="p-2 border">{u.rol}</td>
                                        <td className="p-2 border">
                                            <button onClick={() => confirmRestaurar(u.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
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
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded shadow-lg max-w-md w-full p-6">
                            <h2 className="text-lg font-bold mb-4">Restaurar usuario</h2>
                            <p className="mb-4 text-sm text-gray-700">¿Seguro que deseas restaurar este usuario?</p>
                            <div className="flex justify-end gap-2">
                                <button onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                                <button onClick={restore} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Restaurar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
