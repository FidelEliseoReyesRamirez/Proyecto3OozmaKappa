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
            <Head title="DEVELARQ |Acerca de Nosotros Transformación BIM y Outsourcing" />
            <Header auth={auth}/>

            <section id="quienes-somos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-5 text-left space-y-8">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            Nuestra <span className="text-[#2970E8]">Historia</span> y Trayectoria
                        </h1>
                        
                        <p className="text-lg text-gray-400">
                            DEVELARQ es una oficina especializada en el desarrollo y gestión de proyectos de construcción mediante la 
                            metodología BIM. Optimizamos cada fase del proceso constructivo a través de un modelo digital colaborativo que reduce
                            errores, ahorra tiempo y mejora la coordinación.
                        </p>
                        <p className="text-md text-gray-400 pt-4">
                            DEVELARQ se creó en 2024 con el propósito de revolucionar la gestión de proyectos, enfocándonos en la precisión y eficiencia que solo el Building Information Modeling (BIM) puede ofrecer.
                        </p>
                    </div>

                    <div className="lg:col-span-7 pt-10 lg:pt-0">
                        <div id="timeline" className="relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700 rounded-full"></div>
                                <ul className="space-y-12">
                                    {/* Hito 1 */}
                                    <li className="relative">
                                        <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#B3E10F] border-4 border-[#121212] z-10"></div>
                                        <div className="bg-gray-900 p-6 rounded-xl shadow-xl ml-4 border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                                            <h2 className="text-xl font-bold text-[#B3E10F] mb-1">2024 Enero</h2>
                                            <p className="text-md text-white">Creación y fundación de la empresa, estableciendo el compromiso inicial con la digitalización.</p>
                                        </div>
                                    </li>
                                    
                                    {/* Hito 2 */}
                                    <li className="relative">
                                        <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#2970E8] border-4 border-[#121212] z-10"></div>
                                        <div className="bg-gray-900 p-6 rounded-xl shadow-xl ml-4 border border-gray-700 hover:border-[#2970E8] transition duration-300">
                                            <h2 className="text-xl font-bold text-[#2970E8] mb-1">2024 Diciembre</h2>
                                            <p className="text-md text-white">Adopción y estandarización completa de la metodología BIM en todos los proyectos internos.</p>
                                        </div>
                                    </li>

                                    {/* Hito 3 */}
                                    <li className="relative">
                                        <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#2970E8] border-4 border-[#121212] z-10"></div>
                                        <div className="bg-gray-900 p-6 rounded-xl shadow-xl ml-4 border border-gray-700 hover:border-[#2970E8] transition duration-300">
                                            <h2 className="text-xl font-bold text-[#B3E10F] mb-1">2025</h2>
                                            <p className="text-md text-white">Implementacion de un sistema digital para los clientes y empleados.</p>
                                        </div>
                                    </li>
                                </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="mision-vision" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Nuestro Propósito y <span className="text-[#B3E10F]">Compromiso</span>
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tarjeta de Misión */}
                    <div className="bg-[#121212] p-8 md:p-12 rounded-2xl border-t-8 border-[#2970E8] shadow-2xl transition duration-300 hover:shadow-3xl transform hover:-translate-y-1">
                        <div className="flex items-start mb-6 space-x-4">
                            <i className="fa-solid fa-bullseye text-[#2970E8] text-4xl flex-shrink-0"></i>
                            <h3 className="text-3xl font-extrabold text-white">Nuestra Misión</h3>
                        </div>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Transformar la industria ofreciendo soluciones arquitectónicas más inteligentes, eficientes y sostenibles. Democratizando la nueva tecnología para
                            que nuestros clientes desarrollen y ejecuten sus proyectos de manera responsable, sostenible y de calidad.
                        </p>
                    </div>
                    {/* Tarjeta de Visión */}
                    <div className="bg-[#121212] p-8 md:p-12 rounded-2xl border-t-8 border-[#B3E10F] shadow-2xl transition duration-300 hover:shadow-3xl transform hover:-translate-y-1">
                        <div className="flex items-start mb-6 space-x-4">
                            <i className="fa-solid fa-eye text-[#B3E10F] text-4xl flex-shrink-0"></i>
                            <h3 className="text-3xl font-extrabold text-white">Nuestra Visión</h3>
                        </div>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Ser líderes en la industria de la construcción en la región mediante la integración de tecnología avanzada y prácticas innovadoras para el rubro, así mismo
                            democratizar el acceso a la arquitectura. Buscamos desarrollar proyectos sostenibles, eficientes y accesibles, posicionando a Bolivia como referente en la
                            gestión de proyectos BIM con calidad internacional en Latinoamérica.
                        </p>
                    </div>
                </div>
            </section>

            <section id="valores" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Nuestros <span className="text-[#2970E8]">Valores</span>
                    </h2>
                </div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
                    <div className="bg-gray-900 p-8 md:p-12 rounded-2xl border-t-8 border-[#2970E8] shadow-2xl transition duration-300 hover:shadow-3xl transform hover:-translate-y-1">
                        <div className="flex items-start mb-6 space-x-4">
                            <i className="fa-solid fa-star text-[#2970E8] text-4xl flex-shrink-0"></i>
                            <h3 className="text-3xl font-extrabold text-white">Nuestros importantes valores</h3>
                        </div>
                        <ul className="space-y-12">
                            {/* Valor 1 */}
                            <li className="relative">
                                <div className="bg-gray-900 p-6 rounded-xl shadow-xl ml-4 border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                                    <h2 className="text-xl font-bold text-[#B3E10F] mb-1">Inovacion constante</h2>
                                    <p className="text-md text-white">Nos comprometemos a estar a la vanguardia de la tecnología en la construcción, utilizando herramientas y prácticas avanzadas
                                        para optimizar cada proyecto. Fomentamos la mejora continua y la innovación, buscando siempre nuevas formas de hacer la
                                        arquitectura más accesible, eficiente y sostenible.</p>
                                </div>
                            </li>
                            {/* Valor 2 */}
                            <li className="relative">
                                <div className="bg-gray-900 p-6 rounded-xl shadow-xl ml-4 border border-gray-700 hover:border-[#2970E8] transition duration-300">
                                    <h2 className="text-xl font-bold text-[#2970E8] mb-1">Compromiso con la eficiencia</h2>
                                        <p className="text-md text-white">Valoramos el tiempo y los recursos de nuestros clientes, nos enfocamos en optimizar cada etapa del proceso constructivo
                                            para reducir costos y plazos, mejorando la calidad de sus proyectos. La eficiencia es un pilar fundamental de nuestra propuesta de valor.
                                        </p>
                                </div>
                            </li>
                            {/* Valor 3 */}
                            <li className="relative">
                                <div className="bg-gray-900 p-6 rounded-xl shadow-xl ml-4 border border-gray-700 hover:border-[#B3E10F] transition duration-300">
                                    <h2 className="text-xl font-bold text-[#B3E10F] mb-1">Calidad y precisión</h2>
                                        <p className="text-md text-white">Nos comprometemos a entregar resultados que superen las expectativas, cuidando cada detalle para garantizar precisión y
                                            durabilidad. La calidad es esencial en todas las fases del proyecto.
                                        </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-5xl mx-auto p-10 md:p-12 rounded-2xl text-center bg-[#121212] border border-gray-700 shadow-3xl">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                        ¿Listo para trabajar con un equipo <span className="text-[#B3E10F]">experto en BIM</span> y <span className="text-[#2970E8]">comprometido </span>con sus <span className="text-[#B3E10F]">clientes</span> y el <span className="text-[#B3E10F]">exito</span> de sus proyectos?
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

            <Footer/>
        </div>
    );
}
export default AboutUs;