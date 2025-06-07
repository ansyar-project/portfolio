// Simple in-memory rate limiter for admin actions
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Export a function to clear the map for testing
export function clearRateLimit() {
  rateLimitMap.clear();
}

// Type for the time function
type TimeFunction = () => number;

// Default time function
let getCurrentTime: TimeFunction = () => Date.now();

// Function to override the time function for testing
export function setTimeFunction(timeFunction: TimeFunction) {
  getCurrentTime = timeFunction;
}

// Function to reset to default time function
export function resetTimeFunction() {
  getCurrentTime = () => Date.now();
}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = getCurrentTime();

  // Handle zero limit case
  if (limit <= 0) {
    // console.log("[DEBUG] Zero limit, returning false");
    return false;
  }

  // Clean up expired entries
  const entriesToDelete: string[] = [];
  for (const [key, value] of rateLimitMap.entries()) {
    // console.log(
    //   `[DEBUG] Checking ${key}: resetTime=${value.resetTime}, expired=${
    //     value.resetTime <= now
    //   }`
    // );
    if (value.resetTime <= now) {
      entriesToDelete.push(key);
    }
  }

  for (const key of entriesToDelete) {
    rateLimitMap.delete(key);
    // console.log(`[DEBUG] Deleted expired entry: ${key}`);
  }

  const current = rateLimitMap.get(identifier);
  // console.log(`[DEBUG] Current entry for ${identifier}:`, current);

  // If no current entry (either new or was cleaned up), create new one
  if (!current) {
    const newEntry = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(identifier, newEntry);
    // console.log(`[DEBUG] Created new entry:`, newEntry);
    // console.log("[DEBUG] Returning: true\n");
    return true;
  }

  // At this point, current entry exists and is not expired (was not cleaned up above)
  // Check if we've hit the limit
  if (current.count >= limit) {
    // console.log(`[DEBUG] Hit limit: ${current.count} >= ${limit}`);
    // console.log("[DEBUG] Returning: false\n");
    return false;
  }

  // Increment count and allow
  current.count++;
  // console.log(`[DEBUG] Incremented count to: ${current.count}`);
  // console.log("[DEBUG] Returning: true\n");
  return true;
}

export class RateLimitError extends Error {
  constructor(message: string = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}
