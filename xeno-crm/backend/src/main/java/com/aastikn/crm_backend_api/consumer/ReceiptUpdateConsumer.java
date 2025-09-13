package com.aastikn.crm_backend_api.consumer;

import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import com.aastikn.crm_backend_api.repository.CommunicationLogRepository;
import com.aastikn.crm_backend_api.repository.CampaignRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.aastikn.crm_backend_api.entity.CommunicationLog;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReceiptUpdateConsumer implements StreamListener<String, MapRecord<String, String, String>> {

    private final CommunicationLogRepository logRepository;
    private final CampaignRepository campaignRepository;
    private final ObjectMapper objectMapper;

    private final Queue<DeliveryReceiptDto> receiptQueue = new ConcurrentLinkedQueue<>();

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        try {
            String jsonData = message.getValue().get("data");
            if (jsonData == null) {
                log.warn("Received a receipt record without a 'data' field: {}", message);
                return;
            }
            DeliveryReceiptDto receipt = objectMapper.readValue(jsonData, DeliveryReceiptDto.class);
            receiptQueue.add(receipt);
        } catch (Exception e) {
            log.error("Error deserializing receipt: {}", message, e);
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
        while(!receiptQueue.isEmpty()) {
            receiptsToProcess.add(receiptQueue.poll());
        }

        List<Long> sentIds = receiptsToProcess.stream()
            .filter(r -> CommunicationLog.Status.SENT.name().equals(r.getStatus()))
            .map(DeliveryReceiptDto::getLogId).toList();

        List<Long> failedIds = receiptsToProcess.stream()
            .filter(r -> CommunicationLog.Status.FAILED.name().equals(r.getStatus()))
            .map(DeliveryReceiptDto::getLogId).toList();

        if (!sentIds.isEmpty()) {
            logRepository.updateStatusForIds(CommunicationLog.Status.SENT, sentIds);
            List<Object[]> sentCounts = logRepository.countByCampaignId(sentIds);
            for (Object[] row : sentCounts) {
                campaignRepository.updateCounts((Long) row[0], ((Long) row[1]).intValue(), 0);
            }
        }
        if (!failedIds.isEmpty()) {
            logRepository.updateStatusForIds(CommunicationLog.Status.FAILED, failedIds);
            List<Object[]> failedCounts = logRepository.countByCampaignId(failedIds);
            for (Object[] row : failedCounts) {
                campaignRepository.updateCounts((Long) row[0], 0, ((Long) row[1]).intValue());
            }
        }
    }
}
