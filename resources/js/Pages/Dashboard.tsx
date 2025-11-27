import React, { useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Chart from "chart.js/auto";

type UserRole = "admin" | "arquitecto" | "ingeniero" | "cliente";

export default function Dashboard() {
    const props = usePage().props as any;

    const user = props.user;
    const rol: UserRole = props.rol;

    const stats = props.stats;
    const proyectos = props.proyectos;
    const rolData = props.rolData;

    /* ==========================================================
       REFS PARA 5 GRÁFICOS
    ========================================================== */
    const chartGeneral = useRef<HTMLCanvasElement | null>(null);
    const chartProyectos = useRef<HTMLCanvasElement | null>(null);
    const chartDocs = useRef<HTMLCanvasElement | null>(null);
    const chartAuditoria = useRef<HTMLCanvasElement | null>(null);
    const chartTareas = useRef<HTMLCanvasElement | null>(null);

    /* CONTENEDOR PARA LEER VARIABLES CSS DEL ROL */
    const containerRef = useRef<HTMLDivElement | null>(null);

    /* ==========================================================
       OBTENER COLORES REALES DEL ROL DESDE CSS
    ========================================================== */
    const getRoleColors = () => {
        if (!containerRef.current)
            return { accent: "#ffffff", accentBg: "rgba(255,255,255,0.3)" };

        const styles = getComputedStyle(containerRef.current);
        return {
            accent: styles.getPropertyValue("--accent").trim(),
            accentBg: styles.getPropertyValue("--accent-bg").trim(),
        };
    };

    /* ==========================================================
       GENERAR GRÁFICOS
    ========================================================== */
    useEffect(() => {
        const { accent, accentBg } = getRoleColors();

        /* 1. Actividad general */
        if (chartGeneral.current) {
            new Chart(chartGeneral.current, {
                type: "bar",
                data: {
                    labels: ["Proyectos", "Documentos", "Usuarios", "Auditoría", "Tareas"],
                    datasets: [
                        {
                            label: "Actividad General",
                            data: [
                                stats.totalProyectos,
                                stats.documentosPDF +
                                stats.documentosExcel +
                                stats.documentosWord +
                                stats.documentosURL,
                                stats.usuariosTotales,
                                stats.auditoriaSemana,
                                stats.tareasPendientes,
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

        /* 2. Proyectos por estado */
        if (chartProyectos.current) {
            new Chart(chartProyectos.current, {
                type: "doughnut",
                data: {
                    labels: ["Activos", "En Progreso", "Finalizados"],
                    datasets: [
                        {
                            data: [
                                stats.proyectosActivos,
                                stats.proyectosProgreso,
                                stats.proyectosFinalizados,
                            ],
                            backgroundColor: [accent, accentBg, "#444"],
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* 3. Documentos por tipo */
        if (chartDocs.current) {
            new Chart(chartDocs.current, {
                type: "pie",
                data: {
                    labels: ["PDF", "Excel", "Word", "URL"],
                    datasets: [
                        {
                            data: [
                                stats.documentosPDF,
                                stats.documentosExcel,
                                stats.documentosWord,
                                stats.documentosURL,
                            ],
                            backgroundColor: [accent, accentBg, "#666", "#999"],
                        },
                    ],
                },
                options: { responsive: true },
            });
        }

        /* 4. Auditoría últimos 7 días */
        if (chartAuditoria.current) {
            new Chart(chartAuditoria.current, {
                type: "line",
                data: {
                    labels: stats.auditoriaDias.map((d: any) => d.fecha),
                    datasets: [
                        {
                            label: "Eventos de Auditoría",
                            data: stats.auditoriaDias.map((d: any) => d.total),
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

        /* 5. Tareas por prioridad */
        if (chartTareas.current) {
            new Chart(chartTareas.current, {
                type: "radar",
                data: {
                    labels: ["Baja", "Media", "Alta"],
                    datasets: [
                        {
                            label: "Prioridad",
                            data: [stats.tareasBaja, stats.tareasMedia, stats.tareasAlta],
                            backgroundColor: accentBg,
                            borderColor: accent,
                            borderWidth: 3,
                        },
                    ],
                },
                options: { responsive: true },
            });
        }
    }, [stats, rol]);

    /* ==========================================================
       VISTA COMPLETA
    ========================================================== */
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div ref={containerRef} className={`min-h-screen bg-[#121212] ${"rol-" + rol}`}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-gray-900 p-6 shadow sm:rounded-lg text-white border border-gray-700">

                            {/* TÍTULO */}
                            <h1 className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                                Bienvenido, {user.name}
                            </h1>

                            <p className="text-[var(--text-muted)] mt-1">
                                Panel con métricas, gráficos y datos según tu rol.
                            </p>

                            {/* PANEL DEL ROL ARRIBA */}
                            <div className="mt-10">
                                {rol === "admin" && <SectionAdmin data={rolData} />}
                                {rol === "arquitecto" && <SectionArquitecto data={rolData} />}
                                {rol === "ingeniero" && <SectionIngeniero data={rolData} />}
                                {rol === "cliente" && <SectionCliente data={rolData} />}
                            </div>

                            {/* ESTADÍSTICAS GENERALES */}
                            <h2 className="text-xl font-bold mt-12 mb-3" style={{ color: "var(--accent)" }}>
                                Estadísticas Generales
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard label="Proyectos Totales" value={stats.totalProyectos} />
                                <StatCard label="Proyectos Activos" value={stats.proyectosActivos} />
                                <StatCard label="Usuarios Totales" value={stats.usuariosTotales} />
                            </div>

                            {/* GRÁFICOS */}
                            <h2 className="text-xl font-bold mt-12 mb-4" style={{ color: "var(--accent)" }}>
                                Gráficos del Sistema
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                <ChartCard title="Actividad General"><canvas ref={chartGeneral}></canvas></ChartCard>

                                <ChartCard title="Proyectos por Estado"><canvas ref={chartProyectos}></canvas></ChartCard>

                                <ChartCard title="Documentos por Tipo"><canvas ref={chartDocs}></canvas></ChartCard>

                                <ChartCard title="Auditoría Últimos 7 Días"><canvas ref={chartAuditoria}></canvas></ChartCard>

                                <ChartCard title="Prioridad de Tareas"><canvas ref={chartTareas}></canvas></ChartCard>
                            </div>

                            {/* PROYECTOS */}
                            <h2 className="text-2xl font-bold mt-12" style={{ color: "var(--accent)" }}>
                                Proyectos
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {proyectos.map((p: any) => (
                                    <div key={p.id} className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-[var(--accent)] transition">
                                        <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
                                            {p.nombre}
                                        </p>

                                        {rol === "admin" && (
                                            <p className="text-gray-400 text-sm mt-1">
                                                Responsable: {p.responsable ?? "No asignado"}<br />
                                                Cliente: {p.cliente ?? "No asignado"}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ==========================================================
   COMPONENTES AUXILIARES
========================================================== */

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

function RolePanel({ title, children }: any) {
    return (
        <div className="p-6 rounded-xl border border-gray-700 bg-gray-800">
            <h3 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">{children}</div>
        </div>
    );
}

const RoleCard = ({ label, value }: any) => (
    <div className="p-4 rounded-xl border border-gray-700 bg-gray-900">
        <h4 className="font-semibold" style={{ color: "var(--accent)" }}>{label}</h4>
        <p className="text-3xl mt-2 font-bold">{value ?? 0}</p>
    </div>
);

/* ==========================================================
   PANEL POR ROL
========================================================== */

const SectionAdmin = ({ data }: any) => (
    <RolePanel title="Panel del Administrador">
        <RoleCard label="Usuarios Activos" value={data.usuariosActivos} />
        <RoleCard label="Proyectos Finalizados" value={data.proyectosFinalizados} />
        <RoleCard label="Descargas" value={data.descargasDocumentos} />
    </RolePanel>
);

const SectionArquitecto = ({ data }: any) => (
    <RolePanel title="Panel del Arquitecto">
        <RoleCard label="Mis Proyectos" value={data.proyectosDiseño} />
        <RoleCard label="Tareas Activas" value={data.tareasActivas} />
        <RoleCard label="Planos Subidos" value={data.planosSubidos} />
    </RolePanel>
);

const SectionIngeniero = ({ data }: any) => (
    <RolePanel title="Panel del Ingeniero">
        <RoleCard label="Hitos Asignados" value={data.hitosAsignados} />
        <RoleCard label="Proyectos Técnicos" value={data.proyectosTecnicos} />
        <RoleCard label="Reuniones" value={data.reunionesProgramadas} />
    </RolePanel>
);

const SectionCliente = ({ data }: any) => (
    <RolePanel title="Panel del Cliente">
        <RoleCard label="Mis Proyectos" value={data.misProyectos} />
        <RoleCard label="Documentos Recibidos" value={data.documentosRecibidos} />
    </RolePanel>
);
