# Mariah Coirs SEO Guide

This document is a practical SEO blueprint for the current application. It is written for the existing stack in this repository:

- Frontend: React + Vite + React Router SPA
- Backend: Node.js + Express + Prisma + PostgreSQL
- Content system: blog CRUD with SEO fields already present

The goal is not only to rank the homepage, but to turn the site into a search-friendly content and product hub that can compete for commercial, informational, and local export-intent queries.

## 1. Current SEO Reality Check

The current app already has a few useful pieces:

- Blog posts have `metaTitle`, `metaDescription`, `canonicalUrl`, `slug`, and `featuredImage`.
- Blog listing and blog detail routes already exist.
- The blog detail page sets the document title, meta description, and canonical URL dynamically.

The biggest gaps are:

- The site is a client-rendered SPA, so search engines get less content at first load than they would from SSR or prerendered pages.
- The app has only a small number of indexable routes: home, blog listing, blog detail, and admin.
- Important SEO pages like product pages, category pages, FAQ, about, contact, certifications, shipping/export information, and location pages are not separate indexable routes.
- There is no visible sitemap, robots file, or structured data strategy in the frontend yet.
- Blog pages are SEO-aware, but the rest of the site is still mostly a single landing page.

## 2. SEO Goal

For top-level SEO, the site should do three things well:

1. Rank for brand queries and company intent.
2. Rank for product and category queries such as coco peat, coir pith, coir fiber, coir blocks, and export supply terms.
3. Rank for informational queries through blogs, FAQs, comparison pages, and guides.

That means the site should not rely on the homepage alone. A strong SEO site needs a content architecture with dedicated pages for each important search intent.

## 3. Best Page Structure For This Business

### Pages you already have

- `/` Home
- `/blogs` Blog listing
- `/blog/:slug` Blog detail
- `/admin` Admin portal

### Pages you should add

These are the most valuable pages for this kind of business:

- `/about` About the company
- `/products` Product listing hub
- `/products/:slug` Individual product pages
- `/products/category/:category` Category pages
- `/industries` Industries and use cases
- `/certifications` Certifications and compliance
- `/export-process` Export, packaging, logistics, and shipping process
- `/faq` FAQ page
- `/contact` Contact page
- `/locations` or `/service-areas` if you want regional targeting
- `/resources` or `/knowledge-center` as a content hub for guides beyond blogs
- `/privacy`, `/terms`, `/sitemap` if linked in the footer

### Pages that are optional but powerful

Add these only if you can support them with real content:

- `/use-cases/cocopeat-for-hydroponics`
- `/use-cases/cocopeat-for-nurseries`
- `/use-cases/coir-for-landscaping`
- `/use-cases/coir-for-mattress-or-bedding`
- `/export-destinations/:country`
- `/industry/:industry`
- `/compare/:product-a-vs-product-b`

These pages are excellent for long-tail search traffic if the content is unique and useful.

## 4. Recommendation: Do You Need Additional Pages?

Yes, you should add additional pages.

If you keep only the homepage and blogs, you will limit your search reach. For this business, the highest-value pages are product pages, category pages, use-case pages, and company trust pages.

### Priority order

1. Product pages
2. Product category pages
3. About, Contact, Certifications, Export Process
4. FAQ page
5. Use-case pages
6. Location pages if you have region-specific demand
7. Resource hub pages for guides and comparisons

## 5. Technical SEO Foundation

This is the order in which the technical work should be done.

### Step 1: Make every important page crawlable

The app is currently a React SPA. For SEO, you should move toward one of these:

- SSR with a framework like Next.js
- Prerendering for static marketing pages
- Hybrid rendering where marketing pages are prerendered and admin remains SPA-like

If you keep the current Vite SPA only, you can still improve SEO, but it will never be as strong as SSR or prerendering for competitive search terms.

### Step 2: Create proper metadata per route

Every page should have:

- Unique `<title>`
- Unique meta description
- Canonical URL
- Open Graph tags
- Twitter card tags
- Correct index/follow directives

### Step 3: Add structured data

Use JSON-LD schema markup for:

- Organization
- WebSite
- BreadcrumbList
- Article for blog detail pages
- Product for product pages
- FAQPage for FAQ pages
- LocalBusiness if you target a physical region

### Step 4: Add sitemap and robots

You should have:

- `robots.txt`
- `sitemap.xml`

Your sitemap must include:

- Home page
- Static pages
- Product pages
- Category pages
- Blog listing and blog posts

### Step 5: Fix performance and Core Web Vitals

Search rankings depend heavily on speed and stability.

You should optimize:

- LCP by compressing and lazy-loading heavy images
- CLS by reserving image and layout space
- INP by reducing client-side rendering work

### Step 6: Improve internal linking

Every page should link to related pages:

- Homepage to product categories and trust pages
- Product pages to related products and relevant blogs
- Blogs to products and use-case pages
- FAQ to relevant product or service pages

