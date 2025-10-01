import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Importar Link
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-[#B3E10F]">
                Olvidaste tu contraseña? No hay problema. Simplemente
                ingresa tu dirección de correo electrónico a continuación y te
                enviaremos un enlace para restablecer tu contraseña que te
                permitirá elegir una nueva.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-between"> 
                    {/* Botón de Cancelar / Volver */}
                    <Link
                        href={route('login')}
                        className="text-sm text-[#2970E8] hover:text-[#B3E10F] transition duration-150 underline"
                    >
                        Cancelar
                    </Link>

                    <PrimaryButton disabled={processing}>
                        Enviar enlace de restablecimiento
                    </PrimaryButton>
                </div>
                
            </form>
        </GuestLayout>
    );
}