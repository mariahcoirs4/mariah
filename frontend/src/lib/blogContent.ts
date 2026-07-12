export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function splitList(value?: string | null) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatBlogDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function estimateReadingTime(value: string) {
  const words = stripText(value).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function authorInitials(name?: string | null) {
  if (!name) return 'MC';
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return 'MC';
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function stripText(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderMarkdown(content: string) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let paragraph: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let inCode = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${paragraph.map((line) => renderInlineMarkdown(line)).join(' ')}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || !listItems.length) return;
    const tag = listType;
    output.push(`<${tag}>${listItems.map((item) => `<li>${item}</li>`).join('')}</${tag}>`);
    listType = null;
    listItems = [];
  };

  const flushCode = () => {
    if (!codeLines.length) return;
    output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('```')) {
      if (inCode) {
        flushCode();
      } else {
        flushParagraph();
        flushList();
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      output.push(`<h${level} id="${slugify(text)}">${renderInlineMarkdown(text)}</h${level}>`);
      continue;
    }

    const quoteMatch = line.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      output.push(`<blockquote>${renderInlineMarkdown(quoteMatch[1])}</blockquote>`);
      continue;
    }

    const listMatch = line.match(/^(\d+\.|[-*])\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const nextType = /^\d+\./.test(listMatch[1]) ? 'ol' : 'ul';
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push(renderInlineMarkdown(listMatch[2]));
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushCode();

  return output.join('\n');
}

function injectHeadingIds(html: string) {
  if (typeof DOMParser === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('h2, h3, h4').forEach((heading) => {
    const text = heading.textContent?.trim() ?? '';
    if (!heading.id && text) heading.id = slugify(text);
  });
  return doc.body.innerHTML;
}

function extractHeadingsFromHtml(html: string) {
  if (typeof DOMParser === 'undefined') return [] as TocEntry[];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('h2, h3, h4')).map((heading) => ({
    id: heading.id || slugify(heading.textContent?.trim() ?? ''),
    text: heading.textContent?.trim() ?? '',
    level: Number(heading.tagName.slice(1)),
  }));
}

function extractHeadingsFromMarkdown(content: string) {
  return content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .flatMap((line) => {
      const match = line.match(/^(#{2,4})\s+(.*)$/);
      if (!match) return [];
      const level = match[1].length;
      const text = match[2].trim();
      return [{ id: slugify(text), text, level } satisfies TocEntry];
    });
}

export function renderBlogContent(content: string) {
  const value = content.trim();
  if (!value) return '';

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value) && !/^\s*#/.test(value);
  const html = looksLikeHtml ? value : renderMarkdown(value);
  return injectHeadingIds(html);
}

export function extractTableOfContents(content: string) {
  const value = content.trim();
  if (!value) return [] as TocEntry[];

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value) && !/^\s*#/.test(value);
  return looksLikeHtml ? extractHeadingsFromHtml(value) : extractHeadingsFromMarkdown(value);
}
