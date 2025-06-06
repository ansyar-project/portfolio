/**
 * @jest-environment jsdom
 */
import { GET, POST } from "../route";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Mock NextAuth
jest.mock("next-auth", () => {
  return jest.fn(() => ({
    // Mock handler function
    mockHandler: true,
  }));
});

// Mock authOptions
jest.mock("@/lib/authOptions", () => ({
  authOptions: {
    providers: [],
    session: {
      strategy: "jwt",
    },
    callbacks: {},
  },
}));

const mockNextAuth = NextAuth as jest.MockedFunction<typeof NextAuth>;

describe("NextAuth API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exports GET and POST handlers", () => {
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
  });

  it("creates NextAuth handler with correct auth options", () => {
    // Import will trigger the module evaluation
    require("../route");

    expect(mockNextAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        providers: expect.any(Array),
        session: expect.objectContaining({
          strategy: "jwt",
        }),
        callbacks: expect.any(Object),
      })
    );
  });

  it("GET and POST point to the same handler", () => {
    expect(GET).toBe(POST);
  });

  it("validates session strategy is either jwt or database", () => {
    // This test verifies the type safety check in the route file
    const mockAuthOptionsWithInvalidStrategy = {
      ...authOptions,
      session: {
        strategy: "invalid" as any,
      },
    };

    // Mock the authOptions import to return invalid strategy
    jest.doMock("@/lib/authOptions", () => ({
      authOptions: mockAuthOptionsWithInvalidStrategy,
    }));

    // This should throw an error when the module is re-evaluated
    expect(() => {
      jest.isolateModules(() => {
        require("../route");
      });
    }).toThrow('authOptions.session.strategy must be "jwt" or "database"');
  });

  it("handles missing session configuration gracefully", () => {
    const mockAuthOptionsWithoutSession = {
      ...authOptions,
      session: undefined,
    };

    jest.doMock("@/lib/authOptions", () => ({
      authOptions: mockAuthOptionsWithoutSession,
    }));

    // Should not throw when session is undefined
    expect(() => {
      jest.isolateModules(() => {
        require("../route");
      });
    }).not.toThrow();
  });

  it("properly types session strategy", () => {
    jest.isolateModules(() => {
      const route = require("../route");

      // The module should load without TypeScript errors
      expect(route.GET).toBeDefined();
      expect(route.POST).toBeDefined();
    });
  });

  it("preserves other auth options when processing session strategy", () => {
    const mockAuthOptionsWithExtras = {
      ...authOptions,
      providers: [{ id: "test", name: "Test Provider" }],
      pages: { signIn: "/custom-signin" },
      session: {
        strategy: "jwt" as const,
        maxAge: 3600,
      },
    };

    jest.doMock("@/lib/authOptions", () => ({
      authOptions: mockAuthOptionsWithExtras,
    }));

    jest.isolateModules(() => {
      require("../route");
    });

    expect(mockNextAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        providers: [{ id: "test", name: "Test Provider" }],
        pages: { signIn: "/custom-signin" },
        session: expect.objectContaining({
          strategy: "jwt",
          maxAge: 3600,
        }),
      })
    );
  });

  it("accepts database strategy", () => {
    const mockAuthOptionsWithDatabase = {
      ...authOptions,
      session: {
        strategy: "database" as const,
      },
    };

    jest.doMock("@/lib/authOptions", () => ({
      authOptions: mockAuthOptionsWithDatabase,
    }));

    expect(() => {
      jest.isolateModules(() => {
        require("../route");
      });
    }).not.toThrow();
  });

  it("accepts jwt strategy", () => {
    const mockAuthOptionsWithJwt = {
      ...authOptions,
      session: {
        strategy: "jwt" as const,
      },
    };

    jest.doMock("@/lib/authOptions", () => ({
      authOptions: mockAuthOptionsWithJwt,
    }));

    expect(() => {
      jest.isolateModules(() => {
        require("../route");
      });
    }).not.toThrow();
  });
});
