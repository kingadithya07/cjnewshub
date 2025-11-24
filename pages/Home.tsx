

import React from 'react';
import { useNews } from '../context/NewsContext';
import { AdSpace } from '../components/AdSpace';
import { AdSize } from '../types';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { articles, incrementArticleView, currentUser } = useNews();
  const navigate = useNavigate();
  
  // Filter for published articles only
  const publishedArticles = articles.filter(a => a.status === 'published');
  
  // Prioritize Featured articles, then fallback to newest
  const featuredArticle = publishedArticles.find(a => a.isFeatured) || publishedArticles[0];
  
  // Get other articles excluding the featured one
  const sideArticles = publishedArticles
    .filter(a => a.id !== featuredArticle?.id)
    .slice(0, 4);

  const handleArticleClick = (id: string) => {
    incrementArticleView(id);
    navigate(`/article/${id}`);
  };

  return (
    <div className="w-full min-h-screen pb-12 bg-[#FAF9F6]">
        {/* Top Leaderboard Ad */}
        <div className="max-w-7xl mx-auto px-4 border-b border-gray-200 pb-8">
            <AdSpace size={AdSize.LEADERBOARD} className="w-full" label="Premium Global Partners" />
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Content Area (Left 8 cols) */}
            <div className="lg:col-span-8 space-y-10">
                {/* Featured Article */}
                {featuredArticle && (
                    <article className="group mb-12 relative">
                        <div 
                            className="relative overflow-hidden mb-6 cursor-pointer rounded-2xl shadow-lg aspect-[16/9] md:aspect-[2/1] w-full" 
                            onClick={() => handleArticleClick(featuredArticle.id)}
                        >
                            {featuredArticle.videoUrl ? (
                                <div className="w-full h-full bg-black flex items-center justify-center relative group-hover:bg-gray-900 transition-colors">
                                     <video 
                                        src={featuredArticle.videoUrl} 
                                        poster={featuredArticle.imageUrl}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        muted
                                        loop
                                        onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
                                        onMouseOut={(e) => e.currentTarget.pause()}
                                     />
                                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                         <PlayCircle className="w-16 h-16 text-white opacity-80" />
                                     </div>
                                </div>
                            ) : (
                                <img 
                                    src={featuredArticle.imageUrl} 
                                    alt={featuredArticle.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                            )}
                            {/* Gradient Overlay for better text visibility if we want to overlay text, or just aesthetic */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="absolute top-4 left-4 bg-gold shadow-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-10">
                                {featuredArticle.category}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 px-2">
                             <div className="flex items-center gap-3 text-xs text-gray-500 font-sans uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Clock size={12}/> {featuredArticle.date}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="font-bold text-ink">Published by {featuredArticle.author}</span>
                             </div>
                             
                             <h2 
                                className="text-3xl md:text-5xl font-serif font-black text-ink leading-tight group-hover:text-gold-dark transition-colors cursor-pointer"
                                onClick={() => handleArticleClick(featuredArticle.id)}
                             >
                                {featuredArticle.title}
                             </h2>
                             
                             <p className="text-gray-600 font-serif text-lg md:text-xl leading-relaxed mt-2 line-clamp-3">
                                {featuredArticle.excerpt}
                             </p>

                             <div className="mt-4">
                                <button 
                                    onClick={() => handleArticleClick(featuredArticle.id)}
                                    className="text-xs font-bold uppercase tracking-widest border-b-2 border-gold pb-1 hover:text-gold-dark transition-colors flex items-center gap-2 w-fit"
                                >
                                    Read Full Story <ArrowRight size={14} />
                                </button>
                             </div>
                        </div>
                    </article>
                )}

                {/* In-Feed Ad Space */}
                <div className="border-t border-b border-gray-200 py-8 my-8 bg-gray-50/50 rounded-lg">
                    <AdSpace size={AdSize.LEADERBOARD} label="Sponsored Content" />
                </div>

                {/* Sub Articles Grid */}
                <h3 className="text-xl font-serif font-bold border-b-2 border-gray-200 pb-2 mb-6">Latest Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {sideArticles.map(article => (
                        <article key={article.id} className="flex flex-col gap-4 group">
                            <div 
                                className="overflow-hidden w-full aspect-video bg-gray-100 relative cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                onClick={() => handleArticleClick(article.id)}
                            >
                                {article.videoUrl && (
                                    <div className="absolute top-2 right-2 z-10 bg-black/50 p-1 rounded-full">
                                        <PlayCircle className="text-white w-4 h-4" />
                                    </div>
                                )}
                                <img 
                                    src={article.imageUrl} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">{article.category}</span>
                                <h3 
                                    className="text-xl font-serif font-bold text-ink leading-snug group-hover:text-gold-dark transition-colors cursor-pointer"
                                    onClick={() => handleArticleClick(article.id)}
                                >
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-500 font-serif line-clamp-2 leading-relaxed">
                                    {article.excerpt}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1">{article.date}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Sidebar (Right 4 cols) */}
            <div className="lg:col-span-4 border-l border-gray-200 pl-0 lg:pl-8 space-y-10">
                
                {/* Sidebar Ad */}
                <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-lg flex justify-center">
                     <AdSpace size={AdSize.RECTANGLE} label="Sponsored" />
                </div>

                {/* Trending / List Widget */}
                <div>
                    <h4 className="text-lg font-sans font-bold border-b-2 border-ink pb-2 mb-6 uppercase tracking-wider text-xs">Trending Now</h4>
                    <ul className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <li key={i} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-4 last:border-0">
                                <span className="text-3xl font-serif font-black text-gray-200 group-hover:text-gold transition-colors">0{i}</span>
                                <div>
                                    <h5 className="font-serif font-bold text-sm leading-snug group-hover:text-gray-600 transition-colors">
                                        Diplomatic tensions rise as trade agreements stall in the Pacific region.
                                    </h5>
                                    <span className="text-[10px] text-gray-400 uppercase mt-2 block font-bold">2 Hours Ago</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Subscribe Widget - Hidden if logged in */}
                {!currentUser && (
                    <div className="bg-ink text-white p-8 text-center rounded-lg shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gold/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="font-serif font-bold text-2xl mb-2 relative z-10">Morning Briefing</h4>
                        <p className="text-gray-400 text-xs mb-6 font-sans relative z-10">Start your day with the stories you need to know. Delivered at 7 AM.</p>
                        <button 
                            onClick={() => navigate('/subscribe')}
                            className="w-full bg-gold hover:bg-white hover:text-ink text-ink font-bold text-xs uppercase py-3 tracking-widest transition-colors rounded shadow-md relative z-10"
                        >
                            Sign Up Free
                        </button>
                    </div>
                )}
                
                 {/* Skyscraper Ad */}
                 <div className="hidden md:flex justify-center sticky top-24 pt-4">
                     <AdSpace size={AdSize.SKYSCRAPER} />
                </div>

            </div>
        </div>
    </div>
  );
};
