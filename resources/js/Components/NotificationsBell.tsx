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
    handleClickNotification,
  } = useNotifications();

  return (
    <div className="relative flex items-center" ref={dropdownRef}>

      {/* CAMPANA */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-white hover:text-[var(--accent)] transition"
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

        {/* DOT de alertas */}
        {hasUnread && <span className="notif-dot absolute top-1 right-1 h-2 w-2 rounded-full animate-pulse"></span>}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="fixed w-80 bg-[#0B1120] text-white border border-gray-700 rounded-xl shadow-xl z-[9999] animate-fadeIn"
          style={{
            top: "70px",
            right: "20px",
          }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <span className="font-medium text-sm">Notificaciones</span>

            {hasUnread && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Marcar todas
              </button>
            )}
          </div>

          {/* LISTA */}
          <div className="max-h-72 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No tienes notificaciones
              </div>
            ) : (
              notificaciones.slice(0, 7).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClickNotification(n)}
                  className={`cursor-pointer px-4 py-3 text-sm border-b border-gray-800 hover:bg-gray-800 transition ${!n.leida ? "bg-gray-900/40" : ""
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-lg text-[var(--accent)]">
                      {getIcon(n.tipo)}
                    </span>

                    <div className="flex-1 min-w-0">
                      {n.asunto && (
                        <div className="font-semibold text-white truncate">
                          {n.asunto}
                        </div>
                      )}

                      <div
                        className={
                          !n.leida ? "font-medium truncate" : "text-gray-300 truncate"
                        }
                      >
                        {n.mensaje}
                      </div>

                      <div className="text-xs text-gray-500">{timeAgo(n.fecha_envio)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="px-4 py-2 text-center border-t border-gray-700">
            <Link
              href={route("notificaciones.index")}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Ver todas →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
