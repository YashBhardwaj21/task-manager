module.exports = {
  "/api/v1/tasks": {
    get: {
      tags: ["Tasks"],
      summary: "Get tasks with pagination, search, and filtering",
      description: "Retrieves a paginated list of tasks owned by the authenticated user. Includes metadata for pagination.",
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Number of items per page" },
        { name: "status", in: "query", schema: { type: "string", enum: ["pending", "in-progress", "completed"] }, description: "Filter by status" },
        { name: "search", in: "query", schema: { type: "string" }, description: "Search term for title or description" }
      ],
      responses: {
        200: {
          description: "Paginated list of tasks",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedTaskResponse" }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    },
    post: {
      tags: ["Tasks"],
      summary: "Create a new task",
      description: "Creates a new task associated with the authenticated user.",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateTaskRequest" }
          }
        }
      },
      responses: {
        201: {
          description: "Task created successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Task created successfully",
                data: {
                  id: "clq...",
                  title: "Backend Assignment",
                  status: "pending",
                  priority: "high"
                }
              }
            }
          }
        },
        400: { $ref: "#/components/responses/ValidationError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },
  "/api/v1/tasks/{id}": {
    get: {
      tags: ["Tasks"],
      summary: "Get a task by ID",
      description: "Retrieves a specific task. Returns 404 if not found or 403 if owned by another user.",
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Task ID" }
      ],
      responses: {
        200: {
          description: "Task details",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskResponse" }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" },
        404: { $ref: "#/components/responses/NotFoundError" }
      }
    },
    put: {
      tags: ["Tasks"],
      summary: "Update a task",
      description: "Updates an existing task. Users may only modify tasks they own. Admins may modify any task.",
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Task ID" }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateTaskRequest" }
          }
        }
      },
      responses: {
        200: {
          description: "Task updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskResponse" }
            }
          }
        },
        400: { $ref: "#/components/responses/ValidationError" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" },
        404: { $ref: "#/components/responses/NotFoundError" }
      }
    },
    delete: {
      tags: ["Tasks"],
      summary: "Delete a task",
      description: "Soft-deletes a task (sets deletedAt timestamp). Users may only delete tasks they own. Admins may delete any task.",
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
