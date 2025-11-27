
import React, { useState, useRef } from 'react';
import { SystemUser } from '../types';

interface BackendTestViewProps {
  currentUser: SystemUser;
  onSwitchUser: (user: SystemUser) => void;
}

const endpointsToTest = [
    { method: 'GET', path: '/api/health' },
    { method: 'GET', path: '/api/management/professionals' },
    { method: 'GET', path: '/api/management/services' },
    { method: 'GET', path: '/api/management/insurance-plans' },
    { method: 'GET', path: '/api/clinical/today' },
    { method: 'GET', path: '/api/finance/dashboard?category=Especialidade&range=this_month' },
    { method: 'POST', path: '/api/ai/marketing-plan' },
];

const BackendTestView: React.FC<BackendTestViewProps> = ({ currentUser, onSwitchUser }) => {
    const [serverStatus, setServerStatus] = useState<'stopped' | 'starting' | 'running' | 'error'>('stopped');
    const [testResults, setTestResults] = useState<Record<string, { status: number; data: any; error?: string }>>({});
    const [runningTests, setRunningTests] = useState<string[]>([]);
    const serverRef = useRef<any>(null);

    // Function to start the server
    const startServer = async () => {
        setServerStatus('starting');
        try {
            // Try to import the backend. If in a strict browser env where relative imports
            // to non-src files are blocked, this will throw.
            // Using dynamic import with error handling.
            let backend;
            try {
                 // @ts-ignore
                 backend = await import('../backend/src/server');
            } catch (importError) {
                console.warn("Could not import backend directly. This is expected in some sandbox environments.", importError);
                // Fallback attempt or just error out cleanly
                throw new Error("Cannot load backend module in this environment.");
            }
            
            const { createServer } = backend;
            const app = createServer();
            
            // In a real browser environment, we'd need a service worker to handle fetch requests.
            // Here, we simulate it. The 'aistudio' environment handles this via google_studio_sandbox.
            // @ts-ignore - google_studio_sandbox is injected by the environment
            if (window.google_studio_sandbox) {
                // @ts-ignore
                serverRef.current = await window.google_studio_sandbox.startServer(app);
                
                // Health check
                const response = await fetch('/api/health');
                if(response.ok) {
                     setServerStatus('running');
                } else {
                     setServerStatus('error');
                }
            } else {
                console.warn("Sandbox environment not detected. Backend simulation might not work as expected.");
                setServerStatus('error');
            }
        } catch (e) {
            console.error('Failed to start server:', e);
            setServerStatus('error');
        }
    };

    const runTest = async (endpoint: typeof endpointsToTest[0]) => {
        setRunningTests(prev => [...prev, endpoint.path]);
        try {
            const response = await fetch(endpoint.path, {
                method: endpoint.method,
                headers: endpoint.method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
                // Mock body for POST requests to avoid errors
                body: endpoint.method === 'POST' ? JSON.stringify({ 
                    metrics: { 
                        topProfessional: { name: 'Test', count: 10 }, 
                        topService: { name: 'Test', count: 10 }, 
                        satisfactionRate: 100, 
                        newPatients: 5, 
                        professionalPopularity: [] 
                    } 
                }) : undefined 
            });
            
            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            setTestResults(prev => ({
                ...prev,
                [endpoint.path]: { status: response.status, data }
            }));
        } catch (e: any) {
             setTestResults(prev => ({
                ...prev,
                [endpoint.path]: { status: 0, data: null, error: e.message }
            }));
        } finally {
            setRunningTests(prev => prev.filter(p => p !== endpoint.path));
        }
    };

    const runAllTests = async () => {
        for (const endpoint of endpointsToTest) {
            await runTest(endpoint);
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#002C3C]">Teste de Backend (In-Browser)</h2>
                        <p className="text-gray-600 text-sm">Inicia um servidor Express.js simulado no navegador para testar as rotas da API.</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                            serverStatus === 'running' ? 'bg-green-100 text-green-800' :
                            serverStatus === 'error' ? 'bg-red-100 text-red-800' :
                            serverStatus === 'starting' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            Status: {serverStatus.toUpperCase()}
                        </span>
                        {serverStatus === 'stopped' && (
                            <button 
                                onClick={startServer} 
                                className="bg-[#1B7C75] text-white px-4 py-2 rounded-lg hover:bg-[#004D5A] transition-colors"
                            >
                                Iniciar Servidor
                            </button>
                        )}
                        {serverStatus === 'running' && (
                             <button 
                                onClick={runAllTests} 
                                className="bg-[#004D5A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                            >
                                Rodar Todos os Testes
                            </button>
                        )}
                    </div>
                </div>

                {serverStatus === 'running' && (
                    <div className="space-y-4">
                        {endpointsToTest.map(ep => {
                            const result = testResults[ep.path];
                            const isRunning = runningTests.includes(ep.path);
                            return (
                                <div key={ep.path} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-mono font-bold text-xs px-2 py-1 rounded ${ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {ep.method}
                                            </span>
                                            <span className="font-mono text-sm font-medium text-gray-700">{ep.path}</span>
                                        </div>
                                        <button 
                                            onClick={() => runTest(ep)}
                                            disabled={isRunning}
                                            className="text-sm text-[#1B7C75] hover:underline disabled:text-gray-400 font-medium"
                                        >
                                            {isRunning ? 'Testando...' : 'Testar Individualmente'}
                                        </button>
                                    </div>
                                    {result && (
                                        <div className={`mt-2 p-3 rounded text-xs font-mono overflow-auto max-h-60 ${result.status >= 200 && result.status < 300 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold">HTTP {result.status}</span>
                                            </div>
                                            {result.error ? (
                                                <p className="text-red-600">{result.error}</p>
                                            ) : (
                                                <pre>{JSON.stringify(result.data, null, 2)}</pre>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                 {serverStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                        <p className="font-bold flex items-center gap-2">
                            <i className="ph-bold ph-warning-circle"></i>
                            Falha ao iniciar o servidor
                        </p>
                        <p className="mt-1 text-sm">Verifique o console do navegador para mais detalhes sobre o erro.</p>
                        <p className="mt-1 text-xs text-red-600">Nota: Em alguns ambientes sandbox, a importação de módulos fora da pasta src pode ser bloqueada.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackendTestView;
