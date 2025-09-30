import React from "react";
import { Link, Head } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

interface AboutUsProps {
    auth: {
        user: any;
    };
}
const AboutUs: React.FC<AboutUsProps> = ({auth}) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Transformación BIM y Outsourcing" />
            <Header auth={auth}/>

            <section id="quienes-somos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    <div className="lg:col-span-6 xl:col-span-7 text-left">                        
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
            
            
            <Footer/>
        </div>
    );
}
export default AboutUs;