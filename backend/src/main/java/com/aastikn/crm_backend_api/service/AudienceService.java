package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.AudiencePreviewRequest;
import com.aastikn.crm_backend_api.dto.audience.AudienceDto;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import com.aastikn.crm_backend_api.service.specification.CustomerSpecificationBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
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
            try {
                RawQueryParser parser = new RawQueryParser();
                Specification<Customer> spec = parser.parse(request.getRawQuery());
                return customerRepository.count(spec);
            } catch (Exception e) {
                log.error("Failed to parse raw query: {}", request.getRawQuery(), e);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid raw query: " + e.getMessage(), e);
            }
        }

        return 0;
    }

    public List<Customer> getAudience(String rulesJson) {
        try {
            var ruleNode = objectMapper.readTree(rulesJson);
            if (ruleNode.has("rawQuery")) {
                String rawQuery = ruleNode.get("rawQuery").asText();
                RawQueryParser parser = new RawQueryParser();
                Specification<Customer> spec = parser.parse(rawQuery);
                return customerRepository.findAll(spec);
            } else {
                AudienceDto audienceDto = objectMapper.treeToValue(ruleNode, AudienceDto.class);
                CustomerSpecificationBuilder builder = new CustomerSpecificationBuilder();
                Specification<Customer> spec = builder.build(audienceDto);
                if (spec != null) {
                    return customerRepository.findAll(spec);
                }
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to parse audience rules: {}", rulesJson, e);
            return List.of();
        } catch (Exception e) {
            log.error("Failed to build audience from rules: {}", rulesJson, e);
            return List.of();
        }
        return List.of();
    }
}
