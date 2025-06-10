import React, { useState, memo, useEffect, useRef, useMemo } from "react";
import { LuCopy } from "react-icons/lu";

// Icon Components (using SVG paths)
const TwitterIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ShareIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CopyIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// Theme definitions
const THEMES = {
  plain: {
    base: {
      bgColor: "bg-transparent",
      textColor: "text-gray-600",
      hoverBgColor: "hover:bg-gray-50",
      hoverTextColor: "hover:text-gray-800",
      border: "border border-gray-200",
    },
    platforms: {
      twitter: {
        textColor: "text-gray-600",
        hoverTextColor: "hover:text-blue-500",
      },
      facebook: {
        textColor: "text-gray-600",
        hoverTextColor: "hover:text-blue-600",
      },
      linkedin: {
        textColor: "text-gray-600",
        hoverTextColor: "hover:text-blue-700",
      },
      email: {
        textColor: "text-gray-600",
        hoverTextColor: "hover:text-gray-800",
      },
      copy: {
        textColor: "text-gray-600",
        hoverTextColor: "hover:text-gray-800",
      },
    },
  },

  ghost: {
    base: {
      bgColor: "bg-transparent",
      textColor: "text-gray-500",
      hoverBgColor: "hover:bg-gray-100",
      hoverTextColor: "hover:text-gray-700",
      border: "",
    },
    platforms: {
      twitter: {
        textColor: "text-gray-500",
        hoverTextColor: "hover:text-blue-500",
      },
      facebook: {
        textColor: "text-gray-500",
        hoverTextColor: "hover:text-blue-600",
      },
      linkedin: {
        textColor: "text-gray-500",
        hoverTextColor: "hover:text-blue-700",
      },
      email: {
        textColor: "text-gray-500",
        hoverTextColor: "hover:text-gray-700",
      },
      copy: {
        textColor: "text-gray-500",
        hoverTextColor: "hover:text-gray-700",
      },
    },
  },

  minimal: {
    base: {
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      hoverBgColor: "hover:bg-gray-100",
      hoverTextColor: "hover:text-gray-800",
      border: "",
    },
    platforms: {
      twitter: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-blue-500",
      },
      facebook: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-blue-600",
      },
      linkedin: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-blue-700",
      },
      email: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-gray-800",
      },
      copy: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-gray-800",
      },
    },
  },

  default: {
    base: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      hoverBgColor: "hover:bg-gray-200",
      hoverTextColor: "hover:text-gray-900",
      border: "",
    },
    platforms: {
      twitter: {
        bgColor: "bg-blue-50",
        textColor: "text-blue-500",
        hoverBgColor: "hover:bg-blue-100",
        hoverTextColor: "hover:text-blue-600",
      },
      facebook: {
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-500",
        hoverBgColor: "hover:bg-indigo-100",
        hoverTextColor: "hover:text-indigo-600",
      },
      linkedin: {
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        hoverBgColor: "hover:bg-blue-100",
        hoverTextColor: "hover:text-blue-800",
      },
      email: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-gray-800",
      },
      copy: {
        bgColor: "bg-gray-50",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-100",
        hoverTextColor: "hover:text-gray-800",
      },
    },
  },

  brand: {
    base: {
      bgColor: "bg-white",
      textColor: "text-white",
      hoverBgColor: "",
      hoverTextColor: "hover:text-white",
      border: "",
    },
    platforms: {
      twitter: {
        bgColor: "bg-blue-500",
        textColor: "text-white",
        hoverBgColor: "hover:bg-blue-600",
        hoverTextColor: "hover:text-white",
      },
      facebook: {
        bgColor: "bg-blue-600",
        textColor: "text-white",
        hoverBgColor: "hover:bg-blue-700",
        hoverTextColor: "hover:text-white",
      },
      linkedin: {
        bgColor: "bg-blue-700",
        textColor: "text-white",
        hoverBgColor: "hover:bg-blue-800",
        hoverTextColor: "hover:text-white",
      },
      email: {
        bgColor: "bg-gray-600",
        textColor: "text-white",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-white",
      },
      copy: {
        bgColor: "bg-gray-600",
        textColor: "text-white",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-white",
      },
    },
  },

  dark: {
    base: {
      bgColor: "bg-gray-800",
      textColor: "text-gray-200",
      hoverBgColor: "hover:bg-gray-700",
      hoverTextColor: "hover:text-white",
      border: "",
    },
    platforms: {
      twitter: {
        bgColor: "bg-gray-800",
        textColor: "text-blue-400",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-blue-300",
      },
      facebook: {
        bgColor: "bg-gray-800",
        textColor: "text-blue-400",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-blue-300",
      },
      linkedin: {
        bgColor: "bg-gray-800",
        textColor: "text-blue-400",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-blue-300",
      },
      email: {
        bgColor: "bg-gray-800",
        textColor: "text-gray-400",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-gray-200",
      },
      copy: {
        bgColor: "bg-gray-800",
        textColor: "text-gray-400",
        hoverBgColor: "hover:bg-gray-700",
        hoverTextColor: "hover:text-gray-200",
      },
    },
  },

  outline: {
    base: {
      bgColor: "bg-transparent",
      textColor: "text-gray-600",
      hoverBgColor: "hover:bg-gray-50",
      hoverTextColor: "hover:text-gray-800",
      border: "border-2 border-gray-300",
    },
    platforms: {
      twitter: {
        bgColor: "bg-transparent",
        textColor: "text-blue-500",
        hoverBgColor: "hover:bg-blue-50",
        hoverTextColor: "hover:text-blue-600",
        border: "border-2 border-blue-500",
      },
      facebook: {
        bgColor: "bg-transparent",
        textColor: "text-blue-600",
        hoverBgColor: "hover:bg-blue-50",
        hoverTextColor: "hover:text-blue-700",
        border: "border-2 border-blue-600",
      },
      linkedin: {
        bgColor: "bg-transparent",
        textColor: "text-blue-700",
        hoverBgColor: "hover:bg-blue-50",
        hoverTextColor: "hover:text-blue-800",
        border: "border-2 border-blue-700",
      },
      email: {
        bgColor: "bg-transparent",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-50",
        hoverTextColor: "hover:text-gray-800",
        border: "border-2 border-gray-600",
      },
      copy: {
        bgColor: "bg-transparent",
        textColor: "text-gray-600",
        hoverBgColor: "hover:bg-gray-50",
        hoverTextColor: "hover:text-gray-800",
        border: "border-2 border-gray-600",
      },
    },
  },
} as const;

