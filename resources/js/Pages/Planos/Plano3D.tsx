import React, { useEffect, useState, useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
 
interface Props extends PageProps {
    planoId: number;
    proyectoId: number;
    galeria: any[];
    user: any;
}
 
const MAX_SIZE_MB = 10;
 
const Plano3D: React.FC = () => {
    // NO TOCAR UNITY
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
 
    const { planoId, proyectoId, galeria, user } = usePage<Props>().props;
    const esCliente = user?.rol === "cliente";
 
    // FORM
    const [titulo, setTitulo] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [formVisible, setFormVisible] = useState(false);
 
    // VISTAS
    const [vista, setVista] = useState<
        "grid" | "masonry" | "lista" | "carousel"
    >("grid");
 
    // FULLSCREEN
    const [modalIndex, setModalIndex] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);
 
    // BUSCADOR + ORDEN
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState<"reciente" | "antiguo">("reciente");
 
    // GALERÍA FILTRADA
    const galeriaFiltrada = useMemo(() => {
        let data = galeria;
 
        if (busqueda.trim() !== "") {
            data = data.filter((i) =>
                (i.titulo || "")
                    .toLowerCase()
                    .includes(busqueda.toLowerCase())
            );
        }
 
        data = [...data].sort((a, b) =>
            orden === "reciente"
                ? new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                : new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
        );
 
        return data;
    }, [galeria, busqueda, orden]);
 
    // UNITY
   useEffect(() => {
    const iframe = document.querySelector("iframe");
    if (!iframe) return;
 
    // 1. Enviar mensaje cuando realmente cargó el iframe
    iframe.onload = () => {
        iframe.contentWindow?.postMessage(
            { type: "LOAD_MODEL", id: planoId },
            "*"
        );
    };
 
    // 2. Además, reintentar cada 500ms hasta que Unity lo reciba
    let intentos = 0;
    const maxIntentos = 5;
 
    const intervalo = setInterval(() => {
        intentos++;
        iframe.contentWindow?.postMessage(
            { type: "LOAD_MODEL", id: planoId },
            "*"
        );
        if (intentos >= maxIntentos) clearInterval(intervalo);
    }, 500);
 
    return () => clearInterval(intervalo);
}, [planoId]);
 
 
    // FILE VALIDATION
    const handleFile = (file: File | null) => {
        if (!file) return;
 
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
            alert(`La imagen supera los ${MAX_SIZE_MB} MB`);
            setImagen(null);
            return;
        }
        setImagen(file);
    };
 
    // SUBIR IMAGEN
    const subirImagen = (e: any) => {
        e.preventDefault();
        if (!imagen) return alert("Selecciona una imagen");
 
        const form = new FormData();
        form.append("imagen", imagen);
        form.append("titulo", titulo);
 
        router.post(route("galeria.store", proyectoId), form, {
            forceFormData: true,
            onSuccess: () => {
                setTitulo("");
                setImagen(null);
                setFormVisible(false);
            },
        });
    };
 
    // ELIMINAR
    const eliminarImagen = (id: number) => {
        if (!confirm("¿Eliminar imagen?")) return;
        router.delete(route("galeria.destroy", { proyecto: proyectoId, id }));
    };
 
    // FULLSCREEN
    const abrirFullscreen = (i: number) => {
        setModalIndex(i);
        setModalOpen(true);
    };
 
    const cerrarFullscreen = () => setModalOpen(false);
 
    const siguiente = () =>
        setModalIndex((modalIndex + 1) % galeriaFiltrada.length);
 
    const anterior = () =>
        setModalIndex(
            (modalIndex - 1 + galeriaFiltrada.length) %
                galeriaFiltrada.length
        );
 
    return (
        <AuthenticatedLayout>
            <Head title={`Visor 3D - Plano ${planoId}`} />
 
            {/* VISOR UNITY */}
            <div className="py-12 flex justify-center">
                <iframe
                    src="/unity-viewer/index.html"
                    title="Unity 3D Viewer"
                    className="w-[92%] h-[80vh] border border-gray-700 rounded-xl shadow-lg bg-black"
                />
            </div>
 
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {/* TÍTULO GALERÍA */}
                <h2 className="text-2xl font-bold text-[#B3E10F] mb-4">
                    Galería del Proyecto
                </h2>
 
                {/* PANEL COMPLETO: CONTROLES + FORM + GALERÍA */}
                <div className="bg-[#050814] border border-gray-800 rounded-2xl p-4 md:p-5 shadow-lg">
                    {/* CONTROLES SUPERIORES */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        {/* Nueva Imagen */}
                        {!esCliente && (
                            <button
                                onClick={() => setFormVisible(!formVisible)}
                                className="bg-[#B3E10F] text-black font-bold px-4 py-2 rounded-lg shadow hover:bg-lime-300 transition"
                            >
                                {formVisible ? "Cancelar" : "Nueva Imagen"}
                            </button>
                        )}
 
                        <div className="flex flex-1 flex-col md:flex-row gap-3 md:justify-end">
                            {/* Buscador */}
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="bg-[#0F152A] text-white border border-gray-700 p-2 rounded w-full md:w-56"
                            />
 
                            {/* Orden */}
                            <select
                                value={orden}
                                onChange={(e) =>
                                    setOrden(
                                        e.target.value as
                                            | "reciente"
                                            | "antiguo"
                                    )
                                }
                                className="bg-[#0F152A] text-white border border-gray-700 p-2 rounded"
                            >
                                <option value="reciente">
                                    Más reciente primero
                                </option>
                                <option value="antiguo">
                                    Más antiguo primero
                                </option>
                            </select>
 
                            {/* Vista */}
                            <select
                                value={vista}
                                onChange={(e) =>
                                    setVista(
                                        e.target.value as
                                            | "grid"
                                            | "masonry"
                                            | "lista"
                                            | "carousel"
                                    )
                                }
                                className="bg-[#0F152A] text-white border border-gray-700 p-2 rounded"
                            >
                                <option value="grid">Grid</option>
                                <option value="masonry">Masonry</option>
                                <option value="lista">Lista</option>
                                <option value="carousel">Carrusel</option>
                            </select>
                        </div>
                    </div>
 
                    {/* FORMULARIO DENTRO DEL PANEL */}
                    {formVisible && !esCliente && (
                        <form
                            onSubmit={subirImagen}
                            className="bg-[#0A0F1E] p-4 rounded-xl border border-gray-700 shadow-inner mb-6"
                        >
                            <h3 className="text-lg font-semibold text-[#B3E10F] mb-3">
                                Subir imagen (máx. 10 MB)
                            </h3>
 
                            <input
                                type="text"
                                placeholder="Título (opcional)"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full bg-[#080D15] border border-gray-700 p-2 rounded mb-3 text-white"
                            />
 
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFile(e.target.files?.[0] ?? null)
                                }
                                className="w-full bg-[#080D15] border border-gray-700 p-2 rounded mb-4 text-white"
                            />
 
                            <button className="bg-[#2970E8] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
                                Subir
                            </button>
                        </form>
                    )}
 
                    {/* GALERÍA */}
                    {galeriaFiltrada.length === 0 ? (
                        <p className="text-gray-400 italic">
                            No hay imágenes que coincidan.
                        </p>
                    ) : vista === "grid" ? (
                        // GRID
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {galeriaFiltrada.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="bg-[#0F152A] p-2 rounded-xl border border-gray-700 shadow-md relative cursor-pointer flex flex-col"
                                    onClick={() => abrirFullscreen(idx)}
                                >
                                    <img
                                        src={`/storage/${img.archivo_url}`}
                                        className="rounded-lg w-full h-44 object-cover"
                                    />
 
                                    {img.titulo && (
                                        <p className="mt-2 text-xs text-center text-gray-300 truncate">
                                            {img.titulo}
                                        </p>
                                    )}
 
                                    {!esCliente && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                eliminarImagen(img.id);
                                            }}
                                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px]"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : vista === "masonry" ? (
                        // MASONRY
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                            {galeriaFiltrada.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="break-inside-avoid mb-4 relative cursor-pointer"
                                    onClick={() => abrirFullscreen(idx)}
                                >
                                    <div className="overflow-hidden rounded-xl border border-gray-700 bg-[#0F152A]">
                                        <img
                                            src={`/storage/${img.archivo_url}`}
                                            className="w-full rounded-t-xl shadow-md"
                                        />
                                        {img.titulo && (
                                            <p className="px-3 py-2 text-xs text-gray-300 truncate">
                                                {img.titulo}
                                            </p>
                                        )}
                                    </div>
 
                                    {!esCliente && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                eliminarImagen(img.id);
                                            }}
                                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px]"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : vista === "lista" ? (
                        // LISTA
                        <div className="space-y-4">
                            {galeriaFiltrada.map((img, idx) => (
                                <div
                                    key={img.id}
                                    onClick={() => abrirFullscreen(idx)}
                                    className="flex gap-4 bg-[#0F152A] p-4 rounded-xl border border-gray-700 cursor-pointer hover:bg-[#111729]"
                                >
                                    <img
                                        src={`/storage/${img.archivo_url}`}
                                        className="w-28 h-28 object-cover rounded-xl"
                                    />
                                    <div className="flex flex-col justify-center text-white">
                                        <p className="font-semibold text-[#B3E10F]">
                                            {img.titulo || "Sin título"}
                                        </p>
                                    </div>
 
                                    {!esCliente && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                eliminarImagen(img.id);
                                            }}
                                            className="ml-auto bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-white text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // CAROUSEL
                        <div className="flex overflow-x-auto gap-4 pb-2">
                            {galeriaFiltrada.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="flex-shrink-0 w-52 cursor-pointer"
                                    onClick={() => abrirFullscreen(idx)}
                                >
                                    <img
                                        src={`/storage/${img.archivo_url}`}
                                        className="h-40 w-full object-cover rounded-xl shadow hover:opacity-80 transition"
                                    />
                                    {img.titulo && (
                                        <p className="mt-2 text-xs text-center text-gray-300 truncate">
                                            {img.titulo}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
 
            {/* FULLSCREEN */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <button
                        onClick={cerrarFullscreen}
                        className="absolute top-5 right-5 text-white text-3xl font-bold"
                    >
                        ×
                    </button>
 
                    <button
                        className="absolute left-5 text-white text-4xl font-bold"
                        onClick={anterior}
                    >
                        ‹
                    </button>
 
                    <img
                        src={`/storage/${galeriaFiltrada[modalIndex].archivo_url}`}
                        className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300"
                    />
 
                    <button
                        className="absolute right-5 text-white text-4xl font-bold"
                        onClick={siguiente}
                    >
                        ›
                    </button>
                </div>
            )}
        </AuthenticatedLayout>
    );
};
 
export default Plano3D;