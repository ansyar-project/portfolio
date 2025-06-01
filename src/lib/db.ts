import { prisma } from "./prisma";

// --- Profile ---
export async function getProfile() {
  return prisma.profile.findFirst();
}

export async function updateProfile(
  data: Partial<Parameters<typeof prisma.profile.update>[0]["data"]>
) {
  const profile = await prisma.profile.findFirst();
  if (!profile) throw new Error("Profile not found");
  return prisma.profile.update({
    where: { id: profile.id },
    data,
  });
}

// --- Skills ---
export async function getSkills() {
  return prisma.skill.findMany();
}

export async function addSkill(data: { name: string; level: string }) {
  return prisma.skill.create({ data });
}

export async function updateSkill(
  id: string,
  data: Partial<{ name: string; level: string }>
) {
  return prisma.skill.update({ where: { id }, data });
}

export async function deleteSkill(id: string) {
  return prisma.skill.delete({ where: { id } });
}

// --- Projects ---
export async function getProjects() {
  return prisma.project.findMany({ include: { stacks: true } });
}

export async function addProject(data: {
  title: string;
  description: string;
  github?: string;
  live?: string;
  stacks?: { name: string }[];
}) {
  return prisma.project.create({
    data: {
      ...data,
      stacks: data.stacks ? { create: data.stacks } : undefined,
    },
    include: { stacks: true },
  });
}

export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    github?: string;
    live?: string;
  }>
) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

// --- Portfolio Items ---
export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany();
}

export async function addPortfolioItem(data: {
  title: string;
  description: string;
  image?: string;
  link?: string;
}) {
  return prisma.portfolioItem.create({ data });
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    image?: string;
    link?: string;
  }>
) {
  return prisma.portfolioItem.update({ where: { id }, data });
}

export async function deletePortfolioItem(id: string) {
  return prisma.portfolioItem.delete({ where: { id } });
}
