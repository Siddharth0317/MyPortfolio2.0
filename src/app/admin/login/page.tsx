import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  // If already authenticated, redirect on the server directly to dashboard
  if (session) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