// Variant definitions
const VARIANTS = {
  default: {
    rounded: "rounded-md",
    padding: "px-3 py-2",
    gap: "gap-2",
  },
  flat: {
    rounded: "rounded-none",
    padding: "px-3 py-2",
    gap: "gap-2",
  },
  round: {
    rounded: "rounded-full",
    padding: "px-4 py-2",
    gap: "gap-2",
  },
  compact: {
    rounded: "rounded-md",
    padding: "px-2 py-1.5",
    gap: "gap-0",
  },
  pill: {
    rounded: "rounded-full",
    padding: "px-4 py-2",
    gap: "gap-3",
  },
  square: {
    rounded: "rounded-none",
    padding: "p-3",
    gap: "gap-0",
  },
} as const;

// Size definitions
const SIZES = {
  xs: { iconSize: 14, padding: "px-2 py-1", text: "text-xs" },
  sm: { iconSize: 16, padding: "px-2.5 py-1.5", text: "text-sm" },
  md: { iconSize: 20, padding: "px-3 py-2", text: "text-sm" },
  lg: { iconSize: 24, padding: "px-4 py-2.5", text: "text-base" },
  xl: { iconSize: 28, padding: "px-5 py-3", text: "text-lg" },
} as const;

// Types
type ThemeName = keyof typeof THEMES;
type VariantName = keyof typeof VARIANTS;
type SizeName = keyof typeof SIZES;
type PlatformName = "twitter" | "facebook" | "linkedin" | "email" | "copy";

interface ThemedSocialShareButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label?: string;
  url?: string;
  title?: string;
  showLabel?: boolean;
  theme?: ThemeName;
  variant?: VariantName;
  size?: SizeName;
  platform?: PlatformName;
  shareUrl?: (encodedUrl: string, encodedTitle: string) => string;
}

