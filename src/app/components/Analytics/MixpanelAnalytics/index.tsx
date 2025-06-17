"use client";
import { useEffect } from "react";
import { initMixpanel } from "@/src/lib/mixpanel";

export default function MixpanelAnalytics({ token }: { token: string }) {
  useEffect(() => {
    initMixpanel({ token });
  }, [token]);

  return (
    <></>
  );
}
