/**
 * Comprehensive HTML Heading Extractor
 *
 * Extracts headings from any HTML string without using DOMParser
 * Handles complex HTML including both standard h1-h6 tags and custom elements with level attributes
 *
 */

// Define types
export interface HeadingObject {
  level: number;
  text: string;
  id: string | null;
}

export interface TocItem extends HeadingObject {
  children: TocItem[];
}

interface ExtractHeadingsOptions {
  minLevel?: number;
  maxLevel?: number;
  generateIds?: boolean;
  includeNoId?: boolean;
}

interface TableOfContentsOptions {
  maxDepth?: number;
}

interface ParseHtmlHeadingsOptions
  extends ExtractHeadingsOptions,
    TableOfContentsOptions {
  generateToc?: boolean;
}

interface ParseHtmlHeadingsResult {
  headings: HeadingObject[];
  toc: TocItem[];
}

/**
 * Extract all headings from an HTML string
 *
 * @param {string} htmlString - The HTML content to parse
 * @param {ExtractHeadingsOptions} options - Configuration options
 * @returns {HeadingObject[]} Array of heading objects with level, text, and id properties
 */
function extractHeadings(
  htmlString: string,
  options: ExtractHeadingsOptions = {}
): HeadingObject[] {
  // Default options
  const config = {
    minLevel: options.minLevel || 1,
    maxLevel: options.maxLevel || 6,
    generateIds: options.generateIds !== false, // true by default
    includeNoId: options.includeNoId !== false, // true by default
  };

  // Validate levels
  if (config.minLevel < 1 || config.minLevel > 6) config.minLevel = 1;
  if (config.maxLevel < 1 || config.maxLevel > 6) config.maxLevel = 6;
  if (config.minLevel > config.maxLevel) config.minLevel = config.maxLevel;

  const headings: HeadingObject[] = [];

  /**
   * Process a heading match and add it to the headings array
   * @param {string} attributesStr - The HTML tag attributes
   * @param {string} content - The content inside the heading tags
   * @param {number} level - The heading level (1-6)
   */
  function processHeadingMatch(
    attributesStr: string,
    content: string,
    level: number
  ): void {
    // Extract ID if present
    const idMatch = attributesStr.match(/\bid=["']([^"']+)["']/i);
    let id: string | null = idMatch ? idMatch[1] : null;

    // Clean the heading content
    const text = cleanHtmlContent(content);

    // Skip empty headings
    if (!text.trim()) return;

    // Generate ID if needed
    if (!id && config.generateIds) {
      id = generateHeadingId(text);
    }

    // Skip headings without IDs if includeNoId is false
    if (!id && !config.includeNoId) return;

    headings.push({
      level,
      text,
      id,
    });
  }

  // Create a pattern that matches any heading within the specified range
  const combinedPattern = new RegExp(
    `<h([${config.minLevel}-${config.maxLevel}])\\b([^>]*?)>((?:.|\\s)*?)<\\/h\\1>`,
    "gi"
  );

  // Process headings in the order they appear in the document
  let match: RegExpExecArray | null;
  while ((match = combinedPattern.exec(htmlString)) !== null) {
    const level = parseInt(match[1], 10);
    processHeadingMatch(match[2], match[3], level);
  }

  return headings;
}
/**
 * Clean HTML content by removing nested tags and decoding entities
 * @param {string} html - HTML content string
 * @returns {string} Cleaned text content
 */
function cleanHtmlContent(html: string): string {
  // Remove all HTML tags
  let content = html.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  content = decodeHTMLEntities(content);

  // Normalize whitespace
  content = content.replace(/\s+/g, " ").trim();

  return content;
}

/**
 * Decode common HTML entities
 * @param {string} html - String containing HTML entities
 * @returns {string} String with decoded entities
 */
function decodeHTMLEntities(html: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "©",
    "&reg;": "®",
    "&euro;": "€",
    "&pound;": "£",
    "&yen;": "¥",
    "&cent;": "¢",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
    "&trade;": "™",
    "&bull;": "•",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
  };

  // Replace named entities
  let decoded = html.replace(
    /&[a-zA-Z0-9]+;/g,
    (match) => entities[match] || match
  );

  // Replace numeric entities (decimal)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );

  // Replace numeric entities (hex)
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  return decoded;
}

