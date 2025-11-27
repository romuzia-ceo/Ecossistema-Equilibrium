import React, { useState, useEffect } from 'react';
import { SystemUser } from '../../types';
import { SYSTEM_USERS } from '../../constants';

interface WebsiteHeaderProps {
    onSwitchUser: (user: SystemUser) => void;
}

const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({ onSwitchUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = () => {
        const patientUser = SYSTEM_USERS.find(u => u.role === 'patient');
        if (patientUser) {
            onSwitchUser(patientUser);
        }
    };

    return (
        <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#home" className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 bg-[#00A99D] rounded-md"></div>
                        <span className={`font-bold text-xl transition-colors ${isScrolled ? 'text-[#002C3C]' : 'text-white'}`}>
                            Equilibrium
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                         <a 
                            href="https://www.equilibriumsrc.com.br/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`text-sm font-semibold hover:text-[#1B7C75] px-3 py-2 rounded-md transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}
                         >
                            Ver Site Completo <i className="ph ph-arrow-square-out"></i>
                        </a>
                        <button onClick={handleLogin} className={`text-sm font-semibold hover:text-[#1B7C75] px-3 py-2 rounded-md transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
                            Portal do Paciente
                        </button>
                        <button 
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-[#004D5A] transition-colors"
                        >
                            Agende sua Consulta
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default WebsiteHeader;
