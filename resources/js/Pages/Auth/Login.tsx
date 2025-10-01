import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react'; 

interface UserTypeSelectorProps {
    selected: 'client' | 'employee';
    onSelect: (type: 'client' | 'employee') => void;
}
const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ selected, onSelect }) => (
    <div className="flex bg-[#121212] rounded-lg p-1 mb-8 shadow-inner">
        <button
            type="button"
            onClick={() => onSelect('client')}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg font-semibold transition duration-300 ${
                selected === 'client'
                    ? 'bg-[#2970E8] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
            <i className="fa-solid fa-building mr-2"></i> Cliente
        </button>
        <button
            type="button"
            onClick={() => onSelect('employee')}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg font-semibold transition duration-300 ${
                selected === 'employee'
                    ? 'bg-[#B3E10F] text-white shadow-md'
                    : 'bg-white text-gray-400' 
            }`}
        >
            <i className="fa-solid fa-user-tie mr-2"></i> Empleado
        </button>
    </div>
);

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
    
    const [userType, setUserType] = useState<'client' | 'employee'>('client');
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="DEVELARQ | Iniciar Sesión" />
            
            <div className="text-center mb-6">
                <Link href={route('welcome')} className="inline-flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl font-extrabold text-[#B3E10F]">DEVELARQ</span>
                    </div>
                    <span className="mt-1 px-2 py-0.5 bg-[#121212] text-[#B3E10F] text-xs font-semibold rounded border border-[#B3E10F]/50">
                        BIM Management Office
                    </span>
                </Link>
            </div>
            
            <div className="bg-[#121212] p-8 rounded-xl shadow-2xl border border-white">

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-400">
                        {status}
                    </div>
                )}
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white">Iniciar Sesión</h1>
                    <p className="text-gray-400 mt-2">Accede a tu panel de proyectos BIM</p>
                </div>


                <form onSubmit={submit}>
                    
                    <div className='mb-6'>
                        <p className="text-gray-300 text-sm font-semibold mb-2">Tipo de Usuario</p>
                        <UserTypeSelector selected={userType} onSelect={setUserType} />
                    </div>

                    <div className='mb-4'>
                        <TextInput id="email" type="email" name="email" value={data.email}
                            className="mt-1 block w-full bg-black border-white text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8] rounded-md"
                            autoComplete="username" isFocused={true} placeholder="tu@email.com" onChange={(e) => setData('email', e.target.value)}/>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4 mb-6">
                        <div className="relative">
                            <TextInput id="password" type={showPassword ? 'text' : 'password'} name="password" value={data.password}
                                className="mt-1 block w-full bg-black border-white text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8] pr-10 rounded-md"
                                autoComplete="current-password" placeholder="Contraseña" onChange={(e) => setData('password', e.target.value)}/>
                            <i className={`fa-regular absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#B3E10F] transition duration-150 ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                onClick={() => setShowPassword(!showPassword)}aria-label="Mostrar contraseña">
                            </i>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <label className="flex items-center text-sm text-gray-400">
                            <Checkbox name="remember" checked={data.remember} className="text-[#2970E8] focus:ring-[#2970E8] border-white bg-gray-800 rounded"
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
                            <Link href={route('password.request')} className="text-sm font-medium text-[#2970E8] hover:text-blue-400 transition duration-150">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="w-full justify-center py-3 bg-[#2970E8] text-white rounded-md hover:bg-blue-600 transition duration-150 text-lg font-bold flex items-center shadow-lg" disabled={processing}>
                            <i className="fa-solid fa-arrow-right mr-2 ml-auto"></i> Iniciar Sesión <span className="ml-auto"></span>
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center mt-8 space-y-4">
                        <p className="text-sm text-gray-400">
                            ¿No tienes cuenta?{' '}
                            <Link href={route('register')} className="font-semibold text-[#B3E10F] hover:text-lime-300 transition duration-150">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                </form>

            </div>
            <Link href={route('welcome')} className="text-sm text-gray-500 hover:text-gray-300 transition duration-150 mt-4 block text-center">
                ← Volver al inicio
            </Link>

        </GuestLayout>
    );
}