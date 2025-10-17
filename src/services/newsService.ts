import { Article } from '../types';

export async function fetchNews(query: string): Promise<Article[]> {
  try {
    const apiUrl = `${import.meta.env.VITE_CLOUDFLARE_WORKER_URL}/api/news`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}
