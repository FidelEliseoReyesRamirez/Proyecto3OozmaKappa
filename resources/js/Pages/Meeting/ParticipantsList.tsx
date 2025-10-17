// src/Components/Meeting/ParticipantsList.tsx

import React from 'react';

interface ListItem {
    id: number;
    name: string;
}

interface ParticipantsListProps {
    usersList: ListItem[]; 
    participants: number[]; 
    onParticipantChange: (userId: number, isChecked: boolean) => void;
    error: string | undefined;
    isReadOnly: boolean; 
}

export default function ParticipantsList({
    usersList,
    participants,
    onParticipantChange,
    error,
    isReadOnly 
}: ParticipantsListProps) {
    
    const selectedParticipantsNames = usersList
        .filter(user => participants.includes(user.id))
        .map(user => user.name);

    if (isReadOnly) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Participantes</label>
                <div className="w-full p-3 bg-gray-800 border border-white rounded-lg min-h-[40px] flex flex-wrap gap-2 items-center">
                    {selectedParticipantsNames.length > 0 ? (
                        selectedParticipantsNames.map((name, index) => (
                            <span 
                                key={index} 
                                className="px-3 py-1 text-xs font-semibold text-gray-900 bg-[#B3E10F] rounded-full shadow-md"
                            >
                                {name}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-sm">No hay participantes seleccionados.</p>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Participantes</label>
            <div className={`w-full p-3 bg-gray-800 border border-white rounded-lg max-h-48 overflow-y-auto space-y-2`}>
                {usersList.map((userOption) => (
                    <label 
                        key={userOption.id} 
                        className={`flex items-center space-x-3 p-1 rounded-md transition cursor-pointer hover:bg-gray-700`}
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