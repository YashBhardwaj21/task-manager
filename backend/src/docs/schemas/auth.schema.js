module.exports = {
  RegisterRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string", example: "Yash" },
      email: { type: "string", format: "email", example: "yash@test.com" },
      password: { type: "string", minLength: 8, example: "Password123" },
      role: { type: "string", enum: ["user", "admin"], example: "user" }
    }
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "admin@test.com" },
      password: { type: "string", example: "Admin@123" }
    }
  },
  RefreshRequest: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    }
  },
  AuthResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Authentication successful" },
      data: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "clq123456000008l412345678" },
              name: { type: "string", example: "Yash" },
              email: { type: "string", example: "yash@test.com" },
              role: { type: "string", example: "user" }
            }
          },
          tokens: {
            type: "object",
            properties: {
              accessToken: { type: "string", example: "eyJhbGciOiJIUz..." },
              refreshToken: { type: "string", example: "eyJhbGciOiJIUz..." }
            }
          }
        }
      }
    }
  }
};
