const { z } = require('zod');

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional()
  })
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional()
  })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
