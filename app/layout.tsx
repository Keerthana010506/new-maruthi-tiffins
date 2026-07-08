import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "New Maruthi Tiffins | Fresh Tiffins & Online Ordering",
  description:
    "Official website of New Maruthi Tiffins. Browse today's menu, place orders online and enjoy fresh homemade tiffins.",
  keywords: [
    "New Maruthi Tiffins",
    "Maruthi Tiffins",
    "Warangal Tiffins",
    "Breakfast",
    "Online Food Ordering",
    "South Indian Tiffins"
  ],
  authors: [
    {
      name: "New Maruthi Tiffins",
    },
  ],
  creator: "New Maruthi Tiffins",

  openGraph: {
    title: "New Maruthi Tiffins",
    description:
      "Official website of New Maruthi Tiffins.",
    url: "https://new-maruthi-tiffins.vercel.app",
    siteName: "New Maruthi Tiffins",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
