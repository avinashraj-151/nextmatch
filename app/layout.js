import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/component/TopNav";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextMatch",
  description: "Dating app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden flex flex-col overscroll-none">
        <TopNav />
        <div className="premium-scrollbar flex-1 min-h-0 overflow-y-auto flex flex-col relative">
          {children}
        </div>
        <Toaster closeButton />
      </body>
    </html>
  );
}
