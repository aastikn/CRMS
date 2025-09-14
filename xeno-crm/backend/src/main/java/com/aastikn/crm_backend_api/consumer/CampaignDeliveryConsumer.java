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

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignDeliveryConsumer implements MessageListener {

    private final CampaignRepository campaignRepository;
    private final AudienceService audienceService;
    private final CommunicationLogRepository communicationLogRepository;
    private final VendorApiService vendorApiService;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            Long campaignId = objectMapper.readValue(message.getBody(), Long.class);
            log.info("Received campaign launch event for campaignId: {}", campaignId);

            Campaign campaign = campaignRepository.findById(campaignId).orElseThrow();
            campaign.setStatus(Campaign.CampaignStatus.IN_PROGRESS);
            campaignRepository.save(campaign);

            // 1. Find the audience
            List<Customer> audience = audienceService.getAudience(campaign.getSegment().getRules());
            campaign.setAudienceSize(audience.size());
            campaignRepository.save(campaign);
            log.info("calling vendor service to send onmessage cdc");
            // 2. Create logs and call vendor for each customer
//            log.info("savedLog for first is {}, and cgm is {}",audience.stream().findFirst());
            for (Customer customer : audience) {
                CommunicationLog log = new CommunicationLog();
                log.setCampaign(campaign);
                log.setCustomer(customer);
                log.setStatus(CommunicationLog.Status.PENDING);
                CommunicationLog savedLog = communicationLogRepository.save(log);
                // 3. Simulate sending the message via the vendor

                vendorApiService.sendMessage(savedLog, campaign.getMessage());
            }

        } catch (Exception e) {
            log.error("Error processing campaign launch event", e);
        }
    }
}