## 6. Blog SEO System

You already have the right data model for blog SEO. Use it properly.

### What to store for every blog post

- `title`
- `slug`
- `metaTitle`
- `metaDescription`
- `canonicalUrl`
- `featuredImage`
- `shortDescription`
- full HTML content
- published/unpublished status

### Blog publishing rules

Every blog should follow this format:

- One clear keyword target
- One search intent
- One primary CTA
- 700 to 1800+ words depending on topic depth
- H2 and H3 headings
- Internal links to products and related articles
- Original images where possible
- FAQ section at the bottom when relevant

### Blog topic clusters you should build

Build blogs around clusters, not random posts.

#### Commercial intent cluster

- Coco peat exporter
- Coir pith supplier
- Coir fiber bulk supply
- Best cocopeat for hydroponics
- How to choose coco peat blocks

#### Educational cluster

- What is coco peat
- Benefits of coir products
- How coco peat is made
- How to store coir products
- How to use coco peat in farming

#### Trust cluster

- Certifications and quality control
- Export packaging standards
- Moisture control and grading
- Supply chain and production process

#### Comparison cluster

- Coco peat vs soil
- Coco peat vs peat moss
- Coir fiber vs jute fiber
- Coir blocks vs loose coco peat

## 7. Content Architecture You Should Build

For this business, the best SEO structure is:

### Pillar pages

These are the main pages that should rank for broad terms:

- Home
- Products
- About
- Certifications
- Export Process
- FAQ
- Blog hub

### Cluster pages

These support the pillar pages:

- Product detail pages
- Category pages
- Use-case pages
- Country or region pages
- Individual blog posts

### How the pages should connect

- Each pillar page should link to all its cluster pages.
- Each cluster page should link back to its pillar page.
- Each blog should link to at least one product page and one related informational page.

## 8. Suggested SEO Page Set For Mariah Coirs

Below is a practical first release.

### Core pages

- Home
- About
- Products
- Coir Fiber
- Coco Peat
- Coir Blocks
- Certifications
- Export Process
- FAQ
- Contact
- Blog

### Product pages

Create one page per product family, and later split them into variants if needed:

- Coco peat blocks
- Coco peat loose
- Coir fiber
- Coir pith
- Coir chips
- Grow bags
- Custom export packaging

### Industry/use-case pages

- Hydroponics
- Nurseries
- Landscaping
- Agriculture
- Horticulture
- Soil conditioning

### Trust pages

- Quality control
- Packaging and loading
- Certificates and compliance
- Factory or production process
- Global shipping or export destinations

## 9. Homepage SEO Improvements

The homepage should not just be a visual landing screen. It should be a keyword-rich business page.

### Homepage sections to include

- Strong H1 with the core business keyword
- Short company summary
- Product categories with internal links
- Benefits and differentiators
- Industries served
- Certifications and proof
- Export capability and geography
- FAQ preview
- Blog preview
- Strong CTA

### Homepage copy guidelines

- Use the company name naturally
- Include the main keyword early
- Mention product categories explicitly
- Mention export capability if that is real
- Avoid keyword stuffing

## 10. Product Page SEO Rules

Every product page should include:

- Unique title tag
- Unique meta description
- Product-focused H1
- Product images with descriptive alt text
- Technical specs
- MOQ
- Packaging details
- Applications
- Certifications or quality notes
- FAQ section
- Internal links to related blogs and products

### Product page template

Use this structure:

1. Hero with product name, summary, and CTA
2. Product overview
3. Specifications
4. Applications
5. Packaging and export details
6. Quality and certifications
7. FAQ
8. Related blogs
9. Contact CTA

## 11. Blog SEO Rules

The blog system should be used as an acquisition channel, not just a news feed.

### Every blog should have

- One target keyword
- One search intent
- One canonical URL
- One featured image with alt text
- Internal links to at least 3 relevant pages
- A CTA that routes to the product or contact page

### Blog title formula examples

- What Is Coco Peat and How Is It Used?
- Coco Peat vs Peat Moss: Which Is Better for Hydroponics?
- How to Choose the Right Coir Fiber Supplier
- Export-Grade Coco Peat Packaging Standards

### Blog structure formula

1. Introduction with keyword and problem statement
2. Definition or overview
3. Main explanation
4. Step-by-step guidance or comparison
5. Common mistakes
6. FAQ
7. Conclusion and CTA

## 12. Structured Data To Add

Use JSON-LD, not visible text, for search engines.

### Organization schema

Add it to the homepage and sitewide layout.

### WebSite schema

Add search action if you plan to support on-site search.

### Breadcrumb schema

Add to every nested page.

### Article schema

Add to every blog detail page.

### Product schema

Add to every product detail page.

### FAQ schema

Add to FAQ pages and optionally to product pages with real questions.

## 13. URL Strategy

