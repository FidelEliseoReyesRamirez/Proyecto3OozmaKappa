import RedButton from '@/Components/RedButton';
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

        if (auth.user.id === id && rol === 'admin' && (modal.type === 'estado' || modal.type === 'eliminar')) {
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
        <AuthenticatedLayout
            header={<h2 className="text-xl font-extrabold leading-tight text-[#B3E10F] tracking-wider">GESTIÓN DE USUARIOS</h2>}
        >
            <Head title="Usuarios" />

            <div className="py-6 max-w-7xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-[#0B1120] p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-800/80">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 border-b border-gray-700 pb-4">
                        <h3 className="font-bold text-2xl text-white">Lista de Usuarios Activos</h3>
                        <div className="flex gap-2">
                            <Link
                                href={route('users.create')}
                                className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                            >
                                Crear nuevo usuario
                            </Link>
                            <Link
                                href={route('users.eliminados')}
                                className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                            >
                                Ver eliminados
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-[#080D15] border border-gray-700 rounded-lg">
                        <table className="w-full border-collapse text-sm text-gray-200">
                            <thead>
                                <tr className="bg-[#2970E8] text-white text-center shadow-lg shadow-[#2970E8]/20">
                                    <th className="p-3 border border-blue-700">Nombre</th>
                                    <th className="p-3 border border-blue-700">Correo</th>
                                    <th className="p-3 border border-blue-700">Celular</th>
                                    <th className="p-3 border border-blue-700">Rol</th>
                                    <th className="p-3 border border-blue-700">Estado</th>
                                    <th className="p-3 border border-blue-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u: any) => (
                                    <tr
                                        key={u.id}
                                        className="text-center bg-[#080D15] hover:bg-gray-800/70 transition duration-150 border-t border-gray-800"
                                    >
                                        <td className="p-2 border border-gray-800 font-semibold">{u.name} {u.apellido}</td>
                                        <td className="p-2 border border-gray-800 text-gray-400 font-mono text-xs">{u.email}</td>
                                        <td className="p-2 border border-gray-800 text-gray-500">{u.telefono}</td>
                                        <td className="p-2 border border-gray-800">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                u.rol === 'admin' ? 'bg-red-800 text-red-100' :
                                                u.rol === 'cliente' ? 'bg-[#B3E10F]/20 text-[#B3E10F]' :
                                                'bg-[#2970E8]/30 text-[#2970E8]'
                                            }`}>
                                                {u.rol}
                                            </span>
                                        </td>
                                        <td className="p-2 border border-gray-800">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                u.estado === 'activo' ? 'bg-green-700 text-green-100' : 'bg-gray-500 text-white'
                                            }`}>
                                                {u.estado}
                                            </span>
                                        </td>
                                        <td className="p-2 border border-gray-800 space-x-1 sm:space-x-2">
                                            <Link
                                                href={route('users.edit', u.id)}
                                                className="bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => openModal('estado', u)}
                                                className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 ${
                                                    u.estado === 'activo' ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'
                                                } text-white`}
                                            >
                                                {u.estado === 'activo' ? 'Desactivar arreglar' : 'Activar arreglar'}
                                            </button>
                                            <button
                                                onClick={() => openModal('eliminar', u)}
                                                className="bg-gray-700 text-red-400 px-2 py-1 rounded-md hover:bg-gray-600 transition duration-150 text-xs sm:text-sm font-medium border border-transparent hover:border-red-400"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {modal.type && modal.type !== 'error' && modal.type !== 'errorSelf' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className="bg-[#0B1120] rounded-xl shadow-2xl max-w-md w-full p-6 text-white border border-gray-700">
                            <h2 className="text-xl font-bold mb-4 text-[#B3E10F]">
                                {modal.type === 'estado' ? 'Cambiar Estado' : 'Confirmar Eliminación'}
                            </h2>
                            <p className="mb-6 text-gray-300">
                                ¿Seguro que deseas {modal.type === 'estado' ? 'cambiar el estado de' : 'eliminar'} <strong className="text-[#B3E10F]">{modal.user?.email}</strong>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-150 font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modal.type === 'error' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className="bg-[#0B1120] rounded-xl shadow-2xl max-w-md w-full p-6 text-white border border-red-700">
                            <h2 className="text-xl font-bold mb-4 text-red-500">Acción no permitida</h2>
                            <p className="mb-6 text-gray-300">
                                No se puede eliminar o desactivar al **último administrador activo** restante.
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-blue-600 transition duration-150 font-semibold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modal.type === 'errorSelf' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className="bg-[#0B1120] rounded-xl shadow-2xl max-w-md w-full p-6 text-white border border-red-700">
                            <h2 className="text-xl font-bold mb-4 text-red-500">Error de Seguridad</h2>
                            <p className="mb-6 text-gray-300">
                                No puedes desactivar ni eliminar tu **propio usuario de administrador** mientras estás conectado.
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-blue-600 transition duration-150 font-semibold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
