type MarkdownModule = {
  frontmatter?: Record<string, unknown>;
  Content: unknown;
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

const getFrontmatterValue = (raw: string, key: string) => {
  const match = raw.match(new RegExp("^---[\\s\\S]*?^" + key + ":\\s*(.+)$", "m"));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, "");
};

const toDateString = (value: unknown) => {
  if (Array.isArray(value)) return toDateString(value[0]);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.trim()) return value.trim().replace(" ", "T").slice(0, 10);
  return "2026-08-10";
};

export const moments = Object.entries(modules)
  .map(([filePath, module]) => {
    const frontmatter = module.frontmatter ?? {};
    const raw = rawModules[filePath] ?? "";
    const rawDate = getFrontmatterValue(raw, "date") ?? getFrontmatterValue(raw, "timestamp");
    const bodyText = stripMarkdown(stripFrontmatter(raw));
    const hasTitle = typeof frontmatter.title === "string" && frontmatter.title.trim().length > 0;

    return {
      title: hasTitle ? String(frontmatter.title) : bodyText.slice(0, 24),
      hasTitle,
      date: toDateString(rawDate ?? frontmatter.date ?? frontmatter.timestamp),
      text: bodyText,
      Content: module.Content,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-Hans-CN"));

export type Moment = (typeof moments)[number];
