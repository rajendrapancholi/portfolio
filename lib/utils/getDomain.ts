type RntTyp =
  | "cloudinary"
  | "youtube"
  | "unsplash"
  | "vimeo"
  | "unknown"
  | "invalid-url";

export function getDomain(url: string): RntTyp {
  try {
    if (!url) return "unknown";
    const { hostname } = new URL(url);
    if (
      hostname.includes("youtube.com") ||
      hostname.includes("youtu.be") ||
      hostname.includes("youtube-nocookie.com")
    )
      return "youtube";

    if (hostname.includes("vimeo.com")) return "vimeo";

    if (hostname.includes("cloudinary.com")) return "cloudinary";
    if (hostname.includes("unsplash.com")) return "unsplash";
    return "unknown";
  } catch (error) {
    return "invalid-url";
  }
}
