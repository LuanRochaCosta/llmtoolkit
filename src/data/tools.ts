export type ToolStatus = 'live' | 'planned';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  status: ToolStatus;
  keywords: string[];
}

export const tools: Tool[] = [
  {
    slug: 'token-counter',
    name: 'AI Token Counter',
    description:
      'Count tokens for GPT-5, Claude, Gemini and more — with live cost estimates and context window usage. Everything runs locally in your browser.',
    status: 'live',
    keywords: ['ai token counter', 'token counter gpt', 'claude token counter', 'how many tokens'],
  },
  {
    slug: 'llm-pricing',
    name: 'LLM Pricing Comparison',
    description:
      'Side-by-side API pricing for every major model — input, output, cached input and context — each row dated to its last verification.',
    status: 'live',
    keywords: ['llm pricing comparison', 'llm api pricing', 'ai model api prices', 'cheapest llm api'],
  },
  {
    slug: 'context-window',
    name: 'Context Window Comparison',
    description:
      'Compare context window sizes across all major LLMs, visualized. Find the model that actually fits your document.',
    status: 'live',
    keywords: ['context window comparison', 'llm context window', 'claude context window', 'gpt context window'],
  },
  {
    slug: 'cost-calculator',
    name: 'LLM API Cost Calculator',
    description:
      'Estimate your real monthly API spend by request volume, input/output ratio and caching — then compare models on total cost.',
    status: 'live',
    keywords: ['llm cost calculator', 'api cost calculator', 'chatgpt api cost', 'openai api cost calculator'],
  },
  {
    slug: 'token-words',
    name: 'Token ↔ Words Converter',
    description:
      'Convert between tokens and words instantly: 1,000 tokens ≈ 750 words. Reference table from 100 to 1M tokens with pages and context fit.',
    status: 'live',
    keywords: ['token to words', 'words to tokens', 'how many words is 1000 tokens', 'tokens per word'],
  },
];
