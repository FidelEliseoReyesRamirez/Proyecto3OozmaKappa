// src/Pages/UserProyectos/Timeline.tsx

import React, { useCallback, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import ProjectSelector from './ProjectSelector'; 
import MilestoneItem from './MilestoneItem';     

// --- Interfaces de Tipado ---

interface ProjectListItem {
    id: number;
    nombre: string;
    estado: string;
}

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

export interface TimelineProps {
    project: {
        id: number;
        name: string;
        status: string;
    };
    milestones: Milestone[];
    clientProjects: ProjectListItem[];
}

// --- Helpers para estilos ---

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completado':
        case 'finalizado':
            return 'text-green-500';
        case 'en progreso':
        case 'pendiente':
            return 'text-yellow-500';
        case 'bloqueado':
        default:
            return 'text-red-500';
    }
};

export const getTypeStyles = (type: Milestone['type']) => {
    switch (type) {
        case 'start':
            return { color: 'text-green-400', bg: 'bg-green-700', icon: '🚀' };
        case 'milestone':
            return { color: 'text-yellow-400', bg: 'bg-yellow-700', icon: '📝' };
        case 'delivery':
            return { color: 'text-blue-400', bg: 'bg-blue-700', icon: '📦' };
        case 'end':
            return { color: 'text-red-400', bg: 'bg-red-700', icon: '✅' };
        default:
            return { color: 'text-gray-400', bg: 'bg-gray-700', icon: '📌' };
    }
};
export default function Timeline({ project, milestones, clientProjects }: TimelineProps) {
    
    const sortedMilestones = useMemo(
        () => [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [milestones]
    );
    
    const handleGoToDashboard = useCallback(() => {
        router.visit(route('dashboard'));
    }, []);
    const projectStatusColor = getStatusColor(project.status);

    return (
        <div className="min-h-screen bg-[#1D3557] p-8 text-white">
            <Head title={`Línea de Tiempo: ${project.name}`} />

            <div className="flex items-start justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-[#B3E10F]">
                    Línea de Tiempo del Proyecto
                </h1>
                
                <div className="flex items-center space-x-4">
                    <p className="text-lg font-bold">
                        Estado Actual: <span className={`${projectStatusColor}`}>{project.status}</span>
                    </p>

                    <a
                        href={route('projects.report.pdf', { projectId: project.id })} 
                        target="_blank" 
                        download 
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-150 ease-in-out shadow-md shrink-0"
                        title="Descargar historial de estados en formato PDF"
                    >
                        <span className="mr-2">⬇️</span> Reporte PDF
                    </a>
                    
                    <button
                        onClick={handleGoToDashboard}
                        className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-150 ease-in-out shadow-md shrink-0"
                    >
                        <span className="mr-2">🏠</span> Dashboard
                    </button>
                </div>
            </div>
            <ProjectSelector 
                currentProjectId={project.id} 
                clientProjects={clientProjects} 
            />

            <div className="relative border-l border-gray-700 ml-4 md:ml-20">
                {sortedMilestones.map((milestone, index) => (
                    <MilestoneItem
                        key={index}
                        milestone={milestone}
                        isLast={index === sortedMilestones.length - 1}
                        projectStatus={project.status} 
                    />
                ))}
            </div>
        </div>
    );
}