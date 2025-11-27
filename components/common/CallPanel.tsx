import React, { useEffect, useState } from 'react';

interface CallPanelProps {
    patientName: string;
    professionalName: string;
    room: string;
    onDismiss: () => void;
}

const CallPanel: React.FC<CallPanelProps> = ({ patientName, professionalName, room, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Start fade-in animation
        const showTimer = setTimeout(() => setIsVisible(true), 50);

        // Auto-dismiss after a delay
        const timer = setTimeout(() => {
            handleClose();
        }, 12000); // Increased duration for better visibility

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onDismiss]);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for fade-out animation to complete before calling onDismiss
        setTimeout(onDismiss, 300);
    };

    return (
        <div 
            className={`fixed inset-0 bg-[#002C3C] flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
        >
            <div className="text-center text-white p-8">
                <i className="ph-fill ph-speaker-high text-6xl text-cyan-300 animate-pulse mb-8"></i>
                
                <h1 className="text-7xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {patientName}
                </h1>
                
                <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <p className="text-3xl text-gray-300">
                        Por favor, dirija-se ao
                    </p>
                    <p className="text-5xl font-semibold text-cyan-300 mt-2">
                        {room}
                    </p>
                </div>

                <p className="mt-8 text-2xl text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    com {professionalName}
                </p>
            </div>
        </div>
    );
};

export default CallPanel;