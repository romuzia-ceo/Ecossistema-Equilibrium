import { MOCK_PROFESSIONALS, MOCK_SERVICES, MOCK_USERS, MOCK_TEMPLATES, MOCK_INSURANCE_PLANS } from '../constants';
import { Professional, ClinicService, User, Template, HealthInsurancePlan } from '../types';

// ===================================================================================
// SERVIÇO DE GESTÃO (SIMULAÇÃO DE BACKEND)
// ===================================================================================
// Este serviço simula o banco de dados e a lógica de negócios para o módulo
// de gestão da clínica.
// ===================================================================================

let professionalsData: Professional[] = JSON.parse(JSON.stringify(MOCK_PROFESSIONALS));
let servicesData: ClinicService[] = JSON.parse(JSON.stringify(MOCK_SERVICES));
let usersData: User[] = JSON.parse(JSON.stringify(MOCK_USERS));
let templatesData: Template[] = JSON.parse(JSON.stringify(MOCK_TEMPLATES));
let insurancePlansData: HealthInsurancePlan[] = JSON.parse(JSON.stringify(MOCK_INSURANCE_PLANS));


// --- Professionals ---
export const getProfessionals = async (): Promise<Professional[]> => {
    return new Promise(resolve => setTimeout(() => resolve(professionalsData), 300));
};

export const getProfessionalById = async (id: string): Promise<Professional | null> => {
    return new Promise(resolve => {
        const professional = professionalsData.find(p => p.id === id);
        setTimeout(() => resolve(professional || null), 300);
    });
};

export const updateProfessional = async (professional: Professional): Promise<Professional> => {
    return new Promise((resolve, reject) => {
        const index = professionalsData.findIndex(p => p.id === professional.id);
        if (index !== -1) {
            professionalsData[index] = professional;
            resolve(professional);
        } else {
            // A simple way to add a new one if not found (or could be an error)
            const newProfessional = { ...professional, id: `prof-${Date.now()}` };
            professionalsData.push(newProfessional);
            resolve(newProfessional);
        }
    });
};

// --- Services ---
export const getServices = async (): Promise<ClinicService[]> => {
    return new Promise(resolve => setTimeout(() => resolve(servicesData), 300));
};

export const saveService = async (service: ClinicService): Promise<ClinicService> => {
     return new Promise(resolve => {
        const index = servicesData.findIndex(s => s.id === service.id);
        if (index !== -1) {
            servicesData[index] = service;
            resolve(service);
        } else {
            const newService = { ...service, id: `serv-${Date.now()}` };
            servicesData.push(newService);
            resolve(newService);
        }
    });
}

// --- Users ---
export const getUsers = async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(usersData), 300));
};

export const saveUser = async (user: User): Promise<User> => {
    return new Promise(resolve => {
        const index = usersData.findIndex(u => u.id === user.id);
        if (index !== -1) {
            usersData[index] = user;
            resolve(user);
        } else {
            const newUser = { ...user, id: `user-${Date.now()}` };
            usersData.push(newUser);
            resolve(newUser);
        }
    });
}


// --- Templates ---
export const getTemplates = async (): Promise<Template[]> => {
    return new Promise(resolve => setTimeout(() => resolve(templatesData), 300));
};

export const saveTemplate = async (template: Template): Promise<Template> => {
    return new Promise(resolve => {
        const index = templatesData.findIndex(t => t.id === template.id);
        if (index !== -1) {
            templatesData[index] = template;
            resolve(template);
        } else {
            const newTemplate = { ...template, id: `tmpl-${Date.now()}` };
            templatesData.push(newTemplate);
            resolve(newTemplate);
        }
    });
}

// --- Health Insurance Plans ---
export const getInsurancePlans = async (): Promise<HealthInsurancePlan[]> => {
    return new Promise(resolve => setTimeout(() => resolve(insurancePlansData), 300));
};

export const saveInsurancePlan = async (plan: HealthInsurancePlan): Promise<HealthInsurancePlan> => {
    return new Promise(resolve => {
        const index = insurancePlansData.findIndex(p => p.id === plan.id);
        if (index !== -1) {
            insurancePlansData[index] = plan;
            resolve(plan);
        } else {
            const newPlan = { ...plan, id: `ins-${Date.now()}` };
            insurancePlansData.push(newPlan);
            resolve(newPlan);
        }
    });
};