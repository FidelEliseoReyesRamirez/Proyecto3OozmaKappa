import { Link } from '@inertiajs/react';

export default function FileTooLarge({ title, message }: { title: string; message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
            <div className="bg-gray-900 p-6 rounded-full shadow-2xl mb-6 border border-[#B3E10F]/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
            </div>

            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight text-center">
                {title}
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-lg text-center">{message}</p>

            <Link href={route('docs.index')}
                className="bg-[#2970E8] text-white px-6 py-3 rounded-lg shadow-xl hover:bg-blue-600 transition-all text-center font-bold">
                Volver a Documentos
            </Link>
        </div>
    );
}