interface ThemedSocialShareGroupProps {
  url: string;
  title: string;
  platforms?: PlatformName[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  showLabels?: boolean;
  theme?: ThemeName;
  variant?: VariantName;
  size?: SizeName;
  spacing?: string;
}

interface ThemedShareButtonProps {
  url: string;
  title: string;
  showMenu?: boolean;
  onToggleMenu?: (isOpen: boolean) => void;
  theme?: ThemeName;
  variant?: VariantName;
  size?: SizeName;
  buttonProps?: Partial<ThemedSocialShareButtonProps>;
  menuProps?: Partial<ThemedSocialShareGroupProps>;
}

// Hook for theme styling
const useThemeStyles = (
  theme: ThemeName = "default",
  variant: VariantName = "default",
  size: SizeName = "md",
  platform?: PlatformName
) => {
  return useMemo(() => {
    const themeConfig = THEMES[theme];
    const variantConfig = VARIANTS[variant];
    const sizeConfig = SIZES[size];

    // Get platform-specific styles or fall back to base
    const platformStyles = {
      ...themeConfig.base,
      ...(platform ? themeConfig.platforms?.[platform] : {}),
    };

    return {
      bgColor: platformStyles.bgColor || themeConfig.base.bgColor,
      textColor: platformStyles.textColor || themeConfig.base.textColor,
      hoverBgColor:
        platformStyles.hoverBgColor || themeConfig.base.hoverBgColor,
      hoverTextColor:
        platformStyles.hoverTextColor || themeConfig.base.hoverTextColor,
      border: platformStyles.border || themeConfig.base.border || "",
      rounded: variantConfig.rounded,
      padding: sizeConfig.padding,
      gap: variantConfig.gap,
      iconSize: sizeConfig.iconSize,
      textSize: sizeConfig.text,
    };
  }, [theme, variant, size, platform]);
};

// Base themed button component
const ThemedSocialShareButton = memo<ThemedSocialShareButtonProps>(
  ({
    icon: Icon,
    label,
    url = "",
    title = "",
    onClick,
    showLabel = true,
    theme = "default",
    variant = "default",
    size = "md",
    platform,
    className = "",
    shareUrl,
    ...props
  }) => {
    const styles = useThemeStyles(theme, variant, size, platform);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
        return;
      }

      e.preventDefault();

      const encodedUrl = url ? encodeURIComponent(url) : "";
      const encodedTitle = title ? encodeURIComponent(title) : "";

      if (shareUrl && url) {
        window.open(
          shareUrl(encodedUrl, encodedTitle),
          "_blank",
          "noopener,noreferrer"
        );
      }
    };

    const buttonClasses = useMemo(() => {
      const baseClasses =
        "flex items-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
      const conditionalGap = showLabel && label ? styles.gap : "";

      return `${baseClasses} ${conditionalGap} ${styles.padding} ${styles.bgColor} ${styles.textColor} ${styles.hoverBgColor} ${styles.hoverTextColor} ${styles.rounded} ${styles.border} ${styles.textSize} ${className}`.trim();
    }, [showLabel, label, styles, className]);

    return (
      <button
        onClick={handleClick}
        className={buttonClasses}
        aria-label={`Share on ${label}`}
        {...props}
      >
        {Icon && <Icon size={styles.iconSize} />}
        {showLabel && label && <span>{label}</span>}
      </button>
    );
  }
);

ThemedSocialShareButton.displayName = "ThemedSocialShareButton";

// Platform-specific components
const ThemedTwitterShareButton = memo<
  Omit<ThemedSocialShareButtonProps, "icon" | "label" | "platform"> & {
    via?: string;
    hashtags?: string[];
  }
>(({ url, title, via = "", hashtags = [], ...props }) => {
  const shareUrl = useMemo(
    () =>
      (encodedUrl: string, encodedTitle: string): string => {
        let twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        if (via) twitterUrl += `&via=${encodeURIComponent(via)}`;
        if (hashtags.length > 0)
          twitterUrl += `&hashtags=${encodeURIComponent(hashtags.join(","))}`;
        return twitterUrl;
      },
    [via, hashtags]
  );

  return (
    <ThemedSocialShareButton
      icon={TwitterIcon}
      label="Twitter"
      url={url}
      title={title}
      platform="twitter"
      shareUrl={shareUrl}
      {...props}
    />
  );
});

