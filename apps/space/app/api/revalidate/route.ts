import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { logger } from "@plane/logger";

import { isCacheTagValue } from "@/lib/cache/tags";

export const runtime = "nodejs";

const resolveSecret = () => process.env.REVALIDATION_SECRET || process.env.REVALIDATE_SECRET;

type RevalidatePayload = {
  secret?: string;
  tag?: string;
  tags?: string[];
  path?: string;
  paths?: string[];
};

const normalizeTags = (payload: RevalidatePayload): string[] => {
  const candidateTags = [payload.tag, ...(payload.tags ?? [])].filter(Boolean) as string[];
  const unique = new Set<string>();

  for (const tag of candidateTags) {
    if (isCacheTagValue(tag)) {
      unique.add(tag);
    }
  }

  return Array.from(unique);
};

const normalizePaths = (payload: RevalidatePayload): string[] => {
  const candidatePaths = [payload.path, ...(payload.paths ?? [])].filter(Boolean) as string[];
  const unique = new Set<string>();

  for (const path of candidatePaths) {
    if (typeof path === "string" && path.startsWith("/")) {
      unique.add(path);
    }
  }

  return Array.from(unique);
};

export async function POST(request: Request) {
  let payload: RevalidatePayload;

  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch (error) {
    logger.warn(`[revalidate] Invalid JSON payload: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const secret = resolveSecret();
  if (!secret) {
    logger.error("[revalidate] Revalidation secret is not configured.");
    return NextResponse.json({ error: "Revalidation secret not configured" }, { status: 500 });
  }

  if (!payload?.secret || payload.secret !== secret) {
    return NextResponse.json({ error: "Invalid revalidation secret" }, { status: 401 });
  }

  const tags = normalizeTags(payload);
  const paths = normalizePaths(payload);

  if (!tags.length && !paths.length) {
    return NextResponse.json({ error: "No valid tags or paths provided" }, { status: 400 });
  }

  const revalidated = { tags: [] as string[], paths: [] as string[] };

  for (const tag of tags) {
    try {
      await revalidateTag(tag);
      revalidated.tags.push(tag);
    } catch (error) {
      logger.error(`[revalidate] Failed to revalidate tag "${tag}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  for (const path of paths) {
    try {
      await revalidatePath(path);
      revalidated.paths.push(path);
    } catch (error) {
      logger.error(
        `[revalidate] Failed to revalidate path "${path}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  logger.info(
    `[revalidate] Completed revalidation request. Tags: [${revalidated.tags.join(", ")}] Paths: [${revalidated.paths.join(", ")}]`
  );

  return NextResponse.json({
    revalidated,
    receivedAt: new Date().toISOString(),
  });
}
