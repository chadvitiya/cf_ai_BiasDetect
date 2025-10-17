import { useState } from 'react';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { ArticleList } from './components/ArticleList';
import { Chat } from './components/Chat';
import { Category } from './types';
import { MessageSquare, Grid3x3 } from 'lucide-react';

type View = 'landing' | 'category' | 'chat';

function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('category');
  };

  const handleBack = () => {
    setView('landing');
    setSelectedCategory(null);
  };

  const toggleView = () => {
    if (view === 'chat') {
      setView('landing');
    } else {
      setView('chat');
    }
    setSelectedCategory(null);
  };

  return (
    <>
      <Header showBack={view !== 'landing'} onBack={handleBack} />

      <button
        onClick={toggleView}
        className="fixed bottom-6 right-6 z-50 p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
        aria-label={view === 'chat' ? 'Show categories' : 'Open chat'}
      >
        {view === 'chat' ? <Grid3x3 size={24} /> : <MessageSquare size={24} />}
      </button>

      {view === 'chat' ? (
        <Chat onBack={handleBack} />
      ) : view === 'category' && selectedCategory ? (
        <ArticleList category={selectedCategory} />
      ) : (
        <Landing onSelectCategory={handleSelectCategory} />
      )}
    </>
  );
}

export default App;
