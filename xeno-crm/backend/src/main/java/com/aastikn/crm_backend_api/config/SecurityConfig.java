package com.aastikn.crm_backend_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Inside SecurityConfig.java
    private static final String[] SWAGGER_WHITELIST = {
            "/swagger-ui.html",
            "/swagger-ui/**",       // This is the important one
            "/v3/api-docs/**"     // This is also important
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // IMPORTANT: Allow access to the Swagger UI paths
                        .requestMatchers(SWAGGER_WHITELIST).permitAll()
                        // Keep the rest of your API open for the assignment
                        .requestMatchers("/api/v1/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}