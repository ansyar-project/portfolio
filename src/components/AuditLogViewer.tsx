"use client";
import React, { useState, useEffect } from "react";
import { getAuditLogsAction } from "@/lib/auditActions";
import type { AuditLogEntry } from "@/lib/auditLogDb";

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const auditLogs = await getAuditLogsAction(100);
        setLogs(auditLogs);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
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
        return "text-green-600 bg-green-100";
      case "UPDATE":
        return "text-blue-600 bg-blue-100";
      case "DELETE":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Recent Admin Actions</h3>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by resource, action, or user..."
          className="border rounded px-3 py-2 w-full max-w-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No audit logs found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Resource</th>
                  <th className="px-4 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-2 font-medium">{log.userId}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {log.resource}
                      {log.resourceId && (
                        <span className="text-gray-500 text-xs ml-1">
                          ({log.resourceId.substring(0, 8)}...)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600 text-xs max-w-xs truncate">
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
