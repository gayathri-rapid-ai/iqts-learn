import { NextRequest } from 'next/server';
import { runCode, type Language } from '../../../lib/runner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const language = String(body?.language || '').toLowerCase() as Language;
    const code = String(body?.code || '');

    if (!code) {
      return new Response(JSON.stringify({ error: 'No code provided' }), { status: 400 });
    }

    if (!['javascript', 'python', 'java', 'go'].includes(language)) {
      return new Response(JSON.stringify({ error: `Unsupported language: ${language}` }), { status: 400 });
    }

    const { output } = await runCode(language, code);
    return new Response(JSON.stringify({ output }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
