package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.CampaignCreateRequest;
import com.aastikn.crm_backend_api.entity.Campaign;
import com.aastikn.crm_backend_api.entity.Segment;
import com.aastikn.crm_backend_api.repository.CampaignRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final MessageProducerService messageProducerService;
    private final ObjectMapper objectMapper;

    public static final String CAMPAIGN_LAUNCH_CHANNEL = "campaign:launch";

    @Transactional
    public Campaign createCampaign(CampaignCreateRequest request) {
        Segment segment = new Segment();
        try {
            // Handle either the structured object or the raw query string
            if (request.getAudience() != null) {
                segment.setRules(objectMapper.writeValueAsString(request.getAudience()));
            } else if (request.getRawQuery() != null) {
                // For raw query, we can store it directly or wrap it in a JSON structure
                segment.setRules(objectMapper.writeValueAsString(Map.of("rawQuery", request.getRawQuery())));
            } else {
                throw new IllegalArgumentException("Either audience or rawQuery must be provided.");
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting rules to JSON", e);
        }

        Campaign campaign = new Campaign();
        campaign.setName(request.getName());
        campaign.setSegment(segment);
        campaign.setMessage(request.getMessage());
        Campaign savedCampaign = campaignRepository.save(campaign);

        // PUBLISH the ID to trigger the delivery process
        messageProducerService.publish(CAMPAIGN_LAUNCH_CHANNEL, savedCampaign.getId());

        return savedCampaign;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
