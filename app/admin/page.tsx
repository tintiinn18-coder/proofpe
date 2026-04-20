import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Protected ProofPe admin dashboard for reviewing startup submissions.",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminDashboard />;
}
