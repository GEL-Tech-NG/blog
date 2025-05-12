import Script from "next/script";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <Script id="blog-post-json-ld" strategy="beforeInteractive"></Script>
      </head>
      {children}
    </>
  );
}
