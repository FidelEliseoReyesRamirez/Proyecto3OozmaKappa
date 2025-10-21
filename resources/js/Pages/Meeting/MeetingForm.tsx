import React, { useState, useEffect } from "react";
import { InertiaFormProps } from "@inertiajs/react";
import { FormData } from "./MeetingFormModal";

interface ListItem {
    id: number;
    name: string;
}

interface MeetingFormProps {
    data: FormData;
    setData: InertiaFormProps<FormData>["setData"];
    errors: InertiaFormProps<FormData>["errors"];
    processing: boolean;
    isEditing: boolean;
    isInternalUser: boolean;
    isReadOnly: boolean;
    projectsList: ListItem[];
    usersList: ListItem[];
    onParticipantChange: (userId: number, isChecked: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: () => void;
    onCancel: () => void;
}

export default function MeetingForm({
    data,
    setData,
    errors,
    processing,
    isEditing,
    isInternalUser,
    isReadOnly,
    projectsList,
    usersList,
    onParticipantChange,
    onSubmit,
    onDelete,
    onCancel,
}: MeetingFormProps) {
    const [modal, setModal] = useState({ visible: false, tipo: "", mensaje: "" });
    const [busqueda, setBusqueda] = useState("");
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false); // Nuevo modal de confirmación

