# Weiyang Astro Theme

Weiyang is a quiet personal blog theme built with Astro 7. It is designed for long-term writing, short moments, archives, friends, comments and a restrained personal homepage.

中文名：未央

## Latest Update Summary

- Added a pure white theme alongside paper, pine and dark themes.
- Kept automatic day/night switching while allowing manual theme selection from the navigation theme menu.
- Refined the homepage update timeline with smaller dots, lighter default lines, stronger hover lines and subtle motion effects.
- Timeline nodes now use date parity: odd-numbered dates appear above the line, even-numbered dates appear below it.
- Timeline start and end dates are shown below the axis as vertical labels using the same accent color as the homepage NOTE label.
- Friend links now keep up to three latest feed items in the static data and refresh live through a Cloudflare Pages Function.

## Features

- Personal homepage with logo, site title, subtitle, latest moment and latest posts.
- Minimal icon-only navigation with hover titles.
- Font Awesome 6 navigation icons and enlarged footer icons.
- Theme menu with automatic mode plus four manual themes: paper, white, pine and dark.
- Automatic theme mode switches to day at 06:00 and night at 18:00.
- Posts, moments, archive, friends, about, category and tag pages.
- Clickable post categories and tags with generated taxonomy pages.
- Archive page grouped by month, with collapsible groups and taxonomy links.
- Homepage update timeline with daily update bars, small timeline dots, hover popovers and start/end date labels.
- Timeline includes posts, moments and latest comments.
- Timeline placement follows date parity: odd dates above, even dates below.
- Post page with right-side table of contents.
- Floating post actions for back-to-top and jump-to-comments.
- Comment section layout with required nickname/email and optional website field.
- Friends page with own-site info, copy buttons, two-column friend cards and latest feed items.
- Cloudflare Pages Function for live friend RSS/Atom refresh at `/api/friend-feeds`.
- RSS output route.
- LXGW WenKai / Xiawu Feikai style font stack.
- Markdown posts and moments, with centralized site settings in `src/data/site.ts`.

## Theme Name

The theme is named **Weiyang**.

The name comes from “未央”, meaning unfinished, ongoing and open-ended. It fits a personal site that keeps collecting notes, memories and writing over time.

## Quick Start

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

For local testing of Cloudflare Pages Functions:

```bash
npm run build
npx wrangler pages dev dist
```

## Project Structure

```text
functions/
  api/
    friend-feeds.ts      Cloudflare Pages Function for live RSS/Atom refresh
src/
  data/
    site.ts              Site, navigation, comments, social links and projects
    friends.ts           Friend links and latest feed samples
  content/
    posts/               Markdown articles
    moments/             Markdown moments
  layouts/
    BaseLayout.astro     Shared layout, navigation, search, theme switcher and footer
  pages/
    index.astro          Homepage with moment, notes and update timeline
    about.astro          About page with projects
    archive.astro        Archive and taxonomy overview
    friends.astro        Friend links page
    moments.astro        Moments page
    posts/[slug].astro   Post detail page
    categories/[category].astro
    tags/[tag].astro
    rss.xml.ts
  styles/
    global.css           Theme colors, layout and component styling
  utils/
    posts.ts             Markdown post loader and normalizer
    moments.ts           Markdown moment loader and normalizer
    taxonomy.ts          Category and tag URL helpers
public/
  assets/logo.png        Site logo
  favicon.ico
```

## Customization

Edit site metadata, navigation and social links in:

```text
src/data/site.ts
```

Edit friend links and feed entries in:

```text
src/data/friends.ts
```

Replace the logo:

```text
public/assets/logo.png
```

Adjust colors and layout:

```text
src/styles/global.css
```

The theme colors are controlled by CSS variables under:

```css
:root[data-theme="paper"]
:root[data-theme="white"]
:root[data-theme="pine"]
:root[data-theme="dark"]
```

The theme menu and automatic theme schedule are controlled in:

```text
src/layouts/BaseLayout.astro
```

The homepage timeline is controlled by:

```text
src/pages/index.astro
src/styles/global.css
```

## Content Model

Posts live in:

```text
src/content/posts/
```

Moments live in:

```text
src/content/moments/
```

Supported post frontmatter fields include `title`, `date`, `pubDate`, `pubDatetime`, `timestamp`, `category`, `series`, `tags` and `description`. The post table of contents is generated from Markdown headings.

## Deployment

The site can be deployed to Cloudflare Pages as a static Astro build with Pages Functions:

```bash
npm run build
npx wrangler pages deploy dist --project-name weiyang-ficor --branch main
```

The deployed Cloudflare Pages Function at `/api/friend-feeds` refreshes friend feed data on page load and returns up to three latest posts per feed.

## Suggested Next Steps

- Connect the comment form to Waline, Twikoo or a custom API.
- Add a license before publishing or reusing publicly.

## License

No license has been added yet. Add one before publishing or reusing publicly.
