import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  // Tried in order when the main model is busy or unavailable.
  geminiFallbackModels: (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.1-flash-lite,gemini-3.7-flash,gemini-3.5-flash,gemini-flash-latest')
    .split(',').map((m) => m.trim()).filter(Boolean),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
