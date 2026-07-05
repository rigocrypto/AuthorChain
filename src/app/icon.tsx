import { ImageResponse } from "next/og";

// Browser-tab / favicon icon — generated so no binary asset is needed.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: 14,
          background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
          color: "#ffffff",
          fontSize: 42,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
