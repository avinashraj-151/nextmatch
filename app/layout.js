import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/component/TopNav";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/schemas/auth";
import { AvatarProvider } from "@/app/_providers/AvatarProvider";

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

export default async function RootLayout({ children }) {
  const session = await auth();
  const initialAvatar = session?.user?.image ?? null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden flex flex-col overscroll-none">
        <AvatarProvider initialAvatar={initialAvatar}>
          <TopNav />
          <div className="premium-scrollbar flex-1 min-h-0 overflow-y-auto flex flex-col relative">
            {children}
          </div>
        </AvatarProvider>
        <Toaster closeButton />
      </body>
    </html>
  );
}
