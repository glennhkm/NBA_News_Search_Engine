import type { Metadata } from "next";
import "./globals.css";
import { geistSans } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NBA News Search Engine",
  description: "NBA News Search Engine Team 7",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased relative h-full w-full bg-[#151515]`}
      >
        <Link href="/" className="w-20 h-32 fixed top-12 left-6 z-[45]">
          <Image
            src="/images/nba-logo.png"
            fill
            alt="logo"
            sizes="30%"
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="h-screen w-screen -z-10 fixed top-0 left-0">
          <Image
            src="/images/iconic.jpg"
            fill
            alt="main-bg"
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div className="fixed right-8 flex flex-col text-sm text-white/40 top-14 z-[100]">
          <p>Copyright © 2024 | Kelompok 7</p>
          <div className="bg-white/20 h-[0.8px] w-full my-2.5"></div>
          <p>Information Retrieval Final Project</p>
        </div>
        <div className="w-screen h-screen bg-gradient-to-t from-[#151515]/95 via-[#151515]/80 -z-[5] via-70% to-[#151515]/40 fixed top-0 left-0"></div>
        {children}
      </body>
    </html>
  );
}
