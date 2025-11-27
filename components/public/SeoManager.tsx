import React, { useEffect } from 'react';
import { SeoData } from '../../types';

interface SeoManagerProps {
    seoData?: SeoData;
}

const DEFAULT_SEO: SeoData = {
    title: 'Clínica Equilibrium | Saúde Mental e Bem-Estar',
    description: 'A Clínica Equilibrium oferece psicoterapia, avaliação neuropsicológica e orientação vocacional. Cuide da sua saúde mental conosco.',
};

const SeoManager: React.FC<SeoManagerProps> = ({ seoData = DEFAULT_SEO }) => {
    useEffect(() => {
        document.title = seoData.title;

        let descriptionMeta = document.querySelector('meta[name="description"]');
        if (!descriptionMeta) {
            descriptionMeta = document.createElement('meta');
            descriptionMeta.setAttribute('name', 'description');
            document.head.appendChild(descriptionMeta);
        }
        descriptionMeta.setAttribute('content', seoData.description);

    }, [seoData]);

    return null; // This component does not render anything
};

export default SeoManager;
