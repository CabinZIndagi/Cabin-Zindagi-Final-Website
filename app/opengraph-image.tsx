import { ImageResponse } from "next/og";
import { siteName, siteTagline } from "@/lib/site";

export const alt = `${siteName} — ${siteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The social share card for every page that doesn't define its own.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #10171d 0%, #1f2a33 55%, #E25600 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#FE8A1C",
          }}
        >
          {siteTagline}
        </div>
        <div style={{ display: "flex", fontSize: 110, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
          {siteName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            marginTop: 28,
            maxWidth: 900,
            color: "#e7ecef",
            lineHeight: 1.35,
          }}
        >
          {"Documenting, amplifying and protecting the lives of India's 9 million truck drivers."}
        </div>
        <div style={{ display: "flex", marginTop: 48, alignItems: "center" }}>
          <div style={{ width: 72, height: 6, background: "#2D8D46" }} />
          <div style={{ display: "flex", fontSize: 26, marginLeft: 20, color: "#c9d2d8" }}>
            {"Agar Chakkaa nahi Ghumega, Toh Jahaj nahi Udega."}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
