export type NormalizedError = {
  name?: string;
  message: string;
  stack?: string;
  cause?: unknown;
};

export const stringifyUnknown = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

export const normalizeError = (error: unknown): NormalizedError => {
  if (error instanceof Error) {
    const normalized: NormalizedError = {
      name: error.name,
      message: error.message,
      stack: error.stack ?? undefined,
    };
    if ((error as { cause?: unknown }).cause) {
      normalized.cause = stringifyUnknown((error as { cause?: unknown }).cause);
    }
    return normalized;
  }

  if (typeof error === "string") {
    return { message: error };
  }

  if (typeof error === "object" && error !== null) {
    const serialized = stringifyUnknown(error);
    return { message: serialized };
  }

  return { message: String(error) };
};

export const describeNormalizedError = (error: NormalizedError): string => {
  const segments = [
    error.name ? `[${error.name}]` : undefined,
    error.message,
    error.stack ? `stack=${error.stack}` : undefined,
    error.cause ? `cause=${error.cause}` : undefined,
  ].filter(Boolean);
  return segments.join(" ");
};
