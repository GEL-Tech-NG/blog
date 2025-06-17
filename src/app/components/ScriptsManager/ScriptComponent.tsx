import Script from "next/script";
import { ScriptComponentProps, ScriptStrategy } from ".";
import isEmpty from "just-is-empty";
import { useCallback } from "react";

export function ScriptComponent({ script }: ScriptComponentProps): JSX.Element {
  const getStrategy = (): ScriptStrategy => {
    // Critical scripts that must load before interaction
    if (script.critical) return "beforeInteractive";

    // Analytics, tracking - can wait
    if (script.category === "analytics") return "lazyOnload";

    // Default
    return "afterInteractive";
  };

  const handleLoad = (): void => {
    process.env.NODE_ENV === "development" &&
      console.log(`Script ${script.id} loaded`);
    // Track script loading for analytics
    if (script.onLoad && typeof script.onLoad === "function") {
      script.onLoad();
    }
  };

  const handleError = (error?: Error): void => {
    console.error(`Script ${script.id} failed to load`, error);
    // Handle error, maybe load fallback
    if (script.onError && typeof script.onError === "function") {
      script.onError(error);
    }
  };
  const replacePlaceholdersInContent = useCallback(
    (content: string): string => {
      if (isEmpty(script.placeholders) || !script.placeholders) return content;
      return Object.entries(script.placeholders).reduce((acc, [key, value]) => {
        return acc.replace(key, value);
      }, content);
    },
    [script.placeholders]
  );
  const content = replacePlaceholdersInContent(script.content || "");

  const replacePlaceholdersInSrc = useCallback(
    (src: string): string => {
      if (isEmpty(script.placeholders) || !script.placeholders) return src;
      return Object.entries(script.placeholders).reduce((acc, [key, value]) => {
        return acc.replace(key, value);
      }, src);
    },
    [script.placeholders]
  );
  const src = replacePlaceholdersInSrc(script.src || "");
  return (
    <Script
      id={script.id}
      src={src}
      strategy={getStrategy()}
      onLoad={handleLoad}
      onError={handleError}
    >
      {content}
    </Script>
  );
}
