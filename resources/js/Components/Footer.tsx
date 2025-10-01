import React from "react";
import { Link } from "@inertiajs/react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white pt-12 pb-6 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. LOGO Y DESCRIPCIÓN */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-10">
                    
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-2xl font-bold text-[#B3E10F] mb-4">
                            DEVELARQ
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Transformamos la industria de la construcción con soluciones BIM inteligentes, eficientes y sostenibles.
                        </p>
                    </div>

                    {/* Columna 2: Servicios */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Servicios</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href={route('services') + '#servicios'}className="text-gray-400 hover:text-white transition duration-200">Modelado BIM/MEP</Link></li>
                            <li><Link href={route('services') + '#servicios'} className="text-gray-400 hover:text-white transition duration-200">Análisis de Datos</Link></li>
                            <li><Link href={route('services') + '#servicios'} className="text-gray-400 hover:text-white transition duration-200">Planificación 4D</Link></li>
                            <li><Link href={route('services') + '#servicios'} className="text-gray-400 hover:text-white transition duration-200">Consultoría Internacional</Link></li>
                        </ul>
                    </div>
                    
                    {/* Columna 3: Empresa */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Empresa</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="acercadenosotros" className="text-gray-400 hover:text-white transition duration-200">Quiénes Somos</a></li>
                            <li><a href="/valores" className="text-gray-400 hover:text-white transition duration-200">Nuestros Valores</a></li>
                            <li><a href="/casos-exito" className="text-gray-400 hover:text-white transition duration-200">Casos de Éxito</a></li>
                            <li><a href="/carreras" className="text-gray-400 hover:text-white transition duration-200">Carreras</a></li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="mailto:contacto@develarq.com" className="text-gray-400 hover:text-white transition duration-200">contacto@develarq.com</a></li>
                            <li><a href="tel:+15551234567" className="text-gray-400 hover:text-white transition duration-200">+1 (555) 123-4567</a></li>
                            <li className="text-sm text-[#B3E10F]">Soporte 24/7</li>
                            <li className="text-sm text-gray-400">15+ países</li>
                        </ul>
                    </div>
                    
                </div>
                <hr className="border-gray-800" />
                
                {/* 3. COPYRIGHT Y LEGAL */}
                <div className="mt-6 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-center md:justify-center items-center">
                    <p className="mb-2 md:mb-0">
                        © 2024 DEVELARQ. Todos los derechos reservados.
                    </p>
                    <span className="hidden md:inline mx-2 text-gray-700">|</span>
                    <a href="/legal" className="text-[#B3E10F] hover:underline">
                         BIM Management Office
                    </a>
                </div>
                
            </div>
            </footer>
    );
};

export default Footer;