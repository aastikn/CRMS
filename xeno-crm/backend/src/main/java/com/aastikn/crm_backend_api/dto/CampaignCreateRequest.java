package com.aastikn.crm_backend_api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CampaignCreateRequest {

    @NotBlank(message = "Campaign name cannot be blank")
    private String name;

    @NotBlank(message = "Campaign message cannot be blank")
    private String message;

    // From the visual builder
    private Object audience;

    // From the text editor
    private String rawQuery;
}
