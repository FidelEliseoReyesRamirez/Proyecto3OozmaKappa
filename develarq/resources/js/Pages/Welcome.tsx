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
    
    // Componente simple para simular la imagen o visualización compleja
    const VisualizationMock: React.FC = () => (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 h-96 flex items-center justify-center">
            <p className="text-gray-400 text-center font-bold">
                [Espacio para Imagen/Modelo 3D]
                <br />
                ANÁLISIS Y GESTIÓN DE DATOS DE MODELOS
            </p>
        </div>
    );

    // Componente para simular un ícono de Tailwind/Heroicons (usando un div para simplificar)
    const IconMock: React.FC<{ color: string }> = ({ color }) => (
        <div className={`w-8 h-8 rounded-md mb-4 flex items-center justify-center ${color}`}>
            <span className="text-white text-xl">#</span>
        </div>
    );


    return (
        // Contenedor principal: Dark mode
        <div className="min-h-screen bg-gray-900 text-white antialiased">
        <Head title="DEVELARQ | Transformación BIM y Outsourcing" />
            
            {/* 1. Barra de Navegación (Header) */}
            <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800 sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm">
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-indigo-400 flex items-center">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                        DEVELARQ
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <a href="#hero" className="font-medium text-gray-400 hover:text-indigo-400 hidden sm:inline">Inicio</a>
                        <a href="#proyectos" className="font-medium text-gray-400 hover:text-indigo-400 hidden sm:inline">Proyectos</a>
                        <a href="#servicios" className="font-medium text-gray-400 hover:text-indigo-400 hidden sm:inline">Servicios</a>
                        <a href="#quienes-somos" className="font-medium text-gray-400 hover:text-indigo-400 hidden sm:inline">Nosotros</a>
                        <a href="#contacto" className="font-medium text-gray-400 hover:text-indigo-400 hidden sm:inline">Contacto</a>


                        {auth.user ? (
                            <Link href={route('dashboard')} className="font-semibold text-gray-400 hover:text-indigo-400 transition duration-150">Dashboard</Link>
                        ) : (
                            <Link href={route('login')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-150 font-semibold shadow-lg">
                                <span className="mr-1">→</span> Acceder
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* 2. Sección Hero (Asimétrica) */}
            <main id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Columna Izquierda: Título y Contenido */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-300 bg-gray-800 rounded-full mb-4 border border-indigo-500/30">
                            BIM Management Office
                        </span>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                            Transformamos la 
                            <span className="text-indigo-400"> construcción</span> con 
                            <span className="text-green-400"> tecnología BIM</span>
                        </h1>
                        
                        <p className="text-lg text-gray-400 max-w-lg mb-8">
                            Optimizamos cada fase del proceso constructivo a través de modelos digitales colaborativos. Reducimos errores, ahorramos tiempo y mejoramos la coordinación entre todos los involucrados.
                        </p>

                        <div className="flex items-center space-x-4 mb-10">
                            <a href="#contacto" className="px-6 py-3 text-lg font-bold rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition duration-150 shadow-lg flex items-center">
                                Solicitar Consulta
                                <span className="ml-2">→</span>
                            </a>
                            <a href="#" className="px-6 py-3 text-lg font-bold rounded-lg text-gray-300 hover:text-indigo-400 transition duration-150 flex items-center">
                                ▷ Ver Demo
                            </a>
                        </div>
                        
                        {/* Estadísticas Inferiores */}
                        <div className="flex space-x-8 pt-4 border-t border-gray-800">
                            <div>
                                <h3 className="text-3xl font-bold text-green-400">40-70%</h3>
                                <p className="text-sm text-gray-400">Ahorro en costos</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-green-400">+500</h3>
                                <p className="text-sm text-gray-400">Proyectos completados</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-green-400">15+</h3>
                                <p className="text-sm text-gray-400">Países atendidos</p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Visualización */}
                    <div className="lg:col-span-6 xl:col-span-5 hidden lg:block">
                        <VisualizationMock />
                    </div>

                </div>
            </main>
            
            {/* 3. Sección Proyectos BIM Desarrollados (GRID) */}
            <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    
                    {/* Título y Subtítulo */}
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-indigo-400 border border-indigo-400 rounded-full mb-3">
                        Nuestros Proyectos
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Proyectos BIM Desarrollados
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                        Explora nuestra galería de proyectos desarrollados con metodología BIM avanzada
                    </p>
                    
                    {/* Grid de Tarjetas (3 Columnas) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Tarjeta 1 */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-indigo-500 transition duration-300">
                            <div className="relative h-60 bg-gray-700 flex items-center justify-center">
                                <p className="text-white font-medium">[Imagen: Torre Residencial]</p>
                                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-black/60 rounded">Residencial</span>
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Torre Residencial Moderna</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-green-400">15,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-indigo-400">25 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-green-400">65%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta 2 */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-indigo-500 transition duration-300">
                            <div className="relative h-60 bg-gray-700 flex items-center justify-center">
                                <p className="text-white font-medium">[Imagen: Centro Comercial]</p>
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Centro Comercial Metropolitano</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-green-400">45,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-indigo-400">4 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-green-400">58%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta 3 */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-indigo-500 transition duration-300">
                            <div className="relative h-60 bg-gray-700 flex items-center justify-center">
                                <p className="text-white font-medium">[Imagen: Hospital]</p>
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-4">Hospital Regional</h3>
                                <div className="flex justify-between border-t border-gray-700 pt-4">
                                    <div className="text-center"><p className="text-lg font-bold text-green-400">28,000 m²</p><p className="text-sm text-gray-400">Área</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-indigo-400">8 pisos</p><p className="text-sm text-gray-400">Pisos</p></div>
                                    <div className="text-center"><p className="text-lg font-bold text-green-400">72%</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN AÑADIDA: Servicios de Outsourcing BIM (GRID de 6) --- */}
            <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-indigo-400 border border-indigo-400 rounded-full mb-3 bg-gray-900/50">
                        Nuestros Servicios
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Servicios de <span className="text-indigo-400">Outsourcing BIM</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-16">
                        Ofrecemos soluciones completas de modelado, documentación y gestión BIM adaptadas a las necesidades específicas de cada proyecto.
                    </p>
                    
                    {/* Grid de 2x3 para Servicios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        
                        {/* Tarjeta de Servicio */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
                            <IconMock color="bg-blue-600/20" /> {/* Ícono azul */}
                            <h3 className="text-xl font-bold text-white mb-2">Modelado BIM/MEP</h3>
                            <p className="text-sm text-gray-400">Modelado arquitectónico, estructural y MEP bajo protocolos específicos con detalles según requerimientos del proyecto.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-yellow-500 transition duration-300">
                            <IconMock color="bg-yellow-600/20" /> {/* Ícono amarillo */}
                            <h3 className="text-xl font-bold text-white mb-2">Análisis y Gestión de Datos</h3>
                            <p className="text-sm text-gray-400">Análisis de información BIM, cuantificación exacta de materiales y gestión de datos de modelos para optimización de recursos.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-green-500 transition duration-300">
                            <IconMock color="bg-green-600/20" /> {/* Ícono verde */}
                            <h3 className="text-xl font-bold text-white mb-2">Planificación 4D</h3>
                            <p className="text-sm text-gray-400">Planificación de proyectos BIM 4D integrando tiempo y secuencias constructivas para optimizar cronogramas de obra.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-lime-500 transition duration-300">
                            <IconMock color="bg-lime-600/20" /> {/* Ícono lima */}
                            <h3 className="text-xl font-bold text-white mb-2">Diagnóstico y Corrección</h3>
                            <p className="text-sm text-gray-400">Diagnóstico y valoración de modelos existentes, corrección de errores y optimización de archivos BIM.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300">
                            <IconMock color="bg-indigo-600/20" /> {/* Ícono índigo */}
                            <h3 className="text-xl font-bold text-white mb-2">DEVELARQ International</h3>
                            <p className="text-sm text-gray-400">Coordinación y consultoría BIM multinacional, adaptando normativas y estándares locales de construcción.</p>
                        </div>
                        
                        {/* Tarjeta de Servicio */}
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-red-500 transition duration-300">
                            <IconMock color="bg-red-600/20" /> {/* Ícono rojo */}
                            <h3 className="text-xl font-bold text-white mb-2">Equipo Dedicado</h3>
                            <p className="text-sm text-gray-400">Personal dedicado que trabaja exclusivamente para un cliente, convirtiéndose en una extensión de su equipo.</p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN AÑADIDA: Quiénes Somos (Texto e Indicadores) --- */}
            <section id="quienes-somos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Columna Izquierda: Texto */}
                    <div className="lg:col-span-6 xl:col-span-7 text-left">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-gray-800 rounded-full mb-4 border border-gray-700">
                            Quiénes Somos
                        </span>
                        
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                            Transformamos la industria con <span className="text-indigo-400">soluciones inteligentes</span>
                        </h2>
                        
                        <p className="text-lg text-gray-400 max-w-lg mb-8">
                            DEVELARQ es una oficina especializada en el desarrollo y gestión de proyectos de construcción mediante la metodología BIM. Optimizamos cada fase del proceso constructivo a través de un modelo digital colaborativo que reduce errores, ahorra tiempo y mejora la coordinación.
                        </p>
                        
                        {/* Puntos Clave */}
                        <div className="space-y-6 mt-10">
                            {[
                                { title: "Innovación Constante", text: "Nos comprometemos a estar a la vanguardia de la tecnología en construcción, utilizando herramientas avanzadas para optimizar cada proyecto.", icon: "⚡" },
                                { title: "Compromiso con la Eficiencia", text: "Valoramos el tiempo y recursos de nuestros clientes, optimizando cada etapa del proceso constructivo para reducir costos y plazos.", icon: "📈" },
                                { title: "Calidad y Precisión", text: "Nos comprometemos a entregar resultados que superen las expectativas, cuidando cada detalle para garantizar precisión y durabilidad.", icon: "💎" },
                            ].map((item, index) => (
                                <div key={index}>
                                    <h3 className="text-xl font-bold text-white flex items-center mb-1">
                                        <span className="mr-2 text-indigo-400">{item.icon}</span> {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Columna Derecha: Indicadores y Estadísticas */}
                    <div className="lg:col-span-6 xl:col-span-5 grid grid-cols-2 gap-8 pt-10 lg:pt-0">
                        
                        {/* Indicador 1 */}
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-green-400 mb-2">40-70%</h3>
                            <p className="text-sm text-gray-400">Ahorro en costos de contratación</p>
                        </div>
                        
                        {/* Indicador 2 */}
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
                            <p className="text-sm text-gray-400">Proyectos completados</p>
                        </div>
                        
                        {/* Indicador 3 */}
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-white mb-2">15+</h3>
                            <p className="text-sm text-gray-400">Países atendidos</p>
                        </div>
                        
                        {/* Indicador 4 */}
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-center">
                            <h3 className="text-3xl font-bold text-indigo-400 mb-2">24/7</h3>
                            <p className="text-sm text-gray-400">Soporte técnico</p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN AÑADIDA: Contacto y Formulario (Dos Columnas) --- */}
            <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Título Principal */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-white border border-gray-500 rounded-full mb-3 bg-gray-900/50">
                            Contacto
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            ¿Listo para <span className="text-indigo-400">transformar</span> tu proyecto?
                        </h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                            Contáctanos hoy mismo y descubre cómo podemos optimizar tu proyecto con la metodología BIM avanzada del mercado.
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
                                        <span className="text-2xl text-indigo-400">{item.icon}</span>
                                        <div>
                                            <p className="text-sm text-gray-400">{item.label}</p>
                                            <p className="text-base font-medium text-white">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Horarios de Atención */}
                            <div className="p-6 bg-gray-900 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">Horarios de Atención</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <p className="text-gray-400">Lunes - Viernes</p>
                                        <p className="font-semibold text-green-400">8:00 AM - 6:00 PM</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-400">Sábados</p>
                                        <p className="font-semibold text-green-400">9:00 AM - 2:00 PM</p>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-700 mt-3">
                                        <p className="text-gray-400">Soporte Técnico</p>
                                        <p className="font-semibold text-indigo-400">24/7</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Columna Derecha: Formulario de Contacto */}
                        <div className="lg:col-span-7 p-8 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Solicitar Consulta Gratuita</h3>
                            <p className="text-sm text-gray-400 mb-6">Cuéntanos sobre tu proyecto y te contactaremos en menos de 24 horas.</p>

                            <form className="space-y-4">
                                {/* Nombre y Email (en la misma fila) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                                        <input type="text" id="name" placeholder="Tu nombre completo" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <input type="email" id="email" placeholder="tu@email.com" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500" />
                                    </div>
                                </div>

                                {/* Empresa */}
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Empresa</label>
                                    <input type="text" id="company" placeholder="Nombre de tu empresa" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500" />
                                </div>

                                {/* Tipo de Proyecto (Simulado) */}
                                <div>
                                    <label htmlFor="project-type" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Proyecto</label>
                                    <select id="project-type" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 focus:ring-indigo-500">
                                        <option value="" disabled>Selecciona el tipo de proyecto</option>
                                        <option value="residencial">Residencial</option>
                                        <option value="comercial">Comercial</option>
                                        <option value="industrial">Industrial</option>
                                    </select>
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                                    <textarea id="message" rows={4} placeholder="Cuéntanos más detalles sobre tu proyecto..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                                </div>

                                {/* Botón de Envío */}
                                <button type="submit" className="w-full px-6 py-3 text-lg font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition duration-150 shadow-lg mt-6">
                                    Enviar Solicitud
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* 6. Footer (Opcional, pero recomendado) */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-gray-900 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} DEVELARQ Clone. Desarrollado con Laravel, React y Tailwind CSS.
                </p>
            </footer>

        </div> // Cierre final del div principal (min-h-screen)
    );
}

export default Welcome;