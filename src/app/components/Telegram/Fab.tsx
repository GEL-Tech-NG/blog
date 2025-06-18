"use client";
import { usePathname } from "next/navigation";
import { FaTelegram } from "react-icons/fa";

export const TelegramFab = () => {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");
  if (isDashboard) return null;
  return (
    <a
      href="https://t.me/geltechdeals"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 flex items-center gap-2 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
    >
      <FaTelegram /> Join Telegram Group
    </a>
  );
};
