/**
 * Centralized Error Message Extraction Utility
 *
 * Extracts the most useful error message from various error types:
 * - Backend API responses (with fields, message, errorCode)
 * - Frontend validation errors (Zod, custom)
 * - Network/Axios errors
 * - Generic JavaScript errors
 *
 * Priority order:
 * 1. Backend field-level messages (most specific)
 * 2. Backend message
 * 3. Frontend validation message
 * 4. Error.message
 * 5. Axios/network error message
 * 6. Generic fallback
 */

import type { ApiResponse, ApiError } from "./types";

/**
 * Extracts all field-level error messages from backend response
 * Supports both `fields` object (backend format) and `errors` array (mock format)
 */
export function extractFieldMessages(response: ApiResponse<unknown>): string[] {
  const messages: string[] = [];

  // Backend format: fields object { field: string[] }
  if (response.fields && typeof response.fields === "object") {
    Object.entries(response.fields).forEach(([field, fieldMessages]) => {
      if (Array.isArray(fieldMessages)) {
        fieldMessages.forEach((msg) => {
          messages.push(`${field}: ${msg}`);
        });
      }
    });
    return messages;
  }

  // Mock/legacy format: errors array [{ field, message }]
  if (response.errors && Array.isArray(response.errors)) {
    response.errors.forEach((err: ApiError) => {
      if (err.field) {
        messages.push(`${err.field}: ${err.message}`);
      } else {
        messages.push(err.message);
      }
    });
    return messages;
  }

  return messages;
}

/**
 * Extracts field errors as a Record for form validation display
 * Returns { fieldName: "first error message" }
 * Supports multiple fields with multiple messages each
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error && typeof error === "object") {
    let apiResponse: ApiResponse<unknown> | undefined;

    if ("apiResponse" in error) {
      apiResponse = (error as { apiResponse?: ApiResponse<unknown> }).apiResponse;
    } else if ("success" in error && "message" in error) {
      apiResponse = error as ApiResponse<unknown>;
    } else if ("response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
      apiResponse = axiosError.response?.data;
    }

    if (apiResponse) {
      // Backend format: fields object { field: string[] }
      if (apiResponse.fields && typeof apiResponse.fields === "object") {
        Object.entries(apiResponse.fields).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            // Use the first message for each field
            fieldErrors[field] = messages[0];
          }
        });
      }
      // Mock/legacy format: errors array
      else if (apiResponse.errors && Array.isArray(apiResponse.errors)) {
        apiResponse.errors.forEach((err: ApiError) => {
          if (err.field && !fieldErrors[err.field]) {
            fieldErrors[err.field] = err.message;
          }
        });
      }
    }
  }

  return fieldErrors;
}

/**
 * Checks if an error is a backend validation error (has fields or errors)
 */
export function isValidationError(error: unknown): boolean {
  if (error && typeof error === "object") {
    // Check apiResponse
    if ("apiResponse" in error) {
      const apiResponse = (error as { apiResponse?: ApiResponse<unknown> }).apiResponse;
      if (apiResponse && (apiResponse.fields || (apiResponse.errors && apiResponse.errors.length > 0))) {
        return true;
      }
    }
    // Check direct response
    if ("success" in error && "fields" in error) {
      const apiResponse = error as ApiResponse<unknown>;
      return apiResponse.success === false && !!apiResponse.fields;
    }
    if ("success" in error && "errors" in error) {
      const apiResponse = error as ApiResponse<unknown>;
      return apiResponse.success === false && !!apiResponse.errors && apiResponse.errors.length > 0;
    }
    // Check axios response
    if ("response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        return data.success === false && (!!data.fields || (!!data.errors && data.errors.length > 0));
      }
    }
  }
  return false;
}

/**
 * Main error message extraction function
 * Returns a user-friendly error message from any error type
 * 
 * Handles:
 * 1. Backend success response - returns the success message
 * 2. Backend normal error - returns the error message
 * 3. Backend validation error - returns field-level messages
 * 4. Axios errors - preserves response.data
 * 5. Network/unknown errors - returns fallback
 * 6. Frontend Error objects - returns error.message
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  // 1. Backend API response with field-level errors (most specific)
  if (error && typeof error === "object" && "apiResponse" in error) {
    const apiResponse = (error as { apiResponse?: ApiResponse<unknown> }).apiResponse;
    if (apiResponse) {
      const fieldMessages = extractFieldMessages(apiResponse);
      if (fieldMessages.length > 0) {
        return fieldMessages.join("\n");
      }
      if (apiResponse.message) {
        return apiResponse.message;
      }
    }
  }

  // 2. Direct ApiResponse object (when error IS the response)
  if (error && typeof error === "object" && "success" in error && "message" in error) {
    const apiResponse = error as ApiResponse<unknown>;
    // Handle both success and error responses
    const fieldMessages = extractFieldMessages(apiResponse);
    if (fieldMessages.length > 0) {
      return fieldMessages.join("\n");
    }
    if (apiResponse.message) {
      return apiResponse.message;
    }
  }

  // 3. Axios error with response data
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: ApiResponse<unknown>; status?: number }; message?: string };
    if (axiosError.response?.data) {
      const fieldMessages = extractFieldMessages(axiosError.response.data);
      if (fieldMessages.length > 0) {
        return fieldMessages.join("\n");
      }
      if (axiosError.response.data.message) {
        return axiosError.response.data.message;
      }
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // 4. Standard JavaScript Error
  if (error instanceof Error) {
    return error.message;
  }

  // 5. String error
  if (typeof error === "string") {
    return error;
  }

  // 6. Object with message property
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === "string") return msg;
  }

  // 7. Fallback
  return fallback;
}

/**
 * Extracts success message from backend response
 * Returns the message if success=true, otherwise returns null
 */
export function getSuccessMessage(error: unknown): string | null {
  if (error && typeof error === "object") {
    let apiResponse: ApiResponse<unknown> | undefined;

    if ("apiResponse" in error) {
      apiResponse = (error as { apiResponse?: ApiResponse<unknown> }).apiResponse;
    } else if ("success" in error && "message" in error) {
      apiResponse = error as ApiResponse<unknown>;
    } else if ("response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
      apiResponse = axiosError.response?.data;
    }

    if (apiResponse && apiResponse.success === true && apiResponse.message) {
      return apiResponse.message;
    }
  }
  return null;
}

/**
 * Gets the error code from backend response if available
 */
export function getErrorCode(error: unknown): string | null {
  if (error && typeof error === "object") {
    let apiResponse: ApiResponse<unknown> | undefined;

    if ("apiResponse" in error) {
      apiResponse = (error as { apiResponse?: ApiResponse<unknown> }).apiResponse;
    } else if ("success" in error && "message" in error) {
      apiResponse = error as ApiResponse<unknown>;
    } else if ("response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<unknown> } };
      apiResponse = axiosError.response?.data;
    }

    if (apiResponse && apiResponse.errorCode) {
      return apiResponse.errorCode;
    }
  }
  return null;
}