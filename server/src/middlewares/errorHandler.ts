import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { AppError, type ErrorDetail } from '../utils/errors.js';

function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    const details: ErrorDetail[] = err.issues.map((i) => ({
      field: i.path.join('.'),
      issue: i.message,
    }));
    return new AppError('VALIDATION_ERROR', 'Some fields are invalid.', details);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details: ErrorDetail[] = Object.values(err.errors).map((e) => ({
      field: e.path,
      issue: e.message,
    }));
    return new AppError('VALIDATION_ERROR', 'Some fields are invalid.', details);
  }

  if (err instanceof mongoose.Error.CastError) {
    return new AppError('VALIDATION_ERROR', 'Some fields are invalid.', [
      { field: err.path, issue: 'invalid value' },
    ]);
  }

  const e = err as { type?: string; code?: number; keyPattern?: Record<string, unknown> };

  // body-parser errors
  if (e?.type === 'entity.parse.failed') {
    return new AppError('VALIDATION_ERROR', 'Request body is not valid JSON.');
  }
  if (e?.type === 'entity.too.large') {
    return new AppError('VALIDATION_ERROR', 'Request body is too large.');
  }

  // MongoDB duplicate key
  if (e?.code === 11000) {
    const fields = Object.keys(e.keyPattern ?? {});
    return new AppError(
      'CONFLICT',
      'This record already exists.',
      fields.map((field) => ({ field, issue: 'duplicate' })),
    );
  }

  return new AppError('INTERNAL_ERROR', 'Something went wrong. Please try again.');
}

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new AppError('NOT_FOUND', 'The requested resource was not found.'));
};

/** Global handler: always answers with the error envelope from 04-API.md §1.2. */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const appErr = toAppError(err);
  const log = logger.child({ requestId: req.requestId });

  if (appErr.httpStatus >= 500) {
    log.error({ err }, appErr.message);
  } else {
    log.debug({ code: appErr.code }, appErr.message);
  }

  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(appErr.httpStatus).json({
    success: false,
    error: {
      code: appErr.code,
      message: appErr.message,
      ...(appErr.details?.length ? { details: appErr.details } : {}),
    },
    requestId: req.requestId,
  });
};
