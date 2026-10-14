# Copilot Agent Instructions (AGENTS.md)

Welcome, GitHub Copilot! You are assisting developers working on a TypeScript and Angular web application hosted on GitHub Pages. This application empowers colleagues to interactively generate and customize AI agent instruction markdown files (such as `SKILLS`, `AGENTS`, `/rules`, and custom instructions) by selecting templates and modular project elements.

## 1. Project Overview & Tech Stack
- **Framework:** Angular (Standalone components, reactive forms, Signals where applicable).
- **Language:** TypeScript (Strict typing enabled, modern ES features).
- **Styling/UI:** Tailwind CSS (preferred for clean, responsive UI).
- **Deployment:** GitHub Pages (Static site hosting, utilizing HashLocationStrategy or proper base-href handling for routing).
- **Core Functionality:** A template builder app where users select base markdown templates (`SKILLS`, `AGENTS`, `/rules`, general instructions) and inject dynamic project/agent-specific elements.

## 2. Coding Standards & Best Practices
- **TypeScript:** Always define explicit interfaces or types for templates, elements, and configuration states. Avoid `any`.
- **Angular Architecture:** 
  - Favor Standalone Components over NgModules.
  - Keep business logic inside injectable services or component store logic.
  - Use Angular Signals for reactive state management of selected templates and elements.
- **Markdown Generation:** Ensure any generated markdown output escapes special characters correctly and maintains clean formatting with proper frontmatter and headers.
- **GitHub Pages Compatibility:** Since the app is hosted statically on GitHub Pages, ensure assets use relative paths and handle 404 fallbacks (`404.html` redirect trick) if client-side routing is used.

## 3. Key Features to Assist With
When writing or debugging code in this repository, help with:
- **Template Management:** Creating, parsing, and rendering markdown templates dynamically.
- **Interactive Builder State:** Managing user selections (selected template type + chosen optional elements/rules) using Angular Signals or Reactive Forms.
- **Live Preview & Export:** Implementing real-time markdown preview rendering and a "Copy to Clipboard" or "Download `.md` file" feature.
- **UI Components:** Building intuitive selector cards, checkboxes for optional elements, and a split-screen editor/preview view.

## 4. Copilot Response Guidelines
- Provide concise, modern TypeScript and Angular code snippets following the Standalone Component pattern.
- Ensure styling recommendations utilize Tailwind CSS classes.
- When generating markdown templates or helper utilities, ensure they are robust and cleanly structured.