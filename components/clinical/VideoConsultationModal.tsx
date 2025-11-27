import React, { useState, useEffect, useRef } from 'react';

interface VideoConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
}

const ControlButton: React.FC<{
    icon: string;
    label: string;
    onClick: () => void;
    active?: boolean;
    variant?: 'default' | 'danger';
}> = ({ icon, label, onClick, active = true, variant = 'default' }) => {
    
    const baseClasses = "flex flex-col items-center justify-center w-16 h-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white";
    const variantClasses = {
        default: active ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
    }

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`} aria-label={label}>
             <i className={`ph-bold ${icon} text-2xl`}></i>
        </button>
    );
};

const VideoConsultationModal: React.FC<VideoConsultationModalProps> = ({ isOpen, onClose, patientName }) => {
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen) {
            const startStream = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setLocalStream(stream);
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                    // Simula conexão do paciente após um delay
                    if(remoteVideoRef.current) {
                         setTimeout(() => {
                            if(remoteVideoRef.current) remoteVideoRef.current.style.opacity = '1';
                         }, 1500)
                    }

                } catch (err) {
                    console.error("Erro ao acessar câmera/microfone:", err);
                    alert("Não foi possível acessar a câmera e o microfone. Verifique as permissões do seu navegador.");
                    onClose();
                }
            };
            startStream();
        } else {
            // Limpa o stream quando a modal é fechada
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
                 if(remoteVideoRef.current) remoteVideoRef.current.style.opacity = '0';
            }
        }
        
        // Função de limpeza para garantir que o stream pare ao desmontar o componente
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, onClose, localStream]);

     useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
            localStream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
        }
    }, [isMicMuted, isCameraOff, localStream]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                
                {/* Remote Video (Patient) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white">
                        <video 
                            ref={remoteVideoRef}
                            className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                            autoPlay 
                            loop 
                            playsInline 
                            src="https://storage.googleapis.com/aistudio-hosting-project-prod.appspot.com/assets/f6388f8d-c533-4613-81b0-469b62f275e5?GoogleAccessId=aistudio-hosting-project-prod%40appspot.gserviceaccount.com&Expires=4102444800&Signature=oH1iM3p2PqT8z%2B3zD6X4BvF2%2B9Y8%2BRJq3z%2B5kY2V6yU%2Bt4Vq5z%2B3z%2B8z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2-src"
                        />
                    </div>
                </div>

                {/* Local Video (Professional) */}
                <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-white">
                    <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                </div>
                
                {/* Top Bar Info */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                     <h2 className="text-white text-xl font-bold">Consulta Online: {patientName}</h2>
                </div>


                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-4 bg-gradient-to-t from-black/50 to-transparent">
                    <ControlButton 
                        icon={isMicMuted ? 'ph-microphone-slash' : 'ph-microphone'}
                        label={isMicMuted ? 'Ativar Microfone' : 'Silenciar Microfone'}
                        onClick={() => setIsMicMuted(prev => !prev)}
                        active={!isMicMuted}
                    />
                     <ControlButton 
                        icon={isCameraOff ? 'ph-video-camera-slash' : 'ph-video-camera'}
                        label={isCameraOff ? 'Ativar Câmera' : 'Desativar Câmera'}
                        onClick={() => setIsCameraOff(prev => !prev)}
                        active={!isCameraOff}
                    />
                    <ControlButton 
                        icon="ph-phone-disconnect"
                        label="Encerrar Chamada"
                        onClick={onClose}
                        variant="danger"
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoConsultationModal;
