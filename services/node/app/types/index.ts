export interface LoginRequest {
  username: string;
  password: string;
}

export interface RequestError {
  success: boolean;
  statusCode: number;
  message: string;
}
