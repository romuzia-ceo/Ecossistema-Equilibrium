import React from 'react';
import { MOCK_BLOG_POSTS, HEALTH_CAMPAIGNS } from '../../../constants';
import { BlogPost } from '../../../types';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
     <div className="bg-white rounded-2xl shadow-md overflow-hidden group">
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
        <div className="p-6">
            <p className="text-xs font-semibold text-[#1B7C75] uppercase">{post.category}</p>
            <h3 className="font-bold text-lg text-[#002C3C] mt-1 h-14 group-hover:text-[#1B7C75] transition-colors">{post.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
            <a href="#" className="text-sm font-semibold text-[#004D5A] hover:underline mt-4 inline-block">
                Leia mais <i className="ph ph-arrow-right"></i>
            </a>
        </div>
    </div>
);


const HealthSpacePage: React.FC = () => {
    const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
    const activeCampaign = HEALTH_CAMPAIGNS[currentMonth];
    
    // Filter posts for the active campaign or show all if no campaign for the month
    const filteredPosts = activeCampaign
        ? MOCK_BLOG_POSTS.filter(post => post.campaignSlug === activeCampaign.slug)
        : MOCK_BLOG_POSTS;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold text-[#002C3C]">Saúde Inteligente</h1>
                     <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">Um lugar para aprender, refletir e encontrar caminhos para uma vida com mais equilíbrio e bem-estar.</p>
                </div>
                
                {activeCampaign && (
                    <section className={`p-8 rounded-2xl mb-12 ${activeCampaign.bgColor}`}>
                        <h2 className={`text-3xl font-bold ${activeCampaign.color}`}>{activeCampaign.name}</h2>
                        <p className={`mt-2 text-lg ${activeCampaign.color.replace(/800/,'700')} opacity-90`}>{activeCampaign.description}</p>
                    </section>
                )}
                
                <section>
                    <h3 className="text-2xl font-bold text-[#002C3C] mb-6">
                      {activeCampaign ? `Artigos em Destaque: ${activeCampaign.name}` : 'Todos os Artigos'}
                    </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {filteredPosts.map(p => <BlogCard key={p.id} post={p} />)}
                    </div>
                </section>

                 {activeCampaign && filteredPosts.length < MOCK_BLOG_POSTS.length && (
                    <section className="mt-12">
                        <h3 className="text-2xl font-bold text-[#002C3C] mb-6">Mais Artigos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {MOCK_BLOG_POSTS.filter(p => p.campaignSlug !== activeCampaign.slug).map(p => (
                                <BlogCard key={p.id} post={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default HealthSpacePage;