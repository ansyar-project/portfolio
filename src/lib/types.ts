export type Profile = {
  name: string;
  title: string;
  bio?: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  image?: string;
};

export interface Skill {
  id: string;
  name: string;
  level: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Stack {
  id: string;
  name: string;
  projectId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  live: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  stacks: Stack[];
};

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}
