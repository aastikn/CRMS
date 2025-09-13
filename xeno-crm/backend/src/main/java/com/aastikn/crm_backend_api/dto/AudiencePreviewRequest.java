package com.aastikn.crm_backend_api.dto;

import lombok.Data;

@Data
public class AudiencePreviewRequest {
    // From the visual builder
    private Object audience;

    // From the text editor
    private String rawQuery;
}
