import { getSession } from "@/src/lib/auth/next-auth";
import { redirect } from "next/navigation";
import { getDashboardNavigation } from "@/src/lib/dashboard/nav-links";
import { TPermissions } from "@/src/types";

export default async function Page() {
  const session = await getSession();

  const permissions = session?.user?.permissions as TPermissions[];
  const firstAccessiblePage = getDashboardNavigation(permissions);

  return redirect(firstAccessiblePage[0].href);
}
