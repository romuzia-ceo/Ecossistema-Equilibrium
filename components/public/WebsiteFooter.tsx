import React from 'react';

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => (
    <a href="#" className="text-gray-400 hover:text-white transition-colors">
        <i className={`ph-bold ph-${icon} text-2xl`}></i>
    </a>
);

const WebsiteFooter: React.FC = () => {
    return (
        <footer className="bg-[#002C3C] text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Equilibrium</h3>
                        <p className="text-gray-400 text-sm">
                            Cuidando da sua saúde mental e bem-estar em cada fase da vida.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-4">Site Principal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://www.equilibriumsrc.com.br/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Serviços Detalhados</a></li>
                            <li><a href="https://www.equilibriumsrc.com.br/corpo-clinico" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Corpo Clínico</a></li>
                            <li><a href="https://www.equilibriumsrc.com.br/blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Blog Completo</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-4">Contato</h3>
                        <address className="not-italic text-sm space-y-2 text-gray-400">
                            <p>Rua Exemplo, 123 - Centro<br/>São Roque - SP, 18130-000</p>
                            <p>Telefone: (11) 98765-4321</p>
                            <p>Email: contato@equilibriumsrc.com.br</p>
                        </address>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-4">Siga-nos</h3>
                        <div className="flex gap-4">
                            <SocialIcon icon="instagram-logo" />
                            <SocialIcon icon="facebook-logo" />
                            <SocialIcon icon="linkedin-logo" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Clínica Equilibrium. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default WebsiteFooter;
