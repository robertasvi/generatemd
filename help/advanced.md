Combining XML tags with Markdown is one of the most effective ways to engineer prompts for advanced AI agents (like Claude 3.5 Sonnet, GPT-4o, or custom agent frameworks).

While Markdown provides clean visual hierarchy for humans and general parsing for models, XML tags act as strict programmatic boundaries. They explicitly tell the model where specific sections (like context, data, tools, or instructions) begin and end, virtually eliminating context bleeding.

### Why the Hybrid Approach Works
- Markdown for Readability: Humans write and review prompts; Markdown makes them easy to read, edit, and maintain.

- XML for Precision: LLMs are heavily trained on HTML/XML-like syntax in codebases and web data. XML tags (<instructions>, <context>) create unambiguous syntactic barriers that prevent the model from confusing instructions with raw data or examples.

### Production Prompt Template: Combining Markdown and XML
Here is how you can structure a robust, production-grade prompt for an autonomous coding or task-executing agent:

```md
# Role & Objective
You are an expert autonomous software engineering agent. Your goal is to refactor legacy database queries into optimized Prisma calls based on the specifications provided below.

<system_instructions>
- Always follow the existing project architecture and TypeScript strict mode rules.
- Do not modify files listed in the exclusions list.
- If an error occurs during processing, explain the root cause before attempting a fix.
</system_instructions>

## Operational Constraints
1. **Performance:** The resulting query must execute in less than 50ms.
2. **Backward Compatibility:** Do not break existing API contracts.

<context>
The legacy application uses raw SQL queries via `pg-promise` inside a monolithic service layer. We are migrating the user management module to Prisma ORM.

### Relevant Schema Snippet
` ```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  posts     Post[]
}
``` `
</context>

<input_data>
Here is the legacy raw SQL query you need to migrate:

` ```prisma
SELECT users.id, users.email, count(posts.id) as post_count 
FROM users 
LEFT JOIN posts ON users.id = posts.user_id 
GROUP BY users.id;
``` `
</input_data>

<output_format>
Provide your response using the following structure:

**Analysis:** Brief explanation of how the SQL translates to Prisma.
**Refactored Code:** The Prisma implementation inside a fenced code block.
**Verification:** Steps to test the new implementation.
</output_format>
```


### Key Patterns for Best Results

1. **Keep the Outer Shell in Markdown:** Use standard Markdown headers (`#`, `##`) for the top-level sections so human engineers can quickly scan the prompt template.
2. **Wrap Variable Data and Context in XML:** Whenever you inject dynamic variables, user code, logs, or reference documentation into a prompt, wrap them in semantic tags like `<context>`, `<input_data>`, or `<examples>`. This prevents a malicious or malformed input from "jailbreaking" or overriding your system instructions.
3. **Use Explicit Closing Tags:** Always close your XML tags (`</instructions>`, `</context>`). Unclosed tags can confuse the model's parser and alter how it handles the rest of the token stream.
4. **Leverage Nested Structures:** You can nest Markdown inside XML (or vice versa) safely, as shown in the `<context>` block above where a Markdown header and code block live inside the XML tag.