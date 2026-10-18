UI Design System & Component Library Guidelines

Core Principles

Source of Truth: Always prioritize the official company UI design library, design tokens, and component documentation over generic CSS frameworks, custom inline styles, or component library defaults.
Consistency: Ensure all generated layouts, patterns, and component usage strictly adhere to the design system specifications.

Component Usage Guidelines

Use System Components: Always check the design library documentation before creating custom components or HTML elements. If a component (e.g., `Button`, `Modal`, `DataTable`, `Card`, `Drawer`) exists in the system, you MUST USE IT.

API & Prop Compliance

Apply component properties, variants, sizes, and slots strictly as defined in the library documentation.
Do not invent unsupported prop names, override core library styles, or pass arbitrary inline styles unless explicitly required.
Layout & Nesting: Structure pages and UI views using the layout wrappers provided by the design library (e.g., `Grid`, `Stack`, `Container`, `Flex`).

Styling & Token Rules

Design Tokens:** Always use design tokens (theme variables, CSS variables, or design system tokens) for colors, typography, spacing, border radii, z-indexes, and shadows.
Incorrect: `margin: 16px; color: #0052CC;`
Correct: `margin: var(--spacing-4); color: var(--color-brand-primary);`
Typography: Use official typography components or typography token classes defined in the system rather than setting manual font sizes or line heights.

Accessibility & Interactive States

State Management: Ensure components correctly handle default, hover, focus, active, disabled, and loading states as designated by the design system.
Accessibility (a11y): Maintain required ARIA attributes, semantic HTML elements, keyboard navigation, and contrast ratios specified in the component documentation.

---

Fallback & Custom UI Rules
If a requested UI element or pattern is **not** present in the design library:
  1. Compose the pattern using lower-level library primitives and tokens (e.g., `Box`, `Stack`, `Text`).
  2. Maintain strict visual consistency with the existing design system patterns.
  3. Clearly document the custom element with an inline comment noting why a system component was not used.