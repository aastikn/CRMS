package com.aastikn.crm_backend_api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.aastikn.crm_backend_api.config.RedisConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageProducerService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public void publishCustomerEvent(Object customerData) {
        try {
            String jsonData = objectMapper.writeValueAsString(customerData);

            // Create MapRecord with structured data
            MapRecord<String, String, String> record = StreamRecords.newRecord()
                    .in(RedisConfig.CUSTOMER_STREAM)
                    .ofMap(Map.of(
                            "data", jsonData,
                            "type", "customer",
                            "timestamp", String.valueOf(System.currentTimeMillis())
                    ));

            redisTemplate.opsForStream().add(record);
            log.info("Published customer event to stream: {}", RedisConfig.CUSTOMER_STREAM);

        } catch (JsonProcessingException e) {
            log.error("Error publishing customer event", e);
            throw new RuntimeException("Failed to publish customer event", e);
        }
    }

    public void publishOrderEvent(Object orderData) {
        try {
            String jsonData = objectMapper.writeValueAsString(orderData);

            // Create MapRecord with structured data
            MapRecord<String, String, String> record = StreamRecords.newRecord()
                    .in(RedisConfig.ORDER_STREAM)
                    .ofMap(Map.of(
                            "data", jsonData,
                            "type", "order",
                            "timestamp", String.valueOf(System.currentTimeMillis())
                    ));

            redisTemplate.opsForStream().add(record);
            log.info("Published order event to stream: {}", RedisConfig.ORDER_STREAM);

        } catch (JsonProcessingException e) {
            log.error("Error publishing order event", e);
            throw new RuntimeException("Failed to publish order event", e);
        }
    }
}