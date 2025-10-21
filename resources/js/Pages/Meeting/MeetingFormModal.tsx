// src/Components/Meeting/MeetingFormModal.tsx

import React, { useState, useEffect } from 'react';
import { useForm, InertiaFormProps } from '@inertiajs/react';
import moment from 'moment';
import MeetingForm from './MeetingForm';

interface ListItem {
    id: number;
    name: string;
}

export interface FormData {
    id?: number;
    title: string;
    start: string;
    end: string;
    description: string;
    projectId: string | number;
    participants: number[];
}

interface MeetingFormModalProps {
    show: boolean;
    onClose: () => void;
    initialData: FormData;
    projectsList: ListItem[];
    usersList: ListItem[];
    userRole: string;
}
export default function MeetingFormModal({
    show,
    onClose,
    initialData,
    projectsList,
    usersList,
    userRole
}: MeetingFormModalProps) {

    const [timeConflictError, setTimeConflictError] = useState<string | null>(null);

    const initialFormattedData: FormData = {
        ...initialData,
        start: initialData.start ? moment(initialData.start).format('YYYY-MM-DDTHH:mm') : '',
        end: initialData.end ? moment(initialData.end).format('YYYY-MM-DDTHH:mm') : '',
        projectId: initialData.projectId ? String(initialData.projectId) : '',
    };

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        delete: destroy
    } = useForm<FormData>(initialFormattedData);

    const isEditing = !!data.id;
    const isClient = userRole === 'cliente';
    const isReadOnly = isClient;
    const isInternalUser = !isClient;

    useEffect(() => {
        if (!show) {
            setTimeConflictError(null);
        }
    }, [show]);

    if (!show) {
        return null;
    }

    const handleParticipantChange = (userId: number, isChecked: boolean) => {
        if (isReadOnly) return;

        setData((prevData) => {
            const newParticipants = isChecked
                ? [...prevData.participants, userId].filter((id, index, self) => self.indexOf(id) === index)
                : prevData.participants.filter((id) => id !== userId);

            return { ...prevData, participants: newParticipants };
        });
    };

    const submitMeeting = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        const routeName = isEditing ? 'meetings.update' : 'meetings.store';
        const method = isEditing ? put : post;
        const routeParams = isEditing ? data.id : undefined;

        setTimeConflictError(null);

        method(route(routeName, routeParams), {
            onSuccess: () => {
                onClose();
                reset();
            },
            onError: (err: any) => {
                if (err.time_conflict) {
                    setTimeConflictError(err.time_conflict);
                    setTimeout(() => setTimeConflictError(null), 5000);
                }
                console.error("Error al guardar/actualizar la reunión:", err);
            },
        });
    };

    const handleDelete = () => {
        if (!isInternalUser || isReadOnly) return;

        // Eliminación directa desde el modal visual del MeetingForm
        destroy(route("meetings.destroy", data.id), {
            onSuccess: () => {
                onClose();
            },
            onError: (e) => {
                console.error("Error al eliminar la reunión:", e);
            },
        });
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
            <div className="bg-[#1D3557] rounded-xl shadow-2xl max-w-lg w-full p-6 border border-white max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-white">
                    {isEditing ? (isReadOnly ? 'Detalles de la Reunión' : 'Editar Reunión') : 'Programar Nueva Reunión'}
                </h2>

                {timeConflictError && (
                    <div className="absolute top-4 right-4 z-[60] p-4 bg-red-600 text-white rounded-lg shadow-xl animate-fade-in-down transition-opacity duration-300">
                        <p className="font-semibold">⚠️ ¡Error de Horario!</p>
                        <p className="text-sm">{timeConflictError}</p>
                    </div>
                )}

                <MeetingForm
                    data={data}
                    setData={setData as InertiaFormProps<FormData>['setData']}
                    errors={errors}
                    processing={processing}
                    isEditing={isEditing}
                    isInternalUser={isInternalUser}
                    isReadOnly={isReadOnly}
                    projectsList={projectsList}
                    usersList={usersList}
                    onParticipantChange={handleParticipantChange}
                    onSubmit={submitMeeting}
                    onDelete={handleDelete}
                    onCancel={() => { onClose(); reset(); }}
                />

            </div>
        </div>
    );
}