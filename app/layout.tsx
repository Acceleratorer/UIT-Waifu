import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "UIT Waifu — AI companion for UIT students",
  description:
    "A web-first AI companion for University of Information Technology students. Chat, study, debug code, and understand documents.",
  metadataBase: new URL("https://waifu.accel.io.vn"),
  icons: {
    icon: [{ url: `${basePath}/icons/favicon.jpg`, type: "image/jpeg" }],
    shortcut: [{ url: `${basePath}/icons/favicon.jpg`, type: "image/jpeg" }],
    apple: [{ url: `${basePath}/icons/logo.png`, type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
