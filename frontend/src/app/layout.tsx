import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "HIRKANI – Pregnancy Food Safety Guide",
  description: "AI-powered pregnancy food safety scanner",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center p-3">{children}</main>
      </body>
    </html>
  );
}
