import { site as siteData } from "@/data/site";
import { posts } from "@/utils/posts";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET({ site }: { site?: URL }) {
  const base = site?.toString() ?? "http://localhost:4323/";
  const items = posts
    .map((post) => {
      const link = new URL(post.href, base).toString();

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid>${escapeXml(link)}</guid>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  <description>${escapeXml(post.excerpt)}</description>
</item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteData.title)}</title>
  <link>${escapeXml(base)}</link>
  <description>${escapeXml(siteData.description)}</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
