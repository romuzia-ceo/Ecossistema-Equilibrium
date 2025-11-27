import React from 'react';
import { MOCK_SERVICES, MOCK_PROFESSIONALS, MOCK_TESTIMONIALS } from '../../../constants';
import VideoCarousel from '../VideoCarousel';
import ContactForm from '../ContactForm';

const ServiceCard: React.FC<{ service: typeof MOCK_SERVICES[0], icon: string }> = ({ service, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-shadow transform hover:-translate-y-1">
        <i className={`ph-bold ph-${icon} text-4xl text-[#1B7C75] mb-3 inline-block`}></i>
        <h3 className="font-bold text-lg text-[#002C3C] mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600 h-10">{service.instructions?.substring(0, 60)}...</p>
        <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-semibold text-[#004D5A] hover:underline mt-4"
        >
            Agendar Agora
        </button>
    </div>
);

const ProfessionalCard: React.FC<{ professional: typeof MOCK_PROFESSIONALS[0], imageUrl: string }> = ({ professional, imageUrl }) => (
    <div className="text-center">
        <img src={imageUrl} alt={professional.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
        <h3 className="font-bold text-lg text-[#002C3C]">{professional.name}</h3>
        <p className="text-sm text-[#1B7C75] font-semibold">{professional.role.split(' (')[0]}</p>
    </div>
);

const BenefitCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="text-center p-4">
        <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mx-auto mb-4">
            <i className={`ph-bold ph-${icon} text-3xl text-[#1B7C75]`}></i>
        </div>
        <h3 className="font-bold text-lg text-[#002C3C]">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ testimonial: typeof MOCK_TESTIMONIALS[0] }> = ({ testimonial }) => (
    <div className="bg-teal-50/50 p-6 rounded-2xl">
        <i className="ph-fill ph-quotes text-3xl text-[#1B7C75] mb-4"></i>
        <p className="text-gray-700 italic">"{testimonial.quote}"</p>
        <p className="mt-4 font-bold text-right text-[#004D5A]">- {testimonial.author}</p>
    </div>
);

const HomePage: React.FC = () => {
    return (
        <>
            {/* Hero Section with Video Carousel */}
            <section id="home" className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
                <VideoCarousel />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Cuidado e Equilíbrio para sua Vida</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">Oferecemos um espaço de acolhimento e desenvolvimento pessoal, com profissionais especializados em saúde mental e bem-estar.</p>
                    <div className="mt-8 flex justify-center gap-4">
                         <button 
                            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-[#1B7C75] font-bold py-3 px-6 rounded-full text-md hover:bg-gray-200 transition-colors"
                        >
                            Nossos Serviços
                        </button>
                        <button 
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-[#1B7C75] text-white font-bold py-3 px-6 rounded-full text-md hover:bg-[#004D5A] transition-colors"
                        >
                            Agende sua Consulta
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Benefits Section */}
            <section id="benefits" className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitCard icon="hand-heart" title="Acolhimento Humanizado" description="Um espaço seguro e empático para você ser ouvido sem julgamentos." />
                        <BenefitCard icon="user-focus" title="Profissionais Especializadas" description="Nossa equipe é qualificada para oferecer o melhor suporte à sua jornada." />
                        <BenefitCard icon="puzzle-piece" title="Atendimento Personalizado" description="Cada plano terapêutico é único, focado nas suas necessidades individuais." />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-[#002C3C]">Nossos Serviços</h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Conheça as áreas em que podemos te ajudar a encontrar mais equilíbrio e qualidade de vida.</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ServiceCard service={MOCK_SERVICES[0]} icon="smiley" />
                        <ServiceCard service={MOCK_SERVICES[1]} icon="brain" />
                        <ServiceCard service={MOCK_SERVICES[2]} icon="compass" />
                    </div>
                </div>
            </section>

             {/* Professionals Section */}
            <section id="team" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-[#002C3C]">Corpo Clínico</h2>
                    <p className="mt-2 text-gray-600">Profissionais dedicadas e qualificadas para oferecer o melhor cuidado.</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <ProfessionalCard professional={MOCK_PROFESSIONALS[0]} imageUrl="https://images.unsplash.com/photo-1557534401-49033a8a8a47?q=80&w=800" />
                        <ProfessionalCard professional={MOCK_PROFESSIONALS[1]} imageUrl="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800" />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-50">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-[#002C3C] text-center">O que nossos pacientes dizem</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {MOCK_TESTIMONIALS.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-[#002C3C]">Dê o primeiro passo</h2>
                    <p className="mt-2 text-gray-600">Preencha o formulário abaixo e nossa equipe entrará em contato para agendar sua consulta.</p>
                    <div className="mt-8">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
