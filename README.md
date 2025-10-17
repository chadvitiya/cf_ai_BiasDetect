# cf_ai_BiasHunter

An AI-powered news bias analyzer built on Cloudflare's infrastructure. BiasHunter helps users detect political bias and sentiment in real-time news articles using Llama 3.3 on Workers AI.

## Features

- **AI-Powered Analysis**: Uses Llama 3.3 (70B) on Cloudflare Workers AI to analyze news articles for:
  - Political bias (Left/Center/Right/Neutral)
  - Sentiment scoring (-1 to +1)
  - Detailed reasoning for classifications

- **Real-Time News**: Fetches current news articles via Serper API

- **Chat Interface**: Natural language interaction with the AI analyzer

- **Persistent Memory**: Chat history stored using Cloudflare Durable Objects

- **Category Browsing**: Pre-defined categories (Geopolitics, Science, Business, Culture, Security, Sports)

- **Minimalist UI**: Cloudflare-themed design with dark mode support

## Architecture

### Components

1. **LLM Integration**
   - Model: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
   - Performs bias analysis and summarization
   - Structured JSON output for consistent results

2. **Cloudflare Workers**
   - Handles API requests
   - Coordinates between Serper API and Workers AI
   - Routes traffic to Durable Objects

3. **Durable Objects**
   - Stores chat history per user session
   - Provides persistent state across interactions
   - Named instances for consistent user experience

4. **User Input**
   - Category-based browsing (clicking predefined topics)
   - Chat interface for natural language queries
   - Floating action button to toggle between modes

5. **Frontend**
   - React + TypeScript
   - Vite for fast development
   - Tailwind CSS for styling

## Project Structure

```
.
├── src/                          # Frontend React app
│   ├── components/
│   │   ├── Chat.tsx             # Chat interface with history
│   │   ├── ArticleCard.tsx      # Individual article display
│   │   ├── ArticleList.tsx      # Article grid view
│   │   ├── CategoryCard.tsx     # Topic category cards
│   │   ├── Header.tsx           # Navigation header
│   │   └── Landing.tsx          # Landing page
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Dark mode support
│   ├── services/
│   │   └── newsService.ts       # API client
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   └── App.tsx                  # Main app component
│
├── workers/                      # Cloudflare Worker
│   └── src/
│       ├── index.ts             # Main worker logic
│       └── chat-history.ts      # Durable Object for memory
│
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works)
- Serper API key ([get one free](https://serper.dev))

### Local Development

1. **Clone and install dependencies**
   ```bash
   npm install
   cd workers && npm install && cd ..
   ```

2. **Configure environment variables**

   Create `.env` in project root:
   ```
   VITE_SERPER_API_KEY=your_serper_api_key_here
   VITE_CLOUDFLARE_WORKER_URL=http://localhost:8787
   ```

   Create `workers/.dev.vars`:
   ```
   SERPER_API_KEY=your_serper_api_key_here
   ```

3. **Start the Worker (Terminal 1)**
   ```bash
   cd workers
   npx wrangler dev
   ```

4. **Start the Frontend (Terminal 2)**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## Deployment

### Deploy Worker to Cloudflare

1. **Login to Cloudflare**
   ```bash
   cd workers
   npx wrangler login
   ```

2. **Add secrets**
   ```bash
   npx wrangler secret put SERPER_API_KEY
   # Paste your Serper API key when prompted
   ```

3. **Deploy**
   ```bash
   npx wrangler deploy
   ```

4. **Note your Worker URL** (e.g., `https://biashunter-worker.your-subdomain.workers.dev`)

### Deploy Frontend to Cloudflare Pages

1. **Update environment variable**

   Edit `.env`:
   ```
   VITE_CLOUDFLARE_WORKER_URL=https://biashunter-worker.your-subdomain.workers.dev
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy to Pages**
   ```bash
   npx wrangler pages deploy dist --project-name=biashunter
   ```

   Or connect your GitHub repo to Cloudflare Pages dashboard for automatic deployments.

## Usage

### Category Browsing

1. Click any category card on the landing page
2. View 10 analyzed articles for that topic
3. Each article shows:
   - AI-generated summary
   - Bias classification (Left/Center/Right/Neutral)
   - Sentiment score with emoji
   - Reasoning for the classification

### Chat Mode

1. Click the floating chat button (bottom-right)
2. Type any news topic (e.g., "artificial intelligence")
3. Receive analyzed articles in chat format
4. Chat history persists across sessions

## API Endpoints

### Worker API

**Analyze News**
```
POST /api/news
Content-Type: application/json

{
  "topic": "climate change"
}
```

**Chat History**
```
GET /chat/history
Returns: { messages: ChatMessage[] }
```

**Add to History**
```
POST /chat/add
Content-Type: application/json

{
  "role": "user" | "assistant",
  "content": "message text",
  "timestamp": 1234567890
}
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Worker**: Cloudflare Workers (TypeScript)
- **AI**: Workers AI (Llama 3.3 70B)
- **Storage**: Durable Objects
- **News API**: Serper.dev
- **Icons**: Lucide React

## Assignment Requirements

This project fulfills all requirements for the Cloudflare AI assignment:

✅ **LLM**: Uses Llama 3.3 70B via Workers AI for bias analysis
✅ **Workflow/Coordination**: Cloudflare Workers orchestrates API calls
✅ **User Input**: Chat interface + category selection
✅ **Memory/State**: Durable Objects store chat history
✅ **Documentation**: This comprehensive README
✅ **Repository Name**: Prefixed with `cf_ai_`

## License

MIT

## Author

Built for Cloudflare AI assignment
