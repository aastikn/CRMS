package com.aastikn.crm_backend_api.consumer;

import com.aastikn.crm_backend_api.entity.Campaign;
import com.aastikn.crm_backend_api.entity.CommunicationLog;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.CampaignRepository;
import com.aastikn.crm_backend_api.repository.CommunicationLogRepository;
import com.aastikn.crm_backend_api.service.AudienceService;
import com.aastikn.crm_backend_api.service.VendorApiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CampaignConsumer implements StreamListener<String, MapRecord<String, String, String>> {

    private final CampaignRepository campaignRepository;
    private final AudienceService audienceService;
    private final CommunicationLogRepository communicationLogRepository;
    private final VendorApiService vendorApiService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void onMessage(MapRecord<String, String, String> message) {
        try {
            String campaignIdStr = message.getValue().get("data");
            Long campaignId = Long.parseLong(campaignIdStr);
            log.info("Received campaign launch event for campaignId: {}", campaignId);

            Campaign campaign = campaignRepository.findById(campaignId)
                    .orElseThrow(() -> new RuntimeException("Campaign not found: " + campaignId));

            if (campaign.getStatus() != Campaign.CampaignStatus.PENDING) {
                log.warn("Campaign {} is already being processed or is completed.", campaignId);
                return;
            }

            campaign.setStatus(Campaign.CampaignStatus.IN_PROGRESS);
            campaignRepository.save(campaign);

            // 1. Find the audience
            List<Customer> audience = audienceService.getAudience(campaign.getSegment().getRules());
            campaign.setAudienceSize(audience.size());
            campaignRepository.save(campaign);

            // 2. Create logs and call vendor for each customer
            for (Customer customer : audience) {
                try {
                    CommunicationLog log = new CommunicationLog();
                    log.setCampaign(campaign);
                    log.setCustomer(customer);
                    log.setStatus(CommunicationLog.Status.PENDING);
                    communicationLogRepository.save(log);

                    // 3. Simulate sending the message via the vendor
                    vendorApiService.sendMessage(log, campaign.getMessage());
                } catch (Exception e) {
                    log.error("Failed to process message for customer {} in campaign {}", customer.getId(), campaignId, e);
                }
            }

            log.info("Finished dispatching messages for campaignId: {}.", campaignId);

        } catch (Exception e) {
            log.error("Error processing campaign launch event: {}", message, e);
            // Here you might want to find the campaign and set its status to FAILED
        }
    }
}
