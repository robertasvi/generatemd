While LLMs and coding agents benefit from structured context, over-engineering or overly tagging a document can actually degrade performance, waste valuable token budget, and confuse the agent's attention mechanism.

Here is a breakdown of what is actually necessary, what is optional, and what you should avoid when writing instructions or markdown files for agents.

<h2> &num;&num; How a document is read </h2>

An agent (or any markdown parser) does not read your file like a novel. It splits it into a tree of headings, lists and code blocks. A human skims the same structure: headings first, then the rules under them.

```text
YOUR FILE                          HOW IT IS READ (tree)
-----------------------------      ------------------------------------
# Project                          Project
## Frontend                        ├── Frontend
- ALWAYS use signals               │    └── rule: ALWAYS use signals
## Testing                         └── Testing
```typescript                           └── code example (typescript)
[typescript code block]               
``` 

Unstructured text has no branches. Everything is one long block, so the reader has to guess where one topic ends and the next begins.

```text
BEFORE (one block)                 AFTER (tagged)
-----------------------------      ------------------------------------
Use signals for state and          ## Frontend
never use any also write           - ALWAYS use signals for state
tests with playwright and          ## Rules
keep the cache keys...             - NEVER use `any`
                                   ## Testing
                                   - Write Playwright tests
```

<h2> &num;&num; 1. What is Necessary (The Essentials) </h2>
Agents rely primarily on natural language hierarchy and clear semantic boundaries, not complex markup. The following structural elements are sufficient for 95% of use cases:

<b>- **Clear Heading Hierarchy (`#`, `##`, `###`):** </b> Agents use markdown headers to build a mental map (an AST/abstract syntax tree) of the document. Keeping sections logically nested tells the agent what context belongs where.
<b>- **Explicit Boundaries for Rules:** </b> If you have strict rules, use bullet points or numbered lists rather than dense paragraphs. Words like MUST, NEVER, and ALWAYS (when capitalized) serve as strong attention anchors for LLMs.
<b>- **Code Fences with Language Identifiers** </b> (` ```typescript `): When providing examples, always specify the language. This helps the agent parse syntax correctly and distinguish code instructions from prose.

<h3> &num;&num;&num; Capital letters change how a rule is read </h3>

Capitals are a signal of priority. The same sentence carries a different weight depending on how it is written:

| Written as | Reads as | Typical result |
| :--- | :--- | :--- |
| `Try to avoid using any` | A soft preference | Often ignored when it is inconvenient |
| `Do not use any` | A normal instruction | Usually followed |
| `NEVER use any` | A hard constraint | Followed consistently, stands out when skimming |

Use capitals for the few rules that must not be broken (`MUST`, `NEVER`, `ALWAYS`). If every line is capitalized, nothing stands out any more, for the agent and for the human reader alike.

```text
GOOD  - ALWAYS validate input at the controller boundary
        - Prefer small, focused functions

BAD   - ALWAYS USE SMALL FUNCTIONS
        - NEVER FORGET TO ADD COMMENTS
        - ALWAYS FORMAT CODE CORRECTLY      (everything shouts, nothing is priority)
```

<h3> &num;&num;&num; Bullet points change how rules are read </h3>

A bullet (`-`, `*` or `1.`) tells the reader "this line is one separate rule". In a paragraph, rules are tangled together and the reader has to split them by guessing. As bullets, each rule is one item that can be found, counted and followed on its own.

```text
PARAGRAPH (rules blend together)
Use signals for state, never use any, and remember to write
Playwright tests, also keep cache keys namespaced.

BULLETS (one rule per line)
- Use signals for state
- NEVER use `any`
- ALWAYS write Playwright tests
- Keep cache keys namespaced
```

| Written as | How it is read | Typical result |
| :--- | :--- | :--- |
| Dense paragraph | One long instruction with hidden sub-rules | A rule in the middle is easy to miss |
| Bullet list | A list node with one child per rule | Each rule is applied separately |
| Numbered list | An ordered list | Steps are followed in sequence |

Keep each bullet to one rule, and use numbers only when the order matters. Bullets combine well with capitals: put `MUST`, `NEVER` or `ALWAYS` at the start of the bullet that is a hard constraint.

<h2> &num;&num; 2. What is Optional (Use Sparingly) </h2>
XML tags or custom markdown wrappers (like `<instructions>`, `<guidelines>`, or custom blocks) are only necessary under specific conditions:

- **Untrusted or Mixed Content:** If your markdown file contains user-submitted code or data that the agent might misinterpret as instructions, wrapping system boundaries in XML tags (e.g., `<system_instructions>...</system_instructions>`) helps defend against prompt injection.
- **Strictly Scoped Context:** If a single markdown file contains instructions for multiple distinct sub-agents, wrapping sections in XML tags can help the orchestrator route context accurately.

<h2> &num;&num; 3. What to Avoid (Anti-Patterns) </h2>
Over-marking a markdown file creates significant friction:

- **Tag Soup:** Wrapping every single paragraph, sentence, or list item in custom XML tags (`<rule>...</rule>`) wastes tokens and mimics low-quality fine-tuning data. Modern LLMs already understand standard Markdown natively.
- **Deeply Nested Bloat:** Creating excessive layers of nesting makes the file hard for human maintainers to read without providing any extra cognitive benefit to the model.

The same rule written two ways. The second is easier for the agent and for a person:

```text
TAG SOUP (hard to read, more tokens)
<rule><id>1</id><text>NEVER use any</text></rule>
<rule><id>2</id><text>ALWAYS write tests</text></rule>

CLEAN MARKDOWN (same meaning)
## Rules
- NEVER use `any`
- ALWAYS write tests
```

<h2> &num;&num; Summary Guideline </h2>
Treat your agent markdown files as clean, well-structured documentation for a senior human engineer. If a human can scan, understand, and apply the rules easily using standard Markdown headers, lists, and code blocks, an AI agent will parse it successfully too.