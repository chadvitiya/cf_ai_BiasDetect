import { categories } from '../data/categories';
import { CategoryCard } from './CategoryCard';
import { Category } from '../types';

interface LandingProps {
  onSelectCategory: (category: Category) => void;
}

export function Landing({ onSelectCategory }: LandingProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 tracking-wide">
            Track bias in real-time news
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
