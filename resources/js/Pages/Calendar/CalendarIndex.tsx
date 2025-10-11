import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useCallback } from 'react';
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

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalData, setModalData] = useState<FormData | null>(null);

    const meetings = initialMeetings.map(m => ({
        ...m,
        start: typeof m.start === 'string' ? new Date(m.start) : m.start,
        end: typeof m.end === 'string' ? new Date(m.end) : m.end,
    }));
    const handleCloseModal = () => {
        setShowModal(false);
        setModalData(null); 
    };

    const handleSelectSlot = useCallback(
        ({ start, end }: { start: Date, end: Date }) => {
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
        [isClient, user.id, projectsList],
    );
    const handleSelectEvent = useCallback(
        (event: Meeting) => {
            // Permitir la edición solo a usuarios internos
            if (isClient) return; 

            // Clonamos los datos del evento
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
        },
        [isClient],
    );


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
                    cursor: isClient ? 'default' : 'pointer',
                },
            };
        },
        [user.rol, isClient],
    );
    
    const isInternalUser: boolean = user.rol !== 'cliente';

    return (
        <AuthenticatedLayout 
            header={<h2 className="text-xl font-semibold leading-tight text-white">Calendario de Reuniones</h2>}
        >
            <Head title="Calendario" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-[#121212] border border-white p-6 shadow-2xl rounded-xl">

                    {isClient && (
                        <p className="mb-4 text-yellow-300">
                            * Eres cliente. Solo puedes ver las reuniones a las que has sido invitado.
                        </p>
                    )}

                    <div className="h-[80vh] text-gray-800 bg-white p-4 rounded-lg shadow-inner">
                        <Calendar
                            localizer={localizer}
                            events={meetings as any[]}
                            startAccessor="start"
                            endAccessor="end"
                            titleAccessor="title"
                            selectable={!isClient}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent as any}
                            eventPropGetter={eventPropGetter as any}
                            defaultView="week"
                            messages={{
                                next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes",
                                week: "Semana", day: "Día", 
                                showMore: (total: number) => `+ Ver más (${total})`, 
                                allDay: "Todo el día", noEventsInRange: "No hay reuniones en este rango.",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Renderizar el componente Modal extraído */}
            {isInternalUser && modalData && (
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