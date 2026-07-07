import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ClientProviders from "@/components/ClientProviders";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Revayah Sanctuary | Heritage Eco-Resort & Regenerative Farm",
  description:
    "A heritage eco-resort and regenerative farm in Maanhaarrand, North West Province — heritage trails, hemp training academy, farm experiences, and the Revival Hub shop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ClientProviders>
            <ScrollToTop />
            <RevealOnScroll />
            <Nav />
            {children}
            <Footer />
            <ChatWidget />
          </ClientProviders>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
