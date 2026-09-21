import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

interface Schemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Validates and replaces body/query/params with the parsed value.
 * Zod objects strip unknown keys by default. A ZodError is handled by errorHandler.
 */
export function validate(schemas: Schemas): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      // Express 5 exposes req.query / req.params as getters, so redefine them.
      if (schemas.query) {
        Object.defineProperty(req, 'query', {
          value: schemas.query.parse(req.query),
          writable: true,
          configurable: true,
        });
      }
      if (schemas.params) {
        Object.defineProperty(req, 'params', {
          value: schemas.params.parse(req.params),
          writable: true,
          configurable: true,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
