import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/LangContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "World Cup in SEA — Your guide to the 2026 FIFA World Cup in Seattle",
  description:
    "Find fan zones, watch parties, bars, and experiences for the 2026 FIFA World Cup in Seattle, Bellevue, Kirkland, and Tacoma.",
  openGraph: {
    title: "World Cup in SEA",
    description: "Your guide to the 2026 FIFA World Cup in Seattle",
    siteName: "World Cup in SEA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
