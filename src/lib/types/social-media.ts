export type SocialMedia =
  | "Twitter"
  | "BlueSky"
  | "Mastodon"
  | "Youtube"
  | "TikTok"
  | "Facebook"
  | "Instagram"
  | "Pixiv"
  | (string & {})
  ;

export const hostToSocial: Record<string, SocialMedia> = {
  "twitter.com": "Twitter",
  "x.com": "Twitter",
  "bsky.app": "BlueSky",
  "mastodon.social": "Mastodon",
  "youtube.com": "Youtube",
  "youtu.be": "Youtube",
  "tiktok.com": "TikTok",
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "pixiv.net": "Pixiv",
};
