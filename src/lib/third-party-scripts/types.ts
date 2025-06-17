import { type ReactNode } from "react";

export const SCRIPT_POSITIONS = {
  HEAD_START: "head-start",
  HEAD_END: "head-end",
  BODY_START: "body-start",
  BODY_END: "body-end",
} as const;

export const SCRIPT_STRATEGIES = {
  BLOCKING: "beforeInteractive", // Blocks page rendering
  AFTER_INTERACTIVE: "afterInteractive", // After page is interactive
  LAZY: "lazyOnload", // During idle time
  WORKER: "worker", // In web worker
} as const;

export type ScriptPosition =
  (typeof SCRIPT_POSITIONS)[keyof typeof SCRIPT_POSITIONS];
export type ScriptStrategy =
  (typeof SCRIPT_STRATEGIES)[keyof typeof SCRIPT_STRATEGIES];

export interface ScriptConfig {
  id: string;
  src?: string;
  content?: string;
  position: ScriptPosition;
  placeholders?: Record<`{{${string}}}`, string>;
  category?: "analytics" | "tracking" | "performance" | "functional" | string;
  critical?: boolean;
  enabled?: boolean;
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: (error?: Error) => void;
}

export interface ScriptRendererProps {
  scripts: ScriptConfig[];
  position: ScriptPosition;
}

export interface ConditionalScriptRendererProps extends ScriptRendererProps {
  globalEnabled?: boolean;
}
export interface ScriptComponentProps {
  script: ScriptConfig;
}

export interface DocumentProps {
  scripts: ScriptConfig[];
  scriptsEnabled?: boolean;
}
