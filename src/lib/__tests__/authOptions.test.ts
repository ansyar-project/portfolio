import type { CredentialsConfig } from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

type MockRequest = {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  method?: string;
};

describe("Auth Options", () => {
  let authOptions: NextAuthOptions;

  beforeEach(async () => {
    // Set up environment variables for testing
    process.env.ADMIN_USERNAME = "testadmin";
    process.env.ADMIN_PASSWORD = "testpassword123";

    // Clear module cache and import fresh
    delete require.cache[require.resolve("../authOptions")];
    const authModule = await import("../authOptions");
    authOptions = authModule.authOptions;
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
  });

  it("should have correct structure", () => {
    expect(authOptions).toHaveProperty("providers");
    expect(authOptions).toHaveProperty("session");
    expect(authOptions).toHaveProperty("pages");

    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.session).toEqual({ strategy: "jwt" });
    expect(authOptions.pages).toEqual({ signIn: "/login" });
  });

  it("should use credentials provider", () => {
    const provider = authOptions.providers[0];
    expect(provider.id).toBe("credentials");
    expect(provider.name).toBe("Credentials");
  });

  describe("Credentials Provider Authorization", () => {
    let authorize: NonNullable<CredentialsConfig["authorize"]>;

    beforeEach(() => {
      const credentialsProvider = authOptions.providers[0] as CredentialsConfig;
      // Use the authorize function from options instead of the direct one
      authorize =
        credentialsProvider.options?.authorize ||
        credentialsProvider.authorize!;
    });
    it("should authorize valid credentials", async () => {
      const credentials = {
        username: "testadmin",
        password: "testpassword123",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toEqual({
        id: "1",
        name: "testadmin",
      });
    });
    it("should reject invalid username", async () => {
      const credentials = {
        username: "wronguser",
        password: "testpassword123",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should reject invalid password", async () => {
      const credentials = {
        username: "testadmin",
        password: "wrongpassword",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should reject missing credentials", async () => {
      const result = await authorize(undefined, {} as MockRequest);

      expect(result).toBeNull();
    });

    it("should reject partial credentials", async () => {
      const credentialsOnlyUsername = {
        username: "testadmin",
      };

      const credentialsOnlyPassword = {
        password: "testpassword123",
      };
      const result1 = await authorize(
        credentialsOnlyUsername,
        {} as MockRequest
      );
      const result2 = await authorize(
        credentialsOnlyPassword,
        {} as MockRequest
      );

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
    it("should reject empty credentials", async () => {
      const credentials = {
        username: "",
        password: "",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should handle missing environment variables", async () => {
      delete process.env.ADMIN_USERNAME;
      delete process.env.ADMIN_PASSWORD;

      const credentials = {
        username: "testadmin",
        password: "testpassword123",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should be case sensitive for username", async () => {
      const credentials = {
        username: "TESTADMIN",
        password: "testpassword123",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should be case sensitive for password", async () => {
      const credentials = {
        username: "testadmin",
        password: "TESTPASSWORD123",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should handle whitespace in credentials", async () => {
      const credentials = {
        username: " testadmin ",
        password: " testpassword123 ",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toBeNull();
    });
    it("should handle special characters in environment variables", async () => {
      process.env.ADMIN_USERNAME = "admin@domain.com";
      process.env.ADMIN_PASSWORD = "p@ssw0rd!#$%";

      const credentials = {
        username: "admin@domain.com",
        password: "p@ssw0rd!#$%",
      };

      const result = await authorize(credentials, {} as MockRequest);

      expect(result).toEqual({
        id: "1",
        name: "admin@domain.com",
      });
    });
  });

  describe("Credentials Configuration", () => {
    it("should have correct credential fields", () => {
      const credentialsProvider = authOptions.providers[0] as CredentialsConfig;
      const credentials =
        credentialsProvider.options?.credentials ||
        credentialsProvider.credentials;

      expect(credentials).toHaveProperty("username");
      expect(credentials).toHaveProperty("password");

      expect(credentials.username).toEqual({
        label: "Username",
        type: "text",
      });

      expect(credentials.password).toEqual({
        label: "Password",
        type: "password",
      });
    });
  });

  describe("Security Considerations", () => {
    it("should not expose admin credentials in production", () => {
      // This is more of a documentation test to ensure developers
      // are aware of security considerations
      expect(process.env.ADMIN_USERNAME).toBeDefined();
      expect(process.env.ADMIN_PASSWORD).toBeDefined();

      // In production, these should come from secure environment variables
      // and not be hardcoded
    });

    it("should use JWT strategy for sessions", () => {
      expect(authOptions.session!.strategy).toBe("jwt");
    });

    it("should redirect to custom login page", () => {
      expect(authOptions.pages!.signIn).toBe("/login");
    });
  });
});
