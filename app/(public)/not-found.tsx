import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">
        The content you are looking for may have been moved or is not published.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}

