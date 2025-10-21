import { useEffect, useState, useRef } from "react";
import { usePage, router } from "@inertiajs/react";

type Notificacion = {
  id: number;
  mensaje: string;
  asunto?: string;
  url?: string;
  tipo: "tarea" | "reunion" | "avance" | "documento" | "proyecto" | string;
  fecha_envio: string;
  leida: boolean;
};

type AuthUser = ReturnType<typeof usePage>["props"]["auth"]["user"];

type PageProps = {
  auth: { user: AuthUser };
  notificaciones: Notificacion[];
};

export function useNotifications() {
  const { notificaciones = [] } = usePage<PageProps>().props;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasUnread = notificaciones.some((n) => !n.leida);

  // Detectar nueva notificación (sonido)
  useEffect(() => {
    if (notificaciones.length === 0) return;
    const newestId = notificaciones[0].id;
    const lastSeenId = localStorage.getItem("last_notification_id");

    if (lastSeenId && parseInt(lastSeenId) !== newestId) {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {});
    }

    localStorage.setItem("last_notification_id", newestId.toString());
  }, [notificaciones]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleDropdown = () => setOpen((prev) => !prev);

  // Marcar una notificación como leída
  const markAsRead = (id: number) => {
    router.post(route("notificaciones.marcar", id));
  };

  // Marcar todas
  const markAllAsRead = () => {
    router.post(route("notificaciones.marcarTodas"));
  };

  // Tiempo relativo
  const timeAgo = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
    if (diff < 60) return "Hace unos segundos";
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hrs`;
    return new Date(date).toLocaleDateString();
  };

  // Íconos según tipo
  const getIcon = (tipo: Notificacion["tipo"]) => {
    switch (tipo) {
      case "tarea":
        return "🧱";
      case "reunion":
        return "📅";
      case "avance":
        return "🚀";
      case "documento":
        return "📄";
      case "proyecto":
        return "📁";
      default:
        return "🔔";
    }
  };

  // ✅ NUEVO: acción al hacer click en la notificación
  const handleClickNotification = (noti: Notificacion) => {
    // Marcar como leída
    markAsRead(noti.id);

    // Si tiene URL → redirigir
    if (noti.url) {
      window.location.href = noti.url;
    } else {
      // Si no tiene URL, solo cierra el dropdown
      setOpen(false);
    }
  };

  return {
    notificaciones,
    hasUnread,
    open,
    dropdownRef,
    toggleDropdown,
    markAsRead,
    markAllAsRead,
    timeAgo,
    getIcon,
    handleClickNotification,
  };
}
