package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import com.aastikn.crm_backend_api.entity.CommunicationLog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class VendorApiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String receiptWebhookUrl = "http://localhost:3000/api/v1/receipts"; // URL to your own backend

    public void sendMessage(CommunicationLog communicationLog, String messageTemplate) {
        // Personalize the message as required [cite: 32]
        String personalizedMessage = messageTemplate.replace("{name}", communicationLog.getCustomer().getName());
        log.info("VENDOR_API_SIM: Sending message to {}: '{}'", communicationLog.getCustomer().getEmail(), personalizedMessage);

        // Simulate success/failure (~90% SENT, ~10% FAILED) [cite: 33]
//        String status = Math.random() < 0.9 ? "SENT" : "FAILED";
        String status = "SENT";

        DeliveryReceiptDto receipt = new DeliveryReceiptDto(communicationLog.getId(), status);

        // Hit the delivery receipt API on your backend [cite: 34]
        try {
            // This makes an HTTP POST request to your own DeliveryReceiptController
            restTemplate.postForEntity(receiptWebhookUrl, receipt, String.class);
            log.info("VENDOR_API_SIM: Sent delivery receipt for logId: {} with status: {}", communicationLog.getId(), status);
        } catch (Exception e) {
            log.error("VENDOR_API_SIM: Failed to send delivery receipt for logId: {}", communicationLog.getId(), e);
        }
    }
}