import { Suspense } from "react";
import { DriverPortal } from "@/components/DriverPortal";

export const metadata = {
  title: "For Drivers | Cabin Zindagi",
  description:
    "Parking, dhabas, rest stops, music and more for India's truck drivers — free, in Hindi or English.",
};

export default function ForDriversPage() {
  // useSearchParams inside the portal needs a Suspense boundary to prerender.
  return (
    <Suspense>
      <DriverPortal />
    </Suspense>
  );
}
