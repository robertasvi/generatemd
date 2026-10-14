While LLMs and coding agents benefit from structured context, over-engineering or overly tagging a document can actually degrade performance, waste valuable token budget, and confuse the agent's attention mechanism.
Here is a breakdown of what is actually necessary, what is optional, and what you should avoid when writing instructions or markdown files for agents.

<h2> &num;&num;&num; 1. What is Necessary (The Essentials) </h2>
Agents rely primarily on natural language hierarchy and clear semantic boundaries, not complex markup. The following structural elements are sufficient for 95% of use cases:
Clear Heading Hierarchy (#, ##, ###): Agents use markdown headers to build a mental map (an AST/abstract syntax tree) of the document. Keeping sections logically nested tells the agent what context belongs where.
Explicit Boundaries for Rules: If you have strict rules, use bullet points or numbered lists rather than dense paragraphs. Words like MUST, NEVER, and ALWAYS (when capitalized) serve as strong attention anchors for LLMs.
Code Fences with Language Identifiers (```typescript): When providing examples, always specify the language. This helps the agent parse syntax correctly and distinguish code instructions from prose.

<h2> &num;&num;&num; 2. What is Optional (Use Sparingly) </h2>
XML tags or custom markdown wrappers (like <instructions>, <guidelines>, or custom blocks) are only necessary under specific conditions:
Untrusted or Mixed Content: If your markdown file contains user-submitted code or data that the agent might misinterpret as instructions, wrapping system boundaries in XML tags (e.g., <system_instructions>...</system_instructions>) helps defend against prompt injection.
Strictly Scoped Context: If a single markdown file contains instructions for multiple distinct sub-agents, wrapping sections in XML tags can help the orchestrator route context accurately.

<h2> &num;&num;&num; 3. What to Avoid (Anti-Patterns) </h2>
Over-marking a markdown file creates significant friction:
Tag Soup: Wrapping every single paragraph, sentence, or list item in custom XML tags (<rule>...</rule>) wastes tokens and mimics low-quality fine-tuning data. Modern LLMs already understand standard Markdown natively.
Deeply Nested Bloat: Creating excessive layers of nesting makes the file hard for human maintainers to read without providing any extra cognitive benefit to the model.

<h2> &num;&num;&num; Summary Guideline </h2>
Treat your agent markdown files as clean, well-structured documentation for a senior human engineer. If a human can scan, understand, and apply the rules easily using standard Markdown headers, lists, and code blocks, an AI agent will parse it successfully too.