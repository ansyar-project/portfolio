export type Profile = {
  name: string;
  title: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  image?: string;
};

export type Skill = {
  id: string;
  name: string;
  level: string;
};

export type Stack = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  github?: string;
  live?: string;
  stacks?: Stack[];
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
};
