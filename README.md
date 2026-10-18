# Generatemd — AI Agent Documentation Generator 🤖💻

> **Automated markdown file generation for AI agents, code workflows, and developer documentation**

![Angular Logo](https://github.com/angular/angular/raw/main/logo.png) | **[TypeScript](https://www.typescriptlang.org/)** | **Angular CLI**

---

## 🚀 Overview

Generatemd is a web-based application built with **Angular 18+** that provides an intelligent wizard interface to generate structured Markdown documentation files for AI coding agents, technical workflows, and project specifications. It streamlines the creation of standardized files like `AGENTS.md`, `SKILL.md`, `RULES.md`, and `TASK-instructions.md` within your repositories.

Think of it as a **smart template engine** specifically tailored for developer teams working with AI coding assistants (Cursor, Copilot, Bolt, etc.) - ensuring consistent, high-quality documentation output without repetitive manual work.

---

## 📚 Table of Contents

- [🎯 What is Generatemd?](#-what-is-generatemd)
- [⚙️ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🔧 Usage Examples](#-usage-examples)
- [🛠️ Installation & Deployment](#installation--deployment)
- [📜 License](#-license)

---

## 🎯 What is Generatemd?

Generatemd is essentially a **CLI-style documentation generator** built as a web application. It offers:

| Purpose | Generated Output File | Usage |
|---------|----------------------|--------|
| **Project Instructions** | `AGENTS.md` (root or `.github/`) | Defines stack, rules, conventions for all agents in a project |
| **Reusable Skills** | `.github/skills/[name]/SKILL.md` | Create reusable tasks with defined workflows/templates |
| **Scoped Rules** | `.github/instructions/[name].instructions.md` | Apply patterns to specific file globs (type scripts, components, etc.) |
| **Feature Tasks** | `task-instructions.md` | Define acceptance criteria and specs for developer tasks |

Each template includes a guided wizard that prompts for essential information, providing instant generation with copy/download export options.

---

## ⚙️ Features

### 🌐 Interactive Development Experience

| Feature | Description |
|---------|-------------|
| **Step-by-Step Wizard** | Guided questionnaires per template type |
| **Example Loading** | Load reference documents from local file system |
| **Real-time Preview** | See generated markdown instantly in UI |
| **Multi-format Export** | Copy to clipboard, download `.md` files, or export JSON config |
| **Dark/Light Theme** | LocalStorage-persistent theme switching with system detection |
| **Help Pages** | Built-in documentation for 5 key references |

### 📐 Generated Templates

#### 🔵 AGENTS.md (Project-Wide)
Generates a comprehensive file for your AI coding agents to follow:

```markdown
# AGENTS.md

## Operational Purpose & Scope
Brief description of what this project does and why it exists.

## 1. Stack & Architectural Guidance
Technology choices and architecture preferences.

## 2. Design Principles
Styling conventions, UX guidelines, and aesthetic standards.

## 3. Testing Standards
Requirements for test coverage (Jest, Playwright, etc).

## 4. Rules & Workflow Checklist
Architectural guardrails and team workflow requirements.
```

#### 🟡 SKILL.md (Reusable Tasks)
Templates for re-useable agent capabilities:

```yaml
---
name: code-verification
description: When to verify code changes before acceptance
---

# Workflow Description

Define the steps your agent should follow when reviewing code or handling PRs.
```

#### 🟠 RULES.md (Scoped Guards)
File-level instructions with glob patterns:

```yaml
---
applyTo: "**/*.ts"
---

# TypeScript Rules
- Use signals for reactive state management
- Keep components under 100 lines when possible
- Implement standalone component pattern
```

#### 🟣 TASK Instructions (Feature Specs)
Turn feature requests into structured specs:

```markdown
# Feature: User Profile Picture Upload

## 1. Overview & Goal
Explain what is being built and why it matters.

## 2. Technical Scope & Files
List files, dependencies to use/avoid/not create.

## 3. Acceptance Criteria (The Rules)
Define the rules for success in bullet points.

## 4. Acceptance Tests (The Verification)
Define how you can verify each feature is working correctly.

## 5. References / Related Skills
Link to relevant skill definitions for this implementation.
```

---

## 🏗️ Architecture

### ⚙️ Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | Angular | 18+ |
| **Build Tool** | Angular CLI | Latest major release |
| **Styling** | CSS Modules | Custom variables |
| **State Management** | Signals (Angular Core) | Built-in |
| **Routing** | Browser-based | No router (SPA-like single page) |
| **Dependency Management** | npm / package.json | TypeScript + Node |

### 📂 Project Structure

```
generatemd/
├── app/                                # Angular source root
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts                  # Main component logic
│   │   │   ├── content.service.ts       # Help & example loading
│   │   │   ├── download.service.ts       # Export utilities
│   │   │   └── generator.ts              # Template definitions & gen logic
│   │   └── styles/                     # CSS modules
│   │       └── app.css                  # Markdown-style styling
│   ├── public/                         # Static assets folder
│   ├── node_modules/                   # Dependencies
│   ├── dist/                           # Build output
│   └── package.json                    # npm configuration
├── .github/
│   └── workflows/                      # Optional GitHub Actions
└── README.md                          # Project documentation

```

### 🌀 Core Engine: `generator.ts`

The heart of the application, defining templates and generation logic:

- **Template Registry**: An array of predefined types (AGENTS, SKILL, RULES, TASK)
- **Question Schema**: Defines fields for each template type (title, label, placeholder)
- **Yaml Metadata Generation**: Frontmatter headers with YAML syntax
- **Markdown Content Formatting**: Auto-sections and bullet points
- **Slug Functionality**: Auto-generates path-friendly filenames from input text
- **Output Generation**: Returns structured `GeneratedFile` objects

Example generation logic:

```typescript
function slug(value: string): string {
  return value.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')    // Non-alpha digits → dashes
    .replace(/^-|-$/g, '')         // Trim leading/trailing dashes
    || 'untitled';                  // Default fallback
}
```

---

## 🔧 Usage Examples

### 🚀 Running Locally (Development)

To start a development server:

```bash
cd ~/Documents/GitHub/generatemd/app
npm install
ng serve
# Visit http://localhost:4200 in browser
```

This opens the application with hot-reload, allowing you to modify source files and instantly see changes.

### 📦 Building for Production

To compile and bundle the app into production-ready JavaScript:

```bash
npm run build
```

Build output is stored in `dist/` directory, ready for deployment to a web server (GitHub Pages, Netlify, Vercel, etc.). Production builds are optimized for performance.

### 🧪 Running Tests

```bash
# Unit tests (Vitest runner)
ng test

# End-to-end tests (if configured)
# You need to install e2e framework (e.g., WebdriverIO/Cypress):
npm run build:e2e -- -c=e2e
ng e2e
```

### 📤 Deploying

#### GitHub Pages Example

1. Build the project: `npm run build`
2. Upload contents of `dist/generatemd/` to repository as `/generatemd/index.html`
3. Enable GitHub Pages in Settings → Actions

#### Netlify/Vercel Deployment

1. Push repository to web host's organization
2. Deploy with custom `index.html` file in root directory
3. Configure redirect rules for SPA routing if needed

### 🛠️ Custom Template Extensions

Add new template types:

```javascript
// app/src/app/generator.ts - Add to TEMPLATES array

const NEW_TEMPLATE = {
  id: 'new-template-id',
  name: 'New Template Name',
  description: 'Description and purpose text',
  destination: 'Filepath where it gets saved',
  isBeta: true,
  questions: [
    // Define question fields matching your use case
    { id: 'q1', title: 'Question A', label: 'Label A...', type: 'text' },
    { id: 'q2', title: 'Question B', label: 'Label B...', type: 'textarea' }
  ],
  generate(answerValues) {
    // Generate output file structure based on answers
    return { 
      path: 'output.path.ext',
      body: `---\n${YAML_METADATA}\n---\n\nCONTENT`
    };
  }
};

TEMPLATES.push(NEW_TEMPLATE);
```

### 📝 Example Generation Workflow

1. Select a template type from the dropdown
   - AGENTS.md (project-wide instructions)
   - SKILL.md (reusable task templates)  
   - RULES.md (scoped file patterns)
   - TASK Instructions (feature specifications)

2. Fill out guided questionnaires, get real-time preview in browser UI
3. Load helpful reference examples or pull from local docs
4. Generate output to temporary buffer
5. Export by:
   - Copy to clipboard
   - Download .md file
   - Download JSON configuration (if needed)

---

## 🛠️ Installation & Deployment

### Prerequisites

- **Node.js** >= 18.x (LTS recommended)
- **npm** or **yarn** package manager
- Modern browser with Angular dev server support

### Install Locally

```bash
# Clone repo
git clone https://github.com/yourorg/generatemd.git

cd generatemd/app

# Install dependencies
npm install --legacy-peer-deps

# Run development server
ng serve

# Build for production
npm run build

# Check test suite:
ng test
```

---

## 📜 License & Contribution

Generatemd is licensed under **MIT** - free use in personal and commercial projects. See [LICENSE](../app/LICENSE) for full details.

Contributions welcome! This project embraces community improvement, whether through pull requests, issues, or feature request discussions. Thanks to contributors who help maintain the best developer tooling experience! 🙏

---

## 📚 Contributors Who Made It Great

- **robertas** - Architecture & Generator Logic
- **[Your Org Name]** - Documentation refinement
   
> Built with ❤️ for developers and AI workflows worldwide

[![GitHub stars](https://img.shields.io/github/stars/yourorg/generatemd)](https://github.com/)