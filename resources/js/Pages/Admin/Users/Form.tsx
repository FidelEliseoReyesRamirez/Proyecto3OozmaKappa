// resources/js/Pages/UserForm.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

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

    // VALIDACIÓN
    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!data.name.trim()) errors.name = "El nombre es obligatorio.";
        if (!data.apellido.trim()) errors.apellido = "El apellido es obligatorio.";

        if (!data.email.trim()) errors.email = "El correo es obligatorio.";
        else if (!/^[\w.-]+@gmail\.com$/.test(data.email))
            errors.email = "Debe ser un correo Gmail válido.";

        if (!data.telefono.trim()) errors.telefono = "El teléfono es obligatorio.";
        else if (!/^\d+$/.test(data.telefono))
            errors.telefono = "Solo se permiten números.";
        else if (data.telefono.length < 7 || data.telefono.length > 10)
            errors.telefono = "Debe tener entre 7 y 10 dígitos.";

        if (!data.rol.trim()) errors.rol = "Debe seleccionar un rol.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // SUBMIT
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await axios.post('/users/verificar-duplicado', {
                id: isEdit ? user.id : null,  
                email: data.email,
                telefono: data.telefono,
            });

            const { emailExiste, telefonoExiste } = response.data;

            if (emailExiste || telefonoExiste) {
                let mensaje = "No se puede continuar:\n";
                if (emailExiste) mensaje += `• El correo ${data.email} ya está registrado.\n`;
                if (telefonoExiste) mensaje += `• El teléfono ${data.telefono} ya está registrado.\n`;

                setErrorMsg(mensaje);
                return;
            }

            if (isEdit) patch(route('users.update', user.id));
            else post(route('users.store'));

        } catch (error) {
            console.error(error);
            setErrorMsg("Ocurrió un error al verificar los datos.");
        }
    };


    const isSelf = isEdit && auth.user.id === user?.id;

    const inputStyle =
        "w-full px-4 py-2 bg-[#0B1120] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2970E8] focus:border-[#2970E8] transition";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold leading-tight text-[#B3E10F] tracking-wider">
                    {isEdit ? 'Editar Usuario' : 'Registrar Usuario'}
                </h2>
            }
        >
            <Head title={isEdit ? "Editar Usuario" : "Registrar Usuario"} />

            <div className="py-10 max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-[#080D15] border border-gray-800 shadow-2xl rounded-xl p-8">

                    <form onSubmit={submit} className="space-y-6">

                        {/* NOMBRE */}
                        <div>
                            <label className="text-gray-300 text-sm font-semibold">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={inputStyle}
                                placeholder="Nombre del usuario"
                            />
                            {fieldErrors.name && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                            )}
                        </div>

                        {/* APELLIDO */}
                        <div>
                            <label className="text-gray-300 text-sm font-semibold">
                                Apellido
                            </label>
                            <input
                                type="text"
                                value={data.apellido}
                                onChange={e => setData('apellido', e.target.value)}
                                className={inputStyle}
                                placeholder="Apellido"
                            />
                            {fieldErrors.apellido && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.apellido}</p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-gray-300 text-sm font-semibold">
                                Correo Gmail
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={inputStyle}
                                placeholder="usuario@gmail.com"
                            />
                            {fieldErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* TELEFONO */}
                        <div>
                            <label className="text-gray-300 text-sm font-semibold">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={data.telefono}
                                onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))}
                                className={inputStyle}
                                placeholder="Ej: 78945612"
                                maxLength={10}
                            />
                            {fieldErrors.telefono && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.telefono}</p>
                            )}
                        </div>

                        {/* ROL */}
                        <div>
                            <label className="text-gray-300 text-sm font-semibold">
                                Rol del Usuario
                            </label>
                            <select
                                value={data.rol}
                                onChange={e => setData('rol', e.target.value)}
                                className={inputStyle}
                                disabled={isSelf}
                            >
                                <option value="">Seleccione rol</option>
                                <option value="admin">Admin</option>
                                <option value="arquitecto">Arquitecto</option>
                                <option value="ingeniero">Ingeniero</option>
                                <option value="cliente">Cliente</option>
                            </select>
                            {fieldErrors.rol && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.rol}</p>
                            )}
                        </div>

                        {/* BOTONES */}
                        <div className="flex gap-4 pt-6 border-t border-gray-800">
                            <button
                                type="submit"
                                className="bg-[#B3E10F] hover:bg-lime-300 text-black font-bold px-4 py-2 rounded-md shadow-md transition"
                            >
                                {isEdit ? 'Actualizar' : 'Registrar'}
                            </button>

                            <Link
                                href={route('users.index')}
                                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-md transition"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL DE ERROR elegante */}
            {errorMsg && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-[#0B1120] border border-red-700 p-6 rounded-xl shadow-2xl max-w-md w-full">
                        <h2 className="text-red-500 text-lg font-bold mb-4">No se puede continuar</h2>
                        <p className="text-gray-300 whitespace-pre-line">{errorMsg}</p>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setErrorMsg(null)}
                                className="bg-[#2970E8] px-4 py-2 rounded-md text-white font-semibold hover:bg-blue-600 transition"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
