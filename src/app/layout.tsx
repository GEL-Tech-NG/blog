import type { Metadata, ResolvingMetadata } from "next";
import "./globals.css";
import { fonts } from "../lib/fonts";
import { ChakraProvider } from "../providers/chakra";
import ReactQueryClient from "../providers/react-query";
import AuthProvider from "../providers/auth";
import { getSession } from "../lib/auth/next-auth";
import { SiteConfigProvider } from "../context/SiteConfig";
import { getSettings } from "../lib/queries/settings";
import { NuqsProvider } from "../providers/nuqs";
import { AnalyticsProviders } from "../providers/analytics";
import { getSiteUrl } from "../utils/url";
import { objectToQueryParams } from "../utils";
import { groupSettingsByFolder } from "./components/pages/Dashboard/Settings/utils";
import { TelegramFab } from "./components/Telegram/Fab";

type Props = {
  params: { slug?: string } & Record<string, string | string[] | undefined>;
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  _: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siteSettings = await getSettings();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    metadataBase: new URL(getSiteUrl()),
    title: siteSettings?.siteName?.value,
    description: siteSettings?.siteDescription?.value,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
      noimageindex: false,
      nositelinkssearchbox: false,
    },
    icons: {
      icon: siteSettings?.siteFavicon?.value || "/favicon.ico",
      shortcut: siteSettings?.siteFavicon?.value || "/favicon.ico",
      apple: siteSettings?.siteFavicon?.value || "/favicon.ico",
    },
    openGraph: {
      title: siteSettings?.siteName?.value,
      description: siteSettings?.siteDescription?.value,

      siteName: siteSettings?.siteName?.value,
      images: [
        {
          url:
            siteSettings.siteOpengraph?.value ||
            `/api/og?${objectToQueryParams({ title: siteSettings.siteName?.value, description: siteSettings.siteDescription?.value })}`,
          width: 1200,
          height: 630,
        },
        ...previousImages,
      ],

      locale: "en-US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const siteSettings = await getSettings();
  const groupedSettings = groupSettingsByFolder(siteSettings);
  const socialSettings = groupedSettings["social"] || [];
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: getSiteUrl(),
    name: siteSettings.siteName.value,
    description: siteSettings.siteDescription.value,
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: siteSettings.siteName.value,
      logo: {
        "@type": "ImageObject",
        url: siteSettings.siteLogo.value,
      },
    },
    inLanguage: "en-US",
    copyrightYear: "2025",

    copyrightHolder: {
      "@type": "Organization",
      name: "GEL Tech NG",
    },
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `https://geltechng.com`,
    name: "GEL Tech NG",
    url: "https://geltechng.com",
    logo: {
      "@type": "ImageObject",
      url: siteSettings.siteLogo.value,
      width: "300",
      height: "300",
    },
    description: siteSettings.siteDescription.value,
    foundingDate: "2025-01-10",
    founder: {
      "@type": "Person",
      name: "Victory Lucky",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "13/15 Fadu Avenue",
      addressLocality: "Ejigbo",
      addressRegion: "Lagos",
      postalCode: "100261",
      addressCountry: "Nigeria",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-8162872504",
      contactType: "customer service",
      email: "info@geltechng.com",
      availableLanguage: "English",
    },
    sameAs: socialSettings.map((setting) => setting.value),
  };
  return (
    <html
      lang="en"
      className={`${fonts.body.variable} ${fonts.heading.variable}`}
    >
      <body>
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
          <AnalyticsProviders settings={siteSettings} />
          <SiteConfigProvider initialConfig={siteSettings}>
            <ReactQueryClient>
              <AuthProvider session={session}>
                <NuqsProvider>
                  <ChakraProvider>{children}</ChakraProvider>
                </NuqsProvider>
              </AuthProvider>
            </ReactQueryClient>
          </SiteConfigProvider>

        </>
          <TelegramFab />
      </body>
    </html>
  );
}
