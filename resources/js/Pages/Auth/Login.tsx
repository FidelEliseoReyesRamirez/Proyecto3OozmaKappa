import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

// Se elimina la interfaz UserTypeSelectorProps

// Se elimina el componente UserTypeSelector


export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState<string | null>(null);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Limpia errores previos
        setEmailError(null);

        // Expresión regular para correos válidos y dominios comunes
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com)$/;

        if (!emailRegex.test(data.email)) {
            setEmailError('El correo ingresado no es válido o contiene caracteres no permitidos.');
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="DEVELARQ | Iniciar Sesión" />

            {/* LOGO Y TAGLINE */}
            <div className="text-center mb-6">
                <Link href={route('welcome')} className="inline-flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl font-extrabold text-[#B3E10F]">DEVELARQ</span>
                    </div>
                    <span className="mt-1 px-2 py-0.5 bg-black text-[#2970E8] text-xs font-semibold rounded border border-[#2970E8]/50">
                        BIM Management Office
                    </span>
                </Link>
            </div>

            {/* CONTENEDOR DE FORMULARIO OSCURO */}
            <div className="p-8 rounded-xl shadow-2xl ">

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-400">
                        {status}
                    </div>
                )}

                {/* Título y Subtítulo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white">Iniciar Sesión</h1>
                    <p className="text-gray-400 mt-2">Accede a tu panel de proyectos BIM</p>
                </div>


                <form onSubmit={submit}>

                    <div className='mb-4'>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full bg-black border-white text-black placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8] rounded-md"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={emailError || errors.email} className="mt-2" />
                    </div>

                    {/* Campo de Contraseña con Control de Visibilidad */}
                    <div className="mt-4 mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="block w-full bg-black border-white text-black placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8] pr-10 rounded-md"
                                autoComplete="current-password"
                               
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <i
                                className={`fa-regular absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#B3E10F] transition duration-150 ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Mostrar contraseña"
                            ></i>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Recordarme y Olvidaste tu Contraseña */}
                    <div className="flex justify-between items-center mt-4">
                        <label className="flex items-center text-sm text-gray-400">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                className="text-[#2970E8] focus:ring-[#2970E8] border-white bg-gray-800 rounded"
                                onChange={(e) =>
                                    setData(
                                        'remember',
                                        (e.target.checked || false) as false,
                                    )
                                }
                            />
                            <span className="ms-2">Recordarme</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-[#2970E8] hover:text-blue-400 transition duration-150"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    {/* Botón de Iniciar Sesión */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full justify-center py-3 bg-[#2970E8] text-white rounded-md hover:bg-blue-600 transition duration-150 text-lg font-bold flex items-center shadow-lg"
                            disabled={processing}
                        >
                            <i className=" mr-2 ml-auto"></i> Iniciar Sesión <span className="ml-auto"></span>
                        </button>
                    </div>

                </form>

            </div>
            {/* Enlace Volver al inicio */}
            <Link
                href={route('welcome')}
                className="text-sm text-gray-500 hover:text-gray-300 transition duration-150 mt-4 block text-center"
            >
                 Volver al inicio
            </Link>

        </GuestLayout>
    );
}
