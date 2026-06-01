module.exports = {
  "/api/v1/admin/users": {
    get: {
      tags: ["Admin"],
      summary: "Get all users",
      description: "Requires role=ADMIN. Requests from USER accounts return 403.",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "List of all users",
          content: {
            "application/json": {
              example: {
                success: true,
                data: [
                  {
                    id: "clq...",
                    name: "User 1",
                    email: "user1@test.com",
                    role: "user"
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" }
      }
    }
  },
  "/api/v1/admin/users/{id}/block": {
    patch: {
      tags: ["Admin"],
      summary: "Block a user",
      description: "Requires role=ADMIN. Blocks a user from authenticating. Requests from USER accounts return 403.",
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User ID" }
      ],
      responses: {
        200: {
          description: "User blocked successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "User blocked successfully"
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" },
        404: { $ref: "#/components/responses/NotFoundError" }
      }
    }
  },
  "/api/v1/admin/tasks/{id}": {
    delete: {
      tags: ["Admin"],
      summary: "Force delete any task",
      description: "Requires role=ADMIN. Admins can delete any task regardless of ownership. Requests from USER accounts return 403.",
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Task ID" }
      ],
      responses: {
        200: {
          description: "Task deleted successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Task deleted successfully"
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" },
        404: { $ref: "#/components/responses/NotFoundError" }
      }
    }
  }
};
