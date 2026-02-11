import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session ?? null;
  } catch (error) {
    console.error("GET SESSION ERROR:", error);
    return null;
  }
}
