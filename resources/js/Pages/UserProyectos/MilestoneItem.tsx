// src/Pages/UserProyectos/MilestoneItem.tsx

import React from 'react';
import { getStatusColor, getTypeStyles } from './Timeline'; 

interface Milestone {
    title: string;
    date: string;
    type: 'start' | 'milestone' | 'delivery' | 'end';
    description: string;
    status: string;
    encargado: string;
    documento: {
        id: number;
        name: string;
    } | null;
}

interface MilestoneItemProps {
    milestone: Milestone;
    isLast: boolean;
    projectStatus: string;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone, isLast, projectStatus }) => {
    
    const { color, bg, icon } = getTypeStyles(milestone.type);
    
    const formattedDate = new Date(milestone.date).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const isFinalDelivery = milestone.type === 'delivery';
    const isProjectFinalized = projectStatus.toLowerCase() === 'finalizado';

    const displayStatus = isFinalDelivery && isProjectFinalized ? 'Completado' : milestone.status;
    const displayColor = getStatusColor(displayStatus);

    const isStartOrDelivery = milestone.type === 'start' || isFinalDelivery;

    return (
        <div className="mb-8 flex items-start w-full">
            <div className="flex flex-col items-center mr-6">
                <div className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center z-10 -ml-4 md:-ml-10 ${bg} ${color}`}>
                    <span className="text-xl">{icon}</span>
                </div>
                {!isLast && (
                    <div className="w-0.5 h-full border-l border-gray-700 absolute left-[15.5px] top-[40px] md:left-[35.5px]"></div>
                )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-2xl transform hover:scale-[1.01] transition duration-300 ml-3">
                <h3 className={`text-xl font-bold mb-1 ${color}`}>
                    {milestone.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                    Fecha: <span className="font-semibold">{formattedDate}</span>
                </p>
                
                <div className="text-sm space-y-1 mb-3">
                    <p>
                        Estado: <span className={`font-bold ${displayColor}`}>{displayStatus}</span>
                    </p>
                    {isStartOrDelivery && (
                        <p>
                            Encargado: <span className="font-semibold text-white">{milestone.encargado}</span>
                        </p>
                    )}
                    {!isStartOrDelivery && ( 
                        <p>
                            Encargado del Hito: <span className="font-semibold text-white">{milestone.encargado}</span>
                        </p>
                    )}
                </div>
                
                <p className="text-gray-200 mb-3">{milestone.description}</p>

                {milestone.documento && (
                    <p className="inline-flex items-center px-3 py-1 bg-gray-600 rounded text-xs font-medium text-white mt-2">
                        <span className="mr-1">📄</span> Documento Asignado: {milestone.documento.name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MilestoneItem;