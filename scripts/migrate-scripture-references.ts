import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Book name mappings for the API
const bookMappings: Record<string, string> = {
  "genesis": "GEN", "gen": "GEN",
  "exodus": "EXO", "exod": "EXO", "ex": "EXO",
  "leviticus": "LEV", "lev": "LEV",
  "numbers": "NUM", "num": "NUM",
  "deuteronomy": "DEU", "deut": "DEU", "dt": "DEU",
  "joshua": "JOS", "josh": "JOS",
  "judges": "JDG", "judg": "JDG",
  "ruth": "RUT",
  "1 samuel": "1SA", "1samuel": "1SA", "1 sam": "1SA", "1sam": "1SA",
  "2 samuel": "2SA", "2samuel": "2SA", "2 sam": "2SA", "2sam": "2SA",
  "1 kings": "1KI", "1kings": "1KI", "1 kgs": "1KI", "1kgs": "1KI",
  "2 kings": "2KI", "2kings": "2KI", "2 kgs": "2KI", "2kgs": "2KI",
  "1 chronicles": "1CH", "1chronicles": "1CH", "1 chr": "1CH", "1chr": "1CH",
  "2 chronicles": "2CH", "2chronicles": "2CH", "2 chr": "2CH", "2chr": "2CH",
  "ezra": "EZR",
  "nehemiah": "NEH", "neh": "NEH",
  "esther": "EST", "esth": "EST",
  "job": "JOB",
  "psalms": "PSA", "psalm": "PSA", "ps": "PSA", "psa": "PSA",
  "proverbs": "PRO", "prov": "PRO", "pr": "PRO",
  "ecclesiastes": "ECC", "eccl": "ECC", "eccles": "ECC",
  "song of solomon": "SNG", "song of songs": "SNG", "songs": "SNG", "sos": "SNG",
  "isaiah": "ISA", "isa": "ISA",
  "jeremiah": "JER", "jer": "JER",
  "lamentations": "LAM", "lam": "LAM",
  "ezekiel": "EZK", "ezek": "EZK",
  "daniel": "DAN", "dan": "DAN",
  "hosea": "HOS", "hos": "HOS",
  "joel": "JOL",
  "amos": "AMO",
  "obadiah": "OBA", "obad": "OBA",
  "jonah": "JON",
  "micah": "MIC", "mic": "MIC",
  "nahum": "NAM", "nah": "NAM",
  "habakkuk": "HAB", "hab": "HAB",
  "zephaniah": "ZEP", "zeph": "ZEP",
  "haggai": "HAG", "hag": "HAG",
  "zechariah": "ZEC", "zech": "ZEC",
  "malachi": "MAL", "mal": "MAL",
  "matthew": "MAT", "matt": "MAT", "mt": "MAT",
  "mark": "MRK", "mk": "MRK",
  "luke": "LUK", "lk": "LUK",
  "john": "JHN", "jn": "JHN",
  "acts": "ACT",
  "romans": "ROM", "rom": "ROM",
  "1 corinthians": "1CO", "1corinthians": "1CO", "1 cor": "1CO", "1cor": "1CO",
  "2 corinthians": "2CO", "2corinthians": "2CO", "2 cor": "2CO", "2cor": "2CO",
  "galatians": "GAL", "gal": "GAL",
  "ephesians": "EPH", "eph": "EPH",
  "philippians": "PHP", "phil": "PHP",
  "colossians": "COL", "col": "COL",
  "1 thessalonians": "1TH", "1thessalonians": "1TH", "1 thess": "1TH", "1thess": "1TH",
  "2 thessalonians": "2TH", "2thessalonians": "2TH", "2 thess": "2TH", "2thess": "2TH",
  "1 timothy": "1TI", "1timothy": "1TI", "1 tim": "1TI", "1tim": "1TI",
  "2 timothy": "2TI", "2timothy": "2TI", "2 tim": "2TI", "2tim": "2TI",
  "titus": "TIT",
  "philemon": "PHM", "phlm": "PHM",
  "hebrews": "HEB", "heb": "HEB",
  "james": "JAS", "jas": "JAS",
  "1 peter": "1PE", "1peter": "1PE", "1 pet": "1PE", "1pet": "1PE",
  "2 peter": "2PE", "2peter": "2PE", "2 pet": "2PE", "2pet": "2PE",
  "1 john": "1JN", "1john": "1JN", "1 jn": "1JN", "1jn": "1JN",
  "2 john": "2JN", "2john": "2JN", "2 jn": "2JN", "2jn": "2JN",
  "3 john": "3JN", "3john": "3JN", "3 jn": "3JN", "3jn": "3JN",
  "jude": "JUD",
  "revelation": "REV", "rev": "REV",
};

// Regex to match scripture references
const scriptureRegex = /\b((?:1|2|3|I|II|III)?\s*[A-Za-z]+)\s+(\d+)(?::(\d+))?(?:\s*[-–—]\s*(\d+)(?::(\d+))?)?\b/g;

interface ScriptureRef {
  fullMatch: string;
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  chapterEnd?: number;
}

