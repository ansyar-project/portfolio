import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.projectStack.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.profile.deleteMany();

  // Profile
  await prisma.profile.create({
    data: {
      name: "Muhammad Ansyar Rafi Putra",
      title: "Full Stack Developer/Data Expert/DevOps",
      bio: "Passionate developer with a love for building web applications, data dashboards, and DevOps practices.",
      location: "Melbourne, Australia",
      email: "m.ansyarafi@gmail.com",
      github: "mansyar",
      linkedin: "muhammad-ansyar-rafi-putra-904a75157",
    },
  });

  // Skills
  await prisma.skill.createMany({
    data: [
      { name: "JavaScript", level: "Advanced" },
      { name: "TypeScript", level: "Intermediate" },
      { name: "React", level: "Intermediate" },
      { name: "Next.js", level: "Intermediate" },
      { name: "Tailwind CSS", level: "Intermediate" },
      { name: "Node.js", level: "Intermediate" },
      { name: "Prisma", level: "Intermediate" },
      { name: "SQL", level: "Advanced" },
      { name: "Python", level: "Advanced" },
      { name: "Docker", level: "Advanced" },
      { name: "Git", level: "Advanced" },
      { name: "CI/CD", level: "Intermediate" },
      { name: "Agile Methodologies", level: "Intermediate" },
      { name: "Data Analysis", level: "Intermediate" },
      { name: "Machine Learning", level: "Intermediate" },
      { name: "Cloud Computing", level: "Intermediate" },
      { name: "DevOps Practices", level: "Intermediate" },
    ],
  });
  // Projects
  const project1 = await prisma.project.create({
    data: {
      title: "Personal Portfolio",
      description: "A portfolio website to showcase my projects and skills.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&crop=entropy&auto=format&q=80",
      github: "https://github.com/ansyar-project/portfolio",
      live: "https://ansyar-world.top",
      stacks: {
        create: [
          { name: "Next.js" },
          { name: "React" },
          { name: "Tailwind CSS" },
          { name: "Prisma" },
          { name: "TypeScript" },
          { name: "Docker" },
          { name: "Coolify" },
          { name: "SQLite" },
        ],
      },
    },
    include: { stacks: true },
  });
  const project2 = await prisma.project.create({
    data: {
      title: "Family Expense Tracker",
      description: "A web app to track family expenses and budgets.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop&crop=entropy&auto=format&q=80",
      github: "https://github.com/ansyar-project/family-expense-tracker",
      live: "https://family-expense-tracker.ansyar-world.top",
      stacks: {
        create: [
          { name: "React" },
          { name: "Next.js" },
          { name: "SQLite" },
          { name: "Prisma" },
          { name: "Tailwind CSS" },
          { name: "TypeScript" },
          { name: "Docker" },
          { name: "Coolify" },
        ],
      },
    },
    include: { stacks: true },
  });

  // Portfolio Items
  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Not an Apple Landing Page",
        description: "A landing page inspired by Apple's design.",
        image: "/images/not-an-apple.png",
        link: "https://not-an-apple.ansyar-world.top",
        createdAt: new Date(),
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding complete!");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
