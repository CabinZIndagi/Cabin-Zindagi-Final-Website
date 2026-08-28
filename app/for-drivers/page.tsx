import { Suspense } from "react";
import { DriverPortal } from "@/components/DriverPortal";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/for-drivers");

export default function ForDriversPage() {
  // useSearchParams inside the portal needs a Suspense boundary to prerender.
  return (
    <Suspense>
      <DriverPortal />
    </Suspense>
  );
}
