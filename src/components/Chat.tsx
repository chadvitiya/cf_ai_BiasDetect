import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Article } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  articles?: Article[];
}

interface ChatProps {
  onBack: () => void;
}

export function Chat({ onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! Ask me to analyze news on any topic for bias. For example: "Show me news about climate change" or "What\'s happening in technology?"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_CLOUDFLARE_WORKER_URL}/chat/history`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(prev => [...prev, ...data.messages]);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const userMsg = { role: 'user' as const, content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      await fetch(`${import.meta.env.VITE_CLOUDFLARE_WORKER_URL}/chat/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userMsg, timestamp: Date.now(), query: userMessage })
      });

      const apiUrl = `${import.meta.env.VITE_CLOUDFLARE_WORKER_URL}/api/news`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: userMessage })
      });

      if (!response.ok) throw new Error('Failed to fetch news');

      const data = await response.json();

      const assistantMsg = {
        role: 'assistant' as const,
        content: `I found ${data.articles.length} articles about "${userMessage}". Here's the bias analysis:`,
        articles: data.articles
      };

      setMessages(prev => [...prev, assistantMsg]);

      await fetch(`${import.meta.env.VITE_CLOUDFLARE_WORKER_URL}/chat/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assistantMsg, timestamp: Date.now() })
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error fetching news. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-950">
      <div className="flex-1 overflow-y-auto px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {message.articles && message.articles.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.articles.map((article, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-neutral-800 rounded p-3 border border-neutral-200 dark:border-neutral-700"
                      >
                        <h3 className="font-medium text-sm mb-1">{article.title}</h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                          {article.summary}
                        </p>
                        <div className="flex gap-3 text-xs">
                          <span>Bias: <strong className="text-orange-500">{article.bias}</strong></span>
                          <span>Sentiment: <strong>{article.sentiment.toFixed(2)}</strong></span>
                        </div>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:underline mt-2 inline-block"
                        >
                          Read more →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to analyze news on any topic..."
            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-orange-500 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
