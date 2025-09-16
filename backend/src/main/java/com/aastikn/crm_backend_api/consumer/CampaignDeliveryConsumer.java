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
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignDeliveryConsumer implements MessageListener {

    private final CampaignRepository campaignRepository;
    private final AudienceService audienceService;
    private final CommunicationLogRepository communicationLogRepository;
    private final VendorApiService vendorApiService;
    private final ObjectMapper objectMapper;

    // In CampaignDeliveryConsumer.java

    // In CampaignDeliveryConsumer.java

    @Override
    public void onMessage(Message message, byte[] pattern) {
        Long campaignId = null;
        try {
            campaignId = objectMapper.readValue(message.getBody(), Long.class);
            log.info("Received campaign launch event for campaignId: {}", campaignId);

            Campaign campaign = null;
            // Retry fetching the campaign up to 3 times
            for (int i = 0; i < 3; i++) {
                Optional<Campaign> campaignOptional = campaignRepository.findById(campaignId);
                if (campaignOptional.isPresent()) {
                    campaign = campaignOptional.get();
                    break;
                }
                // Wait for 100ms before retrying
                Thread.sleep(100);
            }

            if (campaign == null) {
                // If it's still not found after retries, throw an exception.
                throw new NoSuchElementException("Campaign not found after retries for ID: " + campaignId);
            }

            campaign.setStatus(Campaign.CampaignStatus.IN_PROGRESS);
            campaignRepository.save(campaign);

            List<Customer> audience = audienceService.getAudience(campaign.getSegment().getRules());
            campaign.setAudienceSize(audience.size());
            campaignRepository.save(campaign);

            for (Customer customer : audience) {
                CommunicationLog log = new CommunicationLog();
                log.setCampaign(campaign);

                log.setCustomer(customer);
                log.setStatus(CommunicationLog.Status.PENDING);
                CommunicationLog savedLog = communicationLogRepository.save(log);

                vendorApiService.sendMessage(savedLog, campaign.getMessage());
            }

        } catch (Exception e) {
            log.error("Error processing campaign launch event for campaignId: {}", campaignId, e);
        }
    }
}
