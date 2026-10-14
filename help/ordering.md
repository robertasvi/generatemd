# Markdown Formatting Guide for AI Agents

When organizing instructions for an AI agent in a markdown file, **both numbered lists (`1, 2, 3`) and markdown headers (`##`, `###`) serve completely different purposes**, and you should use them together rather than choosing one over the other.

---

## 1. Markdown Headers (`##` or `###`) = The Directory Map (AST)
* **What it does:** Creates sections, categories, and a table of contents for the file.
* **When to use it:** To group large topics or rules together (e.g., separating database rules from styling rules).
* **Example:**
  ```markdown
  ## 1. Coding Standards
  ### A. Component Rules
  ### B. Styling Rules
  ```

---

## 2. Numbered Lists (`1., 2., 3.`) = Strict Sequences
* **What it does:** Tells the agent that **sequence and chronological order matter**. It forces the model to execute steps in order (Step 1 $\rightarrow$ Step 2 $\rightarrow$ Step 3).
* **When to use it:** For multi-step workflows, setup guides, or ReAct loops where doing step 3 before step 2 will cause an error.
* **Example:**
  ```markdown
  To deploy the app, follow these steps in exact order:
  1. Run `npm install` to install dependencies.
  2. Run `npm run build` to compile the project.
  3. Push the build artifact to production.
  ```

---

## Summary Rule of Thumb
* Use **`##` or `###` headers** to organize *categories* of rules so the agent can find them easily.
* Use **numbered lists (`1, 2, 3`)** only when the agent must follow a **strict chronological sequence** to complete a task.