ThemedTwitterShareButton.displayName = "ThemedTwitterShareButton";

const ThemedFacebookShareButton = memo<
  Omit<ThemedSocialShareButtonProps, "icon" | "label" | "platform">
>(({ url, title, ...props }) => {
  const shareUrl = useMemo(
    () =>
      (encodedUrl: string): string =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    []
  );

  return (
    <ThemedSocialShareButton
      icon={FacebookIcon}
      label="Facebook"
      url={url}
      title={title}
      platform="facebook"
      shareUrl={shareUrl}
      {...props}
    />
  );
});

ThemedFacebookShareButton.displayName = "ThemedFacebookShareButton";

const ThemedLinkedInShareButton = memo<
  Omit<ThemedSocialShareButtonProps, "icon" | "label" | "platform"> & {
    summary?: string;
    source?: string;
  }
>(({ url, title, summary = "", source = "", ...props }) => {
  const shareUrl = useMemo(
    () =>
      (encodedUrl: string, encodedTitle: string): string => {
        let linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        if (title) linkedinUrl += `&title=${encodedTitle}`;
        if (summary) linkedinUrl += `&summary=${encodeURIComponent(summary)}`;
        if (source) linkedinUrl += `&source=${encodeURIComponent(source)}`;
        return linkedinUrl;
      },
    [summary, source]
  );

  return (
    <ThemedSocialShareButton
      icon={LinkedInIcon}
      label="LinkedIn"
      url={url}
      title={title}
      platform="linkedin"
      shareUrl={shareUrl}
      {...props}
    />
  );
});

ThemedLinkedInShareButton.displayName = "ThemedLinkedInShareButton";

const ThemedEmailShareButton = memo<
  Omit<ThemedSocialShareButtonProps, "icon" | "label" | "platform"> & {
    subject?: string;
    body?: string;
  }
