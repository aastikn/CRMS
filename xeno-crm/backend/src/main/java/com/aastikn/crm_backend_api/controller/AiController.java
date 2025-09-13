package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.dto.GenerateMessagesRequest;
import com.aastikn.crm_backend_api.dto.GenerateMessagesResponse;
import com.aastikn.crm_backend_api.dto.GenerateQueryRequest;
import com.aastikn.crm_backend_api.dto.GenerateQueryResponse;
import com.aastikn.crm_backend_api.dto.MessageSuggestion;
import com.aastikn.crm_backend_api.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @PostMapping("/generate-messages")
    public ResponseEntity<ApiResponse<GenerateMessagesResponse>> generateMessages(@Valid @RequestBody GenerateMessagesRequest request) {
        List<MessageSuggestion> messages = aiService.generateMessages(request.getObjective());
        GenerateMessagesResponse response = new GenerateMessagesResponse(messages);
        return ResponseEntity.ok(ApiResponse.success(response, "Messages generated successfully."));
    }
}