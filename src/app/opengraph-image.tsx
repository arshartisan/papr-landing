import { ImageResponse } from "next/og";
import { getPrice } from "@/lib/price";
import { site } from "@/lib/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark =
  "M206.75 577.014V234.061C206.75 229.215 211.997 226.187 216.193 228.612L361.291 312.476V143.817C361.291 137.657 367.961 133.808 373.294 136.89L588.753 261.422C591.227 262.852 592.75 265.492 592.75 268.348V441.773C592.75 444.63 591.227 447.27 588.753 448.7L450.212 528.774C444.879 531.857 438.209 528.008 438.209 521.848V361.55C438.209 358.693 436.686 356.053 434.212 354.624L361.291 312.476V657.089C361.291 663.249 354.621 667.098 349.288 664.015L210.747 583.941C208.273 582.511 206.75 579.871 206.75 577.014Z";

/** Link preview for X, LinkedIn, Reddit, HN… Shows the sale while one is running. */
export default async function Image() {
  const price = await getPrice();
  const deal = price.deal;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 50% -20%, #0c4a40 0%, #031b18 60%)",
          color: "#f3eee7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 800 800">
            <rect width="800" height="800" rx="180" fill="#005148" />
            <path d={mark} fill="#FFDEBD" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>papr</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05 }}>Every new tab,</span>
          <span style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05, color: "#9db1ac" }}>
            a blank page.
          </span>
          <span style={{ marginTop: 24, fontSize: 30, color: "#9db1ac" }}>
            A quiet notepad in your browser&apos;s new tab. No account, no cloud.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32 }}>
          {deal ? (
            <>
              <span
                style={{ background: "#ffdebd", color: "#0d1513", padding: "8px 20px", borderRadius: 999, fontWeight: 700 }}
              >
                {deal.name}
              </span>
              <span style={{ fontWeight: 700 }}>{deal.label}</span>
              <span style={{ color: "#9db1ac" }}>
                · one-time · until {deal.lastDay}, then {price.label}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 700 }}>{price.label}</span>
              <span style={{ color: "#9db1ac" }}>· one-time · yours forever</span>
            </>
          )}
        </div>
      </div>
    ),
    size,
  );
}