>(({ url, title, subject = "", body = "", ...props }) => {
  const shareUrl = useMemo(
    () =>
      (encodedUrl: string, encodedTitle: string): string => {
        const emailSubject = subject || encodedTitle;
        const emailBody = body || `${encodedTitle}\n\n${url}`;
        return `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      },
    [subject, body, url]
  );

  return (
    <ThemedSocialShareButton
      icon={MailIcon}
      label="Email"
      url={url}
      title={title}
      platform="email"
      shareUrl={shareUrl}
      {...props}
    />
  );
});

ThemedEmailShareButton.displayName = "ThemedEmailShareButton";

const ThemedCopyLinkButton = memo<
  Omit<ThemedSocialShareButtonProps, "icon" | "label" | "platform"> & {
    successDuration?: number;
    successLabel?: string;
  }
>(
  ({
    url,
    title,
    successDuration = 2000,
    successLabel = "Copied!",
    ...props
  }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = useMemo(
      () => async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(url || "");
          setCopied(true);
          setTimeout(() => setCopied(false), successDuration);
        } catch (err) {
          console.error("Failed to copy URL:", err);
        }
      },
      [url, successDuration]
    );

    if (!url) return null;

    return (
      <ThemedSocialShareButton
        icon={LuCopy}
        label={copied ? successLabel : "Copy Link"}
        url={url}
        title={title}
        platform="copy"
        onClick={handleCopy}
        {...props}
      />
    );
  }
);

ThemedCopyLinkButton.displayName = "ThemedCopyLinkButton";

// Themed group component
const ThemedSocialShareGroup = memo<ThemedSocialShareGroupProps>(
  ({
    url,
    title,
    platforms = ["twitter", "facebook", "linkedin", "email"],
    orientation = "horizontal",
    className = "",
    showLabels = true,
    theme = "default",
    variant = "default",
    size = "md",
    spacing = "gap-2",
  }) => {
    const renderPlatformButton = useMemo(
      () => (platform: PlatformName) => {
        const commonProps = {
          url,
          title,
          showLabel: showLabels,
          theme,
          variant,
          size,
        };

        switch (platform) {
          case "twitter":
            return <ThemedTwitterShareButton key="twitter" {...commonProps} />;
          case "facebook":
            return (
              <ThemedFacebookShareButton key="facebook" {...commonProps} />
            );
          case "linkedin":
            return (
              <ThemedLinkedInShareButton key="linkedin" {...commonProps} />
            );
          case "email":
            return <ThemedEmailShareButton key="email" {...commonProps} />;
          case "copy":
            return <ThemedCopyLinkButton key="copy" {...commonProps} />;
          default:
            return null;
        }
      },
      [url, title, showLabels, theme, variant, size]
    );

    const orientationClass =
      orientation === "vertical" ? "flex-col" : "flex-row";
    const compactSpacing = variant === "compact" ? "gap-0" : spacing;

    return (
      <div
        className={`flex ${orientationClass} ${compactSpacing} ${className}`}
      >
        {platforms.map(renderPlatformButton)}
      </div>
    );
  }
);

ThemedSocialShareGroup.displayName = "ThemedSocialShareGroup";

// Themed share button with menu
const ThemedShareButton = memo<ThemedShareButtonProps>(
  ({
    url,
    title,
    showMenu = false,
    onToggleMenu,
    theme = "default",
    variant = "default",
    size = "md",
    buttonProps = {},
    menuProps = {},
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(showMenu);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setIsMenuOpen(showMenu);
    }, [showMenu]);

    const toggleMenu = (): void => {
      const newState = !isMenuOpen;
      setIsMenuOpen(newState);
      onToggleMenu?.(newState);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
          onToggleMenu?.(false);
        }
      };

      if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isMenuOpen, onToggleMenu]);

    return (
      <div className="relative" ref={menuRef}>
        <ThemedSocialShareButton
          icon={ShareIcon}
          label="Share"
          onClick={toggleMenu}
          theme={theme}
          variant={variant}
          size={size}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          {...buttonProps}
        />

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10 min-w-48">
            <ThemedSocialShareGroup
              url={url}
              title={title}
              orientation="vertical"
              className="w-full"
              theme={theme}
              variant={variant}
              size={size}
              {...menuProps}
            />
          </div>
        )}
      </div>
    );
  }
);

ThemedShareButton.displayName = "ThemedShareButton";

// Demo component
const SocialShareDemo = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default");
  const [currentVariant, setCurrentVariant] = useState<VariantName>("default");
  const [currentSize, setCurrentSize] = useState<SizeName>("md");
  const [showLabels, setShowLabels] = useState(true);

  const demoUrl = "https://example.com";
  const demoTitle = "Check out this amazing content!";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Themed Social Share Components
        </h1>
        <p className="text-gray-600">
          Customizable social sharing buttons with multiple themes and variants
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value as ThemeName)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {Object.keys(THEMES).map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant
            </label>
            <select
              value={currentVariant}
              onChange={(e) => setCurrentVariant(e.target.value as VariantName)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {Object.keys(VARIANTS).map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              value={currentSize}
              onChange={(e) => setCurrentSize(e.target.value as SizeName)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {Object.keys(SIZES).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded"
              />
              <span>Show Labels</span>
            </label>
          </div>
        </div>
      </div>

      {/* Demo Groups */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Horizontal Group
          </h3>
          <ThemedSocialShareGroup
            url={demoUrl}
            title={demoTitle}
            theme={currentTheme}
            variant={currentVariant}
            size={currentSize}
            showLabels={showLabels}
            className="justify-center"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Vertical Group
          </h3>
          <ThemedSocialShareGroup
            url={demoUrl}
            title={demoTitle}
            orientation="vertical"
            theme={currentTheme}
            variant={currentVariant}
            size={currentSize}
            showLabels={showLabels}
            className="items-center"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Share Button with Menu
          </h3>
          <div className="flex justify-center">
            <ThemedShareButton
              url={demoUrl}
              title={demoTitle}
              theme={currentTheme}
              variant={currentVariant}
              size={currentSize}
              menuProps={{ showLabels }}
            />
          </div>
        </div>
      </div>

      {/* Theme Showcase */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          All Themes Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(THEMES).map((theme) => (
            <div key={theme} className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3 capitalize">
                {theme}
              </h4>
              <ThemedSocialShareGroup
                url={demoUrl}
                title={demoTitle}
                theme={theme as ThemeName}
                variant={currentVariant}
                size="sm"
                showLabels={false}
                platforms={["twitter", "facebook", "linkedin"]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialShareDemo;
