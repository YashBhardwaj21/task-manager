const authSchemas = require('./schemas/auth.schema');
const taskSchemas = require('./schemas/task.schema');
const errorSchemas = require('./schemas/error.schema');

const authPaths = require('./paths/auth.paths');
const taskPaths = require('./paths/task.paths');
const adminPaths = require('./paths/admin.paths');
const healthPaths = require('./paths/health.paths');

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Task Management System API",
    version: "1.0.0",
    description: `Production-ready REST API with JWT Authentication, RBAC, PostgreSQL, Prisma, Swagger, and Docker.

### System Architecture
Client → Express Routes → Controllers → Services → Prisma → PostgreSQL

### Example Workflow
1. **Register User** (POST /api/v1/auth/register)
2. **Login** (POST /api/v1/auth/login)
3. **Copy JWT Access Token**
4. **Click "Authorize"** (Padlock icon above)
5. **Create Task** (POST /api/v1/tasks)
6. **View Tasks** (GET /api/v1/tasks)

### Seeded Admin Credentials
Email: \`admin@test.com\`
Password: \`Admin@123\`
    `
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server"
    },
    {
      url: "https://api.primetrade-task.example.com",
      description: "Production Server"
    }
  ],
  tags: [
    {
      name: "Authentication",
      description: "Registration, login, and token management"
    },
    {
      name: "Tasks",
      description: "Task management operations"
    },
    {
      name: "Admin",
      description: "Role-restricted administrative actions"
    },
    {
      name: "System",
      description: "Monitoring and health endpoints"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ...authSchemas,
      ...taskSchemas
    },
    responses: {
      ValidationError: {
        description: "Validation failed for the request payload",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationError" }
          }
        }
      },
      UnauthorizedError: {
        description: "Missing or invalid authentication token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UnauthorizedError" }
          }
        }
      },
      ForbiddenError: {
        description: "User does not have permission to access this resource",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ForbiddenError" }
          }
        }
      },
      NotFoundError: {
        description: "The requested resource was not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/NotFoundError" }
          }
        }
      }
    }
  },
  paths: {
    ...healthPaths,
    ...authPaths,
    ...taskPaths,
    ...adminPaths
  }
};

// Merge error schemas into the main schemas manually
Object.assign(swaggerDocument.components.schemas, errorSchemas);

module.exports = swaggerDocument;
