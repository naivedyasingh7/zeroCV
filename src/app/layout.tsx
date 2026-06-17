import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "zeroCV — Hiring is broken. We fixed it with AI.",
  description: "A serious, high-impact AI evaluation platform. Discover real talent beyond resumes and degrees through contextual DNA matching and autonomous screening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-background text-slate-100 font-sans min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
