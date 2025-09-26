import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mindful Moments",
  description: "A gratitude journaling app built with Next.js and Supabase.",
};

const kalamFont = Kalam({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kalamFont.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-full min-h-dvh relative">
            <Header />
            <main className="sm:mx-auto sm:container flex-1 flex flex-col items-center py-[2rem]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
