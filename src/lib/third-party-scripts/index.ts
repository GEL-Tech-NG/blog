import { SiteSettings } from "../../types";
import { SCRIPT_POSITIONS, ScriptConfig } from "./types";

export const getThirdPartyScripts = (siteSettings: SiteSettings) => {
  const ThirdPartyScripts: ScriptConfig[] = [
    {
      id: "google-analytics",
      src: "https://www.googletagmanager.com/gtag/js?id={{GA_MEASUREMENT_ID}}",
      position: SCRIPT_POSITIONS.HEAD_START,
      placeholders: {
        "{{GA_MEASUREMENT_ID}}": siteSettings.gaId.value || "",
      },
      enabled: siteSettings.gaId.enabled,
      critical: true,
    },
    {
      id: "google-analytics-script",
      position: SCRIPT_POSITIONS.HEAD_START,
      placeholders: {
        "{{GA_MEASUREMENT_ID}}": siteSettings.gaId.value || "",
      },
      content: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '{{GA_MEASUREMENT_ID}}');`,
      enabled: siteSettings.gaId.enabled,
      critical: true,
    },
    {
      id: "mixpanel-analytics",
      content: `(function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split( " "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for ( var d = {}, e = ["get_group"].concat( Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);`,
      position: SCRIPT_POSITIONS.BODY_START,
      critical: false,
      enabled: siteSettings.mixpanelToken.enabled,
    },
    {
      id: "google-tag-manager",
      content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{GTM_ID}}');
  `,
      placeholders: {
        "{{GTM_ID}}": siteSettings.gtmId.value || "",
      },
      position: SCRIPT_POSITIONS.HEAD_START,
      critical: true,
      enabled: siteSettings.gtmId.enabled,
    },
    {
      id: "posthog-analytics",
      src: "https://cdn.posthog.com/js/script.js",
      position: SCRIPT_POSITIONS.BODY_END,
      enabled: siteSettings.posthogKey.enabled,
    },
  ];
  return ThirdPartyScripts;
};
