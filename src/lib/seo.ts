// SEO Configuration for Muhammad Ansyar Rafi Putra Portfolio
export const seoConfig = {
  // Basic site information
  siteName: "Ansyar's Portfolio",
  siteUrl: "https://ansyar-world.top",
  author: "Muhammad Ansyar Rafi Putra",

  // Default metadata
  defaultTitle:
    "Muhammad Ansyar Rafi Putra | Full Stack Developer, Data Expert, DevOps",
  titleTemplate: "%s | Ansyar's Portfolio",

  defaultDescription:
    "Portfolio of Muhammad Ansyar Rafi Putra – Full Stack Developer, Data Expert, and DevOps professional. Explore projects, skills, and professional experience in web development, data dashboards, and DevOps practices.",

  // Keywords for SEO
  keywords: [
    "Muhammad Ansyar Rafi Putra",
    "Full Stack Developer",
    "Data Expert",
    "DevOps",
    "Portfolio",
    "Web Development",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Python Developer",
    "JavaScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Web Developer Melbourne",
    "Australia Developer",
    "Freelance Developer",
    "Database Design",
    "API Development",
    "Responsive Design",
    "UI/UX Developer",
    "Modern Web Technologies",
    "Cloud Computing",
    "Docker",
    "Prisma",
    "SQL",
    "Machine Learning",
    "Data Analysis",
    "DevOps Practices",
    "Tailwind CSS",
    "Progressive Web Apps",
    "Mobile Development",
    "Performance Optimization",
    "SEO Expert",
  ],

  // Social media handles
  social: {
    twitter: "@ansyar_dev", // Update with actual handle
    github: "ansyar", // Update with actual username
    linkedin: "ansyar", // Update with actual username
  },

  // OpenGraph default settings
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ansyar's Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Ansyar Rafi Putra - Full Stack Developer Portfolio",
      },
    ],
  },

  // Twitter Card settings
  twitter: {
    card: "summary_large_image",
    creator: "@ansyar_dev", // Update with actual handle
  },

  // Additional SEO settings
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
    },
    {
      name: "theme-color",
      content: "#10b981",
    },
    {
      name: "color-scheme",
      content: "dark light",
    },
    {
      name: "mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    },
    {
      name: "apple-mobile-web-app-title",
      content: "Ansyar's Portfolio",
    },
    {
      name: "application-name",
      content: "Ansyar's Portfolio",
    },
    {
      name: "msapplication-TileColor",
      content: "#10b981",
    },
    {
      name: "format-detection",
      content: "telephone=no, email=no, address=no",
    },
  ],

  // Language and region settings
  languageAlternates: [
    {
      hrefLang: "en-US",
      href: "https://ansyar-world.top",
    },
    {
      hrefLang: "x-default",
      href: "https://ansyar-world.top",
    },
  ],

  // Schema.org structured data types
  structuredDataTypes: {
    person: true,
    website: true,
    organization: false,
    professionalService: true,
    creativeWork: true,
    breadcrumbs: true,
  },

  // Performance and Core Web Vitals
  performance: {
    preloadCriticalAssets: ["/og-image.png", "/favicon.ico"],
    prefetchDNS: ["//fonts.googleapis.com", "//fonts.gstatic.com"],
  },
};

// Helper function to generate page-specific metadata
export function generatePageMetadata(pageConfig: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}) {
  return {
    title: pageConfig.title || seoConfig.defaultTitle,
    description: pageConfig.description || seoConfig.defaultDescription,
    keywords: [...seoConfig.keywords, ...(pageConfig.keywords || [])],
    openGraph: {
      ...seoConfig.openGraph,
      title: pageConfig.title || seoConfig.defaultTitle,
      description: pageConfig.description || seoConfig.defaultDescription,
      url: pageConfig.url || seoConfig.siteUrl,
      images: pageConfig.image
        ? [
            {
              url: pageConfig.image,
              width: 1200,
              height: 630,
              alt: pageConfig.title || seoConfig.defaultTitle,
            },
          ]
        : seoConfig.openGraph.images,
    },
    twitter: {
      ...seoConfig.twitter,
      title: pageConfig.title || seoConfig.defaultTitle,
      description: pageConfig.description || seoConfig.defaultDescription,
      images: pageConfig.image
        ? [pageConfig.image]
        : seoConfig.openGraph.images.map((img) => img.url),
    },
  };
}

export default seoConfig;
