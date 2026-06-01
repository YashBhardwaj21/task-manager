module.exports = {
  "/api/v1/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new user",
      description: "Creates a new user account with hashed password.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "User registered successfully"
              }
            }
          }
        },
        400: {
          description: "Validation or Registration Error",
          content: {
            "application/json": {
              examples: {
                ValidationError: {
                  value: {
                    success: false,
                    message: "Validation failed"
                  }
                },
                EmailExists: {
                  value: {
                    success: false,
                    message: "Email already exists"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/v1/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login user",
      description: "Authenticates a user and returns an access token and a refresh token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },
  "/api/v1/auth/refresh": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      description: "Uses a valid refresh token to generate a new short-lived access token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RefreshRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Token refreshed successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5c..."
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" }
      }
    }
  }
};
