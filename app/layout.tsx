import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeIQ - מסחר חכם",
  description: "המדריך האישי שלך למסחר חכם - מערכת תמיכת החלטות למסחר במניות",
  openGraph: {
    title: "TradeIQ - מסחר חכם",
    description: "המדריך האישי שלך למסחר חכם",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <head />
      <body className="min-h-full flex flex-col bg-gray-900 text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
