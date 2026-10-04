import { redirect } from "next/navigation";
import { auth, isAuthRequired } from "@/auth";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (isAuthRequired() && !(await auth())) redirect("/signin");
  return <HomeClient />;
}
