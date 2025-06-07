import React from "react";
import { Profile, Project, Skill } from "@/lib/types";

interface StructuredDataProps {
  profile?: Profile;
  projects?: Project[];
  skills?: Skill[];
}

const StructuredData: React.FC<StructuredDataProps> = ({
  profile,
  projects,
  skills,
}) => {
  // Generate Person structured data
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name || "Muhammad Ansyar Rafi Putra",
    jobTitle: "Full Stack Developer",
    description:
      profile?.bio ||
      "Full Stack Developer, Data Expert, and DevOps professional",
    url: "https://ansyar-world.top",
    image: profile?.image
      ? `https://ansyar-world.top${profile.image}`
      : "https://ansyar-world.top/og-image.png",
    sameAs: [
      profile?.github ? `https://github.com/${profile.github}` : null,
      profile?.linkedin ? `https://linkedin.com/in/${profile.linkedin}` : null,
    ].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: profile?.location?.split(",")[0] || "Melbourne",
      addressRegion: profile?.location?.split(",")[1]?.trim() || "Victoria",
      addressCountry: "Australia",
    },
    knowsAbout: skills?.map((skill) => skill.name) || [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Full Stack Development",
    ],
    email: "m.ansyarafi@gmail.com",
    worksFor: {
      "@type": "Organization",
      name: "Freelance Developer",
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: {
        "@type": "City",
        name: "Melbourne, Australia",
      },
      skills:
        skills?.map((skill) => skill.name).join(", ") ||
        "JavaScript, TypeScript, React, Next.js",
    },
  };

  // Generate Creative Work structured data for projects
  const projectsData =
    projects?.map((project) => ({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      author: {
        "@type": "Person",
        name: profile?.name || "Muhammad Ansyar Rafi Putra",
      },
      dateCreated: project.createdAt,
      url: project.github,
      image: project.image
        ? `https://ansyar-world.top${project.image}`
        : undefined,
      programmingLanguage: project.stacks?.map((stack) => stack.name) || [],
      creator: {
        "@type": "Person",
        name: profile?.name || "Muhammad Ansyar Rafi Putra",
      },
    })) || [];

  // Generate Professional Service structured data
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Full Stack Development Services",
    provider: {
      "@type": "Person",
      name: profile?.name || "Muhammad Ansyar Rafi Putra",
    },
    serviceType: "Web Development",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Stack Web Development",
            description:
              "Complete web application development using modern technologies",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Frontend Development",
            description: "React, Next.js, and TypeScript frontend development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Backend Development",
            description: "Node.js, Python, and database development",
          },
        },
      ],
    },
  };

  return (
    <>
      {/* Person Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personData),
        }}
      />

      {/* Projects Portfolio Structured Data */}
      {projectsData.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Portfolio Projects",
              description: "Collection of web development projects",
              numberOfItems: projectsData.length,
              itemListElement: projectsData.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: project,
              })),
            }),
          }}
        />
      )}

      {/* Professional Service Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceData),
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://ansyar-world.top",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://ansyar-world.top/#about",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Skills",
                item: "https://ansyar-world.top/#skills",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Projects",
                item: "https://ansyar-world.top/#projects",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "Portfolio",
                item: "https://ansyar-world.top/#portfolio",
              },
              {
                "@type": "ListItem",
                position: 6,
                name: "Contact",
                item: "https://ansyar-world.top/#contact",
              },
            ],
          }),
        }}
      />
    </>
  );
};

export default StructuredData;
