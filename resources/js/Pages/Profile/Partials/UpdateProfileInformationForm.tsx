import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function UpdateProfileInformation({
    className = '',
}: {
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
        });

    const [nameError, setNameError] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Validación final antes de enviar
        if (nameError) return;

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-[#2970E8]">
                    Información del Perfil
                </h2>

                <p className="mt-1 text-sm text-[#B3E10F]">
                    Actualiza el nombre asociado a tu perfil de usuario.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* NOMBRE */}
                <div>
                    <InputLabel htmlFor="name" value="Nombre" className="text-white" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => {
                            let value = e.target.value;

                            // Validación: espacios y caracteres válidos
                            value = value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
                            value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

                            if (value.length > 30) {
                                setNameError('El límite son 30 caracteres.');
                                value = value.slice(0, 30);
                            } else {
                                setNameError(null);
                            }

                            setData('name', value);
                        }}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={nameError || errors.name} />
                </div>

                {/* BOTÓN */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-400">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
