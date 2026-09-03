import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
