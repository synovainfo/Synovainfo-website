import { ImageResponse } from "next/og";

export const runtime = "edge";

export const dynamic = "force-static";

interface OgQueryParams {
  title?: string;
  description?: string;
  type?: string;
}

export async function GET(request: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);

  const params: OgQueryParams = {
    title: searchParams.get("title") ?? undefined,
    description: searchParams.get("description") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  };

  return new ImageResponse(
    <OgTemplate
      title={params.title}
      description={params.description}
      type={params.type}
    />,
    {
      width: 1200,
      height: 630,
      // Default is "cover" — ensures the image fills the social share card area
      // without distortion.
    },
  );
}

// ---------------------------------------------------------------------------
// Brand colours (matching globals.css and favicon)
// ---------------------------------------------------------------------------
const COLORS = {
  darkBg: "#0F1B2D",
  darkBgLight: "#1A2940",
  accentBlue: "#2563EB",
  accentPurple: "#8B5CF6",
  accentCyan: "#06B6D4",
  white: "#FFFFFF",
  mutedWhite: "rgba(255,255,255,0.7)",
  subtleGrid: "rgba(37,99,235,0.08)",
} as const;

// ---------------------------------------------------------------------------
// Default fallback values
// ---------------------------------------------------------------------------
const DEFAULT_TITLE = "Enterprise Architecture & Digital Engineering";
const DEFAULT_DESCRIPTION =
  "Mission-critical platforms engineered for Fortune 500 scale. Multi-cloud infrastructure, agentic AI pipelines, and zero-trust security architectures.";
const DEFAULT_TYPE = "home";

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------
function OgTemplate({
  title,
  description,
  type,
}: OgQueryParams): React.ReactElement {
  const displayTitle = title ?? DEFAULT_TITLE;
  const displayDescription = description ?? DEFAULT_DESCRIPTION;
  const displayType = type ?? DEFAULT_TYPE;

  // Type label for contextual badge
  const typeLabel = getTypeLabel(displayType);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${COLORS.darkBg} 0%, ${COLORS.darkBgLight} 50%, ${COLORS.darkBg} 100%)`,
        fontFamily:
          "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.subtleGrid} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.subtleGrid} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top-right accent glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accentBlue}40 0%, transparent 70%)`,
        }}
      />

      {/* Bottom-left accent glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-60px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accentPurple}30 0%, transparent 70%)`,
        }}
      />

      {/* Bottom-right accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          height: "4px",
          background: `linear-gradient(90deg, ${COLORS.accentBlue}, ${COLORS.accentPurple}, ${COLORS.accentCyan})`,
        }}
      />

      {/* ---- Content ---- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header: company name + type badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo area — text mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* S icon symbol */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${COLORS.accentBlue}, ${COLORS.accentPurple})`,
                color: COLORS.white,
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              S
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: COLORS.white,
                  letterSpacing: "0.08em",
                  lineHeight: 1.2,
                }}
              >
                SYNOVA INFOTECH
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: COLORS.mutedWhite,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}
              >
                Enterprise Technology Partner
              </span>
            </div>
          </div>

          {/* Type badge */}
          {displayType !== "home" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "100px",
                background: `linear-gradient(135deg, ${COLORS.accentBlue}25, ${COLORS.accentPurple}25)`,
                border: `1px solid ${COLORS.accentBlue}40`,
                fontSize: "14px",
                fontWeight: 600,
                color: COLORS.white,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {typeLabel}
            </div>
          )}
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: COLORS.white,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0,
              padding: 0,
              // Clamp long titles with ellipsis
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {displayTitle}
          </h1>

          {displayDescription && (
            <p
              style={{
                fontSize: "24px",
                fontWeight: 400,
                color: COLORS.mutedWhite,
                lineHeight: 1.4,
                margin: 0,
                padding: 0,
                maxWidth: "800px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {displayDescription}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: COLORS.mutedWhite,
              letterSpacing: "0.05em",
            }}
          >
            synovainfotech.com
          </span>

          <span
            style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Enterprise Grade
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Maps the `type` query param to a user-facing label for the badge.
 */
function getTypeLabel(type: string): string {
  switch (type) {
    case "blog":
      return "Blog";
    case "service":
      return "Service";
    case "case-study":
      return "Case Study";
    case "industry":
      return "Industry";
    case "career":
      return "Career";
    case "about":
      return "About";
    case "contact":
      return "Contact";
    default:
      return "Home";
  }
}
