import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-[#2970E8]">
                Gracias por registrarte! Antes de comenzar, ¿podrías verificar
                tu dirección de correo electrónico haciendo clic en el enlace que
                acabamos de enviarte por correo electrónico? Si no recibiste el 
                correo electrónico, con gusto te enviaremos otro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Un nuevo link de Verificación ha sido enviado a la
                    dirección de email que proporcionaste durante el registro.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Reenviar Email de Verificación
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-white underline hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cerrar Sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
