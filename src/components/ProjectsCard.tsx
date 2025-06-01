import React from "react";

type Stack = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  github?: string;
  live?: string;
  stacks?: Stack[];
};

export default function ProjectsCard({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="px-2">
      {/* <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
        Projects
      </h2> */}
      <ul className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 sm:p-6 flex flex-col gap-2 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-base sm:text-lg text-blue-700 dark:text-blue-300">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {project.description}
            </p>
            {project.stacks && project.stacks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.stacks.map((stack) => (
                  <span
                    key={stack.id}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs"
                  >
                    {stack.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-4 mt-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black dark:hover:text-white underline text-xs sm:text-sm"
                >
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 underline text-xs sm:text-sm"
                >
                  Live
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
