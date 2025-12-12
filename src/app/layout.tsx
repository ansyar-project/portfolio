import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

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
    "JavaScript Developer",
    "Web Developer Melbourne",
    "React Developer",
    "Node.js Developer",
    "Database Design",
    "API Development",
    "Responsive Design",
    "UI/UX",
    "Modern Web Technologies",
    "Cloud Computing",
    "Docker",
    "Prisma",
    "SQL",
    "Python Developer",
    "Machine Learning",
  ],
  authors: [{ name: "Muhammad Ansyar Rafi Putra" }],
  creator: "Muhammad Ansyar Rafi Putra",
  publisher: "Muhammad Ansyar Rafi Putra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://ansyar-world.top",
    languages: {
      "en-US": "https://ansyar-world.top",
    },
  },
  openGraph: {
    title:
      "Muhammad Ansyar Rafi Putra | Full Stack Developer, Data Expert, DevOps",
    description:
      "Portfolio of Muhammad Ansyar Rafi Putra – Full Stack Developer, Data Expert, and DevOps. Explore projects, skills, and professional experience in web development, data dashboards, and DevOps practices.",
    url: "https://ansyar-world.top/",
    siteName: "Ansyar's Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://ansyar-world.top/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Ansyar Rafi Putra - Full Stack Developer Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ansyar Rafi Putra | Full Stack Developer",
    description:
      "Full Stack Developer, Data Expert, and DevOps professional from Melbourne, Australia. Specializing in React, Next.js, TypeScript, and modern web technologies.",
    images: ["https://ansyar-world.top/og-image.png"],
    creator: "@ansyar_dev", // Add your Twitter handle if you have one
  },
  category: "Technology",
  classification: "Portfolio Website",
  metadataBase: new URL("https://ansyar-world.top"),
  other: {
    "theme-color": "#10b981", // Emerald color matching your design
    "color-scheme": "dark light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Ansyar's Portfolio",
    "application-name": "Ansyar's Portfolio",
    "msapplication-TileColor": "#10b981",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="https://ansyar-world.top" />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Ansyar Rafi Putra",
              jobTitle: "Full Stack Developer",
              description:
                "Full Stack Developer, Data Expert, and DevOps professional specializing in modern web technologies",
              url: "https://ansyar-world.top",
              sameAs: [
                "https://github.com/ansyar", // Update with actual GitHub
                "https://linkedin.com/in/ansyar", // Update with actual LinkedIn
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Melbourne",
                addressRegion: "Victoria",
                addressCountry: "Australia",
              },
              knowsAbout: [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Python",
                "Full Stack Development",
                "Data Science",
                "DevOps",
                "Web Development",
                "Database Design",
                "API Development",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Freelance Developer",
              },
            }),
          }}
        />

        {/* Website/Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Muhammad Ansyar Rafi Putra Portfolio",
              alternateName: "Ansyar's Portfolio",
              url: "https://ansyar-world.top",
              description:
                "Portfolio website showcasing full stack development projects, skills, and professional experience",
              inLanguage: "en-US",
              isAccessibleForFree: true,
              author: {
                "@type": "Person",
                name: "Muhammad Ansyar Rafi Putra",
              },
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://ansyar-world.top/#search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
