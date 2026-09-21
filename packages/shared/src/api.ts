import type { ErrorCode, ErrorDetail } from './errors';

/** Response envelope types from 04-API.md §1.2. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PageMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: ErrorDetail[];
  };
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiError(body: unknown): body is ApiError {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as { success?: unknown }).success === false &&
    typeof (body as { error?: unknown }).error === 'object'
  );
}
