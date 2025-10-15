// resources/js/Pages/Welcome.tsx

import ContactForm from '@/Components/ContactForm';
import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

interface WelcomeProps {
    auth: {
        user: any;
    };
}

const Welcome: React.FC<WelcomeProps> = ({ auth }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Transformación BIM y Outsourcing" />
            
            {/* 1. Barra de Navegación  */}
            <Header auth={auth}/>

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
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">15,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">25 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">65%</p><p className="text-sm text-gray-400">Ahorro</p></div> 
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
                            Transformamos la industria con <span className="text-[#2970E8]">soluciones inteligentes</span> 
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
                        ¿Listo para <span className="text-[#2970E8]">transformar</span> tu proyecto? 
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Contáctanos hoy mismo y descubre cómo podemos optimizar tu proyecto con la metodología BIM más avanzada del mercado.
                    </p>
                    </div>

                    {/* Contenido: Contacto y Formulario */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Columna Izquierda: Información de Contacto y Horarios */}
                    <div className="lg:col-span-5 space-y-8">
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
                        <ContactForm />
                    </div>
                    </div>
                </div>
            </section>
            {/* Footer */}
           <Footer />
        </div> 
    );
}
export default Welcome;

//w