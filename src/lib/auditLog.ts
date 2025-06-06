import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export interface AuditLogEntry {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
}

// In-memory storage for audit logs (in production, use a database)
const auditLogs: AuditLogEntry[] = [];

/**
 * Log an admin action for audit purposes
 */
export async function logAdminAction(
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return;

    const logEntry: AuditLogEntry = {
      timestamp: new Date(),
      userId: session.user.name || "unknown",
      action,
      resource,
      resourceId,
      details,
    };

    auditLogs.push(logEntry);

    // Keep only last 1000 entries to prevent memory issues
    if (auditLogs.length > 1000) {
      auditLogs.splice(0, auditLogs.length - 1000);
    }

    console.log(
      `[AUDIT] ${action} on ${resource}${
        resourceId ? ` (${resourceId})` : ""
      } by ${logEntry.userId}`
    );
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}

/**
 * Get recent audit logs (for admin dashboard)
 */
export function getAuditLogs(limit: number = 50): AuditLogEntry[] {
  return auditLogs.slice(-limit).reverse(); // Most recent first
}

/**
 * Get audit logs for a specific resource
 */
export function getResourceAuditLogs(
  resource: string,
  resourceId?: string
): AuditLogEntry[] {
  return auditLogs
    .filter(
      (log) =>
        log.resource === resource &&
        (!resourceId || log.resourceId === resourceId)
    )
    .reverse(); // Most recent first
}
