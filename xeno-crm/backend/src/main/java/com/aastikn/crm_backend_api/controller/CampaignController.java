package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.dto.CampaignCreateRequest;
import com.aastikn.crm_backend_api.entity.Campaign;
import com.aastikn.crm_backend_api.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    public ResponseEntity<ApiResponse<Campaign>> createCampaign(@Valid @RequestBody CampaignCreateRequest request) {
        Campaign campaign = campaignService.createCampaign(request);
        return ResponseEntity.ok(ApiResponse.success(campaign, "Campaign created and queued for processing."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Campaign>>> getAllCampaigns() {
        List<Campaign> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(ApiResponse.success(campaigns));
    }
}
