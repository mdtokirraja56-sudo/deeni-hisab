import { ImageResponse } from "next/og";

// App icon (dark green square with a cream crescent). Used by the web manifest,
// the browser tab and the iOS home screen. Example: /pwa-icon?size=192
const ALLOWED = [64, 180, 192, 512];

export async function GET(request: Request) {
  const raw = Number(new URL(request.url).searchParams.get("size"));
  const size = ALLOWED.includes(raw) ? raw : 512;
  const moon = Math.round(size * 0.5); // stays inside the safe zone of "maskable" icons
  const cut = Math.round(moon * 0.78);

  return new ImageResponse(
    (
      <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#0f5132" }}>
        <div style={{ position: "relative", width: moon, height: moon, display: "flex" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: moon, height: moon, borderRadius: moon, background: "#faf8f1", display: "flex" }} />
          <div style={{ position: "absolute", left: Math.round(moon * 0.3), top: Math.round(moon * -0.08), width: cut, height: cut, borderRadius: cut, background: "#0f5132", display: "flex" }} />
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