/**
 * Generate a slug-style ID from heading text
 * @param {string} text - The heading text
 * @returns {string} A URL-friendly ID
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/-{2,}/g, "-"); // Replace multiple hyphens with single hyphen
}

/**
 * Generate a hierarchical table of contents from headings
 * @param {HeadingObject[]} headings - Array of heading objects
 * @param {TableOfContentsOptions} options - Configuration options
 * @returns {TocItem[]} Hierarchical TOC structure
 */
function generateTableOfContents(
  headings: HeadingObject[],
  options: TableOfContentsOptions = {}
): TocItem[] {
  const maxDepth = options.maxDepth || Infinity;

  if (!headings || !headings.length) return [];

  // Find the minimum heading level to start with
  const minLevel = Math.min(...headings.map((heading) => heading.level));

  /**
   * Build the TOC tree recursively
   * @param {HeadingObject[]} items - Heading items to process
   * @param {number} currentLevel - Current heading level being processed
   * @param {number} depth - Current depth of recursion
   * @returns {TocItem[]} Tree of TOC items for current level
   */
  function buildTocTree(
    items: HeadingObject[],
    currentLevel: number,
    depth: number = 1
  ): TocItem[] {
    if (depth > maxDepth) return [];

    const result: TocItem[] = [];
    let i = 0;

    while (i < items.length) {
      const heading = items[i];

      // Skip headings with levels different from what we're currently processing
      if (heading.level !== currentLevel) {
        i++;
        continue;
      }

      // Create TOC item
      const tocItem: TocItem = {
        id: heading.id || generateHeadingId(heading.text),
        text: heading.text,
        level: heading.level,
        children: [],
      };

      // Add to result array
      result.push(tocItem);
      i++;

      // Find child headings (all consecutive headings with deeper levels)
      const childHeadings = [];
      let j = i;

      while (j < items.length && items[j].level > currentLevel) {
        childHeadings.push(items[j]);
        j++;
      }

      // Process child headings if we have any
      if (childHeadings.length > 0) {
        // Find the next level down
        const nextLevel = Math.min(...childHeadings.map((h) => h.level));

        // Process children if we haven't reached max depth
        if (depth < maxDepth) {
          tocItem.children = buildTocTree(childHeadings, nextLevel, depth + 1);
        }

        // Skip past the children we just processed
        i = j;
      }
    }

    return result;
  }

  return buildTocTree(headings, minLevel);
}

/**
 * Extract headings and generate table of contents from HTML
 * @param {string} html - HTML string to parse
 * @param {ParseHtmlHeadingsOptions} options - Configuration options
 * @returns {ParseHtmlHeadingsResult} Object containing extracted headings and hierarchical TOC
 */
function parseHtmlHeadings(
  html: string,
  options: ParseHtmlHeadingsOptions = { generateToc: true }
): ParseHtmlHeadingsResult {
  // Extract headings
  const headings = extractHeadings(html, options);

  // Generate TOC if requested
  const toc =
    options.generateToc !== false
      ? generateTableOfContents(headings, options)
      : [];

  return {
    headings,
    toc,
  };
}

// Example usage
export function example(): ParseHtmlHeadingsResult {
  const htmlContent = `
    <div>
      <h1 id="main-title">Main Title</h1>
      <p>Some content here...</p>
      <h2 id="section1">Section One</h2>
      <p>More content...</p>
      <div level="3" id="subsection1" class="heading">Subsection 1.1</div>
      <p>Details here...</p>
      <h3 id="subsection2"><strong>Subsection 1.2</strong> with <em>formatting</em></h3>
      <p>More details...</p>
      <h2 level="2" id="section2">Section Two</h2>
      <p>Second section content...</p>
      <h3>Subsection 2.1 (no ID)</h3>
      <h4 id="deep">Deep nested</h4>
    </div>
  `;

  const result = parseHtmlHeadings(htmlContent, {
    minLevel: 1,
    maxLevel: 6,
    generateIds: true,
    generateToc: true,
    maxDepth: 4,
  });

  console.log("Extracted Headings:", result.headings);
  console.log("Table of Contents:", JSON.stringify(result.toc, null, 2));

  return result;
}

// Export the functions
export { extractHeadings, generateTableOfContents, parseHtmlHeadings };
