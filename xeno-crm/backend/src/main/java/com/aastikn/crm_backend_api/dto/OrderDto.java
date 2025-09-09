package com.aastikn.crm_backend_api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderDto {

    private Long id;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Order amount is required")
    @DecimalMin(value = "0.01", message = "Order amount must be greater than 0")
    private Double orderAmount;

    @NotNull(message = "Order date is required")
    private LocalDateTime orderDate;

    private String status;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private LocalDateTime createdAt;
}