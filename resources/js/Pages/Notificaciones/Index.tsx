import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useMemo, useState } from "react";

// Tipos
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

// Modal simple
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0B1120] p-5 text-white shadow-2xl">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-gray-300">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[#B3E10F] px-4 py-2 text-sm font-medium text-black hover:bg-lime-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const { notificaciones } = usePage<PageProps>().props;

  // Estados
  const [panelOpen, setPanelOpen] = useState(false);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<
    "" | "tarea" | "reunion" | "avance" | "documento" | "proyecto"
  >("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [soloNoLeidas, setSoloNoLeidas] = useState(false);

  // Validación de fechas
  const dateError =
    desde && hasta && new Date(desde).getTime() > new Date(hasta).getTime()
      ? "La fecha inicial no puede ser mayor que la final."
      : "";

  // Filtrado y orden
  const filtradas = useMemo(() => {
    let data = [...notificaciones];

    if (q.trim()) {
      const text = q.toLowerCase();
      data = data.filter(
        (n) =>
          n.mensaje.toLowerCase().includes(text) ||
          (n.asunto && n.asunto.toLowerCase().includes(text))
      );
    }

    if (tipo) data = data.filter((n) => n.tipo === tipo);
    if (desde)
      data = data.filter(
        (n) => new Date(n.fecha_envio).getTime() >= new Date(desde).getTime()
      );

    if (hasta) {
      const end = new Date(hasta);
      end.setHours(23, 59, 59, 999);
      data = data.filter(
        (n) => new Date(n.fecha_envio).getTime() <= end.getTime()
      );
    }

    if (soloNoLeidas) data = data.filter((n) => !n.leida);

    return data.sort(
      (a, b) =>
        new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
    );
  }, [notificaciones, q, tipo, desde, hasta, soloNoLeidas]);

  // Modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleMarcarTodas = () => {
    if (filtradas.length > 0) setConfirmOpen(true);
  };
  const confirmMarcarTodas = () => {
    setConfirmOpen(false);
    router.post(route("notificaciones.marcarTodas"));
  };
  const markAsRead = (id: number) => {
    router.post(route("notificaciones.marcar", id));
  };

  // Accesibilidad: ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelOpen) setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold text-white">Notificaciones</h2>}
    >
      <Head title="Notificaciones" />
      <div className="mx-auto max-w-5xl p-6 text-white">
        {/* Barra superior */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="rounded-md border border-gray-600 px-3 py-2 text-sm hover:bg-gray-800"
          >
            {panelOpen ? "Ocultar filtros" : "Mostrar filtros"}
          </button>

          <div className="flex gap-2">
            <Link
              href={route("dashboard")}
              className="rounded-md border border-gray-600 px-3 py-2 text-sm hover:bg-gray-800"
            >
              Volver al inicio
            </Link>
            <button
              onClick={handleMarcarTodas}
              disabled={filtradas.length === 0}
              className={`rounded-md px-3 py-2 text-sm font-medium ${filtradas.length === 0
                ? "cursor-not-allowed bg-gray-600 text-gray-300"
                : "bg-[#B3E10F] text-black hover:bg-lime-500"
                }`}
            >
              Marcar todas como leídas
            </button>
          </div>
        </div>

        {/* Panel filtros */}
        <div
          className={`overflow-hidden rounded-xl border border-white/10 bg-[#0B1120] transition-all duration-300 ${panelOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <label className="mb-1 text-xs uppercase text-gray-400">
                Buscar
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Texto o asunto..."
                className="rounded-md border border-gray-600 bg-[#0B1120] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#B3E10F]"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs uppercase text-gray-400">
                Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(
                    e.target.value as
                    | ""
                    | "tarea"
                    | "reunion"
                    | "avance"
                    | "documento"
                    | "proyecto"
                  )
                }
                className="rounded-md border border-gray-600 bg-[#0B1120] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#B3E10F]"
              >
                <option value="">Todos</option>
                <option value="tarea">Tarea</option>
                <option value="proyecto">Proyecto</option>
                <option value="reunion">Reunión</option>
                <option value="avance">Avance</option>
                <option value="documento">Documento</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs uppercase text-gray-400">
                Desde
              </label>
              <input
                type="date"
                value={desde}
                max={hasta || undefined}
                onChange={(e) => setDesde(e.target.value)}
                className="rounded-md border border-gray-600 bg-[#0B1120] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#B3E10F]"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs uppercase text-gray-400">
                Hasta
              </label>
              <input
                type="date"
                value={hasta}
                min={desde || undefined}
                onChange={(e) => setHasta(e.target.value)}
                className="rounded-md border border-gray-600 bg-[#0B1120] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#B3E10F]"
              />
            </div>

            <div className="col-span-1 flex items-center sm:col-span-2 lg:col-span-4">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={soloNoLeidas}
                  onChange={(e) => setSoloNoLeidas(e.target.checked)}
                  className="h-4 w-4 accent-[#B3E10F]"
                />
                <span className="text-sm text-gray-200">Solo no leídas</span>
              </label>
            </div>
          </div>

          {dateError && (
            <div className="border-t border-white/10 px-4 pb-4 pt-3">
              <div className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-200">
                {dateError}
              </div>
            </div>
          )}
        </div>

        {/* Lista */}
        <div className="mt-6 rounded-xl border border-white/10 bg-[#0B1120]">
          {filtradas.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No hay notificaciones para los filtros seleccionados.
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {filtradas.map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${n.tipo === "tarea"
                          ? "bg-blue-900/40 text-blue-300 border border-blue-700/50"
                          : n.tipo === "reunion"
                            ? "bg-purple-900/40 text-purple-300 border border-purple-700/50"
                            : n.tipo === "avance"
                              ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50"
                              : n.tipo === "documento"
                                ? "bg-amber-900/40 text-amber-300 border border-amber-700/50"
                                : n.tipo === "proyecto"
                                  ? "bg-pink-900/40 text-pink-300 border border-pink-700/50"
                                  : "bg-gray-800 text-gray-300 border border-gray-700"
                          }`}
                      >
                        {n.tipo}
                      </span>
                      {!n.leida && (
                        <span className="inline-flex items-center rounded-full border border-[#B3E10F]/40 bg-[#B3E10F]/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#B3E10F]">
                          Nueva
                        </span>
                      )}
                    </div>

                    {/* Asunto + mensaje + enlace */}
                    <div className="text-sm">
                      {n.asunto && (
                        <div className="font-semibold text-white mb-0.5">{n.asunto}</div>
                      )}
                      <div className={`${!n.leida ? "font-medium" : "text-gray-300"}`}>
                        {n.mensaje}
                      </div>
                      {n.url && (
                        <button
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.url) {
                              router.visit(n.url, {
                                preserveScroll: true,
                                onError: () => router.visit(route("notificaciones.index")),
                              });
                            }
                          }}
                          className="mt-1 inline-block text-sm text-[#B3E10F] hover:underline"
                        >
                          Ver más
                        </button>
                      )}

                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(n.fecha_envio).toLocaleString()}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {!n.leida ? (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
                      >
                        Marcar como leída
                      </button>
                    ) : (
                      <span className="select-none rounded-md border border-gray-700 px-3 py-1.5 text-xs uppercase tracking-wide text-gray-400">
                        Leída
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmMarcarTodas}
        title="Marcar todas como leídas"
        message="¿Deseas marcar todas las notificaciones filtradas como leídas? Esta acción no se puede deshacer."
        confirmText="Sí, marcar todas"
        cancelText="Cancelar"
      />
    </AuthenticatedLayout>
  );
}
