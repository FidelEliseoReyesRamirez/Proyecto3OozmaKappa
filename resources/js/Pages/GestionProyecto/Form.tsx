import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Link, useForm, Head } from "@inertiajs/react";
import { FormEventHandler, useState, useEffect } from "react";

export default function Form({ proyecto, clientes, responsables }: any) {
    const { data, setData, post, processing, errors } = useForm<{
        nombre: string;
        cliente_id: string;
        descripcion?: string;
        fecha_inicio: string;
        responsable_id: string;
        archivo_bim: File | null;
    }>({
        nombre: proyecto?.nombre || "",
        cliente_id: proyecto?.cliente_id || "",
        descripcion: proyecto?.descripcion || "",
        fecha_inicio: proyecto?.fecha_inicio || "",
        responsable_id: proyecto?.responsable_id || "",
        archivo_bim: null,
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [clienteSearch, setClienteSearch] = useState("");
    const [responsableSearch, setResponsableSearch] = useState("");
    const [openCliente, setOpenCliente] = useState(false);
    const [openResponsable, setOpenResponsable] = useState(false);

    const routeName = proyecto ? "proyectos.update" : "proyectos.store";

    const filteredClientes = clientes.filter((c: any) =>
        c.name.toLowerCase().includes(clienteSearch.toLowerCase())
    );
    const filteredResponsables = responsables.filter((r: any) =>
        r.name.toLowerCase().includes(responsableSearch.toLowerCase())
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validarCampos()) return;
        if (proyecto) post(route(routeName, proyecto.id), { forceFormData: true });
        else post(route(routeName));
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
        if (data.archivo_bim) {
            const ext = data.archivo_bim.name.split(".").pop()?.toLowerCase();
            if (!["bim", "ifc"].includes(ext || "")) {
                mostrarModal("Formato de archivo no permitido. Solo .bim o .ifc.");
                return false;
            }
            if (data.archivo_bim.size > 256 * 1024 * 1024) {
                mostrarModal("El archivo supera los 256 MB permitidos.");
                return false;
            }
        }
        return true;
    };

    const mostrarModal = (mensaje: string) => {
        setModalMessage(mensaje);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setModalMessage("");
    };

    const inputFieldStyles =
        "mt-1 block w-full bg-gray-900 border border-gray-700 text-white rounded-lg shadow-inner focus:border-[#2970E8] focus:ring-[#2970E8] transition duration-200 ease-in-out placeholder-gray-500";

    const dropdownStyle =
        "absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto";

    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".combo-clientes")) setOpenCliente(false);
            if (!target.closest(".combo-responsables")) setOpenResponsable(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    return (
        <section className="flex justify-center items-center py-12 px-4 min-h-screen bg-gray-950 relative">
            <Head title="DEVELARQ | Crear Proyecto" />

            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-xl shadow-lg shadow-gray-900/50">
                <h2 className="text-3xl font-extrabold text-[#2970E8] mb-1 tracking-wider">
                    {proyecto ? "EDITAR PROYECTO" : "CREAR NUEVO PROYECTO"}
                </h2>
                <p className="mb-8 text-md text-[#B3E10F]">
                    ✨ Define los parámetros del proyecto y asigna a tu equipo principal.
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
                            placeholder="Ej: Torre de Oficinas Central Park"
                            maxLength={150}
                        />
                        <p className="text-xs text-gray-400 mt-1">{data.nombre.length}/150 caracteres</p>
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>

                    {/* CLIENTE Y RESPONSABLE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">

                        {/* CLIENTE CON BUSCADOR VISUAL */}
                        <div className="relative combo-clientes">
                            <InputLabel htmlFor="cliente" value="Cliente Asociado" className="text-gray-200 font-semibold" />
                            <div
                                className={
                                    inputFieldStyles +
                                    " cursor-pointer px-3 py-2.5 min-h-[42px] flex items-center text-sm"
                                }
                                onClick={() => setOpenCliente(!openCliente)}
                            >
                                {clientes.find((c: any) => c.id === data.cliente_id)?.name ||
                                    "Seleccione o escriba un cliente..."}
                            </div>

                            {openCliente && (
                                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    <input
                                        type="text"
                                        autoFocus
                                        maxLength={50}
                                        className="w-full px-3 py-2.5 bg-gray-800 text-gray-200 text-sm border-b border-gray-700 focus:outline-none"
                                        placeholder="Buscar cliente..."
                                        value={clienteSearch}
                                        onChange={(e) => setClienteSearch(e.target.value)}
                                    />
                                    {filteredClientes.length > 0 ? (
                                        filteredClientes.map((c: any) => (
                                            <div
                                                key={c.id}
                                                onClick={() => {
                                                    setData("cliente_id", c.id);
                                                    setOpenCliente(false);
                                                    setClienteSearch("");
                                                }}
                                                className={`px-3 py-2 text-sm hover:bg-[#2970E8] hover:text-white cursor-pointer ${c.id === data.cliente_id ? "bg-[#1f5dc0] text-white" : "text-gray-200"
                                                    }`}
                                            >
                                                {c.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-gray-500 text-sm">Sin resultados</div>
                                    )}
                                </div>
                            )}
                            <InputError className="mt-2" message={errors.cliente_id} />
                        </div>

                        {/* RESPONSABLE CON BUSCADOR VISUAL */}
                        <div className="relative combo-responsables">
                            <InputLabel htmlFor="responsable" value="Responsable Principal" className="text-gray-200 font-semibold" />
                            <div
                                className={
                                    inputFieldStyles +
                                    " cursor-pointer px-3 py-2.5 min-h-[42px] flex items-center text-sm"
                                }
                                onClick={() => setOpenResponsable(!openResponsable)}
                            >
                                {responsables.find((r: any) => r.id === data.responsable_id)?.name ||
                                    "Seleccione o escriba un responsable..."}
                            </div>

                            {openResponsable && (
                                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    <input
                                        type="text"
                                        autoFocus
                                        maxLength={50}
                                        className="w-full px-3 py-2.5 bg-gray-800 text-gray-200 text-sm border-b border-gray-700 focus:outline-none"
                                        placeholder="Buscar responsable..."
                                        value={responsableSearch}
                                        onChange={(e) => setResponsableSearch(e.target.value)}
                                    />
                                    {filteredResponsables.length > 0 ? (
                                        filteredResponsables.map((r: any) => (
                                            <div
                                                key={r.id}
                                                onClick={() => {
                                                    setData("responsable_id", r.id);
                                                    setOpenResponsable(false);
                                                    setResponsableSearch("");
                                                }}
                                                className={`px-3 py-2 text-sm hover:bg-[#2970E8] hover:text-white cursor-pointer ${r.id === data.responsable_id ? "bg-[#1f5dc0] text-white" : "text-gray-200"
                                                    }`}
                                            >
                                                {r.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-gray-500 text-sm">Sin resultados</div>
                                    )}
                                </div>
                            )}
                            <InputError className="mt-2" message={errors.responsable_id} />
                        </div>
                    </div>

                    {/* FECHA */}
                    <div>
                        <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio del Proyecto" className="text-gray-200 font-semibold" />
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

                    {/* ARCHIVO BIM */}
                    <div className="pt-4 border-t border-gray-700">
                        <InputLabel htmlFor="archivo_bim" value="Archivo BIM Inicial (.ifc, .bim)" className="text-gray-200 font-semibold" />
                        <input
                            id="archivo_bim"
                            type="file"
                            accept=".bim,.ifc"
                            className="mt-1 block w-50% text-sm text-gray-300
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-bold
                                file:bg-[#2970E8] file:text-white
                                hover:file:bg-indigo-600 transition duration-150 cursor-pointer"
                            onChange={(e) => setData("archivo_bim", e.target.files?.[0] || null)}
                        />
                        <p className="mt-1 text-xs text-gray-500">Formatos soportados: .ifc, .bim. Máx. 256MB.</p>
                        <InputError className="mt-2" message={errors.archivo_bim} />
                    </div>

                    {/* BOTONES */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#B3E10F] text-gray-900 px-3 py-2 rounded-md hover:bg-lime-300 transition duration-150 text-sm font-bold shadow-md shadow-[#B3E10F]/30"
                        >
                            {proyecto ? "ACTUALIZAR PROYECTO" : "GUARDAR PROYECTO"}
                        </button>
                        <Link
                            href={route("proyectos.index")}
                            className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 text-white"
                        >
                            Cancelar y Volver
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
