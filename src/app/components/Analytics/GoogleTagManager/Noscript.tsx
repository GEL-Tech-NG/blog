"use client";
const GoogleTagManagerNoscript = ({ gtmId }: { gtmId: string }) => {
  return (
    <>
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        />
    </noscript>
        </>
  );
};
export default GoogleTagManagerNoscript;
GoogleTagManagerNoscript.displayName = "GoogleTagManagerNoscript";
