import { redirect } from "next/navigation";
import Routes from "@/utils/routes";

export default function Page() {
  return redirect(Routes.admin());
}
