import { generateFile, slug } from './generator';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ContentService } from './content.service';

describe('generator', () => {
  it('normalizes skill names into folder names', () => {
    expect(slug(' Code Verification ')).toBe('code-verification');
    expect(slug('!!!')).toBe('untitled');
  });

  it('generates AGENTS.md sections while preserving existing headings', () => {
    const file = generateFile('agents', {
      project: 'Description',
      stack: '## 1. Stack & Architectural Guidance\nCustom stack',
    });

    expect(file.path).toBe('AGENTS.md');
    expect(file.body).toBe(
      '# AGENTS.md\n\n## Operational Purpose & Scope\n\nDescription\n\n## 1. Stack & Architectural Guidance\nCustom stack\n',
    );
  });

  it('generates a skill with frontmatter and a folder destination', () => {
    const file = generateFile('skill', {
      name: 'Code Verification',
      description: 'Review code\nfor regressions',
      content: '# Workflow\n\nCheck tests.',
    });

    expect(file.path).toBe('code-verification/SKILL.md');
    expect(file.folder).toBe('code-verification');
    expect(file.body).toBe(
      '---\nname: code-verification\ndescription: Review code for regressions\n---\n\n# Workflow\n\nCheck tests.\n',
    );
  });

  it('generates scoped instructions as a bulleted list', () => {
    const file = generateFile('rule', {
      name: 'exceptions',
      apply: '**/*.ts',
      rules: '- Preserve error context\n* Add tests',
    });

    expect(file.path).toBe('exceptions.instructions.md');
    expect(file.body).toBe(
      '---\napplyTo: "**/*.ts"\n---\n\n# exceptions\n\n- Preserve error context\n- Add tests\n',
    );
  });

  it('generates a task instruction with all specification sections', () => {
    const file = generateFile('task', {
      description: 'Add a close action.',
      files: 'app/src/app/app.html\napp/src/app/app.ts',
      acceptance: 'Close returns to the main view.',
      tests: 'Verify close from form and preview.',
      steps: 'Add the button\nReset state',
    });

    expect(file.path).toBe('task-instructions.md');
    expect(file.body).toBe(
      '# Task Instructions\n\n## Description\n\nAdd a close action.\n\n## Files in scope\n\napp/src/app/app.html\napp/src/app/app.ts\n\n## Acceptance criteria\n\nClose returns to the main view.\n\n## Acceptance test criteria\n\nVerify close from form and preview.\n\n## Steps\n\nAdd the button\nReset state\n',
    );
  });
});

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('opens the generator and previews an AGENTS file after its five steps', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const templateButton = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent?.includes('AGENTS.md')) as HTMLButtonElement;
    templateButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.step-count')?.textContent).toContain('1 / 5');
    for (let step = 0; step < 4; step++) {
      (fixture.nativeElement.querySelector('.form-actions .primary-button') as HTMLButtonElement).click();
      fixture.detectChanges();
    }

    (fixture.nativeElement.querySelector('.form-actions .primary-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('.preview-field textarea') as HTMLTextAreaElement).value)
      .toBe('# AGENTS.md\n');

    (fixture.nativeElement.querySelector('.stage-navigation .close-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#template-heading')?.textContent).toContain('Choose a file');
    expect(fixture.nativeElement.querySelector('.result-stage')).toBeNull();
  });

  it('closes the question form back to template selection', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.template-option') as HTMLButtonElement).click();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.stage-navigation .close-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#template-heading')?.textContent).toContain('Choose a file');
    expect(fixture.nativeElement.querySelector('.work-stage')).toBeNull();
  });

  it('shows the beta task generator with its five specification fields', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.template-option').length).toBe(4);
    expect(fixture.nativeElement.querySelector('.beta-label')?.textContent).toContain('Beta');
    (fixture.nativeElement.querySelector('.template-option:last-child') as HTMLButtonElement).click();
    fixture.detectChanges();

    const labels = [...fixture.nativeElement.querySelectorAll('.question-field > span')]
      .map((label: HTMLSpanElement) => label.textContent);
    expect(labels).toEqual([
      'Description',
      'Files in scope',
      'Acceptance criteria',
      'Acceptance test criteria',
      'Steps',
    ]);
  });
});

describe('ContentService', () => {
  it('sanitizes rendered help Markdown', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(
      '# Safe title\n\n<img src="x" onerror="alert(1)">\n\n<script>alert(1)</script>',
    );

    try {
      const service = TestBed.inject(ContentService);
      const html = await service.loadHelp('help/guide.md');

      expect(html).toContain('<h1>Safe title</h1>');
      expect(html).not.toContain('onerror');
      expect(html).not.toContain('<script>');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
