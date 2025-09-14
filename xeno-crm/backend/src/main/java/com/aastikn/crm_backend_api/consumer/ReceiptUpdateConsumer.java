package com.aastikn.crm_backend_api.consumer;

import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import com.aastikn.crm_backend_api.entity.Campaign;
import com.aastikn.crm_backend_api.entity.CommunicationLog;
import com.aastikn.crm_backend_api.repository.CampaignRepository;
import com.aastikn.crm_backend_api.repository.CommunicationLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceiptUpdateConsumer implements MessageListener {

    private final CommunicationLogRepository logRepository;
    private final CampaignRepository campaignRepository;
    private final ObjectMapper objectMapper;
    private final Queue<DeliveryReceiptDto> receiptQueue = new ConcurrentLinkedQueue<>();

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            DeliveryReceiptDto receipt = objectMapper.readValue(message.getBody(), DeliveryReceiptDto.class);
            receiptQueue.add(receipt);
        } catch (IOException e) {
            log.error("Error deserializing receipt message", e);
        }
    }

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void processReceiptQueue() {
        if (receiptQueue.isEmpty()) {
            return;
        }
        log.info("Processing {} receipts from the queue.", receiptQueue.size());

        List<DeliveryReceiptDto> receiptsToProcess = new ArrayList<>();
        DeliveryReceiptDto receipt;
        while ((receipt = receiptQueue.poll()) != null) {
            receiptsToProcess.add(receipt);
        }

        List<Long> sentIds = receiptsToProcess.stream()
                .filter(r -> "SENT".equals(r.getStatus()))
                .map(DeliveryReceiptDto::getLogId).toList();

        List<Long> failedIds = receiptsToProcess.stream()
                .filter(r -> "FAILED".equals(r.getStatus()))
                .map(DeliveryReceiptDto::getLogId).toList();

        java.util.Set<Long> affectedCampaignIds = new java.util.HashSet<>();

        if (!sentIds.isEmpty()) {
            logRepository.updateStatusForIds(CommunicationLog.Status.SENT, sentIds);
            logRepository.countByCampaignId(sentIds).forEach(row -> {
                Long campaignId = (Long) row[0];
                int count = ((Long) row[1]).intValue();
                campaignRepository.updateCounts(campaignId, count, 0);
                affectedCampaignIds.add(campaignId);
            });
        }

        if (!failedIds.isEmpty()) {
            logRepository.updateStatusForIds(CommunicationLog.Status.FAILED, failedIds);
            logRepository.countByCampaignId(failedIds).forEach(row -> {
                Long campaignId = (Long) row[0];
                int count = ((Long) row[1]).intValue();
                campaignRepository.updateCounts(campaignId, 0, count);
                affectedCampaignIds.add(campaignId);
            });
        }

        affectedCampaignIds.forEach(campaignId -> {
            campaignRepository.findById(campaignId).ifPresent(campaign -> {
                if (campaign.getStatus() == Campaign.CampaignStatus.IN_PROGRESS) {
                    int totalProcessed = campaign.getSentCount() + campaign.getFailedCount();
                    if (totalProcessed >= campaign.getAudienceSize()) {
                        campaign.setStatus(Campaign.CampaignStatus.COMPLETED);
                        campaignRepository.save(campaign);
                        log.info("Campaign {} marked as COMPLETED.", campaignId);
                    }
                }
            });
        });
    }
}
