package com.aastikn.crm_backend_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenerateMessagesRequest {
    @NotBlank
    private String objective;
}
