package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.entity.CommunicationLog;
import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class VendorApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    // The URL of our own backend's receipt endpoint
    private final String receiptWebhookUrl = "http://localhost:3000/api/v1/receipts";

    public void sendMessage(CommunicationLog communicationLog, String baseMessage) {
        // Personalize the message (assuming {name} placeholder exists in baseMessage)
        String personalizedMessage = baseMessage.replace("{name}", communicationLog.getCustomer().getName() != null ? communicationLog.getCustomer().getName() : "Customer");
        log.info("Simulating sending message to {}: {}", communicationLog.getCustomer().getEmail(), personalizedMessage);
        
        // Simulate success/failure
        CommunicationLog.Status status = Math.random() < 0.9 ? CommunicationLog.Status.SENT : CommunicationLog.Status.FAILED;
        
        // Prepare the receipt to send back
        DeliveryReceiptDto receipt = new DeliveryReceiptDto(communicationLog.getId(), status.name());
        
        // Simulate calling our own webhook
        try {
            restTemplate.postForEntity(receiptWebhookUrl, receipt, String.class);
            log.info("Delivery receipt sent for logId: {} with status: {}", communicationLog.getId(), status.name());
        } catch (Exception e) {
            log.error("Failed to send delivery receipt for logId: {}", communicationLog.getId(), e);
        }
    }
}
