import { redirect } from "next/navigation";
import AdminRoutes from "@/utils/routes";

export default async function Page() {
  return redirect(AdminRoutes.dashboard());
}
