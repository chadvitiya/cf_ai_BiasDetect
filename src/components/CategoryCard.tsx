import {
  Globe2,
  Microscope,
  TrendingUp,
  BookOpen,
  Shield,
  Trophy
} from 'lucide-react';
import { CategoryInfo } from '../types';

const iconMap = {
  Globe2,
  Microscope,
  TrendingUp,
  BookOpen,
  Shield,
  Trophy,
};

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap];

  return (
    <button
      onClick={onClick}
      className="group relative w-full aspect-square bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-200 hover:border-orange-500/50 dark:hover:border-orange-500/50 hover:shadow-md active:scale-[0.98]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="mb-4 transition-transform duration-200 group-hover:scale-105">
          <Icon
            size={40}
            className="text-neutral-700 dark:text-neutral-300 group-hover:text-orange-500 dark:group-hover:text-orange-500 transition-colors"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
          {category.label}
        </h2>
      </div>
    </button>
  );
}
