import type { Metadata } from 'next';
import { Kalam, Open_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/layout/Header';
import { ScrollbarProvider } from '@/components/layout/ScrollbarProvider';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Mindful Moments',
  description: 'A gratitude journaling app built with Next.js and Supabase.',
};

// Initializes the Kalam font for use throughout the application.
const openSans = Open_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: '400',
});

const kalam = Kalam({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
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
      <body className={`${openSans.className} ${kalam.variable} antialiased`}>
        <ScrollbarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex h-full min-h-dvh flex-col">
              <Header />
              <main className="flex flex-1 flex-col items-center py-[2rem] sm:container sm:mx-auto">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </ScrollbarProvider>
      </body>
    </html>
  );
}
