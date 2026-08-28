import { ScrollVideo } from "@/components/ScrollVideo";
import { Outcome } from "@/components/Outcome";
import { PartnersSection } from "@/components/PartnersSection";
import { ImpactTransition } from "@/components/ImpactTransition";
import { SectionSnap } from "@/components/SectionSnap";
import { pageMetadata, siteName, siteTagline } from "@/lib/site";

export const metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      {/* The hero is a scroll-driven video, so the page has no visible top-level
          heading. Crawlers still need one — kept screen-reader-only so the
          design is untouched. */}
      <h1 className="sr-only">{`${siteName} — ${siteTagline}`}</h1>
      <SectionSnap />
      <ScrollVideo src="/home/scroll.mp4" reveal="fadeup" brandColor="theme" inset />
      <div className="snap-start">
        <Outcome />
      </div>
      <div className="snap-start">
        <PartnersSection />
      </div>
      <div className="snap-start">
        <ImpactTransition />
      </div>
    </>
  );
}
