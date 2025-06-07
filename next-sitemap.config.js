/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://ansyar-world.top",
  generateRobotsTxt: false, // We have our own robots.ts
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/admin/*", "/api/*", "/login", "/debug/*", "/test/*", "/_next/*"],
  transform: async (config, path) => {
    // Custom priority and changefreq for specific paths
    const customConfig = {
      "/": { priority: 1.0, changefreq: "weekly" },
      "/#about": { priority: 0.9, changefreq: "monthly" },
      "/#skills": { priority: 0.9, changefreq: "monthly" },
      "/#projects": { priority: 0.9, changefreq: "weekly" },
      "/#portfolio": { priority: 0.8, changefreq: "weekly" },
      "/#contact": { priority: 0.8, changefreq: "monthly" },
    };

    return {
      loc: path,
      changefreq: customConfig[path]?.changefreq || config.changefreq,
      priority: customConfig[path]?.priority || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/_next/",
          "/debug/",
          "/test/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login"],
      },
    ],
    additionalSitemaps: ["https://ansyar-world.top/sitemap.xml"],
  },
};
