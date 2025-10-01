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
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data, setData, post, patch } = useForm<UserFormData>({
        name: user?.name || '',
        apellido: user?.apellido || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        rol: user?.rol || 'cliente',
    });

    const validate = (): string | null => {
        if (!data.name.trim()) return "El nombre es obligatorio.";
        if (/^\s/.test(data.name)) return "El nombre no puede iniciar con espacio.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.name)) return "El nombre solo puede contener letras y espacios.";
        if (data.name.length > 50) return "El nombre no puede tener más de 50 caracteres.";

        if (!data.apellido.trim()) return "El apellido es obligatorio.";
        if (/^\s/.test(data.apellido)) return "El apellido no puede iniciar con espacio.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.apellido)) return "El apellido solo puede contener letras y espacios.";
        if (data.apellido.length > 50) return "El apellido no puede tener más de 50 caracteres.";

        if (!/^[\w.-]+@(gmail\.com|hotmail\.com)$/.test(data.email)) return "El correo debe ser Gmail o Hotmail.";

        if (!data.telefono) return "El teléfono es obligatorio.";
        if (!/^\d+$/.test(data.telefono)) return "El teléfono solo puede contener números.";
        if (data.telefono.length < 7 || data.telefono.length > 10) return "El teléfono debe tener entre 7 y 10 dígitos.";

        if (!data.rol) return "El rol es obligatorio.";

        return null;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            setErrorMsg(error);
            return;
        }
        if (isEdit) {
            patch(route('users.update', user.id));
        } else {
            post(route('users.store'));
        }
    };

    const isSelf = isEdit && auth.user.id === user?.id;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-white">{isEdit ? 'Editar usuario' : 'Crear usuario'}</h2>}>
            <Head title={isEdit ? "Editar usuario" : "Crear usuario"} />

            <div className="py-6 max-w-4xl mx-auto sm:px-4 lg:px-8">
                <div className="bg-[#2970E8] border border-white p-6 shadow rounded">
                    <form onSubmit={submit} className="space-y-3">
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nombre" className="border rounded p-2 w-full "/>
                        <input type="text" value={data.apellido} onChange={e => setData('apellido', e.target.value)} placeholder="Apellido" className="border rounded p-2 w-full"/>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Correo (Gmail o Hotmail)" className="border rounded p-2 w-full"/>
                        <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))} placeholder="Teléfono" maxLength={10} className="border rounded p-2 w-full"/>

                        <select
                            value={data.rol}
                            onChange={e => setData('rol', e.target.value)}
                            className="border rounded p-2 w-full"
                            disabled={isSelf} //  bloqueo si soy yo mismo
                        >
                            <option value="">Seleccionar rol</option>
                            <option value="admin">Admin</option>
                            <option value="arquitecto">Arquitecto</option>
                            <option value="ingeniero">Ingeniero</option>
                            <option value="cliente">Cliente</option>
                        </select>
                        {isSelf && <p className="text-sm text-gray-500">⚠️ No puedes cambiar tu propio rol.</p>}

                        <div className="flex gap-2">
                            <button type="submit" className="bg-[#B3E10F] text-black px-4 py-2 rounded hover:bg-[#8aab13]">
                                {isEdit ? 'Actualizar' : 'Registrar'}
                            </button>
                            <Link href={route('users.index')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {errorMsg && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded shadow-lg max-w-sm w-full p-6">
                        <h2 className="text-lg font-bold mb-4">Error de validación</h2>
                        <p className="mb-4 text-sm text-gray-700">{errorMsg}</p>
                        <div className="flex justify-end">
                            <button onClick={() => setErrorMsg(null)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
