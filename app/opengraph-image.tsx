import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} – ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 96,
          background: "#ffffff",
          color: "#1d1d1f",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 600, color: "#0071e3" }}>{site.name}</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24, letterSpacing: -2 }}>
          {site.tagline}
        </div>
      </div>
    ),
    size,
  );
}
