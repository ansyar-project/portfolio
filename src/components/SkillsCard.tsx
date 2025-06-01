import React from "react";

type Skill = {
  id: string;
  name: string;
  level: string;
};

export default function SkillsCard({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="px-2">
      {/* <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
        Skills
      </h2> */}
      <ul className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {skills.map((skill) => (
          <li
            key={skill.id}
            className="bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow text-blue-800 dark:text-blue-200 font-medium text-xs sm:text-sm"
          >
            {skill.name}{" "}
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              ({skill.level})
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
