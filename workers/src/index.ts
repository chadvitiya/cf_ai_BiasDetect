interface Env {
  AI: any;
  SERPER_API_KEY: string;
  CHAT_HISTORY: DurableObjectNamespace;
}

export { ChatHistory } from './chat-history';

interface Article {
  title: string;
  snippet: string;
  link: string;
  source?: string;
  date?: string;
}

interface AnalyzedArticle {
  title: string;
  summary: string;
  sentiment: number;
  bias: string;
  reason: string;
  link: string;
  source?: string;
  date?: string;
}

const BIAS_ANALYSIS_PROMPT = `You are BiasHunter, an AI that summarizes and evaluates the bias of news articles.

For each article provided:
1. Summarize the content in 200-250 words with detailed analysis.
2. Assign:
   - A sentiment score between -1 (very negative) and +1 (very positive)
   - A political bias label: Left / Center / Right / Neutral
3. Justify the bias classification with one concise reason.

Format your output as valid JSON array:
[
  {
    "title": "",
    "summary": "",
    "sentiment": 0.0,
    "bias": "",
    "reason": ""
  }
]

Return ONLY the JSON array, no additional text.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);

      if (url.pathname.startsWith('/chat')) {
        const id = env.CHAT_HISTORY.idFromName('user-session');
        const stub = env.CHAT_HISTORY.get(id);
        const newRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        return stub.fetch(newRequest);
      }

      if (url.pathname === '/api/news' && request.method === 'POST') {
        const { topic } = await request.json();

        const searchResponse = await fetch('https://google.serper.dev/news', {
          method: 'POST',
          headers: {
            'X-API-KEY': env.SERPER_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ q: topic, num: 10 }),
        });

        const searchResults = await searchResponse.json();
        const articles: Article[] = (searchResults.news || []).slice(0, 10).map((n: any) => ({
          title: n.title,
          snippet: n.snippet,
          link: n.link,
          source: n.source,
          date: n.date,
        }));

        const combinedText = articles
          .map((a, i) => `Article ${i + 1}: ${a.title}\n${a.snippet}`)
          .join('\n\n');

        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          prompt: `${BIAS_ANALYSIS_PROMPT}\n\nArticles:\n${combinedText}`,
          max_tokens: 4096,
        });

        let analyzedArticles: AnalyzedArticle[] = [];

        try {
          // The AI response might be in different formats - handle them all
          let responseText = '';

          if (typeof aiResponse.response === 'string') {
            responseText = aiResponse.response;
          } else if (aiResponse.response && typeof aiResponse.response === 'object') {
            responseText = JSON.stringify(aiResponse.response);
          } else if (typeof aiResponse === 'string') {
            responseText = aiResponse;
          } else {
            responseText = JSON.stringify(aiResponse);
          }

          // Extract JSON array by finding matching brackets
          const startIdx = responseText.indexOf('[');
          if (startIdx === -1) {
            throw new Error('No JSON array found in response');
          }

          let depth = 0;
          let endIdx = startIdx;
          for (let i = startIdx; i < responseText.length; i++) {
            if (responseText[i] === '[') depth++;
            if (responseText[i] === ']') depth--;
            if (depth === 0) {
              endIdx = i;
              break;
            }
          }

          const jsonStr = responseText.substring(startIdx, endIdx + 1);
          const parsedAnalysis = JSON.parse(jsonStr);

          if (Array.isArray(parsedAnalysis) && parsedAnalysis.length > 0) {
            analyzedArticles = articles.map((article, i) => ({
              ...article,
              summary: parsedAnalysis[i]?.summary || article.snippet,
              sentiment: typeof parsedAnalysis[i]?.sentiment === 'number' ? parsedAnalysis[i].sentiment : 0,
              bias: parsedAnalysis[i]?.bias || 'Neutral',
              reason: parsedAnalysis[i]?.reason || 'AI analysis completed',
            }));
          } else {
            throw new Error('Invalid analysis format');
          }
        } catch (parseError) {
          const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown';
          analyzedArticles = articles.map(article => ({
            ...article,
            summary: article.snippet,
            sentiment: 0,
            bias: 'Neutral',
            reason: errorMsg.substring(0, 200), // Show error in UI
          }));
        }

        return new Response(JSON.stringify({ articles: analyzedArticles }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};
