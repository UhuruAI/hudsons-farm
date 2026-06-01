import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Hudson's Farm | Organic & Regenerative",
  description:
    "6.8 hectares of organic hemp, gourmet mushrooms, microgreens, and fresh produce in Magaliesburg, South Africa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>
          <Nav />
          {children}
          <Footer />
          <ChatWidget />
        </ClientProviders>
      </body>
    </html>
  );
}
