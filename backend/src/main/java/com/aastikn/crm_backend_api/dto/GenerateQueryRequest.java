package com.aastikn.crm_backend_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenerateQueryRequest {
    @NotBlank(message = "Prompt cannot be blank")
    private String prompt;
}
