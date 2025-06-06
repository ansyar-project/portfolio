import { NextRequest } from "next/server";
import { GET } from "@/app/api/health/route";

describe("/api/health", () => {
  it("should return health status", async () => {
    const request = new NextRequest("http://localhost:3000/api/health");
    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      status: "ok",
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });

    // Verify timestamp is a valid ISO string
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);

    // Verify uptime is a positive number
    expect(data.uptime).toBeGreaterThan(0);
  });

  it("should include environment in development", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const request = new NextRequest("http://localhost:3000/api/health");
    const response = await GET(request);

    const data = await response.json();
    expect(data.environment).toBe("development");

    process.env.NODE_ENV = originalEnv;
  });

  it("should not include environment in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const request = new NextRequest("http://localhost:3000/api/health");
    const response = await GET(request);

    const data = await response.json();
    expect(data.environment).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });

  it("should have correct content type", async () => {
    const request = new NextRequest("http://localhost:3000/api/health");
    const response = await GET(request);

    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("should handle multiple concurrent requests", async () => {
    const request = new NextRequest("http://localhost:3000/api/health");

    // Make multiple concurrent requests
    const promises = Array(10)
      .fill(null)
      .map(() => GET(request));
    const responses = await Promise.all(promises);

    // All responses should be successful
    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    // Parse all responses
    const dataPromises = responses.map((response) => response.json());
    const dataArray = await Promise.all(dataPromises);

    // All should have the same structure
    dataArray.forEach((data) => {
      expect(data).toEqual({
        status: "ok",
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });
  });
});
