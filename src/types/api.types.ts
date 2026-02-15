/**
 * API-related type definitions
 * Types for API responses, requests, and pagination
 */

// Generic API response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API error response
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: Record<string, any>;
}

// Next.js search params
export interface NextSearchParams {
  [key: string]: string | string[] | undefined;
}
