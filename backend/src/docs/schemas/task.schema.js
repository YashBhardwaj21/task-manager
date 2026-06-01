module.exports = {
  Task: {
    type: "object",
    properties: {
      id: { type: "string", example: "clq123456000008l412345678" },
      title: { type: "string", example: "Backend Assignment" },
      description: { type: "string", example: "Complete Swagger documentation" },
      status: { type: "string", enum: ["pending", "in-progress", "completed"], example: "pending" },
      priority: { type: "string", enum: ["low", "medium", "high"], example: "high" },
      userId: { type: "string", example: "clq123456000008l412345678" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  CreateTaskRequest: {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string", example: "Backend Assignment" },
      description: { type: "string", example: "Complete Swagger" },
      status: { type: "string", enum: ["pending", "in-progress", "completed"], example: "pending" },
      priority: { type: "string", enum: ["low", "medium", "high"], example: "high" }
    }
  },
  UpdateTaskRequest: {
    type: "object",
    properties: {
      title: { type: "string", example: "Backend Assignment - Updated" },
      description: { type: "string", example: "Updated description" },
      status: { type: "string", enum: ["pending", "in-progress", "completed"], example: "in-progress" },
      priority: { type: "string", enum: ["low", "medium", "high"], example: "high" }
    }
  },
  TaskResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: { $ref: "#/components/schemas/Task" }
    }
  },
  PaginatedTaskResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: { $ref: "#/components/schemas/Task" }
          },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 45 },
              totalPages: { type: "integer", example: 5 }
            }
          }
        }
      }
    }
  }
};
