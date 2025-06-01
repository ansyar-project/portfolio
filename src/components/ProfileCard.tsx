import React from "react";

type Profile = {
  name?: string;
  title?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <section
      id="profile"
      className="flex flex-col items-center text-center gap-3 sm:gap-4 px-2"
    >
      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg mb-3 sm:mb-4">
        {profile?.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        {profile?.name}
      </h1>
      <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-semibold">
        {profile?.title}
      </p>
      <p className="max-w-xs sm:max-w-xl text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        {profile?.bio}
      </p>
      <div className="flex gap-4 mt-2">
        {profile?.github && (
          <a
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black dark:hover:text-white transition"
            title="GitHub"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
          </a>
        )}
        {profile?.linkedin && (
          <a
            href={`https://linkedin.com/in/${profile.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 dark:hover:text-blue-400 transition"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v4.75z" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
