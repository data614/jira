"use server";

import { logger } from "@plane/logger";

import { fetchAnchorMetadata } from "@/lib/server/fetch-anchor-metadata";

import { IssuesClientLayout } from "./client-layout";

type Props = {
  children: React.ReactNode;
  params: {
    anchor: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const { anchor } = params;
  const DEFAULT_TITLE = "Plane";
  const DEFAULT_DESCRIPTION = "Made with Plane, an AI-powered work management platform with publishing capabilities.";
  try {
    const data = await fetchAnchorMetadata(anchor);
    const title = data?.name || DEFAULT_TITLE;
    const description = data?.description || DEFAULT_DESCRIPTION;
    const coverImage = data?.cover_image;

    const openGraphImages = coverImage
      ? [
          {
            url: coverImage,
            width: 800,
            height: 600,
            alt: title,
          },
        ]
      : [];

    const twitterImages = coverImage ? [coverImage] : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: openGraphImages,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: twitterImages,
      },
    };
  } catch (error) {
    logger.error(
      `[metadata] Falling back to defaults for anchor "${anchor}": ${error instanceof Error ? error.message : String(error)}`
    );
    return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  }
}

export default async function IssuesLayout(props: Props) {
  const { children, params } = props;
  const { anchor } = params;

  return <IssuesClientLayout anchor={anchor}>{children}</IssuesClientLayout>;
}
