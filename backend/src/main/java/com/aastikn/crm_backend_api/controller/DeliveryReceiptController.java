package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import com.aastikn.crm_backend_api.service.MessageProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/receipts")
@RequiredArgsConstructor
public class DeliveryReceiptController {

    private final MessageProducerService messageProducerService;
    public static final String RECEIPT_UPDATE_CHANNEL = "receipt:update";

    @PostMapping
    public ResponseEntity<Void> handleReceipt(@RequestBody DeliveryReceiptDto receipt) {
        log.info("published {} as a receipt",receipt);
        // Publish the receipt to a Redis channel for a consumer to process
        messageProducerService.publish(RECEIPT_UPDATE_CHANNEL, receipt);
        return ResponseEntity.ok().build();
    }
}