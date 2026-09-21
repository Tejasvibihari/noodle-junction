declare global {
  namespace Express {
    interface Request {
      /** Request correlation id, echoed in `X-Request-Id` and error envelopes. */
      requestId: string;
    }
  }
}

export {};
