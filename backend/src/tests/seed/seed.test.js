const { execSync } = require('child_process');
const prisma = require('../../../src/config/db');

describe('Database Seed Script', () => {
  beforeEach(() => {
    // Execute the seed script before checking
    try {
      execSync('npx dotenv -e .env.test -- node prisma/seed.js', { stdio: 'ignore' });
    } catch (error) {
      // Ignore if it fails due to existing admin (or other errors for this test)
    }
  });

  it('should create the admin user', async () => {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@test.com" }
    });
    
    expect(admin).toBeTruthy();
    expect(admin.role).toBe("admin");
  });
});
