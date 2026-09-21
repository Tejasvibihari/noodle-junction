import { ERROR_STATUS, type ErrorCode, type ErrorDetail } from '@nj/shared';

export type { ErrorCode, ErrorDetail };

/** Throw this from services/controllers; the global error handler renders the envelope. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly details?: ErrorDetail[];

  constructor(code: ErrorCode, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.httpStatus = ERROR_STATUS[code];
    this.details = details;
  }
}
