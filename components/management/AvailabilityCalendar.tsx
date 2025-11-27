import React, { useState, useEffect } from 'react';
import { Professional, Availability } from '../../types';

interface AvailabilityCalendarProps {
    professional: Professional;
    onProfessionalChange: (professional: Professional) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const TimeInput: React.FC<{ value: string; onChange: (value: string) => void; label: string; }> = ({ value, onChange, label }) => (
    <div>
        <label className="block text-xs text-gray-600">{label}</label>
        <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm p-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
        />
    </div>
);

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ professional, onProfessionalChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-11-20T12:00:00Z'));
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [editedAvailability, setEditedAvailability] = useState<Availability | null>({ start: '09:00', end: '18:00', lunchBreak: {start: '12:00', end: '13:00' } });

    // Reset selection when professional changes
    useEffect(() => {
        setSelectedDates(new Set());
    }, [professional.id]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const handleDateClick = (dateStr: string) => {
        setSelectedDates(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(dateStr)) {
                newSelection.delete(dateStr);
            } else {
                newSelection.add(dateStr);
            }
            return newSelection;
        });
    };

    const applyAvailability = (availability: Availability | null) => {
        const newProfAvailability = { ...professional.availability };
        selectedDates.forEach(dateStr => {
            newProfAvailability[dateStr] = availability;
        });
        onProfessionalChange({ ...professional, availability: newProfAvailability });
        setSelectedDates(new Set()); // Clear selection after applying
    };
    
    const applyRecurrence = (rule: 'weekly' | 'biweekly' | 'monthly') => {
        if (selectedDates.size === 0 || !editedAvailability) return;
        
        const newProfAvailability = { ...professional.availability };
        const referenceDate = new Date(`${Array.from(selectedDates)[0]}T12:00:00Z`);
        const dayOfWeek = referenceDate.getDay();
        const dateOfMonth = referenceDate.getDate();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const loopDate = new Date(year, month, day);
            const dateStr = loopDate.toISOString().split('T')[0];
            let shouldApply = false;

            if (rule === 'weekly' && loopDate.getDay() === dayOfWeek) {
                shouldApply = true;
            } else if (rule === 'monthly' && loopDate.getDate() === dateOfMonth) {
                shouldApply = true;
            } else if (rule === 'biweekly' && loopDate.getDay() === dayOfWeek) {
                 const weekNumber = Math.ceil((loopDate.getDate() + 6 - loopDate.getDay()) / 7);
                 const referenceWeekNumber = Math.ceil((referenceDate.getDate() + 6 - referenceDate.getDay()) / 7);
                 if ((weekNumber % 2) === (referenceWeekNumber % 2)) {
                    shouldApply = true;
                 }
            }
            
            if (shouldApply) {
                 newProfAvailability[dateStr] = editedAvailability;
            }
        }
        onProfessionalChange({ ...professional, availability: newProfAvailability });
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0,0,0,0);

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="p-1"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = dateObj.toISOString().split('T')[0];
            const isSelected = selectedDates.has(dateStr);
            const hasAvailability = !!professional.availability[dateStr];
            const isToday = dateObj.getTime() === today.getTime();

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(dateStr)}
                    className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors relative
                        ${isSelected ? 'bg-[#004D5A] text-white ring-2 ring-offset-2 ring-[#004D5A]' : ''}
                        ${!isSelected && isToday ? 'bg-teal-100 text-teal-800' : ''}
                        ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
                    `}
                >
                    {day}
                    {hasAvailability && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#1B7C75] rounded-full"></div>}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
                 <h4 className="font-semibold text-md text-[#002C3C] mb-2">Definir Disponibilidade</h4>
                 <div className="flex items-center justify-between mb-2">
                     <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><i className="ph-bold ph-caret-left"></i></button>
                     <span className="font-bold text-lg text-gray-800">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                     <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><i className="ph-bold ph-caret-right"></i></button>
                 </div>
                 <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                     {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
                 </div>
                 <div className="grid grid-cols-7 gap-1 place-items-center">
                     {renderCalendar()}
                 </div>
            </div>
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg h-fit">
                <h5 className="font-semibold text-md text-gray-800 mb-2">
                   {selectedDates.size > 0 ? `Editando ${selectedDates.size} dia(s)` : 'Selecione um ou mais dias'}
                </h5>
                {selectedDates.size > 0 && (
                     <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border">
                             <h6 className="font-semibold text-sm mb-2">Horário de Atendimento</h6>
                              <div className="grid grid-cols-2 gap-2">
                                <TimeInput value={editedAvailability?.start || ''} onChange={val => setEditedAvailability(p => p ? {...p, start: val} : null)} label="Início"/>
                                <TimeInput value={editedAvailability?.end || ''} onChange={val => setEditedAvailability(p => p ? {...p, end: val} : null)} label="Fim"/>
                                <TimeInput value={editedAvailability?.lunchBreak?.start || ''} onChange={val => setEditedAvailability(p => p ? {...p, lunchBreak: {...p.lunchBreak, start: val}} : null)} label="Pausa Início"/>
                                <TimeInput value={editedAvailability?.lunchBreak?.end || ''} onChange={val => setEditedAvailability(p => p ? {...p, lunchBreak: {...p.lunchBreak, end: val}} : null)} label="Pausa Fim"/>
                              </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                             <h6 className="font-semibold text-sm mb-2">Ações Rápidas</h6>
                             <div className="space-y-2">
                                <button onClick={() => applyAvailability(editedAvailability)} className="w-full text-sm text-center py-2 px-3 bg-teal-500 text-white rounded-md hover:bg-teal-600">Aplicar Horário</button>
                                <button onClick={() => applyAvailability(null)} className="w-full text-sm text-center py-2 px-3 bg-red-500 text-white rounded-md hover:bg-red-600">Marcar como Folga</button>
                             </div>
                        </div>
                         <div className="p-3 bg-white rounded-lg border">
                             <h6 className="font-semibold text-sm mb-2">Aplicar Recorrência no Mês</h6>
                             <div className="space-y-2">
                                <button onClick={() => applyRecurrence('weekly')} className="w-full text-sm text-center py-2 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Toda semana</button>
                                <button onClick={() => applyRecurrence('biweekly')} className="w-full text-sm text-center py-2 px-3 bg-purple-500 text-white rounded-md hover:bg-purple-600">A cada 15 dias</button>
                             </div>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default AvailabilityCalendar;