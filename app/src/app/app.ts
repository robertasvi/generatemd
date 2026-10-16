import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from './content.service';
import { DownloadService } from './download.service';
import { GeneratedFile, GeneratorTemplate, TemplateExample, TemplateId, TEMPLATES, generateFile } from './generator';

const HELP_PAGES = [
  { title: 'What to highlight', path: 'help/content.md' },
  { title: 'Syntax tree (AST)', path: 'help/syntax-tree.md' },
  { title: 'Ordering', path: 'help/ordering.md' },
  { title: 'How agents work', path: 'help/agent.md' },
  { title: 'High efficiency prompts', path: 'help/advanced.md' },
];

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly templates = TEMPLATES;
  protected readonly helpPages = HELP_PAGES;
  protected readonly selectedId = signal<TemplateId | null>(null);
  protected readonly selectedTemplate = computed(() =>
    this.templates.find(template => template.id === this.selectedId()) ?? null,
  );
  protected readonly answers = signal<Record<string, string>>({});
  protected readonly currentStep = signal(0);
  protected readonly result = signal<GeneratedFile | null>(null);
  protected readonly output = signal('');
  protected readonly stage = signal<'templates' | 'questions' | 'result'>('templates');
  protected readonly isDark = signal(false);
  protected readonly helpOpen = signal(false);
  protected readonly helpIndex = signal(0);
  protected readonly helpHtml = signal('');
  protected readonly helpLoading = signal(false);
  protected readonly helpError = signal('');
  protected readonly exampleMessage = signal('');
  protected readonly busy = signal(false);
  protected readonly notice = signal('');

  private readonly document = inject(DOCUMENT);
  private readonly contentService = inject(ContentService);
  private readonly downloadService = inject(DownloadService);
  private helpRequest = 0;

  constructor() {
    this.initializeTheme();
  }

  protected selectTemplate(template: GeneratorTemplate): void {
    this.selectedId.set(template.id);
    this.answers.set({});
    this.result.set(null);
    this.output.set('');
    this.currentStep.set(0);
    this.exampleMessage.set('');
    this.notice.set('');
    this.stage.set('questions');
  }

  protected setAnswer(id: string, value: string): void {
    this.answers.update(current => ({ ...current, [id]: value }));
  }

  protected updateOutput(event: Event): void {
    this.output.set((event.target as HTMLTextAreaElement).value);
  }

  protected async loadExample(example: TemplateExample): Promise<void> {
    this.busy.set(true);
    this.exampleMessage.set('Loading example...');
    try {
      const loaded = await this.contentService.loadExample(example);
      const values = { ...this.answers(), ...loaded.values };
      if (example.name) values['name'] = example.name;
      if (loaded.description) values['description'] = loaded.description;
      if (loaded.apply) values['apply'] = loaded.apply;
      this.answers.set(values);
      this.exampleMessage.set('Example loaded.');
    } catch (error) {
      this.exampleMessage.set(error instanceof Error ? error.message : 'Could not load example.');
    } finally {
      this.busy.set(false);
    }
  }

  protected previousStep(): void {
    this.currentStep.update(step => Math.max(0, step - 1));
  }

  protected nextStep(): void {
    const template = this.selectedTemplate();
    if (template) this.currentStep.update(step => Math.min(template.questions.length - 1, step + 1));
  }

  protected goToStep(step: number): void {
    const template = this.selectedTemplate();
    if (template) this.currentStep.set(Math.max(0, Math.min(template.questions.length - 1, step)));
  }

  protected generate(): void {
    const template = this.selectedTemplate();
    if (!template) return;
    const result = generateFile(template.id, this.answers());
    this.result.set(result);
    this.output.set(result.body);
    this.notice.set('');
    this.stage.set('result');
  }

  protected editAnswers(): void {
    this.stage.set('questions');
  }

  protected chooseAnotherTemplate(): void {
    this.stage.set('templates');
  }

  protected async copyOutput(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.output());
      this.notice.set('Copied to clipboard.');
    } catch {
      this.notice.set('Clipboard access is unavailable in this browser.');
    }
  }

  protected async downloadOutput(): Promise<void> {
    const result = this.result();
    if (!result) return;
    try {
      await this.downloadService.download(result, this.output());
      this.notice.set('Download started.');
    } catch {
      this.notice.set(result.folder ? 'Could not create the skill ZIP.' : 'Could not download the file.');
    }
  }

  protected toggleTheme(): void {
    const dark = !this.isDark();
    this.isDark.set(dark);
    this.document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      this.notice.set('Theme preference could not be saved.');
    }
  }

  protected async openHelp(): Promise<void> {
    this.helpOpen.set(true);
    await this.showHelpPage(this.helpIndex());
  }

  protected async showHelpPage(index: number): Promise<void> {
    const request = ++this.helpRequest;
    this.helpIndex.set(index);
    this.helpHtml.set('');
    this.helpError.set('');
    this.helpLoading.set(true);
    try {
      const html = await this.contentService.loadHelp(this.helpPages[index].path);
      if (request === this.helpRequest) this.helpHtml.set(html);
    } catch {
      if (request === this.helpRequest) this.helpError.set('Could not load help content.');
    } finally {
      if (request === this.helpRequest) this.helpLoading.set(false);
    }
  }

  protected closeHelp(): void {
    this.helpOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeHelp();
  }

  private initializeTheme(): void {
    let preference: string | null = null;
    try {
      preference = localStorage.getItem('theme');
    } catch {
      preference = null;
    }
    const dark = preference
      ? preference === 'dark'
      : this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.isDark.set(dark);
    this.document.documentElement.classList.toggle('dark', dark);
  }
}
