// PlanosFilters.tsx

import React from 'react';

// Tipos de props para este componente
interface PlanoFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    filterTipo: string;
    setFilterTipo: (value: string) => void;
    filterProyecto: string;
    setFilterProyecto: (value: string) => void;
    filterStart: string;
    setFilterStart: (value: string) => void;
    filterEnd: string;
    setFilterEnd: (value: string) => void;
    order: 'desc' | 'asc';
    setOrder: (value: 'desc' | 'asc') => void;
    handleClearFilters: () => void;
    projectsList: { id: number; name: string }[];
    projectOpen: boolean;
    setProjectOpen: (value: boolean) => void;
    projectSearch: string;
    setProjectSearch: (value: string) => void;
    proyectosFiltrados: { id: number; name: string }[];
}

const PlanosFilters: React.FC<PlanoFiltersProps> = ({
    search,
    setSearch,
    filterTipo,
    setFilterTipo,
    filterProyecto,
    setFilterProyecto,
    filterStart,
    setFilterStart,
    filterEnd,
    setFilterEnd,
    order,
    setOrder,
    handleClearFilters,
    projectsList,
    projectOpen,
    setProjectOpen,
    projectSearch,
    setProjectSearch,
    proyectosFiltrados,
}) => {
    // Función de helper para obtener el nombre del proyecto
    const getProjectName = () => {
        return filterProyecto
            ? projectsList.find((p) => p.id === parseInt(filterProyecto))?.name
            : 'Proyecto: Todos';
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-3 justify-between items-center">
            {/* Input de Búsqueda General */}
            <input
                type="text"
                placeholder="Buscar título o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow min-w-[180px] px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8]"
            />

            {/* SELECTOR DE TIPO (Formatos BIM) */}
            <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8] pr-8"
            >
                <option value="">Tipo: Todos</option>
                <option value="IFC">IFC</option>
                <option value="RVT">RVT (Revit)</option>
                <option value="DWG">DWG (AutoCAD)</option>
                <option value="NWC">NWC (Navisworks)</option>
                <option value="PDF">PDF</option>
                <option value="IMG">Imagen/Render</option>
                <option value="URL">URL/Enlace</option>
            </select>

            {/* PROYECTO BUSCABLE */}
            <div className="relative combo-proyectos min-w-[180px]">
                <div
                    className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm cursor-pointer"
                    onClick={() => setProjectOpen(!projectOpen)}
                >
                    {getProjectName()}
                </div>

                {projectOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 text-gray-200 text-sm border-b border-gray-700 focus:outline-none"
                        />
                        <div
                            onClick={() => {
                                setFilterProyecto('');
                                setProjectOpen(false);
                            }}
                            className="px-3 py-2 text-sm text-gray-300 hover:bg-[#2970E8] hover:text-white cursor-pointer"
                        >
                            Todos los proyectos
                        </div>
                        {proyectosFiltrados.map((proj) => (
                            <div
                                key={proj.id}
                                onClick={() => {
                                    setFilterProyecto(String(proj.id));
                                    setProjectOpen(false);
                                }}
                                className={`px-3 py-2 text-sm cursor-pointer ${filterProyecto === String(proj.id)
                                    ? 'bg-[#1f5dc0] text-white'
                                    : 'text-gray-200 hover:bg-[#2970E8] hover:text-white'
                                    }`}
                            >
                                {proj.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FECHAS y Orden */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="date"
                    value={filterStart}
                    onChange={(e) => setFilterStart(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8]"
                    placeholder="Desde"
                    title="Fecha Desde"
                />
                <input
                    type="date"
                    value={filterEnd}
                    onChange={(e) => setFilterEnd(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8]"
                    placeholder="Hasta"
                    title="Fecha Hasta"
                />
            </div>

            {/* Selector de Orden */}
            <select
                value={order}
                onChange={(e) => setOrder(e.target.value as 'desc' | 'asc')}
                className="px-3 py-2 rounded-md bg-[#080D15] text-white border border-gray-700 text-sm focus:ring-2 focus:ring-[#2970E8] pr-8"
            >
                <option value="desc">Más recientes primero</option>
                <option value="asc">Más antiguos primero</option>
            </select>

            {/* Botón Limpiar Filtros */}
            <button
                onClick={handleClearFilters}
                className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-md transition duration-150 font-semibold"
            >
                Limpiar filtros
            </button>
        </div>
    );
};

export default PlanosFilters;