import { FC, ReactNode } from "react";
import { cn } from "@plane/utils";

import { LegalFooter } from "@/components/global";

type Props = {
  children: ReactNode;
  gradient?: boolean;
  className?: string;
};

const DefaultLayout: FC<Props> = ({ children, gradient = false, className }) => (
  <div
    className={cn(
      `flex h-screen w-full flex-col overflow-hidden ${gradient ? "" : "bg-custom-background-100"}`,
      className
    )}
  >
    <div className="flex-1">{children}</div>
    <LegalFooter className="mt-auto" />
  </div>
);

export default DefaultLayout;
