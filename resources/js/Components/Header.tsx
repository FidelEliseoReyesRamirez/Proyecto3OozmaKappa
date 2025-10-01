import React, { useState } from "react";
import { Link } from "@inertiajs/react";

interface HeaderProps {
    auth: {
        user: any;
    };
}

const Header: React.FC<HeaderProps> = ({ auth }) => { 
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800 sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-sm">
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
                
                <Link href={route('welcome')} className="text-2xl font-bold text-[#B3E10F] flex items-center flex-shrink-0">
                    <img src="/images/logo-develarq.png" alt="Logo" className="mr-2 p-2 w-16 h-16" />
                    DEVELARQ
                </Link>
                
                <div className="hidden sm:flex items-center space-x-6">
                    <Link href={route('welcome')} className="font-medium text-gray-400 hover:text-[#2970E8] transition duration-150">Inicio</Link>
                    <Link href={route('projects')} className="font-medium text-gray-400 hover:text-[#2970E8] transition duration-150">Proyectos</Link>
                    <Link href={route('services')} className="font-medium text-gray-400 hover:text-[#2970E8] transition duration-150">Servicios</Link>
                    <Link href={route('aboutus')} className="font-medium text-gray-400 hover:text-[#2970E8] transition duration-150">Nosotros</Link>
                    <Link href={route('welcome') + '#contacto'} className="font-medium text-gray-400 hover:text-[#2970E8] transition duration-150">Contacto</Link>

                    {auth.user ? (
                        <Link href={route('dashboard')} className="font-semibold text-gray-400 hover:text-[#B3E10F] transition duration-150">Dashboard</Link>
                    ) : (
                        <Link href={route('login')} className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-opacity-80 transition duration-150 font-semibold shadow-lg ml-4">
                            <span className="mr-1">→</span> Acceder
                        </Link>
                    )}
                </div>

                <button className="sm:hidden p-2 rounded-lg text-white hover:bg-gray-800 transition duration-150" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                    <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl text-[#B3E10F]`}></i>
                </button>
            </nav>
            <div className={`fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-xl z-40 transition-transform duration-300 transform 
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} sm:hidden`}>
                <div className="flex flex-col p-6 space-y-4 pt-20">
                    <Link onClick={closeMenu} href={route('welcome')} className="font-medium text-gray-300 hover:text-[#2970E8] border-b border-gray-800 pb-2">Inicio</Link>
                    <Link onClick={closeMenu} href={route('projects')} className="font-medium text-gray-300 hover:text-[#2970E8] border-b border-gray-800 pb-2">Proyectos</Link>
                    <Link onClick={closeMenu} href={route('services')} className="font-medium text-gray-300 hover:text-[#2970E8] border-b border-gray-800 pb-2">Servicios</Link>
                    <Link onClick={closeMenu} href={route('aboutus')} className="font-medium text-gray-300 hover:text-[#2970E8] border-b border-gray-800 pb-2">Nosotros</Link>
                    <Link onClick={closeMenu} href={route('welcome') + '#contacto'} className="font-medium text-gray-300 hover:text-[#2970E8] border-b border-gray-800 pb-2">Contacto</Link>
                    
                    {auth.user ? (
                        <Link onClick={closeMenu} href={route('dashboard')} className="font-semibold text-[#B3E10F] pt-4">Dashboard</Link>
                    ) : (
                        <Link onClick={closeMenu} href={route('login')} className="mt-4 px-4 py-2 text-center bg-[#2970E8] text-white rounded-lg hover:bg-opacity-80 font-semibold shadow-lg">
                            Acceder
                        </Link>
                    )}
                </div>
            </div>
            
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={closeMenu}/>
            )}
        </header>
    );
}

export default Header;