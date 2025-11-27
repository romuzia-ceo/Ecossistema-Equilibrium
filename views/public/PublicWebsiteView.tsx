import React from 'react';
import { SystemUser } from '../../types';
import WebsiteHeader from '../../components/public/WebsiteHeader';
import WebsiteFooter from '../../components/public/WebsiteFooter';
import HomePage from '../../components/public/pages/HomePage';

interface PublicWebsiteViewProps {
  onSwitchUser: (user: SystemUser) => void;
}

const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({ onSwitchUser }) => {
    
    return (
        <div className="bg-white min-h-screen">
            <WebsiteHeader onSwitchUser={onSwitchUser} />
            <main>
                <HomePage />
            </main>
            <WebsiteFooter />
        </div>
    );
};

export default PublicWebsiteView;
