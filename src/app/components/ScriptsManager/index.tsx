import Script from "next/script";
import { ReactNode } from "react";
import { CanRender } from "../CanRender";
import { ScriptComponent } from "./ScriptComponent";

const SCRIPT_POSITIONS = {
  HEAD_START: "head-start",
  HEAD_END: "head-end",
  BODY_START: "body-start",
  BODY_END: "body-end",
} as const;

const SCRIPT_STRATEGIES = {
  BLOCKING: "beforeInteractive", // Blocks page rendering
  AFTER_INTERACTIVE: "afterInteractive", // After page is interactive
  LAZY: "lazyOnload", // During idle time
  WORKER: "worker", // In web worker
} as const;

type ScriptPosition = (typeof SCRIPT_POSITIONS)[keyof typeof SCRIPT_POSITIONS];
type ScriptStrategy =
  (typeof SCRIPT_STRATEGIES)[keyof typeof SCRIPT_STRATEGIES];

interface ScriptConfig {
  id: string;
  src?: string;
  content?: string;
  position: ScriptPosition;
  placeholders?: Record<string, string>;
  category?: "analytics" | "tracking" | "performance" | "functional" | string;
  critical?: boolean;
  enabled?: boolean;
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: (error?: Error) => void;
}

interface ScriptRendererProps {
  scripts: ScriptConfig[];
  position: ScriptPosition;
}

interface ConditionalScriptRendererProps extends ScriptRendererProps {
  globalEnabled?: boolean;
}
interface ScriptComponentProps {
  script: ScriptConfig;
}

interface DocumentProps {
  scripts: ScriptConfig[];
  scriptsEnabled?: boolean;
}

// Enhanced ScriptRenderer with global enable/disable support
function ConditionalScriptRenderer({
  scripts,
  position,
  globalEnabled = true,
}: ConditionalScriptRendererProps): JSX.Element {
  const positionScripts = scripts.filter(
    (script) => script.position === position
  );

  return (
    <CanRender enabled={globalEnabled}>
      <>
        {positionScripts.map((script) => (
          <CanRender
            key={script.id}
            enabled={script.enabled !== false}
            fallback={script.fallback || null}
          >
            <ScriptComponent script={script} />
          </CanRender>
        ))}
      </>
    </CanRender>
  );
}

// Example usage with script configuration
export const ThirdPartyScripts: ScriptConfig[] = [
  {
    id: "google-analytics",
    src: "https://www.googletagmanager.com/gtag/js?id={{GA_MEASUREMENT_ID}}",
    position: SCRIPT_POSITIONS.HEAD_END,
    placeholders: {
      "{{GA_MEASUREMENT_ID}}": "gaMeasurementId",
    },
    enabled: false,
    onLoad: () => console.log("GA loaded"),
    onError: (error) => console.log("GA failed", error),
  },
  {
    id: "google-analytics-script",
    position: SCRIPT_POSITIONS.HEAD_END,
    placeholders: {
      "{{GA_MEASUREMENT_ID}}": "gaMeasurementId",
    },
    content: ` window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '{{GA_MEASUREMENT_ID}}');`,
  },
  {
    id: "mixpanel-analytics",
    content: `(function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split( " "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for ( var d = {}, e = ["get_group"].concat( Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);`,
    position: SCRIPT_POSITIONS.BODY_START,
    critical: true,
    enabled: false,
  },
  {
    id: "google-tag-manager",
    content: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{GTM_ID}}');
  `,
    placeholders: {
      "{{GTM_ID}}": "GTM-DEFAULT",
    },
    position: SCRIPT_POSITIONS.HEAD_START,
    critical: true,
    enabled: false,
  },
  {
    id: "posthog-analytics",
    src: "https://cdn.posthog.com/js/script.js",
    position: SCRIPT_POSITIONS.BODY_END,
    enabled: false,
  },
];

// Type-safe script configuration helper
function createScript(config: ScriptConfig): ScriptConfig {
  return {
    enabled: true,
    ...config,
  };
}

// Utility type for script management
type ScriptManager = {
  scripts: ScriptConfig[];
  addScript: (script: ScriptConfig) => void;
  removeScript: (id: string) => void;
  enableScript: (id: string) => void;
  disableScript: (id: string) => void;
  getScriptsByPosition: (position: ScriptPosition) => ScriptConfig[];
  getScriptsByCategory: (category: string) => ScriptConfig[];
};

// Script manager implementation
function createScriptManager(
  initialScripts: ScriptConfig[] = []
): ScriptManager {
  let scripts = [...initialScripts];

  return {
    get scripts() {
      return [...scripts];
    },

    addScript(script: ScriptConfig) {
      scripts = [...scripts.filter((s) => s.id !== script.id), script];
    },

    removeScript(id: string) {
      scripts = scripts.filter((s) => s.id !== id);
    },

    enableScript(id: string) {
      scripts = scripts.map((s) => (s.id === id ? { ...s, enabled: true } : s));
    },

    disableScript(id: string) {
      scripts = scripts.map((s) =>
        s.id === id ? { ...s, enabled: false } : s
      );
    },

    getScriptsByPosition(position: ScriptPosition) {
      return scripts.filter((s) => s.position === position);
    },

    getScriptsByCategory(category: string) {
      return scripts.filter((s) => s.category === category);
    },
  };
}

export type {
  ScriptConfig,
  ScriptPosition,
  ScriptStrategy,
  ScriptRendererProps,
  ConditionalScriptRendererProps,
  ScriptComponentProps,
  DocumentProps,
  ScriptManager,
};

export {
  CanRender,
  ConditionalScriptRenderer,
  SCRIPT_POSITIONS,
  SCRIPT_STRATEGIES,
  createScript,
  createScriptManager,
};
