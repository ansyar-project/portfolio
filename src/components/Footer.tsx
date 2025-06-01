import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-6 mt-12 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
    </footer>
  );
}