    const usuariosFiltrados = usersList.filter((u) =>
        u.name.toLowerCase().includes(busqueda.toLowerCase())
    );

    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".combo-participantes")) setOpen(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const mostrarModal = (tipo: "exito" | "error", mensaje: string) => {
        setModal({ visible: true, tipo, mensaje });
        setTimeout(() => setModal({ visible: false, tipo: "", mensaje: "" }), 3500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        // Validaciones base
        if (!data.title.trim()) {
            mostrarModal("error", "El título de la reunión es obligatorio.");
            return;
        }
        if (!data.projectId) {
            mostrarModal("error", "Debe seleccionar un proyecto.");
            return;
        }
        if (!data.start || !data.end) {
            mostrarModal("error", "Debe ingresar las fechas de inicio y fin.");
            return;
        }

        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        const now = new Date();

        // Validar que la fecha de inicio no sea anterior al día actual
        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (startDay < today) {
            mostrarModal("error", "No se pueden crear reuniones en fechas anteriores a hoy.");
            return;
        }

        // Validar que la fecha final sea posterior a la inicial
        if (endDate < startDate) {
            mostrarModal("error", "La fecha de fin no puede ser anterior al inicio.");
            return;
        }

        // Validar que sea en el mismo día
        const sameDay =
            startDate.getFullYear() === endDate.getFullYear() &&
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getDate() === endDate.getDate();

        if (!sameDay) {
            mostrarModal("error", "La reunión no puede abarcar más de un día.");
            return;
        }

        // Validar que haya al menos un participante
        if (data.participants.length === 0) {
            mostrarModal("error", "Debe agregar al menos un participante.");
            return;
        }

        // Si pasa todas las validaciones
        onSubmit(e);
    };

    const inputClasses = (hasError: boolean) =>
        `w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:ring-[#B3E10F] focus:border-[#B3E10F] 
         ${isReadOnly ? "opacity-70 cursor-not-allowed border-gray-600" : "border-gray-600"}
         ${hasError ? "border-red-400" : "border-gray-700"}`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative">
            {/* TÍTULO */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                <input
                    type="text"
                    placeholder="Ej: Reunión de avance Proyecto X"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value.slice(0, 100))}
                    required
                    disabled={isReadOnly}
                    className={inputClasses(!!errors.title)}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* PROYECTO */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proyecto</label>
                <select
                    value={String(data.projectId)}
                    onChange={(e) => setData("projectId", e.target.value)}
                    required
                    disabled={isReadOnly}
                    className={inputClasses(!!errors.projectId)}
                >
                    <option value="" disabled>
                        Selecciona un proyecto
                    </option>
                    {projectsList.map((project) => (
                        <option key={project.id} value={String(project.id)}>
                            {project.name}
                        </option>
                    ))}
                </select>
                {errors.projectId && (
                    <p className="text-red-400 text-xs mt-1">{errors.projectId}</p>
                )}
            </div>

            {/* FECHAS */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Inicio</label>
                    <input
                        type="datetime-local"
                        value={data.start}
                        onChange={(e) => setData("start", e.target.value)}
                        required
                        disabled={isReadOnly}
                        className={inputClasses(!!errors.start)}
                    />
                    {errors.start && <p className="text-red-400 text-xs mt-1">{errors.start}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Fin</label>
                    <input
                        type="datetime-local"
                        value={data.end}
                        onChange={(e) => setData("end", e.target.value)}
                        required
                        disabled={isReadOnly}
                        className={inputClasses(!!errors.end)}
                    />
                    {errors.end && <p className="text-red-400 text-xs mt-1">{errors.end}</p>}
                </div>
            </div>

            {/* PARTICIPANTES */}
            <div className="relative combo-participantes">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Participantes
                </label>

                <div
                    className={`${inputClasses(false)} cursor-pointer px-3 py-2.5 min-h-[42px] flex items-center text-sm`}
                    onClick={() => !isReadOnly && setOpen(!open)}
                >
                    {data.participants.length > 0
                        ? `${data.participants.length} seleccionado(s)`
                        : "Seleccione o busque participantes..."}
                </div>

                {open && !isReadOnly && (
                    <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar participante..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-800 text-gray-200 text-sm border-b border-gray-700 focus:outline-none"
                        />
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map((u) => (
                                <div
                                    key={u.id}
                                    onClick={() => {
                                        const isSelected = data.participants.includes(u.id);
                                        const updated = isSelected
                                            ? data.participants.filter((id) => id !== u.id)
                                            : [...data.participants, u.id];
                                        setData("participants", updated);
                                        onParticipantChange(u.id, !isSelected);
                                    }}
                                    className={`px-3 py-2 text-sm cursor-pointer ${data.participants.includes(u.id)
                                        ? "bg-[#1f5dc0] text-white"
                                        : "text-gray-200 hover:bg-[#2970E8] hover:text-white"
                                        }`}
                                >
                                    {u.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                                Sin resultados
                            </div>
                        )}
                    </div>
                )}
                {errors.participants && (
                    <p className="text-red-400 text-xs mt-1">{errors.participants}</p>
                )}
            </div>

            {/* DESCRIPCIÓN */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción
                </label>
                <textarea
                    placeholder="Agenda de la reunión, objetivos..."
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value.slice(0, 500))}
                    disabled={isReadOnly}
                    className={inputClasses(!!errors.description)}
                />
                {errors.description && (
                    <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                {isEditing && isInternalUser && !isReadOnly && (
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        disabled={processing}
                        className="px-5 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition"
                    >
                        {processing ? "Eliminando..." : "Eliminar"}
                    </button>
                )}
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                    {isReadOnly ? "Cerrar" : "Cancelar"}
                </button>
                {!isReadOnly && (
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-[#B3E10F] text-black rounded-lg font-semibold hover:bg-[#8aab13] transition"
                    >
                        {processing
                            ? isEditing
                                ? "Actualizando..."
                                : "Guardando..."
                            : isEditing
                                ? "Guardar Cambios"
                                : "Crear Reunión"}
                    </button>
                )}
            </div>

            {/* MODAL DE ALERTA (validaciones) */}
            {modal.visible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div
                        className={`p-6 rounded-xl shadow-xl w-96 text-center ${modal.tipo === "exito"
                            ? "bg-gray-900 border border-green-600"
                            : "bg-gray-900 border border-red-600"
                            }`}
                    >
                        <h3
                            className={`text-lg font-bold mb-3 ${modal.tipo === "exito" ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {modal.tipo === "exito" ? "Éxito" : "Error"}
                        </h3>
                        <p className="text-gray-200 mb-4">{modal.mensaje}</p>
                        <button
                            onClick={() => setModal({ visible: false, tipo: "", mensaje: "" })}
                            className={`px-4 py-2 rounded-md text-white font-semibold ${modal.tipo === "exito"
                                ? "bg-green-600 hover:bg-green-500"
                                : "bg-red-600 hover:bg-red-500"
                                }`}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINAR */}
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-gray-900 border border-red-700 p-6 rounded-xl shadow-xl w-96 text-center">
                        <h3 className="text-red-400 text-lg font-bold mb-3">
                            Confirmar eliminación
                        </h3>
                        <p className="text-gray-200 mb-6">
                            ¿Estás seguro de que deseas eliminar esta reunión? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="bg-gray-600 px-4 py-2 rounded-md text-white font-semibold hover:bg-gray-500 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmDelete(false);
                                    onDelete();
                                }}
                                className="bg-red-700 px-4 py-2 rounded-md text-white font-semibold hover:bg-red-600 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
