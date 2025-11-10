import React from 'react';
import { Appointment } from '../../types';

interface CalendarViewProps {
  appointments: Appointment[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments }) => {
  const today = new Date('2025-11-20T12:00:00Z'); // Fixed date for consistent mock view
  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const appointmentsByDate: { [key: string]: Appointment[] } = appointments.reduce((acc, appt) => {
    (acc[appt.date] = acc[appt.date] || []).push(appt);
    return acc;
  }, {} as { [key: string]: Appointment[] });

  const renderDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayAppointments = appointmentsByDate[dateString] || [];
    const isToday = date.toDateString() === today.toDateString();

    return (
      <div key={dateString} className="border border-gray-200 rounded-lg p-3 bg-white flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className={`font-bold ${isToday ? 'text-[#1B7C75]' : 'text-[#002C3C]'}`}>{weekDays[date.getDay()]}</span>
          <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${isToday ? 'bg-[#1B7C75]/20 text-[#1B7C75]' : 'bg-gray-100 text-gray-600'}`}>
            {date.getDate()}
          </span>
        </div>
        <div className="space-y-2 overflow-y-auto scrollbar-hide flex-grow">
          {dayAppointments.length > 0 ? (
            dayAppointments.map(appt => (
              <div key={appt.id} className="bg-[#004D5A]/10 p-2 rounded-md border-l-4 border-[#004D5A]">
                <p className="font-bold text-sm text-[#002C3C]">{appt.time}</p>
                <p className="text-xs text-gray-700">{appt.patient}</p>
                <p className="text-xs text-gray-500">com {appt.doctor}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-gray-400 pt-4">Sem agendamentos</div>
          )}
        </div>
      </div>
    );
  };
  
  const renderWeek = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const week = [];
    for(let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week.map(day => renderDay(day));
  }


  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col">
        <h3 className="font-bold text-lg text-[#002C3C] mb-4">Agenda da Semana</h3>
        <div className="grid grid-cols-7 gap-2 flex-grow">
            {renderWeek()}
        </div>
    </div>
  );
};

export default CalendarView;
