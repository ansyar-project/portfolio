import {
  rateLimit,
  RateLimitError,
  clearRateLimit,
  setTimeFunction,
  resetTimeFunction,
} from "../rateLimit";

// Mock time for predictable testing
let mockTime = 1000;

const getMockTime = () => mockTime;
const setMockTime = (time: number) => {
  mockTime = time;
};


describe("Rate Limiting", () => {
  beforeEach(() => {
    // Clear the rate limit map and set up time mocking
    clearRateLimit();
    mockTime = 1000; // Start at 1000ms
    setTimeFunction(getMockTime);
  });

  afterEach(() => {
    resetTimeFunction();
  });

  describe("rateLimit", () => {
    it("should allow first request", () => {
      const result = rateLimit("test-key", 5, 60000);
      expect(result).toBe(true);
    });

    it("should allow requests within limit", () => {
      const identifier = "test-key";
      const limit = 3;

      expect(rateLimit(identifier, limit, 60000)).toBe(true);
      expect(rateLimit(identifier, limit, 60000)).toBe(true);
      expect(rateLimit(identifier, limit, 60000)).toBe(true);
    });

    it("should block requests when limit is exceeded", () => {
      const identifier = "test-key";
      const limit = 2;

      expect(rateLimit(identifier, limit, 60000)).toBe(true);
      expect(rateLimit(identifier, limit, 60000)).toBe(true);
      expect(rateLimit(identifier, limit, 60000)).toBe(false);
      expect(rateLimit(identifier, limit, 60000)).toBe(false);
    });

    it("should reset limit after window expires", () => {
      const identifier = "test-key";
      const limit = 2;
      const windowMs = 60000;

      // Use up the limit
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
      expect(rateLimit(identifier, limit, windowMs)).toBe(false); // Move time forward past the window
      setMockTime(1000 + windowMs + 1);

      // Should be allowed again
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
      expect(rateLimit(identifier, limit, windowMs)).toBe(false);
    });

    it("should handle different identifiers separately", () => {
      const limit = 2;

      expect(rateLimit("user1", limit, 60000)).toBe(true);
      expect(rateLimit("user2", limit, 60000)).toBe(true);
      expect(rateLimit("user1", limit, 60000)).toBe(true);
      expect(rateLimit("user2", limit, 60000)).toBe(true);

      // Both should be at limit now
      expect(rateLimit("user1", limit, 60000)).toBe(false);
      expect(rateLimit("user2", limit, 60000)).toBe(false);
    });

    it("should use default values when not specified", () => {
      const identifier = "test-key";

      // Default limit is 10, default window is 60000ms
      for (let i = 0; i < 10; i++) {
        expect(rateLimit(identifier)).toBe(true);
      }

      // 11th request should be blocked
      expect(rateLimit(identifier)).toBe(false);
    });
    it("should clean up expired entries", () => {
      const limit = 1;
      const windowMs = 60000;

      // Create entry for user1
      expect(rateLimit("user1", limit, windowMs)).toBe(true);
      expect(rateLimit("user1", limit, windowMs)).toBe(false);

      // Create entry for user2
      expect(rateLimit("user2", limit, windowMs)).toBe(true); // Move time forward to expire user1's entry
      setMockTime(1000 + windowMs + 1);

      // Make a request with user2 - user2's entry should also be expired and reset
      expect(rateLimit("user2", limit, windowMs)).toBe(true);

      // user1 should be able to make requests again (entry was cleaned up)
      expect(rateLimit("user1", limit, windowMs)).toBe(true);
    });

    it("should handle zero limit", () => {
      expect(rateLimit("test-key", 0, 60000)).toBe(false);
    });

    it("should handle very short window", () => {
      const identifier = "test-key";
      const limit = 2;
      const windowMs = 1; // 1ms window

      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
      expect(rateLimit(identifier, limit, windowMs)).toBe(false); // Move time forward by 2ms
      setMockTime(1003);

      // Should be allowed again
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
    });

    it("should maintain separate counts for each identifier", () => {
      const limit = 3;

      // Fill up limit for identifier1
      expect(rateLimit("id1", limit, 60000)).toBe(true);
      expect(rateLimit("id1", limit, 60000)).toBe(true);
      expect(rateLimit("id1", limit, 60000)).toBe(true);
      expect(rateLimit("id1", limit, 60000)).toBe(false);

      // identifier2 should still have full limit available
      expect(rateLimit("id2", limit, 60000)).toBe(true);
      expect(rateLimit("id2", limit, 60000)).toBe(true);
      expect(rateLimit("id2", limit, 60000)).toBe(true);
      expect(rateLimit("id2", limit, 60000)).toBe(false);
    });

    it("should handle concurrent access to same identifier", () => {
      const identifier = "test-key";
      const limit = 5; // Simulate concurrent requests
      const results: boolean[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(rateLimit(identifier, limit, 60000));
      }

      // First 5 should be true, rest should be false
      expect(results.slice(0, 5)).toEqual([true, true, true, true, true]);
      expect(results.slice(5)).toEqual([false, false, false, false, false]);
    });

    it("should handle edge case where resetTime equals current time", () => {
      const identifier = "test-key";
      const limit = 1;
      const windowMs = 60000;

      // First request
      expect(rateLimit(identifier, limit, windowMs)).toBe(true); // Set time exactly to reset time
      setMockTime(1000 + windowMs);

      // Should reset and allow request
      expect(rateLimit(identifier, limit, windowMs)).toBe(true);
    });
  });

  describe("RateLimitError", () => {
    it("should create error with default message", () => {
      const error = new RateLimitError();
      expect(error.message).toBe("Rate limit exceeded");
      expect(error.name).toBe("RateLimitError");
      expect(error instanceof Error).toBe(true);
    });

    it("should create error with custom message", () => {
      const customMessage = "Too many requests";
      const error = new RateLimitError(customMessage);
      expect(error.message).toBe(customMessage);
      expect(error.name).toBe("RateLimitError");
      expect(error instanceof Error).toBe(true);
    });

    it("should be instanceof Error and RateLimitError", () => {
      const error = new RateLimitError();
      expect(error instanceof Error).toBe(true);
      expect(error instanceof RateLimitError).toBe(true);
    });

    it("should have correct stack trace", () => {
      const error = new RateLimitError();
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("RateLimitError");
    });
  });

  describe("Memory cleanup", () => {
    it("should not grow indefinitely with different identifiers", () => {
      const limit = 1;
      const windowMs = 1;

      // Create many different entries
      for (let i = 0; i < 100; i++) {
        rateLimit(`user-${i}`, limit, windowMs);
      } // Move time forward to expire all entries
      setMockTime(1000 + windowMs + 1);

      // Make a new request which should trigger cleanup
      rateLimit("new-user", limit, windowMs);

      // Verify that old entries don't affect new requests
      // (This is more of an integration test to ensure cleanup works)
      for (let i = 0; i < 10; i++) {
        expect(rateLimit(`fresh-user-${i}`, limit, windowMs)).toBe(true);
      }
    });
  });
});
