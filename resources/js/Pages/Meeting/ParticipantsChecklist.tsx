// src/Components/Meeting/ParticipantsChecklist.tsx

import React from 'react';

interface ListItem {
    id: number;
    name: string;
}

interface ParticipantsChecklistProps {
    usersList: ListItem[];
    participants: number[];
    onParticipantChange: (userId: number, isChecked: boolean) => void;
    error: string | undefined;
}

export default function ParticipantsChecklist({
    usersList,
    participants,
    onParticipantChange,
    error
}: ParticipantsChecklistProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Participantes</label>
            <div className="w-full p-3 bg-gray-800 border border-white rounded-lg max-h-48 overflow-y-auto space-y-2">
                {usersList.map((userOption) => (
                    <label 
                        key={userOption.id} 
                        className="flex items-center space-x-3 cursor-pointer p-1 rounded-md hover:bg-gray-700 transition"
                    >
                        <input
                            type="checkbox"
                            value={userOption.id}
                            checked={participants.includes(userOption.id)}
                            onChange={(e) => 
                                onParticipantChange(userOption.id, e.target.checked)
                            }
                            className="form-checkbox h-5 w-5 text-[#B3E10F] bg-gray-900 border-gray-500 rounded focus:ring-[#B3E10F]"
                        />
                        <span className="text-white text-sm">{userOption.name}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}