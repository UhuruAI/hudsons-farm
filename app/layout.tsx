import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ClientProviders from "@/components/ClientProviders";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Hudson's Farm | Organic & Regenerative",
  description:
    "12 hectares of organic hemp, gourmet mushrooms, microgreens, and fresh produce in Magaliesburg, South Africa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ClientProviders>
            <ScrollToTop />
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
