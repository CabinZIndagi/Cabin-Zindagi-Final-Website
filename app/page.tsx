import { ScrollVideo } from "@/components/ScrollVideo";
import { Outcome } from "@/components/Outcome";
import { ImpactGallery } from "@/components/ImpactGallery";
import { ImpactTransition } from "@/components/ImpactTransition";
import { SectionSnap } from "@/components/SectionSnap";

export default function Home() {
  return (
    <>
      <SectionSnap />
      <ScrollVideo src="/home/scroll.mp4" reveal="fadeup" brandColor="theme" inset />
      <div className="snap-start">
        <Outcome />
      </div>
      <div className="snap-start">
        <ImpactGallery />
      </div>
      <div className="snap-start">
        <ImpactTransition />
      </div>
    </>
  );
}
