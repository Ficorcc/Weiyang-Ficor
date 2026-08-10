const FEED_CANDIDATE_LIMIT = 80;

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      ...(init.headers || {}),
    },
  });

const decodeEntities = (value = "") =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/<[^>]+>/g, "")
    .trim();

const getTag = (xml: string, tag: string) => {
  const pattern = "<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">";
  const match = xml.match(new RegExp(pattern, "i"));
  return match ? decodeEntities(match[1]) : "";
};

const normalizeDate = (value: string) => {
  if (!value) return "";
  const date = new Date(decodeEntities(value));
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  return decodeEntities(value).match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/)?.[0]?.replace(/\//g, "-") || "";
};

const absoluteUrl = (href: string, base: string) => {
  try {
    return new URL(href, base).href;
  } catch {
    return "";
  }
};

const fetchText = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
      "User-Agent": "Mozilla/5.0 (compatible; WeiyangFeedRefresher/1.0; +https://panjinye.com)",
    },
    cf: { cacheTtl: 0, cacheEverything: false },
  });
  if (!response.ok) throw new Error(String(response.status));
  return { text: await response.text(), url: response.url };
};

const parseFeed = (xml: string, feedUrl: string) => {
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const entryBlocks = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  const blocks = itemBlocks.length ? itemBlocks : entryBlocks;

  return blocks.slice(0, 3).flatMap((block) => {
    const title = getTag(block, "title");
    let url = getTag(block, "link");
    const href = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1];
    if (!url && href) url = href;
    const date = normalizeDate(
      getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated") || getTag(block, "dc:date"),
    );

    if (!title) return [];
    return [{ title, url: absoluteUrl(url, feedUrl) || url || feedUrl, date }];
  });
};

const refreshFeed = async (feed: { url?: string; feedUrl?: string }) => {
  if (!feed.url || !feed.feedUrl) return { url: feed.url || "", latestPosts: [], ok: false };

  try {
    const result = await fetchText(feed.feedUrl);
    if (!/(<rss\b|<feed\b|<rdf:RDF\b)/i.test(result.text)) {
      return { url: feed.url, feedUrl: result.url, latestPosts: [], ok: false };
    }
    return {
      url: feed.url,
      feedUrl: result.url,
      latestPosts: parseFeed(result.text, result.url),
      ok: true,
    };
  } catch {
    return { url: feed.url, feedUrl: feed.feedUrl, latestPosts: [], ok: false };
  }
};

export const onRequestOptions = () =>
  new Response(null, {
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

export const onRequestPost = async ({ request }: { request: Request }) => {
  let feeds: Array<{ url?: string; feedUrl?: string }> = [];

  try {
    const body = (await request.json()) as { feeds?: Array<{ url?: string; feedUrl?: string }> };
    feeds = Array.isArray(body.feeds) ? body.feeds.slice(0, FEED_CANDIDATE_LIMIT) : [];
  } catch {
    return json({ friends: [] }, { status: 400 });
  }

  const friends = await Promise.all(feeds.map(refreshFeed));
  friends.sort((a, b) => {
    const latestA = a.latestPosts[0]?.date || "";
    const latestB = b.latestPosts[0]?.date || "";
    return latestB.localeCompare(latestA);
  });

  return json({ friends });
};
