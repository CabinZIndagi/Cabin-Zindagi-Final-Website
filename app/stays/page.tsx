import { DriverGate } from "@/components/DriverGate";
import { StaysBooking } from "@/components/StaysBooking";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/stays");

export default function StaysPage() {
  return (
    <DriverGate>
      <StaysBooking />
    </DriverGate>
  );
}
