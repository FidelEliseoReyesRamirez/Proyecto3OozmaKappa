import React from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

interface ServicesProps {
    auth: {
        user: any;
    };
}

const Services: React.FC<ServicesProps> = ({auth}) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Servicios Transformación BIM y Outsourcing" />
            <Header auth={auth}/>
            
            <section id="proceso-y-valor" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto text-center">
                    
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Nuestra Metodología y <span className="text-[#2970E8]">Ventaja Competitiva</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-16">
                        Conozca la claridad de nuestro flujo de trabajo y los beneficios tangibles de elegir DEVELARQ.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        
                        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-700 shadow-xl hover:border-[#2970E8] transition duration-300">
                            <i className="fa-solid fa-list-ol text-[#2970E8] text-4xl mb-6"></i>
                            <h3 className="text-2xl font-bold text-white mb-2">Proceso de Trabajo Claro</h3>
                            <p className="text-md text-gray-400 mb-6 border-b border-gray-700 pb-4">
                                Nuestro enfoque es la claridad total en la metodología, asegurando una integración fluida con su equipo.
                            </p>
                            
                            {/* Lista de Pasos Numerados y Estilizados */}
                            <div className="space-y-6">
                                {[
                                    { title: "Consulta y Diagnóstico", text: "Entendemos tus necesidades y el LOD (Level of Development) requerido." },
                                    { title: "Definición de Equipo", text: "Seleccionamos gente especializada en BIM para un trabajo más adecuado." },
                                    { title: "Ejecución y Control", text: "Iniciamos el modelado y control constante de la obra." },
                                    { title: "Entrega Final", text: "Archivos revisados, documentados y listos para la entrega." },
                                ].map((step, index) => (
                                    <div key={index} className="flex space-x-4 items-start">
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg font-extrabold rounded-full bg-[#2970E8] text-white">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{step.title}</h4>
                                            <p className="text-sm text-gray-400">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-700 shadow-xl hover:border-[#B3E10F] transition duration-300">
                            <i className="fa-solid fa-gem text-[#B3E10F] text-4xl mb-6"></i>
                            <h3 className="text-2xl font-bold text-white mb-2">Valor y Beneficios Clave</h3>
                            <p className="text-md text-gray-400 mb-6 border-b border-gray-700 pb-4">
                                Nuestro enfoque no es solo modelar, sino usar la tecnología en su máximo potencial para generar retorno de inversión.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { title: "Ahorro Garantizado", text: "Reducimos costos y contratamos personal capacitado para el proyecto, eliminando gastos fijos." },
                                    { title: "Entrega Rápida", text: "Optimice cronogramas y acelere la documentación para reducir los plazos de entrega." },
                                    { title: "Escalabilidad Inmediata", text: "Aumentamos y reducimos el equipo según las necesidades del proyecto, sin trámites largos." },
                                    { title: "Experiencia Global", text: "Acceso instantáneo a especialistas BIM con experiencia en normativas internacionales." },
                                ].map((benefit, index) => (
                                    <div key={index} className="flex space-x-3 items-start">
                                        <svg className="w-6 h-6 text-[#B3E10F] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{benefit.title}</h4>
                                            <p className="text-sm text-gray-400">{benefit.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
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

            <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-5xl mx-auto p-10 md:p-12 rounded-2xl text-center bg-gray-900 border border-gray-700 shadow-3xl">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                        ¿Listo para <span className="text-[#B3E10F]">Optimizar</span> sus Proyectos y <span className="text-[#B3E10F]">Reducir </span>Costos Operativos?
                    </h3>
                    <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
                        Deje de preocuparse por la contratación, el software y la capacitación. Nuestro equipo BIM está listo para integrarse inmediatamente.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        
                        <Link href={route('welcome') + '#contacto'} className="px-8 py-3 text-lg font-bold rounded-lg bg-[#B3E10F] text-[#121212] hover:bg-lime-300 transition duration-200 shadow-md transform hover:scale-[1.02]">
                            Solicitar una Consulta Gratuita
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
export default Services;