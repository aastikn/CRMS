package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.CustomerDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageProducerService {

    // Spring injects the RedisTemplate bean you defined in RedisConfig
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Adds a message to a specific Redis Stream.
     *
     * @param streamKey The key of the stream to add the message to.
     * @param message The message object (e.g., a CustomerDto or OrderDto).
     */
    public void addToStream(String streamKey, Object message) {
        try {
            log.info("Adding message to Redis Stream '{}'", streamKey);
            // Use opsForStream().add() and wrap the message in a Map
            // to create a stream entry with a 'data' field.
            redisTemplate.opsForStream().add(streamKey, Map.of("data", message));
            log.info("Message added successfully to stream '{}'", streamKey);
        } catch (Exception e) {
            log.error("Error adding message to stream '{}'", streamKey, e);
        }
    }
}