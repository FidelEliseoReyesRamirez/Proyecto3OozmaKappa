import { Link, Head } from '@inertiajs/react';
import React from 'react';

interface ProjectsProps {
    auth: {
        user: any;
    };
    laravelVersion: string;
    phpVersion: string;
}

const Projects: React.FC<ProjectsProps> = ({ auth }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Transformación BIM y Outsourcing" />
            
            {/* 1. Barra de Navegación  */}
            <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800 sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm">
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    {/* Logo*/}
                    <div className="text-2xl font-bold text-[#B3E10F] flex items-center">
                        <img src="/images/logo-develarq.png" alt="Logo" className="mr-2 p-2 w-32 h-32" />
                        DEVELARQ
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        {/* Enlaces de Navegación */}
                        <a href="/" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Inicio</a>
                        <a href="/Proyects" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Proyectos</a>
                        <a href="#servicios" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Servicios</a>
                        <a href="#quienes-somos" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Nosotros</a>
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
            {/* 2. Sección de Proyectos */}
            <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto text-center">
                    
                    {/* Título y Subtítulo */}
                    
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Proyectos <span className="text-[#B3E10F]">BIM </span>Desarrollados
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                        Explora nuestra galería de proyectos desarrollados con metodología BIM avanzada
                    </p>
                    
                    {/* Grid de Tarjetas*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Tarjeta 1 */}
                        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                <img src="/images/modern-residential-tower-bim.png" alt="Proyecto 1" className="object-cover w-full h-full" />
                                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-black/60 rounded">Residencial</span>
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Torre Residencial Moderna</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">15,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">25 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">65%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                                <div className="text-center"><p className="text-lg font-bold text-white">Nuestro diseño de la torre residencial es uno moderno....</p></div> 
                            </div>
                        </div>

                        {/* Tarjeta 2 */}
                        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                <img src="/images/shopping-mall-bim.png" alt="Proyecto 2" className="object-cover w-full h-full" />
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Centro Comercial Metropolitano</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">45,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">4 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">58%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                                <div className="text-center"><p className="text-lg font-bold text-white">Nuestro diseño del centro comercial metropolitano....</p></div> 
                            </div>
                        </div>

                        {/* Tarjeta 3 */}
                        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                <img src="/images/hospital-bim-model.png" alt="Proyecto 3" className="object-cover w-full h-full" />
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Hospital Regional</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">28,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">8 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">72%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                                <div className="text-center"><p className="text-lg font-bold text-white">Nuestro diseño del hospital regional....</p></div> 
                            </div>
                        </div>

                        {/* Tarjeta 4 */}
                        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                <img src="/images/industrial-complex-bim.png" alt="Proyecto 4" className="object-cover w-full h-full" />
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Complejo Industrial</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">60,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">3 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">48%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                                <div className="text-center"><p className="text-lg font-bold text-white">Nuestro diseño del complejo industrial....</p></div> 
                            </div>
                        </div>

                        {/* Tarjeta 5 */}
                        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                <img src="/images/university-bim-building.png" alt="Proyecto 5" className="object-cover w-full h-full" />
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Universidad Tecnológica</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">35,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">6 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">61%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                                <div className="text-center"><p className="text-lg font-bold text-white">Nuestro diseño de la universidad tecnologíca....</p></div> 
                            </div>
                        </div>

                        {/* Tarjeta 6 */}
                        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                <img src="/images/airport-terminal-bim.png" alt="Proyecto 6" className="object-cover w-full h-full" />
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Aeropuerto Internacional</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">120,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">3 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">55%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                                <div className="text-center"><p className="text-lg font-bold text-white">Nuestro diseño del aeropuerto internacional....</p></div> 
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-black text-white pt-12 pb-6 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. SECCIÓN PRINCIPAL: Info y Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-10">
                    
                    {/* Columna 1: Info General / Slogan */}
                    <div className="col-span-2 md:col-span-1">
                        {/* Nombre de la empresa con color de acento (simulando un logo simple) */}
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
                            <li><a href="/servicios#bim-mep" className="text-gray-400 hover:text-white transition duration-200">Modelado BIM/MEP</a></li>
                            <li><a href="/servicios#analisis" className="text-gray-400 hover:text-white transition duration-200">Análisis de Datos</a></li>
                            <li><a href="/servicios#4d" className="text-gray-400 hover:text-white transition duration-200">Planificación 4D</a></li>
                            <li><a href="/servicios#consultoria" className="text-gray-400 hover:text-white transition duration-200">Consultoría Internacional</a></li>
                        </ul>
                    </div>
                    
                    {/* Columna 3: Empresa */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Empresa</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/nosotros" className="text-gray-400 hover:text-white transition duration-200">Quiénes Somos</a></li>
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
                
                {/* 2. LÍNEA DIVISORIA */}
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

        </div> 
    );
};
export default Projects;