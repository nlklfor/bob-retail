import { requireStaffSession } from "@/lib/admin/dal";

export default async function AdminDashboardPage() {
  const user = await requireStaffSession();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Панель керування
      </h1>
      <p className="mt-2 text-muted">Ви увійшли як {user.email}</p>
    </div>
  );
}
