import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
    "HanamkondaTiffins",
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

  // 👇 ADD THIS
  verification: {
    google: "5SsVl3hAM_miPCKRdPjlzpbqDY0T1EueRF1ZuICMhyU",
  },

  openGraph: {
  title: "New Maruthi Tiffins | Fresh Tiffins & Online Ordering",
  description:
    "Official website of New Maruthi Tiffins. Browse today's menu and order fresh South Indian tiffins online.",
  url: "https://new-maruthi-tiffins.vercel.app",
  siteName: "New Maruthi Tiffins",
  images: [
    {
      url: "/images/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "New Maruthi Tiffins",
    },
  ],
  locale: "en_IN",
  type: "website",
},

twitter: {
  card: "summary_large_image",
  title: "New Maruthi Tiffins | Fresh Tiffins & Online Ordering",
  description:
    "Order fresh South Indian breakfast online from New Maruthi Tiffins.",
  images: ["/images/og-image.jpg"],
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

  const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "New Maruthi Tiffins",
  "image": "https://new-maruthi-tiffins.vercel.app/images/og-image.jpg",
  url: "https://new-maruthi-tiffins.vercel.app",
  telephone: "",
  servesCuisine: "South Indian",
  priceRange: "₹",
  openingHours: "Mo-Su 06:00-14:00",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hanamkonda",
    addressRegion: "Telangana",
    addressCountry: "IN"
  }
};

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
   <Script
  id="restaurant-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(restaurantSchema),
  }}
/>
{children}
      </body>
    </html>
  );
}
