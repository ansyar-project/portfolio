import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { prisma } from "./prisma";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
}

/**
 * Log an admin action for audit purposes (persistent database storage)
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

    await prisma.auditLog.create({
      data: {
        userId: session.user.email || session.user.name || "unknown",
        action,
        resource,
        resourceId,
        details: details ? JSON.stringify(details) : undefined,
        // Note: In a real app, you'd get these from request headers
        userAgent: "admin-dashboard",
        ip: "localhost",
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
    // Don't throw - audit logging shouldn't break the main operation
  }
}

/**
 * Get audit logs with pagination (from database)
 */
export async function getAuditLogs(
  limit: number = 50,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
    });

    return logs.map((log) => ({
      ...log,
      resourceId: log.resourceId ?? undefined,
      details: log.details ? JSON.parse(log.details as string) : undefined,
      userAgent: log.userAgent ?? undefined,
      ip: log.ip ?? undefined,
    }));
  } catch (error) {
    console.error("Failed to get audit logs:", error);
    return [];
  }
}

/**
 * Get audit logs for a specific resource (from database)
 */
export async function getResourceAuditLogs(
  resource: string,
  resourceId?: string,
  limit: number = 20
): Promise<AuditLogEntry[]> {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        resource,
        resourceId: resourceId || undefined,
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return logs.map((log) => ({
      ...log,
      resourceId: log.resourceId ?? undefined,
      userAgent: log.userAgent ?? undefined,
      ip: log.ip ?? undefined,
      details: log.details ? JSON.parse(log.details as string) : undefined,
    }));
  } catch (error) {
    console.error("Failed to get resource audit logs:", error);
    return [];
  }
}
