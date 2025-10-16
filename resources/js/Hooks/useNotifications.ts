import { useEffect, useState, useRef } from "react";
import { usePage, router } from "@inertiajs/react";

type Notificacion = {
    id: number;
    mensaje: string;
    tipo: "tarea" | "reunion" | "avance" | "documento";
    fecha_envio: string;
    leida: boolean;
};

type AuthUser = ReturnType<typeof usePage>["props"]["auth"]["user"];

type PageProps = {
    auth: {
        user: AuthUser;
    };
    notificaciones: Notificacion[];
};

export function useNotifications() {
    const { notificaciones = [] } = usePage<PageProps>().props;

    const [open, setOpen] = useState(false);
    const [prevCount, setPrevCount] = useState(notificaciones.length);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasUnread = notificaciones.length > 0;

    // ✅ Sonido cuando llega una nueva notificación
    useEffect(() => {
        if (notificaciones.length > prevCount) {
            const audio = new Audio("/sounds/notification.mp3");
            audio.play();
        }
        setPrevCount(notificaciones.length);
    }, [notificaciones]);

    // ✅ Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // ✅ Alternar dropdown
    const toggleDropdown = () => setOpen((prev) => !prev);

    // ✅ Marcar una notificación como leída
    const markAsRead = (id: number) => {
        router.post(route("notificaciones.marcar", id));
    };

    // ✅ Marcar todas como leídas
    const markAllAsRead = () => {
        router.post(route("notificaciones.marcarTodas"));
    };

    // ✅ (Opcional para futuro) formatear fecha relativa
    const timeAgo = (date: string) => {
        const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
        if (diff < 60) return "Hace unos segundos";
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hrs`;
        return new Date(date).toLocaleDateString();
    };

    // ✅ (Opcional futuro PRO) Ícono según tipo
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
            default:
                return "🔔";
        }
    };

    return {
        notificaciones,
        open,
        hasUnread,
        dropdownRef,
        toggleDropdown,
        markAsRead,
        markAllAsRead,
        timeAgo,
        getIcon,
    };
}
