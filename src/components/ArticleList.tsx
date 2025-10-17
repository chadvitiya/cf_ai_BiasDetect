import { useEffect, useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { Article, Category } from '../types';
import { categories } from '../data/categories';
import { fetchNews } from '../services/newsService';
import { Loader2 } from 'lucide-react';

interface ArticleListProps {
  category: Category;
}

export function ArticleList({ category }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryInfo = categories.find(c => c.id === category);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      setError(null);

      try {
        const query = categoryInfo?.query || category;
        const fetchedArticles = await fetchNews(query);
        setArticles(fetchedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [category, categoryInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-7 h-7 animate-spin text-orange-500 mx-auto mb-3" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Analyzing articles for bias...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-20 pb-16">
        <div className="mb-6 px-5">
          <h2 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            {categoryInfo?.label}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {articles.length} articles analyzed for bias
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border-y border-neutral-200/50 dark:border-neutral-800/50">
          {articles.map((article, index) => (
            <ArticleCard key={article.link || index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
