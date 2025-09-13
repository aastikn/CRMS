package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.AudiencePreviewRequest;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AudienceService {

    private final ObjectMapper objectMapper;
    private final CustomerRepository customerRepository; // Add repository for fetching customers

    // In a real application, this method would parse the audience or rawQuery
    // and build a dynamic JPA query to count the customers.
    // This is a complex task, so for now, we'll return a dummy value
    // based on the complexity of the request.
    public long getAudienceSize(AudiencePreviewRequest request) {
        if (request.getRawQuery() != null && !request.getRawQuery().isEmpty()) {
            // Dummy logic for raw query
            return Math.max(0, 1000 - (request.getRawQuery().length() * 5L));
        }

        if (request.getAudience() != null) {
            // Dummy logic for structured audience object
            try {
                String audienceStr = objectMapper.writeValueAsString(request.getAudience());
                return Math.max(0, 1000 - (audienceStr.length() / 2L));
            } catch (Exception e) {
                return 0;
            }
        }

        return 0;
    }

    // In a real application, this method would parse the rules JSON and build a dynamic query.
    // For this example, we'll just return all customers.
    public List<Customer> getAudience(String rulesJson) {
        // TODO: Implement dynamic query based on rulesJson
        return customerRepository.findAll();
    }
}
