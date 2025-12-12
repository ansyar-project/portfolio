import React from "react";
import AuditLogViewer from "@/components/AuditLogViewer";

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audit Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View admin activity history
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <AuditLogViewer />
      </div>
    </div>
  );
}
