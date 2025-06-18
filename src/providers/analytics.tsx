import dynamic from "next/dynamic";
import { SiteSettings } from "../types";
import { CanRender } from "../app/components/CanRender";

const GoogleTagManager = dynamic(
  () => import("../app/components/Analytics/GoogleTagManager"),
  {
    ssr: false,
  }
);
const GoogleAnalytics = dynamic(
  () => import("../app/components/Analytics/GoogleAnalytics"),
  {
    ssr: false,
  }
);

const GoogleTagManagerNoscript = dynamic(
  () => import("../app/components/Analytics/GoogleTagManager/Noscript"),
  {
    ssr: false,
  }
);
const MixpanelAnalytics = dynamic(
  () => import("../app/components/Analytics/MixpanelAnalytics"),
  {
    ssr: false,
  }
);
export const AnalyticsProviders = ({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) => {
  return (
    <>
      <CanRender enabled={settings.gaId.enabled}>
        <GoogleAnalytics gaMeasurementId={settings.gaId.value} />
      </CanRender>
      <CanRender enabled={settings.gtmId.enabled}>
        <GoogleTagManager gtmId={settings.gtmId.value} />
        <GoogleTagManagerNoscript gtmId={settings.gtmId.value} />
      </CanRender>
      <CanRender enabled={settings.mixpanelToken.enabled}>
        <MixpanelAnalytics token={settings.mixpanelToken.value || ""} />
      </CanRender>
      {children}
    </>
  );
};
