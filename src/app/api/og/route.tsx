import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get("name") || "Author";
    const title =
      searchParams.get("title") || "How to Build Modern Web Applications";
    const description =
      searchParams.get("description") ||
      "Discover the latest techniques and best practices for creating exceptional digital experiences.";
    const category = searchParams.get("category") || "Technology";
    const date = searchParams.get("date") || new Date().toISOString();
    const website = searchParams.get("website") || "yoursite.com";
    const theme = searchParams.get("theme") || "teal";

    const themes = {
      teal: { primary: "#0d9488", secondary: "#14b8a6", bg: "#f0fdfa" },
      blue: { primary: "#0ea5e9", secondary: "#38bdf8", bg: "#f0f9ff" },
      purple: { primary: "#8b5cf6", secondary: "#a78bfa", bg: "#faf5ff" },
      green: { primary: "#059669", secondary: "#10b981", bg: "#f0fdf4" },
    };

    const selectedTheme = themes[theme as keyof typeof themes] || themes.teal;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Left content section */}
          <div
            style={{
              width: "60%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 80px 60px 60px",
              backgroundColor: "white",
            }}
          >
            {/* Category badge */}
            <div
              style={{
                display: "flex",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  padding: "8px 20px",
                  fontSize: "16px",
                  fontWeight: 500,
                  borderRadius: "24px",
                  backgroundColor: selectedTheme.bg,
                  color: selectedTheme.primary,
                  border: `2px solid ${selectedTheme.primary}`,
                }}
              >
                {category}
              </span>
            </div>

            {/* Main title */}
            <h1
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "#1f2937",
                marginBottom: "24px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: selectedTheme.primary }}>
                {title.split(" ").slice(0, 2).join(" ")}
              </span>{" "}
              <span style={{ color: "#1f2937" }}>
                {title.split(" ").slice(2).join(" ")}
              </span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "20px",
                color: "#6b7280",
                marginBottom: "40px",
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>

            {/* Author and date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
                color: "#374151",
                marginBottom: "32px",
              }}
            >
              <span style={{ fontWeight: 600 }}>{name}</span>
              <span style={{ margin: "0 12px", color: "#d1d5db" }}>•</span>
              <span>{formatDate(date)}</span>
            </div>

            {/* Website branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: selectedTheme.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {website.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                {website}
              </span>
            </div>
          </div>

          {/* Right visual section */}
          <div
            style={{
              width: "40%",
              height: "100%",
              position: "relative",
              display: "flex",
              backgroundColor: selectedTheme.bg,
              backgroundImage: `linear-gradient(135deg, ${selectedTheme.bg} 0%, ${selectedTheme.primary}15 100%)`,
            }}
          >
            {/* Abstract geometric shapes */}
            <div
              style={{
                position: "absolute",
                top: "80px",
                right: "60px",
                width: "120px",
                height: "120px",
                borderRadius: "20px",
                backgroundColor: selectedTheme.primary,
                opacity: 0.1,
                transform: "rotate(15deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "120px",
                right: "40px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: selectedTheme.secondary,
                opacity: 0.2,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "200px",
                right: "120px",
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                backgroundColor: selectedTheme.primary,
                opacity: 0.15,
                transform: "rotate(-25deg)",
              }}
            />

            {/* Code-like elements */}
            <div
              style={{
                position: "absolute",
                top: "160px",
                left: "40px",
                right: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "6px",
                    backgroundColor: selectedTheme.primary,
                    borderRadius: "3px",
                    opacity: 0.6 - i * 0.1,
                    width: `${100 - i * 15}%`,
                  }}
                />
              ))}
            </div>

            {/* Bottom accent line */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "8px",
                backgroundColor: selectedTheme.primary,
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Error: ${e.message}`, {
      status: 500,
    });
  }
}
