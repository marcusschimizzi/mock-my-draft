'use client';

import DashboardLayout from '../../layouts/dashboard-layout';

function UsersPage() {
  return (
    <DashboardLayout requireAdmin={true}>
      <h1>Users</h1>
      <p>Users page content</p>
    </DashboardLayout>
  );
}

export default UsersPage;
