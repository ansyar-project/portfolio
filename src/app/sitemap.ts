import { MetadataRoute } from "next";
import {
  getProjectsAction,
  getPortfolioItemsAction,
  getProfileAction,
} from "@/lib/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ansyar-world.top";

  // Get the latest update date from profile for better cache control
  let lastProfileUpdate = new Date();
  try {
    const profile = await getProfileAction();
    if (profile?.updatedAt) {
      lastProfileUpdate = new Date(profile.updatedAt);
    }
  } catch (error) {
    console.error("Error fetching profile for sitemap:", error);
  }
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastProfileUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date("2024-01-01"), // Static date for admin routes
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
  try {
    // Get dynamic content
    const [projects, portfolioItems] = await Promise.all([
      getProjectsAction(),
      getPortfolioItemsAction(),
    ]); // Get the most recent update from projects and portfolio
    const projectDates = projects.map((p) => p.updatedAt || new Date());
    const portfolioDates = portfolioItems.map((p) => p.updatedAt || new Date());

    // Section-specific URLs for better SEO
    const sectionRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/#about`,
        lastModified: lastProfileUpdate,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#skills`,
        lastModified: lastProfileUpdate,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#projects`,
        lastModified:
          projectDates.length > 0
            ? new Date(Math.max(...projectDates.map((d) => d.getTime())))
            : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#portfolio`,
        lastModified:
          portfolioDates.length > 0
            ? new Date(Math.max(...portfolioDates.map((d) => d.getTime())))
            : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/#contact`,
        lastModified: lastProfileUpdate,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];

    return [...staticRoutes, ...sectionRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes with fallback section routes if dynamic content fails
    const fallbackSectionRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/#about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#skills`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#projects`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#portfolio`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/#contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];

    return [...staticRoutes, ...fallbackSectionRoutes];
  }
}
