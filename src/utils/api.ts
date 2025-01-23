import { ApiError } from '@/types/api';

export function createErrorResponse(message: string, status: number = 500, error?: string): ApiError {
  return {
    message,
    error,
    status
  };
}

export function handleApiError(error: unknown): ApiError {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return createErrorResponse(
      'An error occurred while processing your request',
      500,
      error.message
    );
  }
  
  return createErrorResponse('An unknown error occurred', 500);
} 