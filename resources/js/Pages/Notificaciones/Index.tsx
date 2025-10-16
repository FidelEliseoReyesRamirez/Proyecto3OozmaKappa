import { usePage, router } from "@inertiajs/react";

// Tipo de una notificación
type Notificacion = {
    id: number;
    mensaje: string;
    tipo: string;
    fecha_envio: string;
    leida: boolean;
};

// Extraer tipo real del usuario desde Inertia
type AuthUser = ReturnType<typeof usePage>["props"]["auth"]["user"];

// Tipo completo de props de la página
type PageProps = {
    auth: {
        user: AuthUser;
    };
    notificaciones: Notificacion[];
};

export default function Index() {
    const { notificaciones } = usePage<PageProps>().props;

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            {/* Header con botón de marcar todas */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Notificaciones</h1>

                {notificaciones.length > 0 && (
                    <button
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => router.post(route("notificaciones.marcarTodas"))}
                    >
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            {/* Contenedor de notificaciones */}
            <div className="bg-gray-800 rounded-lg shadow p-4">
                {/* Si no hay notificaciones */}
                {notificaciones.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">
                        No hay notificaciones
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-700">
                        {notificaciones.map((n) => (
                            <li key={n.id} className="py-3 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span>{n.mensaje}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(n.fecha_envio).toLocaleString()}
                                    </span>
                                </div>

                                {/* Acciones */}
                                {!n.leida ? (
                                    <button
                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                        onClick={() => router.post(route("notificaciones.marcar", n.id))}
                                    >
                                        Marcar como leída
                                    </button>
                                ) : (
                                    <span className="text-xs text-gray-500">
                                        Leída
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
