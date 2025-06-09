"use client";
import { FaTelegram } from "react-icons/fa";

export const TelegramFab = () => {
  return (
    <a
      href="https://t.me/geltechng"
      target="_blank"
      className="fixed  hover:scale-105 transition-all duration-300 flex items-center gap-2 bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg z-50"
    >
      <FaTelegram /> Join Our Telegram
    </a>
  );
};
