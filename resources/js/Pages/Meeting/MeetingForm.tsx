// src/Components/Meeting/MeetingForm.tsx

import React from 'react';
import { InertiaFormProps } from '@inertiajs/react';
import { FormData } from './MeetingFormModal'; 
import ParticipantsChecklist from './ParticipantsChecklist'; 

interface ListItem {
    id: number;
    name: string;
}

interface MeetingFormProps {
    data: FormData;
    setData: InertiaFormProps<FormData>['setData'];
    errors: InertiaFormProps<FormData>['errors'];
    processing: boolean;
    isEditing: boolean;
    isInternalUser: boolean;
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
    projectsList,
    usersList,
    onParticipantChange,
    onSubmit,
    onDelete,
    onCancel,
}: MeetingFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            
            {/* Título */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                <input 
                    type="text" 
                    placeholder="Ej: Reunión de avance Proyecto X" 
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:ring-[#B3E10F] focus:border-[#B3E10F]"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            
            {/* Proyecto */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proyecto</label>
                <select 
                    value={String(data.projectId)}
                    onChange={e => setData('projectId', e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white focus:ring-[#B3E10F] focus:border-[#B3E10F]"
                >
                    <option value="" disabled>Selecciona un proyecto</option>
                    {projectsList.map((project) => (
                        <option key={project.id} value={String(project.id)}>{project.name}</option>
                    ))}
                </select>
                {errors.projectId && <p className="text-red-400 text-xs mt-1">{errors.projectId}</p>}
            </div>

            {/* Fechas y Horas */}
            <div className="grid grid-cols-2 gap-4">
                {/* Inicio */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Inicio</label>
                    <input 
                        type="datetime-local" 
                        value={data.start}
                        onChange={e => setData('start', e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white focus:ring-[#B3E10F] focus:border-[#B3E10F]"
                    />
                    {errors.start && <p className="text-red-400 text-xs mt-1">{errors.start}</p>}
                </div>
                {/* Fin */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Fin</label>
                    <input 
                        type="datetime-local" 
                        value={data.end}
                        onChange={e => setData('end', e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white focus:ring-[#B3E10F] focus:border-[#B3E10F]"
                    />
                    {errors.end && <p className="text-red-400 text-xs mt-1">{errors.end}</p>}
                </div>
            </div>
            
            {/* PARTICIPANTES  */}
            <ParticipantsChecklist
                usersList={usersList}
                participants={data.participants}
                onParticipantChange={onParticipantChange}
                error={errors.participants}
            />

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                <textarea
                    placeholder="Agenda de la reunión, objetivos..."
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:ring-[#B3E10F] focus:border-[#B3E10F]"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>


            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                
                {/* Botón de Eliminar */}
                {isEditing && isInternalUser && (
                    <button 
                        type="button" 
                        onClick={onDelete}
                        disabled={processing}
                        className="px-5 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition"
                    >
                        {processing ? 'Eliminando...' : 'Eliminar'}
                    </button>
                )}

                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={processing}
                    className="px-5 py-2 bg-[#B3E10F] text-black rounded-lg font-semibold hover:bg-[#8aab13] transition"
                >
                    {processing 
                        ? (isEditing ? 'Actualizando...' : 'Guardando...') 
                        : (isEditing ? 'Guardar Cambios' : 'Crear Reunión')
                    }
                </button>
            </div>
        </form>
    );
}