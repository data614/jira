import "server-only";

import { logger } from "@plane/logger";

import { CacheTag } from "@/lib/cache/tags";

const DEFAULT_REVALIDATE_SECONDS = Number(process.env.SPACE_ANCHOR_METADATA_REVALIDATE ?? 300);

export type AnchorMetadata = {
  name?: string;
  description?: string;
  cover_image?: string;
};

const sanitizeBaseUrl = (url: string) => url.replace(/\/$/, "");

export const fetchAnchorMetadata = async (anchor: string): Promise<AnchorMetadata | null> => {
  if (!anchor) {
    throw new Error("Anchor must be provided to fetch metadata.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const url = `${sanitizeBaseUrl(baseUrl)}/api/public/anchor/${anchor}/meta/`;

  try {
    const response = await fetch(url, {
      // Force ISR caching with explicit revalidation and tagging for selective invalidation.
      next: {
        revalidate: Number.isFinite(DEFAULT_REVALIDATE_SECONDS) ? DEFAULT_REVALIDATE_SECONDS : 300,
        tags: [CacheTag.anchorMetadata(anchor)],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata. Status: ${response.status}`);
    }

    const payload = (await response.json()) as AnchorMetadata | null;
    return payload;
  } catch (error) {
    logger.error(
      `[anchor-metadata] Unable to fetch metadata for anchor "${anchor}": ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
};
