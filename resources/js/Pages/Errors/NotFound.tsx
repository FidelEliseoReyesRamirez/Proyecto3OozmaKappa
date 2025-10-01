import { Link } from '@inertiajs/react';

export default function NotFound({ title, message }: { title: string; message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            {/* Icono SVG en círculo */}
            <div className="bg-red-100 p-6 rounded-full shadow-md mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
            </div>

            {/* Título */}
            <h1 className="text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
                {title}
            </h1>

            {/* Mensaje */}
            <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
                {message}
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href={route('welcome')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition-all text-center"
                >
                    Volver al inicio
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-400 transition-all"
                >
                    Regresar atrás
                </button>
            </div>

            {/* Extra decorativo */}
            <div className="mt-12 text-sm text-gray-400">
                <br />
                <p> Verifica la URL o navega desde el menú principal.</p>
            </div>
        </div>
    );
}
