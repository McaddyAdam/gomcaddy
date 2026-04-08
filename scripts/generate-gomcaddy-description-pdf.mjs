import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PAGE = {
  width: 612,
  height: 792,
  marginLeft: 56,
  marginRight: 56,
  marginBottom: 52,
};

const COLORS = {
  accent: [0.07, 0.67, 0.5],
  body: [0.11, 0.14, 0.18],
  line: [0.84, 0.88, 0.9],
  muted: [0.38, 0.43, 0.49],
  titleBand: [0.03, 0.09, 0.14],
  white: [1, 1, 1],
};

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePath = join(rootDir, 'docs', 'gomcaddy-website-description.md');
const outputPath = join(rootDir, 'docs', 'gomcaddy-website-description.pdf');

function normalizeText(value) {
  return value
    .replace(/\r/g, '')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2022/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '');
}

function escapePdfText(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text, maxWidth, fontSize, isBold = false) {
  const normalized = text.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return [];
  }

  const avgCharWidth = fontSize * (isBold ? 0.56 : 0.52);
  const maxChars = Math.max(12, Math.floor(maxWidth / avgCharWidth));
  const words = normalized.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars || !currentLine) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function parseMarkdown(markdown) {
  const lines = normalizeText(markdown).split('\n');
  let title = '';
  const intro = [];
  const blocks = [];
  let paragraphLines = [];
  let sectionStarted = false;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    const text = paragraphLines.join(' ').trim();
    paragraphLines = [];

    if (!text) {
      return;
    }

    if (!sectionStarted) {
      intro.push(text);
      return;
    }

    blocks.push({ type: 'paragraph', text });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      title = line.slice(2).trim();
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      sectionStarted = true;
      blocks.push({ type: 'heading', text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      sectionStarted = true;
      blocks.push({ type: 'bullet', text: line.slice(2).trim() });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();

  if (!title) {
    throw new Error(`Missing title in ${sourcePath}`);
  }

  return { title, intro, blocks };
}

class PdfRenderer {
  constructor(title) {
    this.title = title;
    this.pages = [];
    this.currentPage = null;
    this.cursorY = 0;
  }

  begin() {
    this.startPage(true);
  }

  startPage(firstPage = false) {
    const page = { firstPage, operations: [] };
    this.pages.push(page);
    this.currentPage = page;

    page.operations.push('q');
    page.operations.push('1 1 1 rg');
    page.operations.push(`0 0 ${PAGE.width} ${PAGE.height} re f`);
    page.operations.push('Q');

    if (firstPage) {
      page.operations.push('q');
      page.operations.push(`${COLORS.titleBand.join(' ')} rg`);
      page.operations.push(`0 618 ${PAGE.width} 174 re f`);
      page.operations.push('Q');

      page.operations.push('q');
      page.operations.push(`${COLORS.accent.join(' ')} rg`);
      page.operations.push(`${PAGE.marginLeft} 684 146 8 re f`);
      page.operations.push('Q');

      this.cursorY = 582;
      return;
    }

    page.operations.push('q');
    page.operations.push(`${COLORS.line.join(' ')} RG`);
    page.operations.push(`${PAGE.marginLeft} 742 m ${PAGE.width - PAGE.marginRight} 742 l S`);
    page.operations.push('Q');
    this.drawText('GoMcaddy Website Description', PAGE.marginLeft, 754, {
      color: COLORS.muted,
      font: 'F2',
      size: 10,
    });

    this.cursorY = 716;
  }

  drawText(text, x, y, options = {}) {
    const { color = COLORS.body, font = 'F1', size = 12 } = options;

    this.currentPage.operations.push('BT');
    this.currentPage.operations.push(`/${font} ${size} Tf`);
    this.currentPage.operations.push(`${color.join(' ')} rg`);
    this.currentPage.operations.push(`1 0 0 1 ${x} ${y} Tm`);
    this.currentPage.operations.push(`(${escapePdfText(text)}) Tj`);
    this.currentPage.operations.push('ET');
  }

  ensureSpace(requiredHeight) {
    if (this.cursorY - requiredHeight >= PAGE.marginBottom) {
      return;
    }

    this.startPage(false);
  }

  renderCover(title, introParagraphs) {
    this.drawText('PROJECT PROFILE', PAGE.marginLeft, 732, {
      color: COLORS.accent,
      font: 'F2',
      size: 11,
    });

    const titleLines = wrapText(title, PAGE.width - PAGE.marginLeft - PAGE.marginRight, 28, true);
    let titleY = 700;

    for (const line of titleLines) {
      this.drawText(line, PAGE.marginLeft, titleY, {
        color: COLORS.white,
        font: 'F2',
        size: 28,
      });
      titleY -= 34;
    }

    let introY = 636;

    for (const paragraph of introParagraphs) {
      const lines = wrapText(paragraph, PAGE.width - PAGE.marginLeft - PAGE.marginRight, 12);

      for (const line of lines) {
        this.drawText(line, PAGE.marginLeft, introY, {
          color: [0.88, 0.92, 0.95],
          font: 'F1',
          size: 12,
        });
        introY -= 16;
      }

      introY -= 8;
    }
  }

  renderHeading(text) {
    const requiredHeight = 34;
    this.ensureSpace(requiredHeight);
    this.drawText(text, PAGE.marginLeft, this.cursorY, {
      color: COLORS.body,
      font: 'F2',
      size: 18,
    });
    this.currentPage.operations.push('q');
    this.currentPage.operations.push(`${COLORS.accent.join(' ')} RG`);
    this.currentPage.operations.push(`${PAGE.marginLeft} ${this.cursorY - 7} m ${PAGE.marginLeft + 86} ${this.cursorY - 7} l S`);
    this.currentPage.operations.push('Q');
    this.cursorY -= 30;
  }

  renderParagraph(text) {
    const lines = wrapText(text, PAGE.width - PAGE.marginLeft - PAGE.marginRight, 12);
    const requiredHeight = lines.length * 16 + 10;
    this.ensureSpace(requiredHeight);

    for (const line of lines) {
      this.drawText(line, PAGE.marginLeft, this.cursorY, {
        color: COLORS.body,
        font: 'F1',
        size: 12,
      });
      this.cursorY -= 16;
    }

    this.cursorY -= 6;
  }

  renderBullet(text) {
    const bulletX = PAGE.marginLeft;
    const textX = PAGE.marginLeft + 18;
    const width = PAGE.width - textX - PAGE.marginRight;
    const lines = wrapText(text, width, 12);
    const requiredHeight = lines.length * 16 + 6;
    this.ensureSpace(requiredHeight);

    this.drawText('-', bulletX, this.cursorY, {
      color: COLORS.accent,
      font: 'F2',
      size: 12,
    });

    for (const line of lines) {
      this.drawText(line, textX, this.cursorY, {
        color: COLORS.body,
        font: 'F1',
        size: 12,
      });
      this.cursorY -= 16;
    }

    this.cursorY -= 4;
  }

  finalize() {
    const totalPages = this.pages.length;

    for (const [index, page] of this.pages.entries()) {
      page.operations.push('q');
      page.operations.push(`${COLORS.line.join(' ')} RG`);
      page.operations.push(`${PAGE.marginLeft} 38 m ${PAGE.width - PAGE.marginRight} 38 l S`);
      page.operations.push('Q');

      this.currentPage = page;
      this.drawText(`Page ${index + 1} of ${totalPages}`, PAGE.width - PAGE.marginRight - 64, 22, {
        color: COLORS.muted,
        font: 'F1',
        size: 10,
      });
    }
  }

  toPdfBuffer() {
    const contentStreams = this.pages.map((page) => page.operations.join('\n'));
    const pageObjects = [];
    const contentObjects = [];

    for (let index = 0; index < this.pages.length; index += 1) {
      const pageId = 5 + index * 2;
      const contentId = pageId + 1;
      pageObjects.push(pageId);
      contentObjects.push(contentId);
    }

    const objects = [
      null,
      `<< /Type /Catalog /Pages 2 0 R >>`,
      `<< /Type /Pages /Kids [${pageObjects.map((id) => `${id} 0 R`).join(' ')}] /Count ${this.pages.length} >>`,
      `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
      `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`,
    ];

    for (let index = 0; index < this.pages.length; index += 1) {
      const pageId = pageObjects[index];
      const contentId = contentObjects[index];
      const content = contentStreams[index];

      objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
      objects[contentId] = `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`;
    }

    const header = `%PDF-1.4\n% Generated by GoMcaddy docs\n`;
    let body = '';
    const offsets = [0];

    for (let index = 1; index < objects.length; index += 1) {
      offsets[index] = Buffer.byteLength(header + body, 'utf8');
      body += `${index} 0 obj\n${objects[index]}\nendobj\n`;
    }

    const xrefOffset = Buffer.byteLength(header + body, 'utf8');
    let xref = `xref\n0 ${objects.length}\n`;
    xref += `0000000000 65535 f \n`;

    for (let index = 1; index < objects.length; index += 1) {
      xref += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
    }

    const trailer = `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info << /Title (${escapePdfText(this.title)}) >> >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return Buffer.from(header + body + xref + trailer, 'utf8');
  }
}

function main() {
  const markdown = readFileSync(sourcePath, 'utf8');
  const { title, intro, blocks } = parseMarkdown(markdown);
  const renderer = new PdfRenderer(title);

  renderer.begin();
  renderer.renderCover(title, intro);

  for (const block of blocks) {
    if (block.type === 'heading') {
      renderer.renderHeading(block.text);
      continue;
    }

    if (block.type === 'bullet') {
      renderer.renderBullet(block.text);
      continue;
    }

    renderer.renderParagraph(block.text);
  }

  renderer.finalize();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderer.toPdfBuffer());
  console.log(`Generated ${outputPath}`);
}

main();
