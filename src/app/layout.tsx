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
import Script from "next/script";

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

  return (
    <html
      lang="en"
      className={`${fonts.body.variable} ${fonts.heading.variable}`}
    >
      <body>
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
      </body>
    </html>
  );
}
