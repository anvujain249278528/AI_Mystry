import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

let client;

function getClient() {
  if (!env.geminiApiKey) throw new AppError(503, 'Mystery generation is not configured yet. Add the Gemini API key on the server and try again.', 'AI_NOT_CONFIGURED');
  client ||= new GoogleGenAI({
    apiKey: env.geminiApiKey,
    httpOptions: { timeout: 60000 },
  });
  return client;
}

// Errors where another model might succeed: rate limit, not found, server busy/down, timeout.
function shouldTryNextModel(error) {
  const status = Number(error?.status || error?.code);
  if ([404, 429, 500, 502, 503, 504].includes(status)) return true;
  return !status && /timeout|timed out|fetch failed|ECONNRESET|empty response/i.test(error?.message || '');
}

async function callModel(model, prompt, schema, temperature) {
  const response = await getClient().models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature,
      ...(schema ? { responseMimeType: 'application/json', responseJsonSchema: schema } : {}),
    },
  });
  const text = response.text?.trim();
  if (!text) throw new Error('The model returned an empty response.');
  return text;
}

export async function generateText(prompt, { schema, temperature = 0.7 } = {}) {
  const models = [...new Set([env.geminiModel, ...env.geminiFallbackModels])];
  let error;
  for (const [index, model] of models.entries()) {
    try {
      return await callModel(model, prompt, schema, temperature);
    } catch (err) {
      error = err;
      if (err instanceof AppError) throw err;
      console.warn(`Gemini model ${model} failed (${err?.status || err?.code || 'no status'}): ${String(err?.message).slice(0, 200)}`);
      if (index < models.length - 1 && shouldTryNextModel(err)) continue;
      break;
    }
  }
  const status = Number(error?.status || error?.code);
  if (status === 429) throw new AppError(503, 'The mystery room is busy right now. Please wait a moment and retry.', 'AI_RATE_LIMITED');
  if (status === 401 || status === 403) throw new AppError(503, 'The mystery room could not connect to its AI service. Please try again later.', 'AI_AUTH_FAILED');
  if (status === 400 && /safety|blocked/i.test(error?.message || '')) {
    throw new AppError(503, 'The AI could not create a case from that request. Please retry with a different difficulty.', 'AI_BLOCKED');
  }
  throw new AppError(503, 'The AI service is temporarily unavailable. Please try again.', 'AI_UNAVAILABLE');
}
