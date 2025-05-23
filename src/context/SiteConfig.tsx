"use client";
import { createContext, useContext } from "react";
import { SiteSettings } from "../types";
import { DEFAULT_SETTINGS } from "../lib/queries/settings/config";

export const SiteConfigContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteConfigProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig: SiteSettings;
}) {
  return (
    <SiteConfigContext.Provider
      value={{ ...DEFAULT_SETTINGS, ...initialConfig }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}
export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }

  return context;
};
