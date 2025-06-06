"use client";
import React, { useState, useEffect } from "react";
import { getAuditLogsAction } from "@/lib/auditActions";
import type { AuditLogEntry } from "@/lib/auditLogDb";

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const auditLogs = await getAuditLogsAction(100);
        setLogs(auditLogs);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      filter === "" ||
      log.resource.toLowerCase().includes(filter.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.userId.toLowerCase().includes(filter.toLowerCase())
  );

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };
  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700";
      case "UPDATE":
        return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700";
      case "DELETE":
        return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700";
      default:
        return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600";
    }
  };
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Recent Admin Actions
      </h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by resource, action, or user..."
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full max-w-md bg-background text-foreground placeholder-gray-500 dark:placeholder-gray-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="bg-background border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
              No audit logs found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 font-medium">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 font-medium">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 font-medium">
                    Action
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 font-medium">
                    Resource
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-100 font-medium">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {log.userId}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      {log.resource}
                      {log.resourceId && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({log.resourceId.substring(0, 8)}...)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-xs max-w-xs truncate">
                      {log.details
                        ? JSON.stringify(log.details).substring(0, 50) + "..."
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
