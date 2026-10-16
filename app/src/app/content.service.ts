import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { TemplateExample } from './generator';

export interface LoadedExample {
  values: Record<string, string>;
  description?: string;
  apply?: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly document = inject(DOCUMENT);
  private readonly helpCache = new Map<string, string>();

  async loadExample(example: TemplateExample): Promise<LoadedExample> {
    const loaded: LoadedExample = { values: {} };
    const entries = await Promise.all(Object.entries(example.files).map(async ([field, path]) => {
      const response = await fetch(new URL(path, this.document.baseURI));
      if (!response.ok) throw new Error(`Could not load ${path}`);

      let text = (await response.text()).replace(/\r\n/g, '\n');
      const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n+/);
      if (frontmatter) {
        const description = frontmatter[1].match(/^description:\s*(.+)$/m);
        const apply = frontmatter[1].match(/applyTo:\s*["']?([^"'\n]+)["']?/);
        if (description) loaded.description = description[1].trim();
        if (apply) loaded.apply = apply[1].trim();
        text = text.slice(frontmatter[0].length);
      }

      return [field, text.trim()] as const;
    }));

    loaded.values = Object.fromEntries(entries);
    return loaded;
  }

  async loadHelp(path: string): Promise<string> {
    const cached = this.helpCache.get(path);
    if (cached) return cached;

    const response = await fetch(new URL(path, this.document.baseURI));
    if (!response.ok) throw new Error(`Could not load ${path}`);

    const markdown = (await response.text()).replace(/<b>\s*(#{1,6})\s*(.*?)\s*<\/b>/g, '$1 $2');
    const html = await marked.parse(markdown, { breaks: true });
    const sanitized = DOMPurify.sanitize(html);
    this.helpCache.set(path, sanitized);
    return sanitized;
  }
}