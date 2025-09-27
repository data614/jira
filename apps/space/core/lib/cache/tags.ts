export const CacheTag = {
  anchorMetadata: (anchor: string) => `anchor:metadata:${anchor}`,
  anchorSettings: (anchor: string) => `anchor:settings:${anchor}`,
  anchorView: (anchor: string) => `anchor:view:${anchor}`,
} as const;

type CacheTagGenerators = typeof CacheTag;

export type CacheTagValue = ReturnType<CacheTagGenerators[keyof CacheTagGenerators]>;

export const isCacheTagValue = (value: unknown): value is CacheTagValue => {
  if (typeof value !== "string") return false;
  return value.startsWith("anchor:");
};
