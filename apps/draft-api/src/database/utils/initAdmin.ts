import { UserService } from '../../services/users-service';

export async function initAdmin() {
  const userService = new UserService();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminUsername || !adminPassword || !adminEmail) {
    console.error(
      'Missing required environment variables for admin user. Skipping admin user creation.'
    );
    return;
  }

  try {
    const existingAdmin = await userService.getUserByUsername(adminUsername);

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

    console.log('Admin user created:', newAdmin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}
