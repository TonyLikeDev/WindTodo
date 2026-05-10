import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WindTodo",
  description: "A monochrome glassmorphism task manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="text-gray-300 min-h-screen" suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }} />
      </body>
    </html>
  );
}
