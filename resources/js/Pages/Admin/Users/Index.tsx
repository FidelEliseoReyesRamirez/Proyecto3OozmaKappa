import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UsersIndex() {
    const { usuarios, auth } = usePage().props as any;
    const [modal, setModal] = useState<{ type: string; user: any | null }>({ type: '', user: null });

    const openModal = (type: string, user: any) => setModal({ type, user });
    const closeModal = () => setModal({ type: '', user: null });

    const confirmAction = () => {
        if (!modal.user) return;
        const { id, rol } = modal.user;

        const adminsActivos = usuarios.filter((u: any) => u.rol === 'admin' && u.estado === 'activo' && u.eliminado === 0);

        if (rol === 'admin' && adminsActivos.length <= 1) {
            setModal({ type: 'error', user: modal.user });
            return;
        }

        if (auth.user.id === id && rol === 'admin') {
            setModal({ type: 'errorSelf', user: modal.user });
            return;
        }

        if (modal.type === 'estado') {
            router.patch(route('users.updateEstado', id));
        }

        if (modal.type === 'eliminar') {
            router.patch(route('users.eliminar', id));
        }

        closeModal();
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Usuarios</h2>}>
            <Head title="Usuarios" />

            <div className="py-6 max-w-7xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-white p-4 sm:p-6 shadow rounded">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                        <h3 className="font-bold text-lg">Lista de usuarios</h3>
                        <div className="flex gap-2">
                            <Link href={route('users.create')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">
                                Crear nuevo usuario
                            </Link>
                            <Link href={route('users.eliminados')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm">
                                Ver eliminados
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th className="p-2 border">Nombre</th>
                                    <th className="p-2 border">Correo</th>
                                    <th className="p-2 border">Rol</th>
                                    <th className="p-2 border">Estado</th>
                                    <th className="p-2 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u: any) => (
                                    <tr key={u.id} className="text-center hover:bg-gray-50">
                                        <td className="p-2 border">{u.name} {u.apellido}</td>
                                        <td className="p-2 border">{u.email}</td>
                                        <td className="p-2 border">{u.rol}</td>
                                        <td className="p-2 border">{u.estado}</td>
                                        <td className="p-2 border space-x-1 sm:space-x-2">
                                            <Link href={route('users.edit', u.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm">
                                                Editar
                                            </Link>
                                            <button onClick={() => openModal('estado', u)} className={`px-2 py-1 rounded text-xs sm:text-sm ${u.estado === 'activo' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                                                {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                            </button>
                                            <button onClick={() => openModal('eliminar', u)} className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 text-xs sm:text-sm">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modales */}
                {modal.type && modal.type !== 'error' && modal.type !== 'errorSelf' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded shadow-lg max-w-md w-full p-6">
                            <h2 className="text-lg font-bold mb-4">
                                {modal.type === 'estado' ? 'Cambiar estado' : 'Eliminar usuario'}
                            </h2>
                            <p className="mb-4 text-sm text-gray-700">
                                ¿Seguro que deseas {modal.type === 'estado' ? 'cambiar el estado de' : 'eliminar'} <strong>{modal.user?.email}</strong>?
                            </p>
                            <div className="flex justify-end gap-2">
                                <button onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                                <button onClick={confirmAction} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}

                {modal.type === 'error' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded shadow-lg max-w-md w-full p-6">
                            <h2 className="text-lg font-bold mb-4">Acción no permitida</h2>
                            <p className="mb-4 text-sm text-gray-700">No se puede eliminar o desactivar al último administrador activo.</p>
                            <div className="flex justify-end">
                                <button onClick={closeModal} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}

                {modal.type === 'errorSelf' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded shadow-lg max-w-md w-full p-6">
                            <h2 className="text-lg font-bold mb-4">Acción no permitida</h2>
                            <p className="mb-4 text-sm text-gray-700">No puedes desactivar ni eliminar tu propio usuario de administrador.</p>
                            <div className="flex justify-end">
                                <button onClick={closeModal} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
