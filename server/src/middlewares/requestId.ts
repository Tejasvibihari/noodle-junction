import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const VALID_ID = /^[A-Za-z0-9_-]{8,64}$/;

export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header('x-request-id');
  req.requestId =
    incoming && VALID_ID.test(incoming)
      ? incoming
      : `req_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
  res.setHeader('X-Request-Id', req.requestId);
  next();
};
