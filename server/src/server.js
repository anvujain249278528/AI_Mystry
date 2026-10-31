import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';

try {
  await connectDatabase();
  app.listen(env.port, () => console.info(`AI Mystery Room API listening on port ${env.port}.`));
} catch (error) {
  console.error('Could not start AI Mystery Room API:', error.message);
  process.exit(1);
}
