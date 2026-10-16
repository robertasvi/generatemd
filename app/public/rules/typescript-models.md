---
applyTo: "**/*.model.ts"
---

# Rule: TypeScript Models & Interfaces

## Context
Applies to all data models, domain entities, DTOs (Data Transfer Objects), and state shapes across the TypeScript codebase.

## Principles

1. **Prefer `interface` over `type` for Domain Models**
   - Use `interface` for entity declarations and object structural types to support declaration merging and cleaner compiler error messages.
   - Use `type` aliases primarily for unions, primitives, tuples, utility transformations, and function signatures.

2. **Strict Immutability (`readonly`)**
   - Declare model properties as `readonly` by default.
   - State updates should create new objects using spread operators or immutable updates rather than direct property mutation.

3. **Explicit Typing over `any`**
   - **Never use `any`**. Use `unknown` for unsafe input, followed by type guards or runtime validation (e.g., Zod).
   - Prefer type-safe branded types or specific primitives (`string`, `number`) over generic containers.

4. **Avoid Magic Strings and Numbers**
   - Use TypeScript `enum` or union string literals (`type Role = 'admin' | 'user'`) for predefined set of values.
   - Group domain enums in their corresponding model module.

5. **Naming & File Structure**
   - File naming format: `<entity-name>.model.ts` (e.g., `user.model.ts`).
   - PascalCase for interface/type names (`UserModel`, `ProjectState`).
   - Suffix interfaces representing API requests/responses with `Request` or `Response` (e.g., `CreateUserRequest`).
   - Avoid `I` prefixes in interface names (e.g., use `User` or `UserModel` instead of `IUser`).

6. **Nullable & Optional Fields**
   - Use standard TypeScript optional fields `?` when a field may be missing.
   - Explicitly use `null` only when representing an explicit empty value returned from a database/backend API.

---

## Code Examples

### Good Example
```typescript
// models/user.model.ts

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly createdAt: Date;
}

export interface CreateUserRequest {
  readonly email: string;
  readonly role: UserRole;
  readonly firstName?: string;
  readonly lastName?: string;
}

export type UserFilter = Pick<User, 'role'> & {
  readonly searchQuery?: string;
};
```

### Bad example
```typescript
// DON'T: Using IUser, any, and mutable fields

export interface IUser {
  id: any;
  email: string;
  role: string; // Magic string
  data: object; // Vague type
}
```