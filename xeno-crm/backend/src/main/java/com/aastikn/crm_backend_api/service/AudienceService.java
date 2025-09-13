package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.AudiencePreviewRequest;
import com.aastikn.crm_backend_api.dto.audience.AudienceDto;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import com.aastikn.crm_backend_api.service.specification.CustomerSpecificationBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AudienceService {

    private final ObjectMapper objectMapper;
    private final CustomerRepository customerRepository;

    public long getAudienceSize(AudiencePreviewRequest request) {
        if (request.getAudience() != null) {
            CustomerSpecificationBuilder builder = new CustomerSpecificationBuilder();
            Specification<Customer> spec = builder.build(request.getAudience());
            return customerRepository.count(spec);
        }

        if (request.getRawQuery() != null && !request.getRawQuery().isEmpty()) {
            // For now, raw query is not supported for security reasons.
            // A proper parser would be needed to safely handle this.
            // Returning a dummy value for now to not break the frontend.
            return Math.max(0, 1000 - (request.getRawQuery().length() * 5L));
        }

        return 0;
    }

    public List<Customer> getAudience(String rulesJson) {
        try {
            AudienceDto audienceDto = objectMapper.readValue(rulesJson, AudienceDto.class);
            CustomerSpecificationBuilder builder = new CustomerSpecificationBuilder();
            Specification<Customer> spec = builder.build(audienceDto);
            if (spec != null) {
                return customerRepository.findAll(spec);
            }
        } catch (JsonProcessingException e) {
            // Log the error
            return List.of();
        }
        return customerRepository.findAll(); // Fallback or throw exception
    }
}
