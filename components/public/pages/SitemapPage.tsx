import React from 'react';
import { MOCK_BLOG_POSTS } from '../../../constants';

// The PUBLIC_ROUTES constant was part of a previous refactoring to break a circular dependency.
// It is not used by any part of the application's routing and has been removed to
// clean up the code and prevent potential, hard-to-debug module loading issues.

const SitemapLink: React.FC<{ url: string; lastModified?: string }> = ({ url, lastModified }) => (
    <div className="py-2 border-b">
        <p className="text-blue-600 hover:underline">
            <a href={`#${url}`}>{url}</a>
        </p>
        {lastModified && <p className="text-xs text-gray-500">Last Modified: {lastModified}</p>}
    </div>
);

const SitemapPage: React.FC<{ navigate: (path: string) => void; }> = ({ navigate }) => {
    // A simplified list of main pages for the sitemap display.
    const mainPages = [
        { path: '/' },
        { path: '/saude-inteligente' },
        { path: '/sitemap' },
    ];
    
    return (
        <div className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-8 rounded-2xl shadow-md">
                    <h1 className="text-3xl font-bold text-[#002C3C] mb-2">Sitemap</h1>
                    <p className="text-gray-600 mb-6">Esta página lista todas as URLs disponíveis no site para facilitar a indexação por motores de busca como o Google.</p>
                    
                    <h2 className="text-xl font-bold text-[#004D5A] mt-8 mb-4">Páginas Principais</h2>
                    <div className="space-y-2">
                        {mainPages.map(route => (
                            <SitemapLink key={route.path} url={route.path} />
                        ))}
                    </div>

                    <h2 className="text-xl font-bold text-[#004D5A] mt-8 mb-4">Artigos do Blog</h2>
                    <div className="space-y-2">
                        {MOCK_BLOG_POSTS.map(post => (
                             <SitemapLink key={post.slug} url={`/saude-inteligente/${post.slug}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitemapPage;