import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express, type Request } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { generalLimiter } from './middlewares/rateLimit.js';
import { requestId } from './middlewares/requestId.js';
import { apiRouter } from './routes.js';
import { AppError } from './utils/errors.js';

export const API_PREFIX = '/api/v1';

export function createApp(): Express {
  const app = express();
  app.disable('x-powered-by');
  if (env.NODE_ENV === 'production') app.set('trust proxy', 1);

  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as Request).requestId,
      customLogLevel: (_req, res, err) =>
        err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // No Origin header = server-to-server call (e.g. Razorpay webhook) or curl.
        if (!origin || env.CORS_ORIGINS.includes(origin)) return cb(null, true);
        cb(new AppError('FORBIDDEN', 'Origin not allowed.'));
      },
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Idempotency-Key',
        'X-Request-Id',
        'X-App-Version',
        'X-Table-Session',
      ],
      exposedHeaders: ['X-Request-Id'],
    }),
  );
  app.use(cookieParser());

  // The Razorpay webhook (M11) needs the RAW body: mount it here, before express.json().
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(generalLimiter);

  app.use(API_PREFIX, apiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
