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

    // ============================
    // 🔹 Validación local
    // ============================
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

        if (!data.rol.trim()) errors.rol = "El rol es obligatorio.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ============================
    // 🔹 Envío del formulario
    // ============================
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await axios.post('/users/verificar-duplicado', {
                email: data.email,
                telefono: data.telefono,
            });

            const { emailExiste, telefonoExiste } = response.data;

            if (emailExiste || telefonoExiste) {
                let mensaje = "No se puede registrar el usuario por:\n";
                if (emailExiste) mensaje += `• El correo ${data.email} ya está registrado.\n`;
                if (telefonoExiste) mensaje += `• El teléfono ${data.telefono} ya está registrado.\n`;

                setErrorMsg(mensaje);
                return; // 🚫 Detiene el envío
            }

            // ✅ Si no hay duplicados, continúa normalmente
            if (isEdit) patch(route('users.update', user.id));
            else post(route('users.store'));

        } catch (error) {
            console.error("Error al verificar duplicados:", error);
            setErrorMsg("Ocurrió un error al verificar los datos. Intenta nuevamente.");
        }
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
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nombre"
                                className={getInputClasses('name')}
                            />
                            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
                        </div>

                        {/* Apellido */}
                        <div>
                            <input
                                type="text"
                                value={data.apellido}
                                onChange={e => setData('apellido', e.target.value)}
                                placeholder="Apellido"
                                className={getInputClasses('apellido')}
                            />
                            {fieldErrors.apellido && <p className="text-red-500 text-sm mt-1">{fieldErrors.apellido}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Correo (solo Gmail)"
                                className={getInputClasses('email')}
                            />
                            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <input
                                type="text"
                                value={data.telefono}
                                onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))}
                                placeholder="Teléfono"
                                maxLength={10}
                                className={getInputClasses('telefono')}
                            />
                            {fieldErrors.telefono && <p className="text-red-500 text-sm mt-1">{fieldErrors.telefono}</p>}
                        </div>

                        {/* Rol */}
                        <div>
                            <select
                                value={data.rol}
                                onChange={e => setData('rol', e.target.value)}
                                className={getInputClasses('rol')}
                                disabled={isSelf}
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="admin">Admin</option>
                                <option value="arquitecto">Arquitecto</option>
                                <option value="ingeniero">Ingeniero</option>
                                <option value="cliente">Cliente</option>
                            </select>
                            {fieldErrors.rol && <p className="text-red-500 text-sm mt-1">{fieldErrors.rol}</p>}
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg font-semibold bg-[#B3E10F] text-black hover:bg-[#8aab13] transition duration-200"
                            >
                                {isEdit ? 'Actualizar' : 'Registrar'}
                            </button>
                            <Link
                                href={route('users.index')}
                                className="bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal de advertencia estilizado */}
            {errorMsg && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-[#0B1120] rounded-xl shadow-2xl max-w-md w-full p-6 text-white border border-red-700">
                        <h2 className="text-xl font-bold mb-4 text-red-500">Advertencia</h2>

                        <p className="mb-6 text-gray-300 whitespace-pre-line">
                            {errorMsg}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setErrorMsg(null)}
                                className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-blue-600 transition duration-150 font-semibold"
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
