import { Share2, Heart } from 'lucide-react';
import { useState } from 'react';
import { useLikedArticles } from '../contexts/LikedArticlesContext';
import { WikiModal } from "./WikiModal";
export interface WikiArticle {
    title: string;
    displaytitle: string;
    extract: string;
    pageid: number;
    url: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
}

interface WikiCardProps {
    article: WikiArticle;
}

export function WikiCard({ article }: WikiCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);  
    const { toggleLike, isLiked } = useLikedArticles();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.displaytitle,
                    text: article.extract || '',
                    url: article.url
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            await navigator.clipboard.writeText(article.url);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <>
        <div className="h-screen w-full flex items-center justify-center snap-start relative" onDoubleClick={() => toggleLike(article)}>
            <div className="h-full w-full relative overflow-hidden">
                {article.thumbnail ? (
                    <img
                        src={article.thumbnail.source}
                        alt={article.displaytitle}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90" />
                    <div className="absolute bottom-20 left-6 right-6 text-white">
                        <div className='flex justify-between'>
                            <h2 className="text-3xl font-bold mb-2">{article.displaytitle}</h2>
                            <div className="flex gap-3 right-6">
                                <button
                                    onClick={() => toggleLike(article)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isLiked(article.pageid) ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'}`}
                                    aria-label="Like article"
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked(article.pageid) ? 'fill-white' : ''}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    aria-label="Share article"
                                    >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    {/* Expandable Extract */}
                    <p
                    className="text-xl text-gray-300 my-4 line-clamp-4 cursor-pointer hover:text-white/90 transition-colors"
                    onClick={() => setIsExpanded(true)}
                    >
                        {article.extract}
                    </p>
                    <div className="flex items-center justify-between">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-white/80 hover:text-white transition-colors"
                        >
                            Open in Wikipedia →
                        </a>
                    </div>
                </div>
            </div>
        </div>
        {isExpanded && (
            <WikiModal
                isOpen={isExpanded}
                onClose={()=>setIsExpanded(false)}
                title={article.displaytitle}
                pageid={article.pageid}
            />
        )}
      </>
    );
}
