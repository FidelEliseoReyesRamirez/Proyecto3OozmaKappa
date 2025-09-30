import React from "react";
import { Link } from "@inertiajs/react";

interface HeaderProps {
    auth: {
        user: any;
    };
}

const Header: React.FC<HeaderProps> = ({ auth }) => { 
    return (
        <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800 sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm">
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
                <Link href={route('welcome')} className="text-2xl font-bold text-[#B3E10F] flex items-center">
                    <img src="/images/logo-develarq.png" alt="Logo" className="mr-2 p-2 w-16 h-16" />
                    DEVELARQ
                </Link>
                
                <div className="flex items-center space-x-6">
                    
                    <Link href={route('welcome')} className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Inicio</Link>
                    <Link href={route('projects')} className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Proyectos</Link>
                    
                    <Link href={route('services')} className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Servicios</Link>
                    <Link href={route('aboutus')} className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Nosotros</Link>
                    <a href="#contacto" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Contacto</a>


                    {auth.user ? (
                        <Link href={route('dashboard')} className="font-semibold text-gray-400 hover:text-[#2970E8] transition duration-150">Dashboard</Link>
                    ) : (
                        <Link href={route('login')} className="px-4 py-2 bg-[#2970E8] text-white rounded-lg hover:bg-opacity-80 transition duration-150 font-semibold shadow-lg">
                            <span className="mr-1">→</span> Acceder
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
export default Header;