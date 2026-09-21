import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { API_PREFIX, createApp } from './app.js';
import { validate } from './middlewares/validate.js';
import { apiRouter } from './routes.js';
import { AppError } from './utils/errors.js';
import { sendSuccess } from './utils/response.js';

// Test-only routes exercising the shared middleware.
beforeAll(() => {
  apiRouter.get('/__t/ok', (_req, res) => {
    sendSuccess(res, { hello: 'world' });
  });
  apiRouter.get('/__t/list', (_req, res) => {
    sendSuccess(res, [1, 2], { meta: { page: 1, limit: 20, total: 2 } });
  });
  apiRouter.get('/__t/locked', () => {
    throw new AppError('ITEM_LOCKED', "This item is already being prepared and can't be removed.", [
      { field: 'itemId', issue: 'status=PREPARING' },
    ]);
  });
  apiRouter.get('/__t/boom', () => {
    throw new Error('db password is hunter2');
  });
  apiRouter.get('/__t/async-boom', async () => {
    throw new AppError('ORDER_CLOSED', 'Order already settled.');
  });
  apiRouter.post(
    '/__t/validate',
    validate({ body: z.object({ qty: z.number().int().positive() }) }),
    (req, res) => {
      sendSuccess(res, req.body, { status: 201 });
    },
  );
  apiRouter.get(
    '/__t/query',
    validate({ query: z.object({ limit: z.coerce.number().int().max(100).default(20) }) }),
    (req, res) => {
      sendSuccess(res, req.query);
    },
  );
});

const app = createApp();
const url = (p: string) => `${API_PREFIX}${p}`;

describe('response envelope', () => {
  it('wraps success data', async () => {
    const res = await request(app).get(url('/__t/ok'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { hello: 'world' } });
  });

  it('includes pagination meta when provided', async () => {
    const res = await request(app).get(url('/__t/list'));
    expect(res.body.meta).toEqual({ page: 1, limit: 20, total: 2 });
  });
});

describe('error handling', () => {
  it('maps AppError to the error envelope with details and requestId', async () => {
    const res = await request(app).get(url('/__t/locked'));
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toEqual({
      code: 'ITEM_LOCKED',
      message: "This item is already being prepared and can't be removed.",
      details: [{ field: 'itemId', issue: 'status=PREPARING' }],
    });
    expect(res.body.requestId).toMatch(/^req_/);
  });

  it('handles errors thrown from async handlers (Express 5)', async () => {
    const res = await request(app).get(url('/__t/async-boom'));
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('ORDER_CLOSED');
  });

  it('never leaks internal error messages', async () => {
    const res = await request(app).get(url('/__t/boom'));
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(res.body)).not.toContain('hunter2');
  });

  it('returns NOT_FOUND for unknown routes', async () => {
    const res = await request(app).get(url('/nope'));
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns VALIDATION_ERROR for malformed JSON', async () => {
    const res = await request(app)
      .post(url('/__t/validate'))
      .set('Content-Type', 'application/json')
      .send('{"qty":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('validate middleware', () => {
  it('passes valid bodies and strips unknown keys', async () => {
    const res = await request(app).post(url('/__t/validate')).send({ qty: 2, evil: '$where' });
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ qty: 2 });
  });

  it('lists invalid fields in details', async () => {
    const res = await request(app).post(url('/__t/validate')).send({ qty: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details[0].field).toBe('qty');
  });

  it('validates and coerces query params', async () => {
    const res = await request(app).get(url('/__t/query?limit=50'));
    expect(res.body.data).toEqual({ limit: 50 });
    const bad = await request(app).get(url('/__t/query?limit=500'));
    expect(bad.status).toBe(400);
  });
});

describe('request id, CORS and security headers', () => {
  it('generates a request id and echoes a valid incoming one', async () => {
    const gen = await request(app).get(url('/__t/ok'));
    expect(gen.headers['x-request-id']).toMatch(/^req_[a-f0-9]{16}$/);
    const echo = await request(app).get(url('/__t/ok')).set('X-Request-Id', 'client-trace-12345');
    expect(echo.headers['x-request-id']).toBe('client-trace-12345');
    const junk = await request(app).get(url('/__t/ok')).set('X-Request-Id', 'bad id!');
    expect(junk.headers['x-request-id']).toMatch(/^req_/);
  });

  it('allows configured origins and rejects others', async () => {
    const ok = await request(app).get(url('/__t/ok')).set('Origin', 'http://localhost:3000');
    expect(ok.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    const bad = await request(app).get(url('/__t/ok')).set('Origin', 'https://evil.example.com');
    expect(bad.status).toBe(403);
    expect(bad.body.error.code).toBe('FORBIDDEN');
  });

  it('sets helmet headers and hides x-powered-by', async () => {
    const res = await request(app).get(url('/__t/ok'));
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
