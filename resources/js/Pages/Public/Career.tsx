import React from "react";
import { Link, Head } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

interface CareerProps {
    auth: {
        user: any;
    };
}
const Career: React.FC<CareerProps> = ({auth}) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Carreras Transformación BIM y Outsourcing" />
            <Header auth={auth} />

            <section id="carreras" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    
                    {/* Encabezado Principal */}
                    <div className="mb-16 max-w-4xl mx-auto">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#B3E10F] mb-3">
                            Tu Futuro es Digital. Tu Impacto es Real.
                        </p>
                        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Forja la Construcción del Mañana con <span className="text-[#2970E8]">DEVELARQ</span>
                        </h2>
                        <p className="mt-6 text-xl text-gray-400">
                            Buscamos ingenieros, arquitectos y especialistas BIM con visión global, obsesión por la precisión y pasión por la innovación tecnológica.
                        </p>
                    </div>

                    {/* Tres Razones para Unirse a DEVELARQ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700">
                            <i className="fa-solid fa-rocket text-[#B3E10F] text-4xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Innovación Constante</h3>
                            <p className="text-sm text-gray-400">Trabaja con las últimas tecnologías 4D o 5D y flujos de trabajo Open BIM. Tu aprendizaje nunca se detiene.</p>
                        </div>
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700">
                            <i className="fa-solid fa-globe text-[#2970E8] text-4xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Impacto Global</h3>
                            <p className="text-sm text-gray-400">Colabora en proyectos de infraestructura y arquitectura que definen paisajes en múltiples continentes.</p>
                        </div>
                        <div className="p-6 bg-[#121212] rounded-xl border border-gray-700">
                            <i className="fa-solid fa-headset text-[#B3E10F] text-4xl mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Flexibilidad y Autonomía</h3>
                            <p className="text-sm text-gray-400">Equilibrio entre vida laboral y personal con modelos de trabajo remotos y horarios flexibles basados en objetivos.</p>
                        </div>
                    </div>

                    {/* Llamada a la Acción de Búsqueda de Puestos */}
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-white mb-4">Encuentra tu Próxima Oportunidad</h3>
                        <p className="text-lg text-gray-400 mb-8">
                            Estamos creciendo rápidamente y buscamos talento especializado en las siguientes áreas.
                        </p>
                        
                        <div className="flex flex-col space-y-4">
                            <div className="p-5 bg-[#121212] rounded-lg text-left flex justify-between items-center border border-gray-700 hover:border-[#2970E8] transition duration-300">
                                <div>
                                    <h4 className="text-xl font-bold text-white">Especialista BIM MEP Senior</h4>
                                    <p className="text-sm text-gray-400">Tiempo Completo | Remoto Global</p>
                                </div>
                                <Link href={route('career')} className="px-6 py-2 text-sm font-bold rounded-lg bg-[#2970E8] text-white hover:bg-blue-600 transition duration-200">
                                    Ver Puesto
                                </Link>
                            </div>
                            
                            <div className="p-5 bg-[#121212] rounded-lg text-left flex justify-between items-center border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                                <div>
                                    <h4 className="text-xl font-bold text-white">Modelador(a) Arquitectónico BIM (Junior)</h4>
                                    <p className="text-sm text-gray-400">Tiempo Completo | Sede LATAM</p>
                                </div>
                                <Link href={route('career')} className="px-6 py-2 text-sm font-bold rounded-lg bg-[#B3E10F] text-[#121212] hover:bg-lime-300 transition duration-200">
                                    Ver Puesto
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
export default Career;