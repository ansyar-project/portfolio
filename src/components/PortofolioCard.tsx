import React from "react";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
};

export default function PortofolioCard({ items }: { items: PortfolioItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="portfolio" className="px-2">
      {/* <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
        Portfolio
      </h2> */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {items.map((item) => (
          <li
            key={item.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-3 sm:p-4 flex flex-col gap-2 hover:shadow-lg transition"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="rounded mb-2 object-cover h-32 sm:h-40 w-full"
              />
            )}
            <div className="font-bold text-blue-700 dark:text-blue-300 text-base sm:text-lg">
              {item.title}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {item.description}
            </div>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 underline text-xs sm:text-sm mt-2"
              >
                View
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
