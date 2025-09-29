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

// Initializes the Kalam font for use throughout the application.
const kalamFont = Kalam({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

/**
 * The root layout for the entire application.
 * This component sets up the basic HTML structure, applies global fonts and styles,
 * and wraps the content in a `ThemeProvider` to enable light and dark mode.
 * It also includes the main application header.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kalamFont.className} antialiased`}>
        {/* ThemeProvider handles the application's light and dark modes. */}
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
