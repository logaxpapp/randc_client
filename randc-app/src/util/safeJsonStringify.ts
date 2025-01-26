// src/utils/safeJsonStringify.ts

// src/utils/safeJsonStringify.ts
export function safeJsonStringify(value: unknown): string {
    try {
      // Attempt JSON serialization
      return JSON.stringify(value, null, 2);
    } catch {
      // Fallback if it cannot be stringified
      return String(value);
    }
  }
  