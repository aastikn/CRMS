package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.AnalyticsDataPoint;
import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/orders-by-day")
    public ResponseEntity<ApiResponse<List<AnalyticsDataPoint>>> getOrdersByDay(@RequestParam(defaultValue = "30") int days) {
        List<AnalyticsDataPoint> data = dashboardService.getOrdersByDay(days);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/users-by-day")
    public ResponseEntity<ApiResponse<List<AnalyticsDataPoint>>> getUserssByDay(@RequestParam(defaultValue = "30") int days) {
        List<AnalyticsDataPoint> data = dashboardService.getUserssByDay(days);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