function parseScriptureReference(match: RegExpMatchArray): ScriptureRef | null {
  const [fullMatch, book, chapter, verseStart, endPart, verseEndPart] = match;

  const normalizedBook = book.toLowerCase().trim()
    .replace(/^i\s+/, "1 ")
    .replace(/^ii\s+/, "2 ")
    .replace(/^iii\s+/, "3 ");

  const bookCode = bookMappings[normalizedBook];
  if (!bookCode) {
    return null;
  }

  const result: ScriptureRef = {
    fullMatch,
    book: bookCode,
    chapter: parseInt(chapter),
  };

  if (verseStart) {
    result.verseStart = parseInt(verseStart);
  }

  if (endPart) {
    if (verseEndPart) {
      // Format: Book chapter:verse - chapter:verse
      result.chapterEnd = parseInt(endPart);
      result.verseEnd = parseInt(verseEndPart);
    } else if (verseStart) {
      // Format: Book chapter:verse-verse
      result.verseEnd = parseInt(endPart);
    } else {
      // Format: Book chapter-chapter
      result.chapterEnd = parseInt(endPart);
    }
  }

  return result;
}

async function fetchVerseText(ref: ScriptureRef): Promise<string | null> {
  try {
    // Using bible-api.com which is free and doesn't require API key
    // It doesn't have NASB, but we can use it for now and note that in the tooltip
    // Alternative: Use API.Bible with NASB (requires API key)

    let query = `${ref.book}+${ref.chapter}`;
    if (ref.verseStart) {
      query += `:${ref.verseStart}`;
      if (ref.verseEnd && !ref.chapterEnd) {
        query += `-${ref.verseEnd}`;
      }
    }

    // For cross-chapter references, we'll just get the starting chapter for now
    const url = `https://bible-api.com/${query}?translation=web`;

    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  Failed to fetch ${query}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.text) {
      // Clean up the text
      return data.text.trim().replace(/\n/g, " ").replace(/\s+/g, " ");
    }

    return null;
  } catch (error) {
    console.error(`  Error fetching verse:`, error);
    return null;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function processContent(content: string): Promise<{ updated: string; count: number }> {
  // Skip if already has scripture-reference spans
  if (content.includes('data-scripture-reference')) {
    // Still process parts that don't have the attribute
  }

  let updatedContent = content;
  let count = 0;
  const processedRefs = new Set<string>();

  // Find all matches first
  const matches: { match: RegExpMatchArray; ref: ScriptureRef }[] = [];
  let match;

  // Reset regex
  scriptureRegex.lastIndex = 0;

  while ((match = scriptureRegex.exec(content)) !== null) {
    // Skip if this reference is already inside a scripture-reference span
    const beforeMatch = content.substring(0, match.index);
    const afterMatch = content.substring(match.index + match[0].length);

    // Check if we're inside an existing scripture-reference span
    const lastOpenSpan = beforeMatch.lastIndexOf('<span');
    const lastCloseSpan = beforeMatch.lastIndexOf('</span>');

    if (lastOpenSpan > lastCloseSpan) {
      const spanContent = beforeMatch.substring(lastOpenSpan);
      if (spanContent.includes('data-scripture-reference')) {
        continue;
      }
    }

    // Skip if inside an HTML tag attribute
    const lastOpenTag = beforeMatch.lastIndexOf('<');
    const lastCloseTag = beforeMatch.lastIndexOf('>');
    if (lastOpenTag > lastCloseTag) {
      continue;
    }

    const ref = parseScriptureReference(match);
    if (ref && !processedRefs.has(match[0])) {
      processedRefs.add(match[0]);
      matches.push({ match, ref });
    }
  }

  // Process matches in reverse order to preserve indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const { match, ref } = matches[i];

    console.log(`  Processing: ${match[0]}`);
    const verseText = await fetchVerseText(ref);

    if (verseText) {
      const escapedRef = escapeHtml(match[0]);
      const escapedText = escapeHtml(verseText);

      const replacement = `<span data-scripture-reference="" class="scripture-reference" data-reference="${escapedRef}" data-verse-text="${escapedText}">${match[0]}</span>`;

      updatedContent =
        updatedContent.substring(0, match.index) +
        replacement +
        updatedContent.substring(match.index + match[0].length);

      count++;

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return { updated: updatedContent, count };
}

async function main() {
  console.log("Starting scripture reference migration...\n");

  // Get all published posts
  const posts = await prisma.post.findMany({
    where: {
      status: "published",
    },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });

  console.log(`Found ${posts.length} published posts\n`);

  let totalUpdated = 0;
  let totalReferences = 0;

  for (const post of posts) {
    console.log(`\nProcessing: "${post.title}"`);

    const { updated, count } = await processContent(post.content);

    if (count > 0) {
      await prisma.post.update({
        where: { id: post.id },
        data: { content: updated },
      });

      console.log(`  Updated ${count} scripture references`);
      totalUpdated++;
      totalReferences += count;
    } else {
      console.log(`  No new references to update`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Migration complete!`);
  console.log(`Posts updated: ${totalUpdated}`);
  console.log(`Total references added: ${totalReferences}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
