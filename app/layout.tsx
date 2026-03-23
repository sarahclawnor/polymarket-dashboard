import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "AlphaHound — Polymarket Opportunity Scanner",
  description: "Real-time edge detection across Polymarket prediction markets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
