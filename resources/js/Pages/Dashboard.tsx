import React, { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Chart from "chart.js/auto";
import axios from "axios";

type UserRole = "admin" | "arquitecto" | "ingeniero" | "cliente";

export default function Dashboard() {
    const props = usePage().props as any;
    const user = props.user;
    const rol: UserRole = props.rol;
    const rolData = props.rolData;
    const proyectos = props.proyectos;
    const statsGlobales = props.stats;

    const [mostrarTodosProyectos, setMostrarTodosProyectos] = useState(false);
    const [stats, setStats] = useState(props.stats);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<number | string>("todos");

    const chartGeneralRef = useRef<any>(null);
    const chartProyectosRef = useRef<any>(null);
    const chartTareasRef = useRef<any>(null);
    const chartEstadoRef = useRef<any>(null);
    const chartDocsRef = useRef<any>(null);
    const chartAuditoriaRef = useRef<any>(null);

    const generalCanvas = useRef<HTMLCanvasElement | null>(null);
    const proyectosCanvas = useRef<HTMLCanvasElement | null>(null);
    const tareasCanvas = useRef<HTMLCanvasElement | null>(null);
    const estadoCanvas = useRef<HTMLCanvasElement | null>(null);
    const docsCanvas = useRef<HTMLCanvasElement | null>(null);
    const auditoriaCanvas = useRef<HTMLCanvasElement | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const getRoleColors = () => {
        if (!containerRef.current)
            return { accent: "#ffffff", accentBg: "rgba(255,255,255,0.3)" };

        const styles = getComputedStyle(containerRef.current);
        return {
            accent: styles.getPropertyValue("--accent").trim(),
            accentBg: styles.getPropertyValue("--accent-bg").trim(),
        };
    };

    const cargarStatsProyecto = async (id: number) => {
        const res = await axios.get(`/dashboard/proyecto/${id}`);
        setStats(res.data.stats);
    };

    useEffect(() => {
        if (proyectoSeleccionado === "todos") {
            setStats(statsGlobales);
        } else {
            cargarStatsProyecto(Number(proyectoSeleccionado));
        }
    }, [proyectoSeleccionado]);


    /* ==========================
       GRÁFICOS
    ========================== */
    useEffect(() => {
        const { accent, accentBg } = getRoleColors();
        const isAdmin = rol === "admin";
        const isGlobal = proyectoSeleccionado === "todos";

        const totalDocs =
            (stats.documentosPDF ?? 0) +
            (stats.documentosExcel ?? 0) +
            (stats.documentosWord ?? 0) +
            (stats.documentosURL ?? 0);

        const totalTareas =
            (stats.tareasPendientes ?? 0) +
            (stats.tareasEnProgreso ?? 0) +
            (stats.tareasCompletadas ?? 0);

        /* --- ADMIN: Actividad general --- */
        if (isAdmin && isGlobal && generalCanvas.current) {
            if (chartGeneralRef.current) chartGeneralRef.current.destroy();
            chartGeneralRef.current = new Chart(generalCanvas.current, {
                type: "bar",
                data: {
                    labels: ["Proyectos", "Documentos", "Usuarios", "Auditoría", "Tareas"],
                    datasets: [
                        {
                            label: "Actividad General",
                            data: [
                                stats.totalProyectos ?? 0,
                                totalDocs,
                                stats.usuariosTotales ?? 0,
                                stats.auditoriaSemana ?? 0,
                                totalTareas,
                            ],
                            backgroundColor: accentBg,
                            borderColor: accent,
                            borderWidth: 3,
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* --- ADMIN: Proyectos por estado --- */
        if (isAdmin && isGlobal && proyectosCanvas.current) {
            if (chartProyectosRef.current) chartProyectosRef.current.destroy();
            chartProyectosRef.current = new Chart(proyectosCanvas.current, {
                type: "doughnut",
                data: {
                    labels: ["Activos", "En Progreso", "Finalizados"],
                    datasets: [
                        {
                            data: [
                                stats.proyectosActivos ?? 0,
                                stats.proyectosProgreso ?? 0,
                                stats.proyectosFinalizados ?? 0,
                            ],
                            backgroundColor: [accent, accentBg, "#444"],
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* --- Todas las vistas: Prioridad --- */
        if (tareasCanvas.current) {
            if (chartTareasRef.current) chartTareasRef.current.destroy();
            chartTareasRef.current = new Chart(tareasCanvas.current, {
                type: "radar",
                data: {
                    labels: ["Baja", "Media", "Alta"],
                    datasets: [
                        {
                            label: "Prioridad",
                            data: [
                                stats.tareasBaja ?? 0,
                                stats.tareasMedia ?? 0,
                                stats.tareasAlta ?? 0,
                            ],
                            backgroundColor: accentBg,
                            borderColor: accent,
                            borderWidth: 3,
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* --- Todas las vistas: Estados de tareas --- */
        if (estadoCanvas.current) {
            if (chartEstadoRef.current) chartEstadoRef.current.destroy();
            chartEstadoRef.current = new Chart(estadoCanvas.current, {
                type: "doughnut",
                data: {
                    labels: ["Pendiente", "En Progreso", "Completado"],
                    datasets: [
                        {
                            label: "Estado",
                            data: [
                                stats.tareasPendientes ?? 0,
                                stats.tareasEnProgreso ?? 0,
                                stats.tareasCompletadas ?? 0,
                            ],
                            backgroundColor: [accent, accentBg, "#777"],
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* --- Documentos --- */
        if (docsCanvas.current) {
            if (chartDocsRef.current) chartDocsRef.current.destroy();
            chartDocsRef.current = new Chart(docsCanvas.current, {
                type: "pie",
                data: {
                    labels: ["PDF", "Excel", "Word", "URL"],
                    datasets: [
                        {
                            data: [
                                stats.documentosPDF ?? 0,
                                stats.documentosExcel ?? 0,
                                stats.documentosWord ?? 0,
                                stats.documentosURL ?? 0,
                            ],
                            backgroundColor: [accent, accentBg, "#666", "#999"],
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* --- ADMIN: Auditoría --- */
        if (isAdmin && auditoriaCanvas.current) {
            if (chartAuditoriaRef.current) chartAuditoriaRef.current.destroy();
            chartAuditoriaRef.current = new Chart(auditoriaCanvas.current, {
                type: "line",
                data: {
                    labels: stats.auditoriaDias?.map((d: any) => d.fecha) ?? [],
                    datasets: [
                        {
                            label: "Eventos de Auditoría",
                            data: stats.auditoriaDias?.map((d: any) => d.total) ?? [],
                            backgroundColor: accentBg,
                            borderColor: accent,
                            borderWidth: 3,
                            tension: 0.3,
                        },
                    ],
                },
                options: { responsive: true },
            });
        }
    }, [stats, rol, proyectoSeleccionado]);


    const isAdmin = rol === "admin";
    const isGlobal = proyectoSeleccionado === "todos";

    /* ==========================
       RETURN
    ========================== */

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div ref={containerRef} className={`min-h-screen bg-[#121212] ${"rol-" + rol}`}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-gray-900 p-6 shadow sm:rounded-lg text-white border border-gray-700">

                            {/* =====================================================
                               PROYECTOS ARRIBA (SOLO 3) + VER MÁS
                            ===================================================== */}
                            <h2 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                                Proyectos
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {(mostrarTodosProyectos ? proyectos : proyectos.slice(0, 3)).map((p: any) => (
                                    <div
                                        key={p.id}
                                        className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-[var(--accent)] transition"
                                    >
                                        <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
                                            {p.nombre}
                                        </p>

                                        {isAdmin && (
                                            <p className="text-gray-400 text-sm mt-1">
                                                Responsable: {p.responsable?.name ?? "No asignado"}
                                                <br />
                                                Cliente: {p.cliente?.name ?? "No asignado"}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {proyectos.length > 3 && (
                                <button
                                    className="mt-3 text-sm text-[var(--accent)] underline"
                                    onClick={() => setMostrarTodosProyectos(!mostrarTodosProyectos)}
                                >
                                    {mostrarTodosProyectos ? "Ver menos" : "Ver más"}
                                </button>
                            )}

                            {/* =====================================================
                               SELECCIONAR PROYECTO
                            ===================================================== */}
                            <h2 className="text-xl font-bold mt-10" style={{ color: "var(--accent)" }}>
                                Elegir Proyecto
                            </h2>

                            <div className="mt-3">
                                <select
                                    className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                                    value={proyectoSeleccionado}
                                    onChange={(e) => setProyectoSeleccionado(e.target.value)}
                                >
                                    {isAdmin && <option value="todos">Todos los proyectos</option>}
                                    {!isAdmin && <option value="todos">Todos mis proyectos</option>}

                                    {proyectos.map((p: any) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* =====================================================
                               ESTADÍSTICAS
                            ===================================================== */}
                            <h2 className="text-xl font-bold mt-10" style={{ color: "var(--accent)" }}>
                                {isGlobal
                                    ? isAdmin
                                        ? "Estadísticas Generales del Sistema"
                                        : "Estadísticas Globales de Mis Proyectos"
                                    : "Estadísticas del Proyecto"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {isAdmin && isGlobal ? (
                                    <>
                                        <StatCard label="Proyectos Totales" value={stats.totalProyectos} />
                                        <StatCard label="Proyectos Activos" value={stats.proyectosActivos} />
                                        <StatCard label="Usuarios Totales" value={stats.usuariosTotales} />
                                    </>
                                ) : (
                                    <>
                                        <StatCard label="Pendientes" value={stats.tareasPendientes} />
                                        <StatCard label="En Progreso" value={stats.tareasEnProgreso} />
                                        <StatCard label="Completadas" value={stats.tareasCompletadas} />
                                    </>
                                )}
                            </div>

                            {/* =====================================================
                               GRÁFICOS
                            ===================================================== */}
                            <h2 className="text-xl font-bold mt-12 mb-4" style={{ color: "var(--accent)" }}>
                                Gráficos
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {isAdmin && isGlobal && (
                                    <>
                                        <ChartCard title="Actividad General">
                                            <canvas ref={generalCanvas}></canvas>
                                        </ChartCard>

                                        <ChartCard title="Proyectos por Estado">
                                            <canvas ref={proyectosCanvas}></canvas>
                                        </ChartCard>
                                    </>
                                )}

                                <ChartCard title="Prioridad de Tareas">
                                    <canvas ref={tareasCanvas}></canvas>
                                </ChartCard>

                                <ChartCard title="Estado de Tareas">
                                    <canvas ref={estadoCanvas}></canvas>
                                </ChartCard>

                                <ChartCard title="Documentos por Tipo">
                                    <canvas ref={docsCanvas}></canvas>
                                </ChartCard>

                                {isAdmin && (
                                    <ChartCard title="Auditoría Últimos 7 Días">
                                        <canvas ref={auditoriaCanvas}></canvas>
                                    </ChartCard>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* =====================================================
   COMPONENTES AUXILIARES
===================================================== */

function StatCard({ label, value }: any) {
    return (
        <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
                {label}
            </h3>
            <p className="text-3xl mt-2 font-bold">{value ?? 0}</p>
        </div>
    );
}

function ChartCard({ title, children }: any) {
    return (
        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--accent)" }}>
                {title}
            </h3>
            {children}
        </div>
    );
}
