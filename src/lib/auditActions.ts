"use server";

import { getAuditLogs as getAuditLogsFromDb } from "@/lib/auditLogDb";

export async function getAuditLogsAction(
  limit: number = 50,
  offset: number = 0
) {
  return await getAuditLogsFromDb(limit, offset);
}
