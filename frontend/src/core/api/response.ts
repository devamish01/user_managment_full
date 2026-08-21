import type { ApiError, ApiResponse, ApiResponseMeta, HttpStatus, Pagination } from "./types";

/* ==========================================================
 * Response Helpers
 * Wrap raw payloads in a consistent backend-shaped envelope.
 * Part of the core API infrastructure — reusable by every module.
 * ========================================================== */

export const buildResponse = <T>(
  success: boolean,
  status: HttpStatus,
  data: T | null,
  message: string,
  meta: ApiResponseMeta = {},
  errors: ApiError[] | null = null,
  errorCode?: string,
  fields?: Record<string, string[]>,
): ApiResponse<T> => ({
  success,
  status,
  message,
  data,
  meta,
  errors,
  errorCode,
  fields,
});

export const successResponse = <T>(
  data: T,
  message: string = "OK",
  meta: Pagination | ApiResponseMeta = {} as ApiResponseMeta,
  status: HttpStatus = 200,
): ApiResponse<T> => buildResponse(true, status, data, message, meta as ApiResponseMeta);

export const createdResponse = <T>(
  data: T,
  message: string = "Created",
): ApiResponse<T> => buildResponse(true, 201, data, message, {});

export const noContentResponse = (
  message: string = "No content",
): ApiResponse<null> => buildResponse(false === false ? true : false, 204, null, message, {});

export const errorResponse = (
  status: HttpStatus,
  errors: ApiError[],
  message: string = "Request failed",
): ApiResponse<null> => buildResponse(false, status, null, message, {}, errors);

/* Common HTTP-inspired error factories */
export const badRequestError = (message: string, errors?: ApiError[]): ApiResponse<null> =>
  errorResponse(400, errors || [{ code: "BAD_REQUEST", message }], message);

export const unauthorizedError = (message: string = "Unauthorized"): ApiResponse<null> =>
  errorResponse(401, [{ code: "UNAUTHORIZED", message }], message);

export const forbiddenError = (message: string = "Forbidden"): ApiResponse<null> =>
  errorResponse(403, [{ code: "FORBIDDEN", message }], message);

export const notFoundError = (resource: string): ApiResponse<null> =>
  errorResponse(404, [{ code: "NOT_FOUND", message: `${resource} not found` }], `${resource} not found`);

export const conflictError = (message: string, field?: string): ApiResponse<null> =>
  errorResponse(409, [{ code: "CONFLICT", field, message }], message);

export const validationError = (errors: ApiError[]): ApiResponse<null> =>
  errorResponse(422, errors, "Validation failed");

export const singleValidationError = (field: string, message: string): ApiResponse<null> =>
  validationError([{ code: "VALIDATION_ERROR", field, message }]);

/**
 * Creates a validation error response with the new `fields` format
 * { fieldName: ["error message 1", "error message 2"] }
 * This is the preferred format for backend validation errors.
 */
export const validationErrorWithFields = (
  fields: Record<string, string[]>,
  message: string = "Validation failed"
): ApiResponse<null> => {
  const errors: ApiError[] = [];
  Object.entries(fields).forEach(([field, messages]) => {
    messages.forEach((msg) => {
      errors.push({ code: "VALIDATION_ERROR", field, message: msg });
    });
  });
  return buildResponse(false, 422, null, message, {}, errors, "VALIDATION_ERROR", fields);
};

/**
 * Creates a single field validation error with the new `fields` format
 */
export const singleValidationErrorWithFields = (
  field: string,
  message: string
): ApiResponse<null> => validationErrorWithFields({ [field]: [message] });

export const serverError = (message: string = "Internal server error"): ApiResponse<null> =>
  errorResponse(500, [{ code: "SERVER_ERROR", message }], message);

/* Pagination meta builder */
export const paginationMeta = (page: number, limit: number, total: number): Pagination => {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};
