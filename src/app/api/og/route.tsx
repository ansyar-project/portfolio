import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Muhammad Ansyar Rafi Putra";
    const description =
      searchParams.get("description") ||
      "Full Stack Developer, Data Expert, DevOps";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #10b981 2px, transparent 0), radial-gradient(circle at 75px 75px, #059669 2px, transparent 0)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "40px",
              borderRadius: "20px",
              border: "2px solid #10b981",
              backdropFilter: "blur(10px)",
            }}
          >
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#10b981",
                textAlign: "center",
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "30px",
                fontSize: "18px",
                color: "#6b7280",
              }}
            >
              📍 Melbourne, Australia • 🚀 Available for Projects
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.log(`${errorMessage}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
