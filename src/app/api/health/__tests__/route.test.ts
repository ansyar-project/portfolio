import { GET } from "@/app/api/health/route";

describe("/api/health", () => {
  it("should return health status", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      status: "OK",
    });
  });

  it("should have correct content type", async () => {
    const response = await GET();

    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("should handle multiple concurrent requests", async () => {
    // Make multiple concurrent requests
    const promises = Array(10)
      .fill(null)
      .map(() => GET());
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
        status: "OK",
      });
    });
  });
});
 