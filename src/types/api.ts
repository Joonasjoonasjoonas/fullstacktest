export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  error?: string;
  status: number;
} 