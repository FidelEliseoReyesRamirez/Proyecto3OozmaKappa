import { Link, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import Footer from '@/Components/Footer';
import Header from '@/Components/Header';

interface ProjectsProps {
    auth: {
        user: any;
    };
}
interface ImageModalProps {
    src: string | null;
    alt: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
    if (!src) return null; 

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={onClose} 
        >
            <div 
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()} 
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-3xl font-bold p-2 leading-none hover:text-[#B3E10F] transition duration-200"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

                <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg shadow-2xl max-w-full max-h-[90vh]" 
                />
            </div>
        </div>
    );
};
const Projects: React.FC<ProjectsProps> = ({ auth }) => {
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedAlt, setSelectedAlt] = useState<string>('');

    const openModal = (src: string, alt: string) => {
        setSelectedImage(src);
        setSelectedAlt(alt);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setSelectedAlt('');
    };

    // Datos de proyectos
    const projectsData = [
        { title: "Torre Residencial Moderna", type: "Residencial", area: "15,000 m²", floors: "25 pisos", saving: "65%", description: "Nuestro diseño de la torre residencial es uno moderno....", imgSrc: "/images/modern-residential-tower-bim.png" },
        { title: "Centro Comercial Metropolitano", type: "Comercial", area: "45,000 m²", floors: "4 pisos", saving: "58%", description: "Nuestro diseño del centro comercial metropolitano....", imgSrc: "/images/shopping-mall-bim.png" },
        { title: "Hospital Regional", type: "Salud", area: "28,000 m²", floors: "8 pisos", saving: "72%", description: "Nuestro diseño del hospital regional....", imgSrc: "/images/hospital-bim-model.png" },
        { title: "Complejo Industrial", type: "Industrial", area: "60,000 m²", floors: "3 pisos", saving: "48%", description: "Nuestro diseño del complejo industrial....", imgSrc: "/images/industrial-complex-bim.png" },
        { title: "Universidad Tecnológica", type: "Educación", area: "35,000 m²", floors: "6 pisos", saving: "61%", description: "Nuestro diseño de la universidad tecnológica....", imgSrc: "/images/university-bim-building.png" },
        { title: "Aeropuerto Internacional", type: "Infraestructura", area: "120,000 m²", floors: "3 pisos", saving: "55%", description: "Nuestro diseño del aeropuerto internacional....", imgSrc: "/images/airport-terminal-bim.png" },
        
    ];


    return (
        <div className="min-h-screen bg-[#121212] text-white antialiased">
            <Head title="DEVELARQ | Proyectos Transformación BIM y Outsourcing" />
            
            {/* 1. Barra de Navegación  */}
            <Header auth={auth} />
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
                        {projectsData.map((project, index) => (
                            <div key={index} className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#2970E8] transition duration-300 group cursor-pointer"
                                onClick={() => openModal(project.imgSrc, project.title)} >
                                <div className="relative h-60 bg-gray-800 flex items-center justify-center">
                                    <img src={project.imgSrc} alt={project.title} className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                                        <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition duration-500 border border-white px-4 py-2 rounded-full">Ver Imagen</span>
                                    </div>
                                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-black/60 rounded">{project.type}</span>
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
                                    <div className="flex justify-between border-t border-gray-700 pt-4">
                                        <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">{project.area}</p><p className="text-sm text-gray-400">Área</p></div>
                                        <div className="text-center"><p className="text-lg font-bold text-[#2970E8]">{project.floors}</p><p className="text-sm text-gray-400">Pisos</p></div>
                                        <div className="text-center"><p className="text-lg font-bold text-[#B3E10F]">{project.saving}</p><p className="text-sm text-gray-400">Ahorro</p></div>
                                    </div>
                                    <div className="text-center mt-4"><p className="text-lg font-bold text-white line-clamp-2">{project.description}</p></div> 
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Footer */}
           <Footer />

           {/* Inclusión del Modal*/}
           <ImageModal 
                src={selectedImage} 
                alt={selectedAlt}
                onClose={closeModal} 
            />

        </div> 
    );
};
export default Projects;