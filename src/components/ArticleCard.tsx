import { ExternalLink } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

function getBiasColor(bias: string): string {
  const normalized = bias.toLowerCase();
  if (normalized.includes('left')) return 'text-blue-600 dark:text-blue-400';
  if (normalized.includes('right')) return 'text-red-600 dark:text-red-400';
  if (normalized.includes('center')) return 'text-green-600 dark:text-green-400';
  return 'text-neutral-600 dark:text-neutral-400';
}

function getSentimentEmoji(sentiment: number): string {
  if (sentiment > 0.3) return '😊';
  if (sentiment < -0.3) return '😟';
  return '😐';
}

export function ArticleCard({ article }: ArticleCardProps) {
  const biasColor = getBiasColor(article.bias);

  return (
    <article className="group bg-white dark:bg-neutral-900 border-b border-neutral-200/50 dark:border-neutral-800/50 last:border-b-0 transition-colors duration-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
      <div className="px-5 py-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium leading-snug text-neutral-900 dark:text-neutral-100 mb-1.5">
              {article.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
              {article.source && (
                <span className="font-medium uppercase tracking-wide">{article.source}</span>
              )}
              {article.date && (
                <>
                  <span>•</span>
                  <span>{article.date}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 mb-3">
          {article.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 dark:text-neutral-500">Bias:</span>
            <span className={`font-semibold ${biasColor}`}>{article.bias}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 dark:text-neutral-500">Sentiment:</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {getSentimentEmoji(article.sentiment)} {article.sentiment.toFixed(2)}
            </span>
          </div>
        </div>

        {article.reason && (
          <p className="text-xs italic text-neutral-500 dark:text-neutral-500 mb-3 pl-3 border-l-2 border-orange-500/30">
            {article.reason}
          </p>
        )}

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
        >
          <span>Read full article</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </article>
  );
}
