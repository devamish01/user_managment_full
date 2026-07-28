

## Files Responsibility


## logger.ts

### Purpose

This file creates and configures the application logger using Pino.


### Responsibilities

- Create a reusable logger instance
- Configure log level based on environment
- Configure development and production logging behavior
- Provide structured application logs


## index.ts

### Purpose

This file exports the logger instance from a single place.

It allows other parts of the application to import the logger easily.


## Logger Rules

- Do not use `console.log` inside application code.
- Always use the centralized logger instance.
- Do not log sensitive information like passwords, tokens, or private data.