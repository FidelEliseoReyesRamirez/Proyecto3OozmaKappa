// src/Pages/UserProyectos/ProjectSelector.tsx

import React, { useCallback } from 'react';
import { router } from '@inertiajs/react';

interface ProjectListItem {
    id: number;
    nombre: string;
    estado: string;
}

interface ProjectSelectorProps {
    currentProjectId: number;
    clientProjects: ProjectListItem[];
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ currentProjectId, clientProjects }) => {
    
    const handleProjectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProjectId = e.target.value;
        if (newProjectId && newProjectId !== String(currentProjectId)) {
            router.get(route('projects.timeline', { projectId: newProjectId }));
        }
    }, [currentProjectId]);

    if (clientProjects.length <= 1) {
        return null; 
    }

    return (
        <div className="flex items-center space-x-4 mb-10">
            <label htmlFor="project-select" className="text-xl text-gray-300 font-semibold shrink-0">
                Seleccionar Proyecto:
            </label>
            
            <select
                id="project-select"
                value={currentProjectId}
                onChange={handleProjectChange}
                className="flex-grow max-w-sm rounded-lg border-gray-600 bg-gray-800 text-lg text-white focus:ring-[#B3E10F] focus:border-[#B3E10F]"
            >
                {clientProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.nombre} ({p.estado})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ProjectSelector;