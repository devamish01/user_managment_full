

## Files Responsibility


## error.middleware.ts

### Purpose

This middleware provides centralized error handling for the complete backend application.

Instead of handling errors separately inside controllers or services, all errors are forwarded to this middleware.


### Responsibilities

- Catch application errors
- Handle custom AppError responses
- Return consistent API error responses
- Log errors using the application logger
- Prevent exposing sensitive error details


## not-found.middleware.ts

### Purpose

This middleware handles requests where no matching API route exists.

If a user accesses an undefined API endpoint, this middleware returns a proper 404 JSON response.


### Responsibilities

- Catch undefined routes
- Return HTTP 404 status
- Maintain consistent API response structure


## index.ts

### Purpose

This file works as a barrel export file.

It provides a single entry point for importing middlewares across the application.


## Middleware Rules

- Middleware should contain only common request/response related logic.
- Business logic should not be written inside middleware.
- Business rules belong inside the service layer.
- Every middleware should have a single responsibility.