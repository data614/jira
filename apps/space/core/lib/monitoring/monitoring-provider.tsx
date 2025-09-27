"use client";

import { FC, PropsWithChildren, useEffect } from "react";

import { appMonitor } from "./app-monitor";

type MonitoringProviderProps = PropsWithChildren<Record<string, never>>;

export const MonitoringProvider: FC<MonitoringProviderProps> = ({ children }) => {
  useEffect(() => {
    appMonitor.start();
    return () => {
      appMonitor.stop();
    };
  }, []);

  return <>{children}</>;
};

export default MonitoringProvider;
