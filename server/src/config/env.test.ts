import { describe, expect, it } from 'vitest';
import { parseEnv } from './env.js';

const valid = {
  MONGODB_URI: 'mongodb://localhost:27017/nj',
  REDIS_URL: 'redis://localhost:6379',
};

describe('parseEnv', () => {
  it('applies defaults', () => {
    const env = parseEnv(valid);
    expect(env.PORT).toBe(5000);
    expect(env.NODE_ENV).toBe('development');
    expect(env.CORS_ORIGINS).toEqual(['http://localhost:3000']);
    expect(env.DEFAULT_TIMEZONE).toBe('Asia/Kolkata');
  });

  it('parses a comma-separated CORS allowlist', () => {
    const env = parseEnv({
      ...valid,
      CORS_ORIGINS: 'https://a.example.com, https://b.example.com',
    });
    expect(env.CORS_ORIGINS).toEqual(['https://a.example.com', 'https://b.example.com']);
  });

  it('coerces PORT to a number', () => {
    expect(parseEnv({ ...valid, PORT: '8080' }).PORT).toBe(8080);
  });

  it('treats an empty COOKIE_DOMAIN as unset', () => {
    expect(parseEnv({ ...valid, COOKIE_DOMAIN: '' }).COOKIE_DOMAIN).toBeUndefined();
  });

  it('fails fast when required variables are missing', () => {
    expect(() => parseEnv({})).toThrow(/MONGODB_URI/);
    expect(() => parseEnv({})).toThrow(/REDIS_URL/);
  });

  it('rejects malformed connection strings without echoing them', () => {
    const bad = { MONGODB_URI: 'http://secret-host', REDIS_URL: valid.REDIS_URL };
    expect(() => parseEnv(bad)).toThrow(/MONGODB_URI/);
    expect(() => parseEnv(bad)).not.toThrow(/secret-host/);
  });
});
