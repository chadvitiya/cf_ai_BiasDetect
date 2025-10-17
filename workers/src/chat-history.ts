export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  query?: string;
}

export class ChatHistory {
  state: DurableObjectState;
  messages: ChatMessage[];

  constructor(state: DurableObjectState) {
    this.state = state;
    this.messages = [];
  }

  async initialize() {
    const stored = await this.state.storage.get<ChatMessage[]>('messages');
    this.messages = stored || [];
  }

  async fetch(request: Request) {
    await this.initialize();

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace('/chat', '');

    if (request.method === 'GET' && pathname === '/history') {
      return new Response(JSON.stringify({ messages: this.messages }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST' && pathname === '/add') {
      const message: ChatMessage = await request.json();
      this.messages.push(message);
      await this.state.storage.put('messages', this.messages);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'DELETE' && pathname === '/clear') {
      this.messages = [];
      await this.state.storage.put('messages', this.messages);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
}
