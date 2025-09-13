package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.DeliveryReceiptDto;
import com.aastikn.crm_backend_api.service.MessageProducerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/receipts")
@RequiredArgsConstructor
public class DeliveryReceiptController {

    private final MessageProducerService messageProducerService;

    public static final String RECEIPT_UPDATE_STREAM_KEY = "receipt:update";

    @PostMapping
    public ResponseEntity<Void> handleReceipt(@Valid @RequestBody DeliveryReceiptDto receipt) {
        messageProducerService.addToStream(RECEIPT_UPDATE_STREAM_KEY, receipt);
        return ResponseEntity.ok().build();
    }
}
