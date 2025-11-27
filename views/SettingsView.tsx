
import React, { useState, useEffect } from 'react';
import { checkGoogleCalendarStatus, connectGoogleCalendar, disconnectGoogleCalendar, getLastSyncTime } from '../services/googleIntegrationService';

const FormInputReadOnly: React.FC<{ label: string; id: string; value: string; }> = ({ label, id, value }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
            {label}
        </label>
        <div className="relative">
            <input
                type="text"
                id={id}
                readOnly
                value={value}
                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#1B7C75] focus:border-[#1B7C75] cursor-not-allowed"
            />
             <button 
                onClick={() => navigator.clipboard.writeText(value)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#004D5A]"
                title="Copiar para a área de transferência"
            >
                <i className="ph ph-copy"></i>
            </button>
        </div>
    </div>
);


const SettingsView: React.FC = () => {
    // WhatsApp States
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [phoneId, setPhoneId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [accessToken, setAccessToken] = useState('');

    // Google Calendar States
    const [googleStatus, setGoogleStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [googleClientId, setGoogleClientId] = useState('');
    const [lastSync, setLastSync] = useState<string | null>(null);

    useEffect(() => {
        const loadGoogleStatus = async () => {
            const isConnected = await checkGoogleCalendarStatus();
            setGoogleStatus(isConnected ? 'connected' : 'disconnected');
            setLastSync(getLastSyncTime());
        };
        loadGoogleStatus();
    }, []);

    const handleConnectWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Connecting WhatsApp with:", { phoneId, accountId, accessToken });
        setStatus('connecting');
        setTimeout(() => {
            setStatus('connected');
        }, 2000);
    };

    const handleGoogleAction = async () => {
        if (googleStatus === 'connected') {
            setGoogleStatus('connecting');
            await disconnectGoogleCalendar();
            setGoogleStatus('disconnected');
            setLastSync(null);
        } else {
            if (!googleClientId.trim()) {
                alert('Por favor, insira um Client ID para simular a conexão.');
                return;
            }
            setGoogleStatus('connecting');
            await connectGoogleCalendar(googleClientId);
            setGoogleStatus('connected');
        }
    };

    const webhookUrl = 'https://api.ecossistemaequilibrium.com/v1/whatsapp/webhook';
    const verifyToken = 'EQUILIBRIUM_VERIFY_TOKEN_XYZ';


    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* GOOGLE CALENDAR SECTION */}
            <div className="bg-white rounded-2xl shadow-md p-8 border-l-8 border-blue-500">
                <div className="flex items-start gap-4 mb-6">
                    <div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                             <i className="ph-bold ph-calendar-google text-3xl text-blue-600"></i>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#002C3C]">Google Calendar</h2>
                        <p className="text-gray-600 mt-1">
                            Sincronize automaticamente seus agendamentos da clínica com sua agenda pessoal ou profissional do Google.
                        </p>
                    </div>
                </div>

                 <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
                    <h4 className="font-bold text-gray-800">Configuração OAuth 2.0</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                        Para habilitar a sincronização, crie credenciais no <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Google Cloud Console</a> e insira seu Client ID abaixo.
                    </p>
                     <div>
                        <label htmlFor="google-client-id" className="block mb-2 text-sm font-medium text-gray-900">Google Client ID</label>
                        <input 
                            type="text" 
                            id="google-client-id" 
                            value={googleClientId} 
                            onChange={(e) => setGoogleClientId(e.target.value)} 
                            disabled={googleStatus === 'connected'}
                            className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" 
                            placeholder="Ex: 123456789-abcde.apps.googleusercontent.com" 
                        />
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {googleStatus === 'connected' && <i className="ph-fill ph-check-circle text-2xl text-green-600"></i>}
                            {googleStatus === 'disconnected' && <i className="ph-fill ph-plugs text-2xl text-gray-400"></i>}
                            {googleStatus === 'connecting' && <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>}
                            <span className={`font-semibold ${googleStatus === 'connected' ? 'text-green-700' : 'text-gray-600'}`}>
                                {googleStatus === 'connected' ? 'Sincronização Ativa' : googleStatus === 'disconnected' ? 'Não conectado' : 'Processando...'}
                            </span>
                        </div>
                        {lastSync && googleStatus === 'connected' && (
                            <p className="text-xs text-gray-500 ml-8">Última sinc: {lastSync}</p>
                        )}
                    </div>
                    <button
                        onClick={handleGoogleAction}
                        disabled={googleStatus === 'connecting'}
                        className={`
                            font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed
                            ${googleStatus === 'connected' 
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
                            }
                        `}
                    >
                        {googleStatus === 'connected' ? (
                            <>
                                <i className="ph ph-sign-out"></i>
                                Desconectar
                            </>
                        ) : (
                            <>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="w-5 h-5" />
                                Conectar com Google
                            </>
                        )}
                    </button>
                 </div>
            </div>

            {/* WHATSAPP SECTION */}
            <div className="bg-white rounded-2xl shadow-md p-8 border-l-8 border-green-500">
                <div className="flex items-start gap-4 mb-6">
                    <div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                             <i className="ph-bold ph-whatsapp-logo text-3xl text-green-600"></i>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#002C3C]">Integração com WhatsApp Business</h2>
                        <p className="text-gray-600 mt-1">
                            Conecte a API do WhatsApp Business para automatizar o agendamento de consultas diretamente das conversas com seus pacientes.
                        </p>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-800">Passo 1: Configuração no Painel da Meta</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        Acesse seu aplicativo no <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Painel de Desenvolvedores da Meta</a>,
                        vá para a seção "WhatsApp" {'>'} "Configuração da API" e use os valores abaixo para configurar o seu Webhook.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormInputReadOnly
                            label="URL de Callback do Webhook"
                            id="webhook-url"
                            value={webhookUrl}
                        />
                         <FormInputReadOnly
                            label="Token de Verificação do Webhook"
                            id="verify-token"
                            value={verifyToken}
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-bold text-gray-800">Passo 2: Insira suas Credenciais</h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Copie as credenciais da mesma página de "Configuração da API" no painel da Meta e cole nos campos abaixo.
                    </p>
                    <form onSubmit={handleConnectWhatsApp} className="space-y-4 mt-4">
                        <div>
                            <label htmlFor="phone-id" className="block mb-2 text-sm font-medium text-gray-900">ID do número de telefone</label>
                            <input type="text" id="phone-id" value={phoneId} onChange={(e) => setPhoneId(e.target.value)} className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#1B7C75] focus:border-[#1B7C75]" placeholder="Ex: 102030405060708" required />
                        </div>
                         <div>
                            <label htmlFor="account-id" className="block mb-2 text-sm font-medium text-gray-900">ID da conta do WhatsApp Business</label>
                            <input type="text" id="account-id" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#1B7C75] focus:border-[#1B7C75]" placeholder="Ex: 9080706050403020" required />
                        </div>
                         <div>
                            <label htmlFor="access-token" className="block mb-2 text-sm font-medium text-gray-900">Token de Acesso</label>
                            <input type="password" id="access-token" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#1B7C75] focus:border-[#1B7C75]" placeholder="Cole seu token aqui" required />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                             <div className="flex items-center gap-2">
                                {status === 'connected' && <i className="ph-fill ph-check-circle text-2xl text-green-600"></i>}
                                {status === 'disconnected' && <i className="ph-fill ph-x-circle text-2xl text-red-600"></i>}
                                {status === 'connecting' && <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1B7C75] rounded-full animate-spin"></div>}
                                <span className={`font-semibold ${status === 'connected' ? 'text-green-700' : status === 'disconnected' ? 'text-red-700' : 'text-gray-600'}`}>
                                    {status === 'connected' ? 'Conectado' : status === 'disconnected' ? 'Desconectado' : 'Conectando...'}
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'connecting'}
                                className="bg-[#1B7C75] hover:bg-[#004D5A] text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <i className="ph ph-plugs-connected"></i>
                                {status === 'connected' ? 'Salvar Alterações' : 'Conectar WhatsApp'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default SettingsView;
