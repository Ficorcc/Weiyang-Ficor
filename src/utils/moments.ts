type MarkdownModule = {
  frontmatter?: Record<string, unknown>;
};

const modules = import.meta.glob("../content/moments/*.md", { eager: true }) as Record<string, MarkdownModule>;
const rawModules = import.meta.glob("../content/moments/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const stripFrontmatter = (value: string) => value.replace(/^---[\s\S]*?---/, "").trim();

const stripMarkdown = (value: string) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, (match) => match.match(/\[([^\]]+)]/)?.[1] ?? "")
    .replace(/[#>*_`~\-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getTitleFromPath = (filePath: string) => {
  const filename = filePath.split("/").pop() ?? "";
  return filename.replace(/\.md$/, "");
};

const toDateString = (value: unknown) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.trim()) return value.trim().replace(" ", "T").slice(0, 10);
  return "2026-08-10";
};

export const moments = Object.entries(modules)
  .map(([filePath, module]) => {
    const frontmatter = module.frontmatter ?? {};
    const raw = rawModules[filePath] ?? "";

    return {
      title: String(frontmatter.title ?? getTitleFromPath(filePath)),
      date: toDateString(frontmatter.date ?? frontmatter.timestamp),
      text: stripMarkdown(stripFrontmatter(raw)),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-Hans-CN"));

export type Moment = (typeof moments)[number];
