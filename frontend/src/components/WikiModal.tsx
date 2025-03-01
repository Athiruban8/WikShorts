import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useWikiArticles } from "../hooks/useWikiArticles";
import "../styles/Wikipedia.css"; 

interface WikiModalProps {
  title: string;
  pageid: number;
  isOpen: boolean;
  onClose: () => void;
}

export function WikiModal({ title, pageid, isOpen, onClose }: WikiModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const { fetchFullArticle } = useWikiArticles();

  useEffect(() => {
    if (isOpen) {
      setContent(null);
      fetchFullArticle(pageid).then((data) => {
        if (data) {
          // Convert relative image links to Wikipedia image links
          const updatedContent = data.replace(
            /href="\/wiki\/File:([^"]+)"/g,
            'href="https://en.wikipedia.org/wiki/File:$1" target="_blank" rel="noopener noreferrer"'
          );
  
          setContent(updatedContent);
        }
      });
    }
  }, [isOpen, pageid, fetchFullArticle]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 w-screen h-screen bg-black text-white flex flex-col z-50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Close button */}
          <button
            className="absolute cursor-pointer top-4 right-4 md:top-6 md:right-6 z-50 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Article Content */}
          <div className="min-w-full h-full p-6 bg-white text-black overflow-y-auto wikipedia-style">
            <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
            {/* <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Open in Wikipedia →
            </a> */}
            {content ? (
              <div
                className="prose max-w-none wikipedia-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-lg text-gray-500">Loading...</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
