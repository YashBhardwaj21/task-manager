module.exports = {
  "/api/v1/health": {
    get: {
      tags: ["System"],
      summary: "Health Check",
      description: "Verify that the server is up and running. Useful for load balancers and deployment monitoring.",
      responses: {
        200: {
          description: "Server is healthy",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Server healthy",
                timestamp: "2026-06-01T12:00:00Z"
              }
            }
          }
        }
      }
    }
  }
};
