import "server-only";
import { db } from "@/src/db";
import { siteSettings } from "@/src/db/schemas";
import { SiteSettings } from "@/src/types";
import { DEFAULT_SETTINGS } from "./config";
import { isSecretKey } from "@/src/utils";
import { encryptKey } from "../../encryption";

import { unstable_cache } from "next/cache";

export const getSettings = unstable_cache(
  async () => {
    const settings = await db.select().from(siteSettings);

    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value || "",
        enabled: setting.enabled as boolean,
        encrypted: setting.encrypted as boolean,
      };
      return acc;
    }, {} as SiteSettings);

    return { ...DEFAULT_SETTINGS, ...settingsObj };
  },
  ["getSettings"],
  { tags: ["getSettings"] }
);

export async function updateSettings(newSettings: SiteSettings) {
  const operations = Object.entries(newSettings).map(([key, setting]) => {
    const value =
      isSecretKey(key) &&
      setting.value &&
      !setting.encrypted &&
      setting.canEncrypt
        ? encryptKey(setting.value)
        : setting.value;

    return db
      .insert(siteSettings)
      .values({
        key,
        value,
        enabled: setting.enabled,
        encrypted: setting.encrypted,
        canEncrypt: setting.canEncrypt,
      })
      .onDuplicateKeyUpdate({
        set: { key, value, updated_at: new Date() },
      });
  });

  for (const operation of operations) {
    await operation;
  }
}
