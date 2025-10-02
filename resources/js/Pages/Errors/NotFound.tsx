import { Link } from '@inertiajs/react';

export default function NotFound({ title, message }: { title: string; message: string }) {
    return (
        // Fondo oscuro para toda la página
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
            
            {/* Icono SVG en círculo (Usando el acento B3E10F y fondo oscuro) */}
            <div className="bg-gray-900 p-6 rounded-full shadow-2xl mb-6 border border-[#B3E10F]/50">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // Color del icono: el lima de DEVELARQ
                    className="h-16 w-16 text-[#B3E10F]" 
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5} // strokeWidth 2 es un poco grueso, bajamos a 1.5
                >
                    {/* Icono de advertencia/información */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
            </div>

            {/* Título (Texto blanco) */}
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight text-center">
                {title}
            </h1>

            {/* Mensaje (Texto gris claro) */}
            <p className="text-lg text-gray-400 mb-8 max-w-lg text-center">
                {message}
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href={route('welcome')}
                    // Botón principal: Azul DEVELARQ
                    className="bg-[#2970E8] text-white px-6 py-3 rounded-lg shadow-xl hover:bg-blue-600 transition-all text-center font-bold"
                >
                    Volver al inicio
                </Link>
                <button
                    onClick={() => window.history.back()}
                    // Botón secundario: Gris oscuro con borde para contraste
                    className="bg-gray-800 text-gray-300 px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition-all border border-gray-700 font-medium"
                >
                    Regresar atrás
                </button>
            </div>

            {/* Extra decorativo (Texto gris sutil) */}
            <div className="mt-12 text-sm text-gray-600">
                <br />
                <p>Verifica la URL o navega desde el menú principal.</p>
            </div>
        </div>
    );
}