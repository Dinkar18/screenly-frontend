import AdminDashboard from '@/features/admin/components/AdminDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireRole="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
