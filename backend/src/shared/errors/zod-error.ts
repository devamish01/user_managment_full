import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {

  const fields: Record<string, string[]> = {};

  error.issues.forEach((issue) => {

    const field = issue.path[0] as string;

    if (!fields[field]) {
      fields[field] = [];
    }


    if (issue.code === "invalid_type") {

      fields[field].push(
        `${field} is required.`
      );

    } else {

      fields[field].push(
        issue.message
      );

    }

  });


  return fields;
};