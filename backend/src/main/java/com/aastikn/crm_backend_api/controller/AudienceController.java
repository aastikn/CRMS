package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.dto.AudiencePreviewRequest;
import com.aastikn.crm_backend_api.service.AudienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/audiences")
@RequiredArgsConstructor
public class AudienceController {

    private final AudienceService audienceService;

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<Long>> previewAudience(@Valid @RequestBody AudiencePreviewRequest request) {
        long size = audienceService.getAudienceSize(request);
        return ResponseEntity.ok(ApiResponse.success(size, "Audience size calculated successfully."));
    }
}
