---
applyTo: "**/exceptions/*.java"
---

# Rule: Java Models, Entities & DTOs (Spring Boot)

## Context
Applies to all domain models, JPA/Hibernate entities, DTOs (Data Transfer Objects), and records in the Spring Boot backend architecture.

## Principles

1. **Use Java Records for DTOs and Immutable Data**
   - Use `public record` for data transfer objects (DTOs), API requests/responses, and immutable payloads. Records provide concise syntax, built-in constructors, `equals()`, `hashCode()`, and `toString()` methods automatically.
   - Use standard classes (`class`) *only* for mutable domain entities or entities requiring JPA persistence mapping.

2. **JPA Entity Best Practices**
   - Annotate database entities with `@Entity` and map them clearly with `@Table`.
   - Always define a unique primary key using `@Id` with `@GeneratedValue(strategy = GenerationType.IDENTITY)` or UUIDs.
   - **Avoid `@Data` from Lombok on Entities:** Do not use `@Data` on JPA entities because it generates `hashCode()` and `equals()` based on all fields, which can break when handling lazy-loaded JPA proxies or collections (leading to infinite loops or `LazyInitializationException`). Instead, explicitly use `@Getter`, `@Setter`, and provide safe custom `equals`/`hashCode` based on business identifiers or IDs.
   - Implement proper Fetch Types: Use `FetchType.LAZY` for `@OneToMany` and `@ManyToMany` relationships.

3. **Validation & Bean Validation (JSR-380)**
   - Validate incoming requests using Bean Validation annotations (`@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Min`, `@Max`) directly inside your DTO records/classes.
   - Always trigger validation at controller boundaries using the `@Valid` annotation on request parameters.

4. **Immutability & Null Safety**
   - Make fields `private final` where possible in non-entity classes.
   - Utilize Java's `Optional<T>` for repository return types or service methods that may return a null value, but **never** use `Optional` for entity fields or method parameters.

5. **Naming & File Structure**
   - **Entities:** PascalCase ending with entity context (e.g., `UserEntity.java` or `User.java` inside an `entity` package).
   - **DTOs:** Suffix with `Request`, `Response`, or `Dto` (e.g., `CreateUserRequest.java`, `UserResponse.java`).
   - Package structure: Group by domain/feature (e.g., `com.example.project.user.entity`, `com.example.project.user.dto`).

---

## Code Examples

### Good Example: Immutable DTO Record with Validation
```java
package com.example.project.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    String email
) {}
```

### Good Example: JPA Entity (Safe Lombok & Lazy Loading)
```java
package com.example.project.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEntity that = (UserEntity) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

### Bad Example
```java
// DON'T: Using @Data on JPA entities and missing validations
@Entity
@Data // Dangerous with JPA relationships and lazy loading!
public class BadUserEntity {
    @Id
    public Long id;
    public String email; // Public mutable fields
}
```
