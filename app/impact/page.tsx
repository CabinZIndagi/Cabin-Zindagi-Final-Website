import { ScrollTopOnMount } from "@/components/ScrollTopOnMount";
import { TyreScroll } from "@/components/TyreScroll";

export default function ImpactPage() {
  return (
    <>
      {/* This page is a 400dvh scroll experience — arriving part-way through it
          looks broken (the wheel already rolled), so pin it to the top on entry.
          The browser's own scroll restore is suppressed earlier still, by the
          inline script in app/layout.tsx. */}
      <ScrollTopOnMount />
      <TyreScroll />
    </>
  );
}
