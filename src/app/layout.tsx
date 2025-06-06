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
  title:
    "Muhammad Ansyar Rafi Putra | Full Stack Developer, Data Expert, DevOps",
  description:
    "Portfolio of Muhammad Ansyar Rafi Putra – Full Stack Developer, Data Expert, and DevOps. Explore projects, skills, and professional experience in web development, data dashboards, and DevOps practices.",
  keywords: [
    "Muhammad Ansyar Rafi Putra",
    "Full Stack Developer",
    "Data Expert",
    "DevOps",
    "Portfolio",
    "Web Development",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Projects",
    "Skills",
    "Melbourne",
    "Australia",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Muhammad Ansyar Rafi Putra" }],
  creator: "Muhammad Ansyar Rafi Putra",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "Muhammad Ansyar Rafi Putra | Full Stack Developer, Data Expert, DevOps",
    description:
      "Portfolio of Muhammad Ansyar Rafi Putra – Full Stack Developer, Data Expert, and DevOps. Explore projects, skills, and professional experience in web development, data dashboards, and DevOps practices.",
    url: "https://ansyar-world.top/",
    siteName: "Ansyar's Portfolio",
    images: [
      {
        url: "https://ansyar-world.top/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Ansyar Rafi Putra Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ansyar Rafi Putra | Full Stack Developer",
    description:
      "Full Stack Developer, Data Expert, and DevOps professional from Melbourne, Australia",
    images: ["https://ansyar-world.top/og-image.png"],
  },

  metadataBase: new URL("https://ansyar-world.top"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
