---
applyTo: "**/security/**/*.java"
---

# Rule: Spring Security 6 & JWT Stateless Authentication

## Context
Applies to backend architectures in Spring Boot 3+ utilizing Spring Security 6, stateless session management, and JSON Web Token (JWT) verification filters.

## Architectural Principles

1. **Stateless Session Management**
   - Configure Spring Security's session creation policy explicitly to `STATELESS`. The server must not store authentication state or HTTP sessions.

2. **Custom OncePerRequestFilter for JWT Verification**
   - Intercept incoming HTTP requests using a custom filter extending `OncePerRequestFilter`.
   - Extract the token from the `Authorization: Bearer <TOKEN>` HTTP header.
   - Validate the token, extract the username/subject, load user details, and explicitly set the `UsernamePasswordAuthenticationToken` inside the `SecurityContextHolder`.

3. **Modern Security Filter Chain Configuration (`SecurityFilterChain` bean)**
   - Use the modern lambda-based configuration DSL (`.csrf(AbstractHttpConfigurer::disable)`, `.authorizeHttpRequests(...)`).
   - Register your custom JWT filter right before the `UsernamePasswordAuthenticationFilter`.

4. **Secure Secret Keys and Token Expiration**
   - Never hardcode JWT secret keys in source code. Load them via environment variables or Spring configuration properties (`@Value("${application.security.jwt.secret-key}")`).
   - Use the `jjwt` library or `nimbusds` library for signing (e.g., HMAC-SHA256 with a minimum key size of 256 bits).
   - Enforce strict token expiration times (short-lived access tokens combined with optional refresh tokens).

---

## Core Components Structure

### 1. Security Configuration (`SecurityConfig.java`)
```java
package com.example.project.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll() // Public endpoints (login/register)
                .anyRequest().authenticated()                  // Secured endpoints
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```
### 2.JWT Filter (`JwtAuthenticationFilter.java`)
```java
package com.example.project.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterNameChain filterChain // or FilterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt); // Extract username/email from token

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### Anti-Patterns to Avoid

- Enabling CSRF: Since JWT tokens are typically stored client-side (e.g., LocalStorage or header-based) and requests are stateless, traditional CSRF protection can be safely disabled, provided CORS policies are strict.

- Loading User Details on Every Filter Pass without Caching considerations: Ensure your UserDetailsService efficiently hits the database or second-level cache.

- Storing Sensitive Data in Payloads: Never place passwords, API keys, or heavy database rows inside the plain base64-encoded JWT claims payload.