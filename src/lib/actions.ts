"use server";

import {
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "./db";

// --- Profile Actions ---
export async function getProfileAction() {
  return getProfile();
}

export async function updateProfileAction(
  data: Parameters<typeof updateProfile>[0]
) {
  return updateProfile(data);
}

// --- Skill Actions ---
export async function getSkillsAction() {
  return getSkills();
}

export async function addSkillAction(data: Parameters<typeof addSkill>[0]) {
  return addSkill(data);
}

export async function updateSkillAction(
  id: string,
  data: Parameters<typeof updateSkill>[1]
) {
  return updateSkill(id, data);
}

export async function deleteSkillAction(id: string) {
  return deleteSkill(id);
}

// --- Project Actions ---
export async function getProjectsAction() {
  return getProjects();
}

export async function addProjectAction(data: Parameters<typeof addProject>[0]) {
  return addProject(data);
}

export async function updateProjectAction(
  id: string,
  data: Parameters<typeof updateProject>[1]
) {
  return updateProject(id, data);
}

export async function deleteProjectAction(id: string) {
  return deleteProject(id);
}

// --- PortfolioItem Actions ---
export async function getPortfolioItemsAction() {
  return getPortfolioItems();
}

export async function addPortfolioItemAction(
  data: Parameters<typeof addPortfolioItem>[0]
) {
  return addPortfolioItem(data);
}

export async function updatePortfolioItemAction(
  id: string,
  data: Parameters<typeof updatePortfolioItem>[1]
) {
  return updatePortfolioItem(id, data);
}

export async function deletePortfolioItemAction(id: string) {
  return deletePortfolioItem(id);
}
