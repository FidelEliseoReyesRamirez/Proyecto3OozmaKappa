import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Link, useForm, Head } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

export default function Form({ proyecto, clientes, responsables }: any) {
    const { data, setData, post, errors } = useForm<{
        nombre: string;
        cliente_id: string;
        descripcion?: string;
        fecha_inicio: string;
        responsable_id: string;
   
    }>({
        nombre: proyecto?.nombre || "",
        cliente_id: proyecto?.cliente_id || "",
        descripcion: proyecto?.descripcion || "",
        fecha_inicio: proyecto?.fecha_inicio || "",
        responsable_id: proyecto?.responsable_id || "",

    });


    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [clienteSearch, setClienteSearch] = useState("");
    const [responsableSearch, setResponsableSearch] = useState("");
    const [openCliente, setOpenCliente] = useState(false);
    const [openResponsable, setOpenResponsable] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadTime, setUploadTime] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    const routeName = proyecto ? "proyectos.update" : "proyectos.store";

    const filteredClientes = clientes.filter((c: any) =>
        c.name.toLowerCase().includes(clienteSearch.toLowerCase())
    );
    const filteredResponsables = responsables.filter((r: any) =>
        r.name.toLowerCase().includes(responsableSearch.toLowerCase())
    );

    const mostrarModal = (mensaje: string) => {
        setModalMessage(mensaje);
        setShowModal(true);
    };
    const cerrarModal = () => {
        setShowModal(false);
        setModalMessage("");
    };

    const validarCampos = () => {
        if (data.nombre.trim() === "" || data.nombre.length > 150) {
            mostrarModal("El nombre no puede estar vacío ni superar 150 caracteres.");
            return false;
        }
        if (!data.cliente_id) {
            mostrarModal("Debe seleccionar un cliente válido.");
            return false;
        }
        if (!data.responsable_id) {
            mostrarModal("Debe seleccionar un responsable válido.");
            return false;
        }
        if (!data.fecha_inicio) {
            mostrarModal("Debe ingresar la fecha de inicio del proyecto.");
            return false;
        }
        return true;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validarCampos()) return;

        setUploading(true);
        setUploadProgress(0);

        const start = Date.now();

        const options: any = {
            forceFormData: true, // convierte automáticamente todo a FormData
            onProgress: (progress: any) => {
                if (progress.total && progress.loaded) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    const elapsed = (Date.now() - start) / 1000;
                    const rate = progress.loaded / elapsed;
                    const remaining = (progress.total - progress.loaded) / rate;
                    setUploadProgress(percent);
                    setUploadTime(remaining);
                }
            },
            onSuccess: () => {
                setUploading(false);
                mostrarModal("Proyecto creado correctamente. Redirigiendo...");
                setTimeout(() => {
                    window.location.href = route("proyectos.index");
                }, 1200);
            },
            onError: () => {
                setUploading(false);
                mostrarModal("Error al crear el proyecto. Verifica los datos.");
            },
            onFinish: () => {
                setUploading(false);
            },
        };

        if (proyecto) {
            // modo edición
            post(route("proyectos.update", proyecto.id), options);
        } else {
            // modo creación
            post(route("proyectos.store"), options);
        }
    };


    const inputFieldStyles =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950 relative">
            <Head title="DEVELARQ | Crear Proyecto" />
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-lg shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    {proyecto ? "EDITAR PROYECTO" : "CREAR NUEVO PROYECTO"}
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    ✨ Define los parámetros del proyecto y sube tu modelo BIM.
                </p>

                <form onSubmit={submit} className="space-y-6" noValidate>
                    {/* NOMBRE */}
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre del Proyecto" className="text-gray-200 font-semibold" />
                        <TextInput
                            id="nombre"
                            className={inputFieldStyles}
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>

                    {/* CLIENTE */}
                    <div>
                        <InputLabel htmlFor="cliente_id" value="Cliente" className="text-gray-200 font-semibold" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={clienteSearch}
                            onFocus={() => setOpenCliente(true)}
                            onChange={(e) => setClienteSearch(e.target.value)}
                            className={inputFieldStyles}
                        />
                        {openCliente && (
                            <ul className="max-h-48 overflow-y-auto text-white bg-gray-800 rounded-md mt-2 border border-gray-700">
                                {filteredClientes.length > 0 ? (
                                    filteredClientes.map((c: any) => (
                                        <li
                                            key={c.id}
                                            onClick={() => {
                                                setData("cliente_id", c.id);
                                                setClienteSearch(c.name);
                                                setOpenCliente(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer hover:bg-[#2970E8] hover:text-white ${data.cliente_id === c.id ? "bg-[#2970E8]/40" : ""
                                                }`}
                                        >
                                            {c.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3 py-2 text-gray-400">Sin coincidencias</li>
                                )}
                            </ul>
                        )}
                        <InputError className="mt-2" message={errors.cliente_id} />
                    </div>

                    {/* RESPONSABLE */}
                    <div>
                        <InputLabel htmlFor="responsable_id" value="Responsable" className="text-gray-200 font-semibold" />
                        <input
                            type="text"
                            placeholder="Buscar responsable..."
                            value={responsableSearch}
                            onFocus={() => setOpenResponsable(true)}
                            onChange={(e) => setResponsableSearch(e.target.value)}
                            className={inputFieldStyles}
                        />
                        {openResponsable && (
                            <ul className="max-h-48 overflow-y-auto bg-gray-800 rounded-md mt-2 border text-white border-gray-700">
                                {filteredResponsables.length > 0 ? (
                                    filteredResponsables.map((r: any) => (
                                        <li
                                            key={r.id}
                                            onClick={() => {
                                                setData("responsable_id", r.id);
                                                setResponsableSearch(r.name);
                                                setOpenResponsable(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer hover:bg-[#2970E8] hover:text-white ${data.responsable_id === r.id ? "bg-[#2970E8]/40" : ""
                                                }`}
                                        >
                                            {r.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3 py-2 text-gray-400">Sin coincidencias</li>
                                )}
                            </ul>
                        )}
                        <InputError className="mt-2" message={errors.responsable_id} />
                    </div>

                    {/* FECHA */}
                    <div>
                        <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" className="text-gray-200 font-semibold" />
                        <TextInput
                            id="fecha_inicio"
                            type="date"
                            className={inputFieldStyles}
                            value={data.fecha_inicio}
                            onChange={(e) => setData("fecha_inicio", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.fecha_inicio} />
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div>
                        <InputLabel htmlFor="descripcion" value="Descripción del Proyecto" className="text-gray-200 font-semibold" />
                        <textarea
                            id="descripcion"
                            className={`${inputFieldStyles} h-28 resize-none`}
                            value={data.descripcion || ""}
                            onChange={(e) => setData("descripcion", e.target.value)}
                        />
                    </div>

                    

                    {/* PROGRESO */}
                    {uploading && (
                        <div className="mt-6">
                            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-[#B3E10F] h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-300 mt-2 text-sm">
                                Progreso: {uploadProgress}%{" "}
                                {uploadTime ? `(Tiempo restante: ${Math.ceil(uploadTime)} s)` : ""}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`px-3 py-2 rounded-md text-sm font-bold transition duration-150 shadow-md ${uploading
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-[#B3E10F] text-gray-900 hover:bg-lime-300 shadow-[#B3E10F]/30"
                                }`}
                        >
                            {uploading ? "Subiendo..." : "GUARDAR PROYECTO"}
                        </button>
                        <Link
                            href={route("proyectos.index")}
                            className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium text-white transition duration-150"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl w-96 text-center">
                        <h3 className="text-[#B3E10F] text-lg font-bold mb-3">Atención</h3>
                        <p className="text-gray-200 mb-6">{modalMessage}</p>
                        <button
                            onClick={cerrarModal}
                            className="bg-[#2970E8] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#1f5dc0] transition duration-150"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
