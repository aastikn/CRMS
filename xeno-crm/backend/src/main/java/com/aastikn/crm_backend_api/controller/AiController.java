package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.dto.GenerateQueryRequest;
import com.aastikn.crm_backend_api.dto.GenerateQueryResponse;
import com.aastikn.crm_backend_api.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate-query")
    public ResponseEntity<ApiResponse<GenerateQueryResponse>> generateQuery(@Valid @RequestBody GenerateQueryRequest request) {
        String query = aiService.generateQuery(request.getPrompt());
        GenerateQueryResponse response = new GenerateQueryResponse(query);
        return ResponseEntity.ok(ApiResponse.success(response, "Query generated successfully."));
    }
}
