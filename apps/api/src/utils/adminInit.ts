import { UserService } from '../services/user-service';

export async function initializeAdministrator() {
  const userService = new UserService();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminUsername || !adminPassword || !adminEmail) {
    console.error(
      'ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_EMAIL are not set. Skipping admin user creation',
    );
    return;
  }

  try {
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
  }
}
