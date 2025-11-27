import React, { useState } from 'react';
import { Professional, TimeSlot } from '../../types';

interface CalendarViewProps {
  professionals: Professional[];
  selectedProfessional: Professional | undefined;
  onSelectProfessional: (professionalId: string | null) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarView: React.FC<CalendarViewProps> = ({ professionals, selectedProfessional, onSelectProfessional }) => {
    // Start with a fixed date for consistent demo experience
    const initialDate = new Date('2025-11-20T12:00:00Z');
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid issues with different month lengths
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const handleDateClick = (day: number) => {
        const newSelectedDate = new Date(currentDate);
        newSelectedDate.setDate(day);
        setSelectedDate(newSelectedDate);
    };

    const renderTimeSlots = (slots: TimeSlot[] | undefined) => {
        if (!slots || slots.length === 0) {
            return <p className="text-xs text-center text-gray-400 mt-4 col-span-full">Sem horários para este dia.</p>;
        }
        return slots.map(slot => (
            <div
                key={slot.time}
                className={`
                    p-2 rounded text-center text-xs font-semibold
                    ${slot.patient ? 'bg-red-100 text-red-800 cursor-not-allowed' : 'bg-green-100 text-green-800'}
                `}
                title={slot.patient ? `Ocupado: ${slot.patient}` : 'Horário disponível'}
            >
                {slot.time}
            </div>
        ));
    };

    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="p-1"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
            const hasAppointments = selectedProfessional?.schedule[dateStr]?.length > 0;

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                        w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors relative
                        ${isSelected ? 'bg-[#004D5A] text-white ring-2 ring-offset-2 ring-[#004D5A]' : 'hover:bg-gray-100'}
                    `}
                >
                    {day}
                    {hasAppointments && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#1B7C75] rounded-full"></div>}
                </button>
            );
        }
        return days;
    };
    
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const slotsForSelectedDay = selectedProfessional?.schedule[selectedDateString];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col">
            <h3 className="font-bold text-lg text-[#002C3C] mb-4">Agenda do Profissional</h3>
            <div className="mb-4">
                <select
                    value={selectedProfessional?.id || ''}
                    onChange={(e) => onSelectProfessional(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75] block p-2.5"
                >
                    {professionals.map(prof => (
                        <option key={prof.id} value={prof.id}>
                            {prof.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Calendar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#004D5A]">
                        <i className="ph-bold ph-caret-left"></i>
                    </button>
                    <p className="text-sm font-semibold text-gray-700 capitalize">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#004D5A]">
                        <i className="ph-bold ph-caret-right"></i>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                    {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center">
                    {renderCalendarGrid()}
                </div>
            </div>
            
            <hr className="my-2"/>

            {/* Time Slots */}
            <div className="flex-grow overflow-y-auto scrollbar-hide -mr-2 pr-2">
                {selectedProfessional ? (
                    <div>
                        <h4 className="font-bold text-center mb-2 text-sm text-[#004D5A]">
                          Horários para {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(selectedDate)}
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {renderTimeSlots(slotsForSelectedDay)}
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm">Selecione um profissional para ver a agenda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
