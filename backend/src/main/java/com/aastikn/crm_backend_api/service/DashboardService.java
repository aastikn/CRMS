package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.AnalyticsDataPoint;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import com.aastikn.crm_backend_api.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public List<AnalyticsDataPoint> getOrdersByDay(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Object[]> results = orderRepository.countOrdersByDay(since);
        return results.stream()
                .map(row -> new AnalyticsDataPoint(((java.sql.Date) row[0]).toLocalDate(), (Long) row[1]))
                .collect(Collectors.toList());
    }

    public List<AnalyticsDataPoint> getUserssByDay(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Object[]> results = customerRepository.countCustomersByDay(since);
        return results.stream()
                .map(row -> new AnalyticsDataPoint(((java.sql.Date) row[0]).toLocalDate(), (Long) row[1]))
                .collect(Collectors.toList());
    }
}
