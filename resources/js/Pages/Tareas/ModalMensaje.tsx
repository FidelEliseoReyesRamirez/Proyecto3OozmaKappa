import React from 'react';

// Definición de las props del modal
interface ModalMensajeProps {
    visible: boolean;
    tipo: "exito" | "error" | "";
    mensaje: string;
    onClose: () => void;
}

export default function ModalMensaje({ visible, tipo, mensaje, onClose }: ModalMensajeProps) {
    if (!visible) return null;

    const esExito = tipo === "exito";
    const baseClass = "p-6 rounded-xl shadow-xl w-96 text-center bg-gray-900";
    const borderColor = esExito ? "border-green-600" : "border-red-600";
    const titleColor = esExito ? "text-green-400" : "text-red-400";
    const buttonBg = esExito ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className={`border ${borderColor} ${baseClass}`}>
                <h3 className={`text-lg font-bold mb-3 ${titleColor}`}>
                    {esExito ? "Éxito" : "Error"}
                </h3>
                <p className="text-gray-200 mb-4">{mensaje}</p>
                <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-md text-white font-semibold ${buttonBg}`}
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}