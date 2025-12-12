import React from "react";
import { loadPortfolioData } from "@/lib/utils";
import PortfolioForm from "@/components/PortfolioForm";

export default async function AdminPortfolioPage() {
  const { portfolioItems, error } = await loadPortfolioData();

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
          ❌ Error Loading Data
        </h2>
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Portfolio
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your portfolio items ({portfolioItems?.length || 0} items)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <PortfolioForm items={portfolioItems || []} />
      </div>
    </div>
  );
}
