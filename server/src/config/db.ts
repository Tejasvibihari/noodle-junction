import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDb(): Promise<void> {
  mongoose.set('strictQuery', true);
  // Indexes are created via migrations in production, never autoIndex.
  mongoose.set('autoIndex', env.NODE_ENV !== 'production');

  mongoose.connection.on('disconnected', () => logger.warn('mongo disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('mongo reconnected'));
  mongoose.connection.on('error', (err) => logger.error({ err }, 'mongo error'));

  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  logger.info({ db: mongoose.connection.name }, 'mongo connected');
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}

export function isDbReady(): boolean {
  return mongoose.connection.readyState === 1;
}
