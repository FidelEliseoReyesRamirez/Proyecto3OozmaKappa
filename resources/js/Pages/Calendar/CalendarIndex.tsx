import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import MeetingFormModal from '@/Pages/Meeting/MeetingFormModal';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface Meeting {
    id: number;
    title: string;
    start: Date | string;
    end: Date | string;
    description: string;
    projectId: number;
    projectTitle: string;
    participants: number[];
}

interface ListItem {
    id: number;
    name: string;
}

interface FormData {
    id?: number;
    title: string;
    start: string;
    end: string;
    description: string;
    projectId: string | number;
    participants: number[];
}

interface CalendarProps {
    meetings: Meeting[];
    usersList: ListItem[];
    projectsList: ListItem[];
}

export default function CalendarIndex({ meetings: initialMeetings, usersList, projectsList }: CalendarProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isClient = user.rol === 'cliente';
    const isInternalUser = !isClient;

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<FormData | null>(null);

    const [filterType, setFilterType] = useState<'todas' | 'futuras' | 'pasadas'>('todas');
    const [filterProject, setFilterProject] = useState<number | 'todos'>('todos');
    const [filterUser, setFilterUser] = useState<number | 'todos'>('todos');

    // Normalizar las fechas
    const meetings = initialMeetings.map(m => ({
        ...m,
        start: typeof m.start === 'string' ? new Date(m.start) : m.start,
        end: typeof m.end === 'string' ? new Date(m.end) : m.end,
    }));

    const now = new Date();

    // Aplicar filtros
    const filteredMeetings = useMemo(() => {
        return meetings.filter(m => {
            const startDate = new Date(m.start);
            const isFuture = startDate >= now;
            const isPast = startDate < now;

            if (filterType === 'futuras' && !isFuture) return false;
            if (filterType === 'pasadas' && !isPast) return false;

            if (filterProject !== 'todos' && m.projectId !== filterProject) return false;
            if (filterUser !== 'todos' && !m.participants.includes(filterUser)) return false;

            return true;
        });
    }, [meetings, filterType, filterProject, filterUser]);

    const handleCloseModal = () => {
        setShowModal(false);
        setModalData(null);
    };

    // Crear nueva reunión
    const handleSelectSlot = useCallback(
        ({ start, end }: { start: Date; end: Date }) => {
            if (isClient) return;
            setModalData({
                title: '',
                description: '',
                start: moment(start).format('YYYY-MM-DDTHH:mm'),
                end: moment(end).format('YYYY-MM-DDTHH:mm'),
                projectId: projectsList.length > 0 ? projectsList[0].id : '',
                participants: [user.id],
            });
            setShowModal(true);
        },
        [isClient, user.id, projectsList]
    );

    // Ver/editar reunión existente
    const handleSelectEvent = useCallback((event: Meeting) => {
        setModalData({
            id: event.id,
            title: event.title,
            description: event.description || '',
            start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
            end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
            projectId: event.projectId,
            participants: event.participants,
        });
        setShowModal(true);
    }, []);

    const eventPropGetter = useCallback(
        (event: Meeting) => {
            let color = '#2970E8';
            let textColor = 'white';

            if (user.rol === 'arquitecto' || user.rol === 'ingeniero') {
                color = '#B3E10F';
                textColor = 'black';
            } else if (user.rol === 'cliente') {
                color = '#383838';
                textColor = 'white';
            }

            return {
                style: {
                    backgroundColor: color,
                    color: textColor,
                    borderRadius: '5px',
                    border: 'none',
                    padding: '3px 6px',
                    cursor: 'pointer',
                },
            };
        },
        [user.rol]
    );

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-white">Calendario de Reuniones</h2>}
        >
            <Head title="Calendario" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-[#121212] border border-white p-6 shadow-2xl rounded-xl text-white">
                    {isClient && (
                        <p className="mb-4 text-yellow-300">
                            * Eres cliente. Solo puedes ver los detalles de las reuniones haciendo click. No puedes crear, modificar ni eliminar.
                        </p>
                    )}

                    {/* PANEL DE FILTROS */}
                    <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setFilterType('todas')}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                                    filterType === 'todas'
                                        ? 'bg-[#B3E10F] text-black'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFilterType('futuras')}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                                    filterType === 'futuras'
                                        ? 'bg-[#B3E10F] text-black'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                Próximas
                            </button>
                            <button
                                onClick={() => setFilterType('pasadas')}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                                    filterType === 'pasadas'
                                        ? 'bg-[#B3E10F] text-black'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                Pasadas
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <select
                                value={filterProject}
                                onChange={(e) => setFilterProject(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1.5 text-sm"
                            >
                                <option value="todos">Todos los proyectos</option>
                                {projectsList.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1.5 text-sm"
                            >
                                <option value="todos">Todos los participantes</option>
                                {usersList.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* CALENDARIO */}
                    <div className="h-[80vh] text-gray-800 bg-white p-4 rounded-lg shadow-inner">
                        <Calendar
                            localizer={localizer}
                            events={filteredMeetings as any[]}
                            startAccessor="start"
                            endAccessor="end"
                            titleAccessor="title"
                            selectable={!isClient}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent as any}
                            eventPropGetter={eventPropGetter as any}
                            defaultView="week"
                            messages={{
                                next: 'Sig.',
                                previous: 'Ant.',
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Día',
                                showMore: (total: number) => `+ Ver más (${total})`,
                                allDay: 'Todo el día',
                                noEventsInRange: 'No hay reuniones en este rango.',
                            }}
                        />
                    </div>
                </div>
            </div>

            {modalData && (
                <MeetingFormModal
                    show={showModal}
                    onClose={handleCloseModal}
                    initialData={modalData}
                    projectsList={projectsList}
                    usersList={usersList}
                    userRole={user.rol}
                />
            )}
        </AuthenticatedLayout>
    );
}
