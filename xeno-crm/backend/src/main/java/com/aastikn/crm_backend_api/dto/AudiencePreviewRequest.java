package com.aastikn.crm_backend_api.dto;

import com.aastikn.crm_backend_api.dto.audience.AudienceDto;
import lombok.Data;

@Data
public class AudiencePreviewRequest {
    // From the visual builder
    private AudienceDto audience;

    // From the text editor
    private String rawQuery;
}
