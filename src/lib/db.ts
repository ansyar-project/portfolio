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
    stacks?: { name: string }[];
  }>
) {
  // Use transaction to handle both project and stacks update atomically
  return prisma.$transaction(async (tx) => {
    // If stacks are provided, replace all existing stacks
    if (data.stacks !== undefined) {
      // First delete all existing stacks
      await tx.projectStack.deleteMany({ where: { projectId: id } });

      // Create new stacks if any
      if (data.stacks.length > 0) {
        await tx.projectStack.createMany({
          data: data.stacks.map((stack) => ({
            name: stack.name,
            projectId: id,
          })),
        });
      }
    } // Update the project (exclude stacks from the data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { stacks: _, ...projectData } = data;
    const updatedProject = await tx.project.update({
      where: { id },
      data: projectData,
      include: { stacks: true },
    });

    return updatedProject;
  });
}

export async function deleteProject(id: string) {
  // Use transaction to ensure both project and stacks are deleted atomically
  return prisma.$transaction(async (tx) => {
    // First delete related stacks
    await tx.projectStack.deleteMany({ where: { projectId: id } });
    // Then delete the project
    return tx.project.delete({ where: { id } });
  });
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
