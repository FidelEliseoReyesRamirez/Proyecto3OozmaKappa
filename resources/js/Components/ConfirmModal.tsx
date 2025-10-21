import { Dialog } from "@headlessui/react";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";

export default function ConfirmModal({ open, onClose, onConfirm, message }: any) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-[#0B1120] text-white rounded-lg shadow-xl p-6 border border-[#2970E8] max-w-md w-full">
                    <Dialog.Title className="text-lg font-semibold text-[#B3E10F] mb-4">
                        Confirmar acción
                    </Dialog.Title>
                    <p className="text-gray-300 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold text-white transition duration-150"
                        >
                            Cancelar
                        </button>
                        <button onClick={onConfirm}
                            className="bg-[#B3E10F] text-gray-900 px-4 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                        >
                            Confirmar
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
