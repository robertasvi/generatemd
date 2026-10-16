export type TemplateId = 'agents' | 'skill' | 'rule';
export type QuestionType = 'text' | 'textarea';

export interface GeneratorQuestion {
  id: string;
  title?: string;
  label: string;
  type: QuestionType;
  placeholder: string;
}

export interface TemplateExample {
  label: string;
  files: Record<string, string>;
  name?: string;
}

export interface GeneratedFile {
  path: string;
  body: string;
  folder?: string;
}

export interface GeneratorTemplate {
  id: TemplateId;
  name: string;
  description: string;
  destination: string;
  wizard?: boolean;
  examples: TemplateExample[];
  questions: GeneratorQuestion[];
  generate(answers: Record<string, string>): GeneratedFile;
}

export const slug = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';

const lines = (value: string): string[] =>
  value.split('\n').map(line => line.trim().replace(/^[-*]\s*/, '')).filter(Boolean);

const bullets = (value: string): string => lines(value).map(line => `- ${line}`).join('\n');

export const TEMPLATES: GeneratorTemplate[] = [
  {
    id: 'agents',
    name: 'AGENTS.md',
    description: 'Project-wide instructions: stack, conventions, and rules for every AI agent request.',
    destination: 'Place in the repository root (or .github/AGENTS.md).',
    wizard: true,
    examples: [
      {
        label: 'Financial reporting app',
        files: {
          project: 'agents/project-description.md',
          stack: 'agents/tech-stack.md',
          styling: 'agents/design-principles.md',
          testing: 'agents/testing.md',
          rules: 'agents/agents.md',
        },
      },
    ],
    questions: [
      { id: 'project', title: 'Operational Purpose & Scope', label: 'Project description and scope', type: 'textarea', placeholder: 'Internal invoicing web app for finance team' },
      { id: 'stack', title: '1. Stack & Architectural Guidance', label: 'Technology stack', type: 'textarea', placeholder: 'TypeScript, Angular 18\nBuild: npm run build' },
      { id: 'styling', title: '2. Design principles and Style Guidance', label: 'Styling and design', type: 'textarea', placeholder: 'Tailwind CSS, follow the company design system' },
      { id: 'testing', title: '3. Testing Standards', label: 'Testing standards', type: 'textarea', placeholder: 'Unit tests with Jest, e2e with Playwright' },
      { id: 'rules', title: '4. Rules and Workflow checklist', label: 'Rules, architectural guidance and workflow checklist', type: 'textarea', placeholder: 'Use standalone components\nNever commit secrets' },
    ],
    generate: answers => {
      const parts = TEMPLATES[0].questions.map(question => {
        const text = (answers[question.id] ?? '').trim();
        if (!text) return '';
        const heading = `## ${question.title}`;
        return text.startsWith(heading) ? text : `${heading}\n\n${text}`;
      }).filter(Boolean);
      parts.unshift('# AGENTS.md');
      return { path: 'AGENTS.md', body: `${parts.join('\n\n')}\n` };
    },
  },
  {
    id: 'skill',
    name: '/skills/[name]/SKILL.md',
    description: 'A reusable skill: a specific task the agent can perform with a defined workflow.',
    destination: 'Choose .github/skills as the destination to create a ready-to-use skill folder.',
    examples: [
      { name: 'Code verification', label: 'Code verification', files: { content: 'skills/code-verification.md' } },
    ],
    questions: [
      { id: 'name', label: 'Skill name', type: 'text', placeholder: 'Code verification' },
      { id: 'description', label: 'When should the agent use this skill?', type: 'textarea', placeholder: 'When the user asks to review code or verify a change' },
      { id: 'content', label: 'Skill instructions (Markdown)', type: 'textarea', placeholder: '# Workflow\n\nDescribe the steps the agent should follow.' },
    ],
    generate: answers => {
      const folder = slug(answers['name'] ?? '');
      const description = (answers['description'] ?? '').trim().replace(/\s*\n\s*/g, ' ');
      return {
        path: `${folder}/SKILL.md`,
        folder,
        body: `---\nname: ${folder}\ndescription: ${description}\n---\n\n${(answers['content'] ?? '').trim()}\n`,
      };
    },
  },
  {
    id: 'rule',
    name: '/instructions/[name].instructions.md',
    description: 'Scoped rules applied automatically to files matching a glob pattern.',
    destination: 'Place in .github/instructions/ (or your rules folder).',
    examples: [
      { name: 'typescript-models', label: 'TypeScript models', files: { rules: 'rules/typescript-models.md' } },
      { name: 'exceptions', label: 'Exceptions', files: { rules: 'rules/exceptions.md' } },
      { name: 'spring-security-jwt', label: 'Spring Security JWT', files: { rules: 'rules/spring-security-jwt.md' } },
    ],
    questions: [
      { id: 'name', label: 'Instruction name', type: 'text', placeholder: 'angular-components' },
      { id: 'apply', label: 'Which files does it apply to? (glob)', type: 'text', placeholder: '**/*.component.ts' },
      { id: 'rules', label: 'Rules to follow (one per line)', type: 'textarea', placeholder: 'Use signals for state\nKeep templates under 100 lines' },
    ],
    generate: answers => ({
      path: `${slug(answers['name'] ?? '')}.instructions.md`,
      body: `---\napplyTo: "${(answers['apply'] ?? '').trim().replace(/"/g, '\\"')}"\n---\n\n${/^#\s/.test((answers['rules'] ?? '').trim()) ? (answers['rules'] ?? '').trim() : `# ${(answers['name'] ?? '').trim()}\n\n${bullets(answers['rules'] ?? '')}`}\n`,
    }),
  },
];

export const generateFile = (templateId: TemplateId, answers: Record<string, string>): GeneratedFile => {
  const template = TEMPLATES.find(candidate => candidate.id === templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return template.generate(answers);
};