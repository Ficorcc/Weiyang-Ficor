export const site = {
  title: "Ficor‘s Blog",
  description: "在路上的思绪与脚印", 
  logo: "/assets/logo.png",
  favicon: "/favicon.ico",
  owner: "Ficor",
  copyrightYears: "2008-2026",
  program: "Astro",
  language: "中文",
  theme: "Weiyang", 
  themeRepository: "https://github.com/Ficorcc/Weiyang",
  socialLinks: [
    { name: "GitHub", href: "https://github.com/Ficorcc", icon: "github" },
    { name: "Mastodon", href: "https://mastodon.social/ficor", icon: "mastodon" },
    { name: "邮箱", href: "mailto:ficor@qq.com", icon: "mail" },
    { name: "QQ", href: "316160777", icon: "qq" },
    { name: "微信", href: "ficorcc", icon: "wechat" },
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
  subtitle: [
    "一个重新站起来，准备出发的人",
    "Do one Thing at a Time,and Do Well",
  ],
  intro: "个人记录、最新动态与文章归档。",
  stats: [
    { label: "文章", value: "55" },
    { label: "动态", value: "1" },
    { label: "主题", value: "Weiyang" },
  ],
};

export const latestComments: Array<{ date: string; articleTitle: string; commenter: string }> = [];

export const projects = [
  {
    title: "Weiyang 未央",
    href: "https://github.com/Ficorcc/Weiyang",
    text: "个人 Astro 主题围绕写作、动态和归档设计的轻量主题。",
  },
];
