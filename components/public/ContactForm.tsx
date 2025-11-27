import React, { useState } from 'react';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        console.log({ name, phone, message });

        // Simulate API call
        setTimeout(() => {
            // Randomly succeed or fail for demo
            if (Math.random() > 0.2) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="bg-teal-50 border border-teal-200 text-teal-800 p-6 rounded-2xl text-center">
                <i className="ph-bold ph-check-circle text-4xl mb-2"></i>
                <h3 className="font-bold">Mensagem Enviada!</h3>
                <p>Obrigado pelo seu contato. Entraremos em contato em breve.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Seu Nome</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                    placeholder="Seu nome completo"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Seu WhatsApp</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                    placeholder="(XX) XXXXX-XXXX"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem (Opcional)</label>
                <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                    placeholder="Gostaria de agendar uma consulta..."
                />
            </div>
             {status === 'error' && <p className="text-red-600 text-sm">Ocorreu um erro. Tente novamente.</p>}
            <div>
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[#1B7C75] text-white font-bold py-3 px-6 rounded-lg text-md hover:bg-[#004D5A] transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                    {status === 'sending' ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enviando...
                        </>
                    ) : (
                        'Enviar Solicitação de Contato'
                    )}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
