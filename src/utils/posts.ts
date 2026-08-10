type MarkdownModule = {
  frontmatter?: Record<string, unknown>;
  Content: unknown;
  getHeadings?: () => Array<{ depth: number; slug: string; text: string }>;
};

const modules = import.meta.glob("../content/posts/*.md", { eager: true }) as Record<string, MarkdownModule>;
const rawModules = import.meta.glob("../content/posts/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const stripFrontmatter = (value: string) => value.replace(/^---[\s\S]*?---/, "").trim();

const stripMarkdown = (value: string) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, (match) => match.match(/\[([^\]]+)]/)?.[1] ?? "")
    .replace(/[#>*_`~\-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getSlugFromPath = (filePath: string) => {
  const filename = filePath.split("/").pop() ?? "";
  return decodeURIComponent(filename.replace(/\.md$/, "")).trim().toLowerCase().replace(/\s+/g, "-");
};

const getTitleFromPath = (filePath: string) => {
  const filename = filePath.split("/").pop() ?? "";
  return filename.replace(/\.md$/, "");
};

const toDateString = (value: unknown): string => {
  if (Array.isArray(value)) return toDateString(value[0]);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.trim()) return value.trim().replace(" ", "T").slice(0, 10);
  return "2026-08-10";
};

const toTags = (value: unknown) => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  return ["导入"];
};

export const posts = Object.entries(modules)
  .map(([filePath, module]) => {
    const frontmatter = module.frontmatter ?? {};
    const raw = rawModules[filePath] ?? "";
    const title = String(frontmatter.title ?? getTitleFromPath(filePath));
    const bodyText = stripMarkdown(stripFrontmatter(raw));
    const excerpt = String(frontmatter.description ?? bodyText.slice(0, 120));
    const slug = getSlugFromPath(filePath);

    return {
      slug,
      title,
      date: toDateString(frontmatter.date ?? frontmatter.pubDate ?? frontmatter.pubDatetime ?? frontmatter.timestamp),
      excerpt,
      href: `/posts/${slug}/`,
      category: String(frontmatter.category ?? frontmatter.series ?? "文章"),
      tags: toTags(frontmatter.tags),
      Content: module.Content,
      headings: module.getHeadings?.().filter((heading) => heading.depth >= 2 && heading.depth <= 3) ?? [],
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-Hans-CN"));

export type Post = (typeof posts)[number];
