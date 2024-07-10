import { AppDataSource } from '../src/database';
import { UserService } from '../src/services/user-service';

async function seedAdminUser() {
  try {
    await AppDataSource.initialize();

    const userService = new UserService();

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeThisPassword';
    const adminEmail = process.env.ADMIN_EMAIL || 'test@test.com';

    const existingAdmin = await userService.findUserByUsername(adminUsername);

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const newAdmin = await userService.createUser({
      username: adminUsername,
      password: adminPassword,
      email: adminEmail,
      isAdmin: true,
    });

    console.log('Admin user created', newAdmin.username);
  } catch (error) {
    console.error('Error seeding admin user', error);
  } finally {
    AppDataSource.destroy();
  }
}

seedAdminUser();
