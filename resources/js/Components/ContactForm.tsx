import React, { useState } from "react";

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        message: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "name") {
            // espacios
            newValue = newValue.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
            newValue = newValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
            if (newValue.length > 50) newValue = newValue.slice(0, 30);
        }

        if (name === "phone") {
            // Solo dígitos
            newValue = newValue.replace(/\D/g, "");
            // Máximo 8 dígitos
            if (newValue.length > 8) newValue = newValue.slice(0, 8);
        }

        if (name === "email") {
            // Elimina espacios
            newValue = newValue.trim();
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
            newErrors.name = "El nombre solo puede contener letras y espacios.";
        } else if (formData.name.length > 50) {
            newErrors.name = "El nombre no puede superar los 50 caracteres.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio.";
        } else if (
            !/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com)$/.test(
                formData.email
            )
        ) {
            newErrors.email =
                "Debe ser un correo válido (gmail, outlook, hotmail, yahoo o icloud).";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "El celular es obligatorio.";
        } else if (!/^\d{8}$/.test(formData.phone)) {
            newErrors.phone = "El celular debe tener exactamente 8 dígitos numéricos.";
        }

        if (!formData.projectType) {
            newErrors.projectType = "Debes seleccionar un tipo de proyecto.";
        }

        if (!formData.message.trim()) {
            newErrors.message = "El mensaje es obligatorio.";
        } else if (formData.message.length > 500) {
            newErrors.message = "El mensaje no puede superar los 500 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            const mensaje = `
        Nuevo contacto desde el sitio web:

        Nombre: ${formData.name}
        Email: ${formData.email}
        Celular: ${formData.phone}
        Empresa: ${formData.company || "No especificada"}
        Tipo de Proyecto: ${formData.projectType}
        Mensaje: ${formData.message}
        `;
            const numeroWhatsapp = "59167031950";

            const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

            window.open(urlWhatsapp, "_blank");

            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                projectType: "",
                message: "",
            });
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre completo" maxLength={50}
                        className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="tucorreo@gmail.com"
                        className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
            </div>

            {/* Celular */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Celular</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: 76543210" maxLength={8}
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Empresa */}
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Empresa (opcional)</label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Nombre de tu empresa"
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]" />
            </div>

            {/* Tipo de Proyecto */}
            <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Proyecto</label>
                <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white focus:border-[#2970E8] focus:ring-[#2970E8]">
                    <option value="" disabled>Selecciona el tipo de proyecto</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                </select>
                {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}
            </div>

            {/* Mensaje */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                <textarea id="message" name="message" rows={4} maxLength={500} value={formData.message} onChange={handleChange} placeholder="Cuéntanos más detalles sobre tu proyecto..."
                    className="w-full px-4 py-2 bg-gray-800 border border-white rounded-lg text-white placeholder-gray-500 focus:border-[#2970E8] focus:ring-[#2970E8]">
                </textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            <button type="submit" className="w-full px-6 py-3 text-lg font-bold rounded-lg bg-[#B3E10F] text-black hover:bg-opacity-80 transition duration-150 shadow-lg mt-6">
                Enviar Solicitud
            </button>
        </form>
    );
};

export default ContactForm;
