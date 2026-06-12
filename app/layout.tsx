import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UIT Waifu — AI companion for UIT students",
  description:
    "A web-first AI companion for University of Information Technology students. Chat, study, debug code, and understand documents.",
  metadataBase: new URL("https://waifu.accel.io.vn"),
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
