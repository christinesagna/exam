export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage products, users, and system settings from the admin console.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-2 text-sm text-gray-600">
            See a quick summary of recent activity and system health.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="mt-2 text-sm text-gray-600">
            View product status and inventory metrics.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="mt-2 text-sm text-gray-600">
            Monitor users and access controls.
          </p>
        </div>
      </section>
    </div>
  );
}
