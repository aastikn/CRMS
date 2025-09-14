package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.controller.DeliveryReceiptController;
import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import com.aastikn.crm_backend_api.entity.CommunicationLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class VendorApiService {

    private final MessageProducerService messageProducerService;

    public void sendMessage(CommunicationLog communicationLog, String messageTemplate) {
        // Personalize the message as required [cite: 32]
        String personalizedMessage = messageTemplate.replace("{name}", communicationLog.getCustomer().getName());
        log.info("VENDOR_API_SIM: Sending message to {}: '{}'", communicationLog.getCustomer().getEmail(), personalizedMessage);

        // Simulate success/failure (~90% SENT, ~10% FAILED) [cite: 33]
        String status = Math.random() < 0.9 ? "SENT" : "FAILED";


        DeliveryReceiptDto receipt = new DeliveryReceiptDto(communicationLog.getId(), status);

        // Publish the receipt to a Redis channel for a consumer to process
        messageProducerService.publish(DeliveryReceiptController.RECEIPT_UPDATE_CHANNEL, receipt);
        log.info("VENDOR_API_SIM: Published delivery receipt for logId: {} with status: {}", communicationLog.getId(), status);
    }
}