Keep URLs short, descriptive, and stable.

### Good URLs

- `/products/coco-peat-blocks`
- `/products/coir-fiber`
- `/industries/hydroponics`
- `/blog/how-coco-peat-is-made`

### Avoid

- Query-string driven content pages
- Mixed-case URLs
- Changing slugs after publication
- Duplicate routes for the same content

## 14. Image SEO Rules

This site is image-rich, so image SEO matters a lot.

### For every meaningful image

- Use descriptive file names
- Use compressed WebP or AVIF where possible
- Add accurate alt text
- Reserve layout space to prevent CLS
- Serve responsive sizes

### Alt text formula

- What the image shows
- What product or process it relates to
- What business intent it supports

Example:

- `Coco peat blocks stacked for export packaging`

## 15. Local And Export SEO

If the business sells globally or exports, build pages for those intents.

### Add if relevant

- Export destinations page
- Shipping and packaging page
- Country-specific landing pages
- Importer-friendly quality assurance page

### If you have a physical office or plant

- Add Google Business Profile
- Add LocalBusiness schema
- Keep NAP details consistent everywhere

## 16. Internal Linking Rules

Internal linking is one of the easiest ranking wins.

### Link plan

- Homepage links to major money pages
- Product pages link to blogs and categories
- Blogs link to products and FAQ pages
- FAQ links to contact and product pages
- Footer links to all major indexable pages

### Anchor text rules

- Use descriptive anchors
- Avoid repeated generic anchors like “click here”
- Match the page intent naturally

## 17. Indexing And Crawl Control

You need clear rules for what search engines should index.

### Index

- Home
- Product pages
- Category pages
- About
- Certifications
- FAQ
- Blog listing
- Published blog posts

### Noindex

- Admin portal
- Draft blog posts
- Private or duplicate utility pages
- Internal workflow pages

## 18. Analytics And SEO Tracking

Track SEO like a product.

### Tools to install

- Google Search Console
- Google Analytics or an equivalent analytics platform
- Bing Webmaster Tools
- Optional heatmap/session tracking if allowed

### Track these KPIs

- Impressions
- Clicks
- CTR
- Average position
- Indexed pages
- Crawl errors
- Conversions from organic traffic
- Blog-to-lead conversions

## 19. Implementation Roadmap

### Phase 1: Technical foundation

1. Add metadata strategy for every route.
2. Add `robots.txt` and `sitemap.xml`.
3. Add JSON-LD schemas.
4. Fix title, description, canonical handling sitewide.
5. Ensure admin and draft routes are not indexed.

### Phase 2: Core page expansion

1. Create About page.
2. Create Products hub.
3. Create product detail pages.
4. Create Certifications page.
5. Create Export Process page.
6. Create FAQ page.
7. Create Contact page.

### Phase 3: Content system

1. Build blog topic clusters.
2. Publish pillar articles.
3. Interlink blogs with product pages.
4. Add blog category and tag pages if useful.

### Phase 4: Performance and authority

1. Optimize images and font loading.
2. Improve Core Web Vitals.
3. Earn backlinks from industry directories and partners.
4. Strengthen E-E-A-T with real company proof.

## 20. What To Change In This Repo

The most important implementation changes for this codebase are:

### Frontend

- Add route-level metadata management for every page.
- Add reusable SEO component for title, description, canonical, OG, and Twitter tags.
- Add static pages for About, Products, FAQ, Certifications, Export Process, Contact, Privacy, Terms, and Sitemap.
- Add product and category route templates.
- Add structured data per page type.

### Backend

- Keep blog SEO fields, but make them mandatory for published content.
- Add API support for categories, tags, and related posts if you want stronger blog clustering.
- Add endpoints for sitemap generation if you want the backend to produce dynamic URLs.

### Deployment

- Make sure all public pages are served with crawlable HTML.
- If possible, move marketing pages to SSR or prerendering.
- Verify redirects, canonical URLs, and trailing slash behavior are consistent.

## 21. Best Practice Summary

If you want the highest SEO ceiling, the order of importance is:

1. SSR or prerendering for public pages
2. Unique metadata on every route
3. Dedicated product and category pages
4. Strong blog content clusters
5. Structured data
6. Sitemap and robots
7. Internal linking
8. Fast image-heavy performance
9. Trust pages and proof
10. Regular content publishing

## 22. Final Answer On Additional Pages

Yes, you should add additional pages.

If you want the site to rank seriously, the homepage and blogs alone are not enough. The site needs indexable product pages, category pages, trust pages, FAQ, and export/process pages. That is the minimum structure for a competitive SEO site in this domain.

The most important next pages are:

- About
- Products
- Product detail pages
- Certifications
- Export Process
- FAQ
- Contact
- Blog topic clusters

If you want, I can next turn this documentation into a concrete implementation plan for the codebase, including the exact routes, page names, and SEO component structure to add first.