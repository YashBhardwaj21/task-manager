module.exports = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "An error occurred" }
    }
  },
  ValidationError: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Validation Error" },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            code: { type: "string" },
            message: { type: "string" },
            path: { type: "array", items: { type: "string" } }
          }
        }
      }
    }
  },
  UnauthorizedError: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Unauthorized" }
    }
  },
  ForbiddenError: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Forbidden" }
    }
  },
  NotFoundError: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Resource not found" }
    }
  }
};
