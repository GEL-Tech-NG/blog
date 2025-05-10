import "server-only";

import { Resend } from "resend";
import { getSettings } from "../queries/settings";
import isEmpty from "just-is-empty";
import { ReactNode } from "react";
import { decryptKey } from "../encryption";

export const sendEmail = async ({
  to,
  from,
  subject,
  html,
  react,
}: {
  from?: string;
  to: string;
  subject: string;
  html?: string;
  react: ReactNode;
}) => {
  const siteSettings = await getSettings();
  let resendApiKey = siteSettings?.resendApiKey?.value;
  if (!resendApiKey) {
    throw new Error("Error sending email, check your site settings");
  }
  resendApiKey = decryptKey(siteSettings?.resendApiKey?.value);
  const resend = new Resend(resendApiKey);
  let defaultFrom = "";

  if (isEmpty(from)) {
    defaultFrom = `${siteSettings?.emailFromName.value || siteSettings?.siteName?.value} <${siteSettings?.emailFrom.value}>`;
  }
  return await resend.emails.send({
    from: from || defaultFrom,
    to,
    subject,
    html,
    react,
  });
};
