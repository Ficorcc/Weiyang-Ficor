export const site = {
  title: "花開未央",
  description: "个人记录、最新动态与文章归档。",
  logo: "/assets/logo.png",
  favicon: "/favicon.ico",
  owner: "Ficor",
  copyrightYears: "2008-2026",
  program: "Astro",
  language: "中文",
  theme: "霞鹜飞楷",
  themeRepository: "https://github.com/Ficorcc/Weiyang",
  socialLinks: [
    { name: "GitHub", href: "https://github.com/", icon: "github" },
    { name: "Mastodon", href: "https://mastodon.social/", icon: "mastodon" },
    { name: "邮箱", href: "mailto:hello@example.com", icon: "mail" },
    { name: "QQ", href: "https://im.qq.com/", icon: "qq" },
    { name: "微信", href: "https://weixin.qq.com/", icon: "wechat" },
    { name: "RSS 订阅", href: "/rss.xml", icon: "rss" },
  ],
};

export const navItems = [
  { label: "首页", href: "/", icon: "home" },
  { label: "关于", href: "/about/", icon: "user" },
  { label: "动态", href: "/moments/", icon: "moment" },
  { label: "友链", href: "/friends/", icon: "link" },
  { label: "归档", href: "/archive/", icon: "archive" },
];

export const profile = {
  subtitle: "个人写作与动态",
  intro: "个人记录、最新动态与文章归档。",
  stats: [
    { label: "文章", value: "55" },
    { label: "动态", value: "1" },
    { label: "主题", value: "Astro" },
  ],
};

export const latestComments: Array<{ date: string; articleTitle: string; commenter: string }> = [];

export const projects = [
  {
    title: "个人 Astro 主题",
    text: "围绕写作、动态和归档设计的轻量主题。",
  },
  {
    title: "内容整理工具",
    text: "把零散素材整理成更容易发布的文章结构。",
  },
];
