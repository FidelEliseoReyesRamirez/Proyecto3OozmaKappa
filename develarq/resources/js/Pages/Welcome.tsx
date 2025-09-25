// resources/js/Pages/Welcome.tsx

import { Link, Head } from '@inertiajs/react';
import React from 'react';

// Define la interfaz de las props (datos pasados desde Laravel)
interface WelcomeProps {
    auth: {
        user: any;
    };
    laravelVersion: string;
    phpVersion: string;
}

const Welcome: React.FC<WelcomeProps> = ({ auth }) => {

    return (
        // Contenedor principal: Dark mode - Fondo: #121212
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Transformación BIM y Outsourcing" />
            
            {/* 1. Barra de Navegación  */}
            <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800 sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm">
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    {/* Logo*/}
                    <div className="text-2xl font-bold text-[#2970E8] flex items-center">
                        <img src="/images/logo-develarq.png" alt="Logo" className="mr-2 p-2 w-32 h-32" />
                        DEVELARQ
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        {/* Enlaces de Navegación */}
                        <a href="#hero" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Inicio</a>
                        <a href="#proyectos" className="font-medium text-gray-400 hover:text-[#2970E8] hidden sm:inline">Proyectos</a>
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

            {/* 2. Sección Hero  */}
            <main id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Columna Izquierda: Título y Contenido */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-[#2970E8] bg-gray-800 rounded-full mb-4 border border-[#2970E8]/30">
                            BIM Management Office
                        </span>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                            Transformamos la 
                            <span className="text-[#2970E8]"> construcción</span> con 
                            <span className="text-[#B3E10F]"> tecnología BIM</span> 
                        </h1>
                        
                        <p className="text-lg text-gray-400 max-w-lg mb-8">
                            Optimizamos cada fase del proceso constructivo a través de modelos digitales colaborativos. 
                            Reducimos errores, ahorramos tiempo y mejoramos la coordinación entre todos los involucrados.
                        </p>

                        <div className="flex items-center space-x-4 mb-10">
                            <a href="#contacto" className="px-6 py-3 text-lg font-bold rounded-lg bg-[#B3E10F] text-[#121212] hover:bg-lime-300 transition duration-150 shadow-lg flex items-center">
                                Solicitar Consulta
                                <span className="ml-2">→</span>
                            </a>
                            <a href="#" className="px-6 py-3 text-lg font-bold rounded-lg text-gray-300 hover:text-[#2970E8] transition duration-150 flex items-center">
                                ▷ Ver Demo
                            </a>
                        </div>
                        
                        {/* Estadísticas Inferiores */}
                        <div className="flex space-x-8 pt-4 border-t border-gray-800">
                            <div>
                                <h3 className="text-3xl font-bold text-[#B3E10F]">40-70%</h3>
                                <p className="text-sm text-gray-400">Ahorro en costos</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-[#2970E8]">+500</h3> 
                                <p className="text-sm text-gray-400">Proyectos completados</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-[#B3E10F]">15+</h3> 
                                <p className="text-sm text-gray-400">Países atendidos</p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Visualización */}
                    <div className="lg:col-span-6 xl:col-span-5"> 
                        <img src="/images/bim-analysis.png" alt="Visualización BIM" 
                            className="w-full h-auto rounded-xl shadow-2xl border border-gray-700 transform transition-transform duration-300 scale-105 hover:scale-110"/>
                    </div>

                </div>
            </main>
            
            {/* 3. Sección Proyectos BIM Desarrollados */}
            <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto text-center">
                    
                    {/* Título y Subtítulo */}
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-[#2970E8] border border-[#2970E8] rounded-full mb-3">
                        Nuestros Proyectos
                    </span>
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
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">15,000 m²</p><p className="text-sm text-gray-400">Área</p></div> {/* Acento #B3E10F */}
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">25 pisos</p><p className="text-sm text-gray-400">Pisos</p></div> {/* Primario #2970E8 */}
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">65%</p><p className="text-sm text-gray-400">Ahorro</p></div> {/* Acento #B3E10F */}
                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4 Seccion Servicios de Outsourcing BIM  */}
            <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-[#B3E10F] border border-[#2970E8] rounded-full mb-3 bg-gray-900/50">
                        Nuestros Servicios
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Servicios de <span className="text-[#2970E8]">Outsourcing </span>BIM
                    </h2>
                    <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-16">
                        Ofrecemos soluciones completas de modelado, documentación y gestión BIM adaptadas a las necesidades específicas de cada proyecto.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        
                        {/* Tarjeta de Servicio 1*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-building text-[#2970E8] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Modelado BIM/MEP</h3>
                            <p className="text-sm text-gray-400">Modelado arquitectónico, estructural y MEP bajo protocolos específicos con detalles según requerimientos del proyecto.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio 2*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-chart-line text-[#B3E10F] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Análisis y Gestión de Datos</h3>
                            <p className="text-sm text-gray-400">Análisis de información BIM, cuantificación exacta de materiales y gestión de datos de modelos para optimización de recursos.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio 3*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-layer-group text-[#2970E8] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Planificación 4D</h3>
                            <p className="text-sm text-gray-400">Planificación de proyectos BIM 4D integrando tiempo y secuencias constructivas para optimizar cronogramas de obra.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio 4*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-gear text-[#B3E10F] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Diagnóstico y Corrección</h3>
                            <p className="text-sm text-gray-400">Diagnóstico y valoración de modelos existentes, corrección de errores y optimización de archivos BIM.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio 5*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-globe text-[#2970E8] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">DEVELARQ International</h3>
                            <p className="text-sm text-gray-400">Coordinación y consultoría BIM multinacional, adaptando normativas y estándares locales de construcción.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio 6*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-user-group text-[#B3E10F] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Equipo Dedicado</h3>
                            <p className="text-sm text-gray-400">Personal dedicado que trabaja exclusivamente para un cliente, convirtiéndose en una extensión de su equipo.</p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* 5 Seccion Quiénes Somos */}
            <section id="quienes-somos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Columna Izquierda: Texto */}
                    <div className="lg:col-span-6 xl:col-span-7 text-left">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-[#B3E10F] bg-gray-800 rounded-full mb-4 border border-gray-700">
                            Quiénes Somos
                        </span>
                        
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                            Transformamos la industria con <span className="text-[#2970E8]">soluciones inteligentes</span> {/* Primario #2970E8 */}
                        </h2>
                        
                        <p className="text-lg text-gray-400 max-w-lg mb-8">
                            DEVELARQ es una oficina especializada en el desarrollo y gestión de proyectos de construcción mediante la metodología BIM. Optimizamos cada fase del proceso constructivo a través de un modelo digital colaborativo que reduce errores, ahorra tiempo y mejora la coordinación.
                        </p>
                        
                        <div className="space-y-6 mt-10">
                            {[
                                { title: "Innovación Constante", text: "Nos comprometemos a estar a la vanguardia de la tecnología en construcción, utilizando herramientas avanzadas para optimizar cada proyecto.", icon: "⚡" },
                                { title: "Compromiso con la Eficiencia", text: "Valoramos el tiempo y recursos de nuestros clientes, optimizando cada etapa del proceso constructivo para reducir costos y plazos.", icon: "📈" },
                                { title: "Calidad y Precisión", text: "Nos comprometemos a entregar resultados que superen las expectativas, cuidando cada detalle para garantizar precisión y durabilidad.", icon: "💎" },
                            ].map((item, index) => (
                                <div key={index}>
                                    <h3 className="text-xl font-bold text-white flex items-center mb-1">
                                        <span className="mr-2 text-[#2970E8]">{item.icon}</span> {item.title} 
                                    </h3>
                                    <p className="text-gray-400 text-sm">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Columna Derecha: Indicadores y Estadísticas */}
                    <div className="lg:col-span-6 xl:col-span-5 grid grid-cols-2 gap-8 pt-10 lg:pt-0">
                        
                        {/* Indicador 1: Ahorro */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-[#B3E10F] mb-2">40-70%</h3>
                            <p className="text-sm text-gray-400">Ahorro en costos de contratación</p>
                        </div>
                        
                        {/* Indicador 2: Proyectos */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
                            <p className="text-sm text-gray-400">Proyectos completados</p>
                        </div>
                        
                        {/* Indicador 3: Países */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-white mb-2">15+</h3>
                            <p className="text-sm text-gray-400">Países atendidos</p>
                        </div>
                        
                        {/* Indicador 4: Soporte */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-[#2970E8] mb-2">24/7</h3>
                            <p className="text-sm text-gray-400">Soporte técnico</p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* 6 Seccion: Por que contratarnos?  */}
            <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-[#B3E10F] border border-[#2970E8] rounded-full mb-3 bg-gray-900/50">
                        Por qué contratarnos?
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Ventajas competitivas que <span className="text-[#B3E10F]">marcan la diferencia</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        
                        {/* Tarjeta de ventaja 1*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-money-bill-1-wave text-[#2970E8] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Economia</h3>
                            <p className="text-sm text-gray-400">Nuestros clientes ahorran entre 40 y 70% de sus costos en contratación, capacitación, hardware, software y otros costos generales asociados.</p>
                        </div>
                        
                        {/* Tarjeta de ventaja 2*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-users text-[#B3E10F] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Experiencia</h3>
                            <p className="text-sm text-gray-400">Equipo con experiencia que domina Revit, Recap, Naviswork, Rhino 3D, Sketchup, AutoCAD y otras herramientas especializadas.</p>
                        </div>
                        
                        {/* Tarjeta de ventaja 3*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-bolt text-[#2970E8] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Cronogramas Ajustados</h3>
                            <p className="text-sm text-gray-400">Trabajamos en proyectos de alta actividad con plazos ajustados, abordando las necesidades inmediatas sin tiempo de capacitación.</p>
                        </div>
                        
                        {/* Tarjeta de ventaja 4*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-city text-[#B3E10F] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Equipo Dedicado</h3>
                            <p className="text-sm text-gray-400">Proporcionamos personal dedicado que trabajará exclusivamente para un cliente, convirtiéndoseen una extensión de su equipo.</p>
                        </div>
                        
                        {/* Tarjeta de ventaja 5*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-circle-check text-[#2970E8] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Calidad Garantizada</h3>
                            <p className="text-sm text-gray-400">Procesos y estándares de calidad bien definidos con flujos de trabajo internos que garantizan un excelente servicio.</p>
                        </div>
                        
                        {/* Tarjeta de ventaja 6*/}
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-globe text-[#B3E10F] text-3xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Flexibilidad Total</h3>
                            <p className="text-sm text-gray-400">Nos adaptamos a las necesidades específicas de cada cliente desde el diseño, modelado hasta la documentación completa.</p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/*7 Seccion: Contacto y Formulario */}
            <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Título Principal */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-[#B3E10F] border border-gray-500 rounded-full mb-3 bg-[#121212]/50">
                            Contacto
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            ¿Listo para <span className="text-[#2970E8]">transformar</span> tu proyecto? {/* Primario #2970E8 */}
                        </h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                            Contáctanos hoy mismo y descubre cómo podemos optimizar tu proyecto con la metodología BIM más avanzada del mercado.
                        </p>
                    </div>

                    {/* Contenido: Contacto y Formulario */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Columna Izquierda: Información de Contacto y Horarios */}
                        <div className="lg:col-span-5 space-y-8">
                            
                            {/* Información de Contacto */}
                            <div className="space-y-4">
                                {[
                                    { label: 'Email', value: 'contacto@develarq.com', icon: '✉️' },
                                    { label: 'Teléfono', value: '+1 (555) 123-4567', icon: '📞' },
                                    { label: 'Oficina', value: 'Disponible en 15+ países', icon: '📍' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <span className="text-2xl text-[#2970E8]">{item.icon}</span>
                                        <div>
                                            <p className="text-sm text-gray-400">{item.label}</p>
                                            <p className="text-base font-medium text-white">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Horarios de Atención */}
                            <div className="p-6 bg-[#121212] rounded-xl border border-white">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-500 pb-3">Horarios de Atención</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <p className="text-gray-400">Lunes - Viernes</p>
                                        <p className="font-semibold text-[#B3E10F]">8:00 AM - 6:00 PM</p> 
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-400">Sábados</p>
                                        <p className="font-semibold text-[#2970E8]">9:00 AM - 2:00 PM</p>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-500 mt-3">
                                        <p className="text-gray-400">Soporte Técnico</p>
                                        <p className="font-semibold text-[#B3E10F]">24/7</p> 
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Columna Derecha: Formulario de Contacto */}
                        <div className="lg:col-span-7 p-8 bg-[#121212] rounded-xl border border-white shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Solicitar Consulta Gratuita</h3>
                            <p className="text-sm text-gray-400 mb-6">Cuéntanos sobre tu proyecto y te contactaremos en menos de 24 horas.</p>

                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                                        <input type="text" id="name" placeholder="Tu nombre completo" className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <input type="email" id="email" placeholder="tu@email.com" className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Empresa</label>
                                    <input type="text" id="company" placeholder="Nombre de tu empresa" className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
                                </div>

                                <div>
                                    <label htmlFor="project-type" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Proyecto</label>
                                    <select id="project-type" className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white focus:border-[#2970E8] focus:ring-[#2970E8]">
                                        <option value="" disabled>Selecciona el tipo de proyecto</option>
                                        <option value="residencial">Residencial</option>
                                        <option value="comercial">Comercial</option>
                                        <option value="industrial">Industrial</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                                    <textarea id="message" rows={4} placeholder="Cuéntanos más detalles sobre tu proyecto..." className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]"></textarea>
                                </div>

                                <button type="submit" className="w-full px-6 py-3 text-lg font-bold rounded-lg bg-[#B3E10F] text-black hover:bg-opacity-80 transition duration-150 shadow-lg mt-6">
                                    Enviar Solicitud
                                </button>
                            </form>
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
}
export default Welcome;