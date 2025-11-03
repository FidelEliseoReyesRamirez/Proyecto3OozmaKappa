import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import NotificationsBell from '@/Components/NotificationsBell';
import { useNotifications } from '@/Hooks/useNotifications';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { notificaciones, hasUnread } = useNotifications();
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, '', window.location.href);
        };
    }, []);

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#121212] text-white">
            <nav className="bg-[#121212] border-b border-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                            </Link>
                        </div>

                        {/* ===== MENÚ PRINCIPAL (ESCRITORIO) ===== */}
                        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </NavLink>

                            {user.rol === 'admin' && (
                                <NavLink href={route('users.index')} active={route().current('users.index')}>
                                    Usuarios
                                </NavLink>
                            )}

                            <NavLink href={route('proyectos.index')} active={route().current('proyectos.index')}>
                                Proyectos
                            </NavLink>

                            <NavLink href={route('tareas.index')} active={route().current('tareas.index')}>
                                Tablero Kanban
                            </NavLink>

                            <NavLink href={route('calendar')} active={route().current('calendar')}>
                                Calendario
                            </NavLink>

                            <NavLink href={route('docs.index')} active={route().current('docs.index')}>
                                Documentos
                            </NavLink>

                            {user.rol === 'cliente' && (
                                <NavLink href={route('avances.index')} active={route().current('avances.index')}>
                                    Avances Proyecto
                                </NavLink>
                            )}

                            {user.rol === 'admin' && (
                                <NavLink href={route('documents.history')} active={route().current('documents.history')}>
                                    Historial Descargas
                                </NavLink>
                            )}

                            {/* ✅ NUEVO: ENLACE AUDITORÍA SOLO ADMIN */}
                            {user.rol === 'admin' && (
                                <NavLink href={route('auditoria.index')} active={route().current('auditoria.index')}>
                                    Auditoría
                                </NavLink>
                            )}
                        </div>

                        {/* ===== LADO DERECHO (NOTIFICACIONES + USUARIO) ===== */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <NotificationsBell />
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center rounded-md bg-[#B3E10F] px-3 py-2 text-sm font-semibold text-black hover:bg-lime-400 transition">
                                        {user.name}
                                        <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Cerrar sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* ===== MENÚ MÓVIL (CAMPANA + HAMBURGUESA) ===== */}
                        <div className="flex items-center lg:hidden space-x-2">
                            <NotificationsBell />
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-gray-800 focus:outline-none transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {showingNavigationDropdown ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ===== MENÚ RESPONSIVE (MÓVIL) ===== */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} lg:hidden border-t border-gray-700`}>
                    <div className="px-4 py-3 space-y-2 bg-[#1A1A1A]">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>

                        {user.rol === 'admin' && (
                            <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                                Usuarios
                            </ResponsiveNavLink>
                        )}

                        <ResponsiveNavLink href={route('proyectos.index')} active={route().current('proyectos.index')}>
                            Proyectos
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('tareas.index')} active={route().current('tareas.index')}>
                            Tablero Kanban
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('calendar')} active={route().current('calendar')}>
                            Calendario
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('docs.index')} active={route().current('docs.index')}>
                            Documentos
                        </ResponsiveNavLink>

                        {user.rol === 'cliente' && (
                            <ResponsiveNavLink href={route('avances.index')} active={route().current('avances.index')}>
                                Avances Proyecto
                            </ResponsiveNavLink>
                        )}

                        {user.rol === 'admin' && (
                            <>
                                <ResponsiveNavLink href={route('documents.history')} active={route().current('documents.history')}>
                                    Historial Descargas
                                </ResponsiveNavLink>

                                {/* ✅ Enlace auditoría móvil */}
                                <ResponsiveNavLink href={route('auditoria.index')} active={route().current('auditoria.index')}>
                                    Auditoría
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-700 bg-[#121212] px-4 py-3 space-y-1">
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-gray-400 mb-2">{user.email}</div>
                        <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                            Cerrar sesión
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-[#121212] shadow border-b border-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-grow">{children}</main>
        </div>
    );
}
