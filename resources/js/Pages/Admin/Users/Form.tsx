// resources/js/Pages/UserForm.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

type UserFormData = {
    name: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: string;
};

export default function UserForm({ isEdit = false }: { isEdit?: boolean }) {
    const { user, auth } = usePage().props as any;
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data, setData, post, patch } = useForm<UserFormData>({
        name: user?.name || '',
        apellido: user?.apellido || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        rol: user?.rol || 'cliente',
    });

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        // Nombre
        if (!data.name.trim()) errors.name = "El nombre es obligatorio.";
        else if (/^\s/.test(data.name)) errors.name = "El nombre no puede iniciar con espacio.";
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.name)) errors.name = "Solo letras y espacios.";
        else if (data.name.length > 30) errors.name = "Máximo 30 caracteres.";

        // Apellido
        if (!data.apellido.trim()) errors.apellido = "El apellido es obligatorio.";
        else if (/^\s/.test(data.apellido)) errors.apellido = "El apellido no puede iniciar con espacio.";
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.apellido)) errors.apellido = "Solo letras y espacios.";
        else if (data.apellido.length > 30) errors.apellido = "Máximo 30 caracteres.";

        // Email
        if (!data.email.trim()) errors.email = "El correo es obligatorio.";
        else if (!/^[\w.-]+@gmail\.com$/.test(data.email)) errors.email = "Debe ser un correo Gmail válido.";

        // Teléfono
        if (!data.telefono) errors.telefono = "El teléfono es obligatorio.";
        else if (!/^\d+$/.test(data.telefono)) errors.telefono = "Solo números.";
        else if (data.telefono.length < 7 || data.telefono.length > 10) errors.telefono = "Entre 7 y 10 dígitos.";

        // Rol
        if (!data.rol) errors.rol = "El rol es obligatorio.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setErrorMsg(null);

        if (isEdit) patch(route('users.update', user.id));
        else post(route('users.store'));
    };

    const isSelf = isEdit && auth.user.id === user?.id;

    const getInputClasses = (field: keyof UserFormData) => {
        return "w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B3E10F] focus:border-[#B3E10F]";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    {isEdit ? 'Editar usuario' : 'Crear usuario'}
                </h2>
            }
        >
            <Head title={isEdit ? "Editar usuario" : "Crear usuario"} />

            <div className="py-6 max-w-4xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-[#1D3557] border border-white p-6 shadow-2xl rounded-xl">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value.slice(0, 30))} maxLength={30} placeholder="Nombre" className={getInputClasses('name')}/>
                            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
                        </div>

                        {/* Apellido */}
                        <div>
                            <input type="text" value={data.apellido} onChange={e => setData('apellido', e.target.value.slice(0, 30))} maxLength={30} placeholder="Apellido" className={getInputClasses('apellido')}/>
                            {fieldErrors.apellido && <p className="text-red-500 text-sm mt-1">{fieldErrors.apellido}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Correo (solo Gmail)" className={getInputClasses('email')}/>
                            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))} placeholder="Teléfono" maxLength={10} className={getInputClasses('telefono')}/>
                            {fieldErrors.telefono && <p className="text-red-500 text-sm mt-1">{fieldErrors.telefono}</p>}
                        </div>

                        {/* Rol */}
                        <div>
                            <select value={data.rol} onChange={e => setData('rol', e.target.value)} className={getInputClasses('rol')} disabled={isSelf}>
                                <option value="">Seleccionar rol</option>
                                <option value="admin">Admin</option>
                                <option value="arquitecto">Arquitecto</option>
                                <option value="ingeniero">Ingeniero</option>
                                <option value="cliente">Cliente</option>
                            </select>
                            {fieldErrors.rol && <p className="text-red-500 text-sm mt-1">{fieldErrors.rol}</p>}
                            {isSelf && <p className="text-sm text-yellow-300 mt-1">⚠️ No puedes cambiar tu propio rol.</p>}
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button type="submit" className="bg-[#B3E10F] text-black font-semibold px-6 py-2 rounded-lg transition duration-200 hover:bg-[#8aab13]">
                                {isEdit ? 'Actualizar' : 'Registrar'}
                            </button>
                            <Link href={route('users.index')} className="bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 hover:bg-gray-700 flex items-center justify-center">
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal de error */}
            {errorMsg && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-t-4 border-[#B3E10F]">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Error de validación</h2>
                        <p className="mb-4 text-base text-gray-700">{errorMsg}</p>
                        <div className="flex justify-end">
                            <button onClick={() => setErrorMsg(null)} className="px-5 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-[#1D3557] font-medium transition">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
