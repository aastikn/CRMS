package com.aastikn.crm_backend_api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerDto {

    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150)
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phone;

    @DecimalMin(value = "0.0", message = "Total spending cannot be negative")
    private Double totalSpending;

    @Min(value = 0, message = "Visit count cannot be negative")
    private Integer visitCount;

    private LocalDateTime lastVisit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}