export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor({
    message,
    statusCode,
    errorCode,
    details,
    isOperational = true,
  }: {
    message: string;
    statusCode: number;
    errorCode: string;
    details?: unknown;
    isOperational?: boolean;
  }) {
    super(message);

    this.name = "AppError";

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}