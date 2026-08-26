"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { readDriverAccess } from "@/lib/driver-access";

/**
 * Sends visitors to /for-drivers unless they've already left their details.
 * localStorage is only readable after mount, so nothing renders until the
 * check has run — otherwise the directory would flash before the redirect.
 */
export function DriverGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (readDriverAccess()) {
      setAllowed(true);
    } else {
      setAllowed(false);
      router.replace(`/for-drivers?next=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  if (!allowed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="sr-only">Loading</span>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
