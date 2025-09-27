"use client";

import Link from "next/link";
import { FC } from "react";

import { cn } from "@plane/utils";

type LegalFooterProps = {
  className?: string;
};

const AGPL_LICENSE_URL = "https://www.gnu.org/licenses/agpl-3.0.en.html";
const SOURCE_CODE_URL = "https://github.com/makeplane/plane";

export const LegalFooter: FC<LegalFooterProps> = ({ className }) => (
  <footer
    className={cn(
      "flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-custom-border-200/60 bg-custom-background-100/90 px-6 py-3 text-xs text-custom-text-300 backdrop-blur",
      className
    )}
    role="contentinfo"
  >
    <span className="text-center">
      Released under the{" "}
      <Link
        href={AGPL_LICENSE_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-custom-text-200 underline decoration-custom-text-200/60 underline-offset-2 transition-colors hover:text-custom-text-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-custom-background-100"
      >
        GNU Affero General Public License v3.0
      </Link>
      .
    </span>
    <span className="text-center">
      <Link
        href={SOURCE_CODE_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-custom-text-200 underline decoration-custom-text-200/60 underline-offset-2 transition-colors hover:text-custom-text-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-custom-background-100"
      >
        Source
      </Link>
    </span>
  </footer>
);

export default LegalFooter;
