import { UsersService } from '../../services/users-service';

export async function initAdmin() {
  const userService = new UsersService();

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
      // Self-heal: ensure the configured admin actually has admin rights. This
      // recovers accounts created before createUser honored the isAdmin flag.
      if (!existingAdmin.isAdmin) {
        await userService.updateUser(existingAdmin.id, { isAdmin: true });
        console.log('Existing admin user promoted to admin');
      } else {
        console.log('Admin user already exists');
      }
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
