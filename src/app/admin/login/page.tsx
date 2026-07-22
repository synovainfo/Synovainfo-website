import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — Synova Infotech",
  description:
    "Secure sign-in to the Synova Infotech enterprise admin dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <>
      {/* ── Animated CSS for floating gradient orbs ── */}
      <style>{`
        @keyframes orb-1-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          33% {
            transform: translate(50px, -70px) scale(1.12);
            opacity: 0.7;
          }
          66% {
            transform: translate(-40px, 30px) scale(0.92);
            opacity: 0.4;
          }
        }
        @keyframes orb-2-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.45;
          }
          33% {
            transform: translate(-60px, 50px) scale(1.18);
            opacity: 0.65;
          }
          66% {
            transform: translate(40px, -60px) scale(0.9);
            opacity: 0.35;
          }
        }
        @keyframes orb-3-float {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.45;
          }
        }
        .orb-1 {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.25),
            rgba(139, 92, 246, 0.15),
            transparent 70%
          );
          filter: blur(80px);
          animation: orb-1-float 14s ease-in-out infinite;
        }
        .orb-2 {
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(6, 182, 212, 0.2),
            rgba(37, 99, 235, 0.15),
            transparent 70%
          );
          filter: blur(80px);
          animation: orb-2-float 18s ease-in-out infinite;
        }
        .orb-3 {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.12),
            rgba(37, 99, 235, 0.08),
            transparent 70%
          );
          filter: blur(100px);
          animation: orb-3-float 12s ease-in-out infinite;
        }
      `}</style>

      {/* ── Full-viewport page ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/20 dark:from-[#070D16] dark:via-[#0C1628] dark:to-[#111D35]">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="orb-1" />
          <div className="orb-2" />
          <div className="orb-3" />
        </div>

        {/* Subtle dot-grid overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        {/* Login card */}
        <LoginForm />
      </div>
    </>
  );
}
