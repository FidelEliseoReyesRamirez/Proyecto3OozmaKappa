import { Link } from "@inertiajs/react";
import { useNotifications } from "@/Hooks/useNotifications";

export default function NotificationsBell() {
    const {
        notificaciones,
        open,
        hasUnread,
        dropdownRef,
        toggleDropdown,
        markAsRead,
        markAllAsRead,
        timeAgo,
        getIcon,
    } = useNotifications();

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            {/* ICONO CAMPANA */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-white hover:text-gray-300 focus:outline-none"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
                        6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 
                        6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 
                        3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {/* PUNTO ROJO */}
                {hasUnread && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
            </button>

            {/* DROPDOWN (ahora FIXED y visible SIEMPRE) */}
            {open && (
                <div
                    className="fixed w-80 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg z-[9999]"
                    style={{
                        top: "70px",      // <<< Ajusta si tu navbar es más alto o bajo (ej: 64px, 72px...)
                        right: "20px",    // <<< Ajusta si quieres mover a la izquierda/derecha
                    }}
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                        <span className="font-semibold text-lg">Notificaciones</span>

                        {hasUnread && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                Marcar todas
                            </button>
                        )}
                    </div>

                    {/* LISTA */}
                    <div className="max-h-60 overflow-y-auto">
                        {notificaciones.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400">
                                No hay notificaciones
                            </div>
                        ) : (
                            notificaciones.map((n) => (
                                <div
                                    key={n.id}
                                    className="px-4 py-3 border-b border-gray-700 last:border-0 flex justify-between items-start hover:bg-gray-700 transition"
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">
                                            {getIcon(n.tipo)}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{n.mensaje}</span>
                                            <span className="text-xs text-gray-400">
                                                {timeAgo(n.fecha_envio)}
                                            </span>
                                        </div>
                                    </div>

                                    {!n.leida && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="text-xs text-blue-400 hover:text-blue-300 ml-2"
                                            title="Marcar como leída"
                                        >
                                            ✓
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="px-4 py-2 text-center border-t border-gray-700">
                        <Link
                            href={route("notificaciones.index")}
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            Ver todas
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
