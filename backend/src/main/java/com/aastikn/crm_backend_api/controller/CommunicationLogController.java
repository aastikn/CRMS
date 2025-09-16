package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.dto.CommunicationLogDto;
import com.aastikn.crm_backend_api.service.CommunicationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
@Tag(name = "Communication Logs", description = "APIs for viewing communication logs")
public class CommunicationLogController {

    private final CommunicationLogService communicationLogService;

    @GetMapping
    @Operation(summary = "Get all communication logs", description = "Retrieve a paginated list of all communication logs")
    public ResponseEntity<ApiResponse<Page<CommunicationLogDto>>> getAllLogs(Pageable pageable) {
        Page<CommunicationLogDto> logs = communicationLogService.getAllLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all communication logs without pagination", description = "Retrieve a list of all communication logs")
    public ResponseEntity<ApiResponse<List<CommunicationLogDto>>> getAllLogs() {
        List<CommunicationLogDto> logs = communicationLogService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
