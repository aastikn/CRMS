package com.aastikn.crm_backend_api.config;

import com.aastikn.crm_backend_api.consumer.CampaignDeliveryConsumer;
import com.aastikn.crm_backend_api.consumer.ReceiptUpdateConsumer;
import com.aastikn.crm_backend_api.controller.DeliveryReceiptController;
import com.aastikn.crm_backend_api.service.CampaignService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@Slf4j
public class RedisConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        // This disables writing dates as timestamps, which is more readable
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Use the customized ObjectMapper for the value serializer
        GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        // Set serializers
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(valueSerializer);
        template.setHashValueSerializer(valueSerializer);

        template.afterPropertiesSet();
        log.info("RedisTemplate configured successfully with custom ObjectMapper");
        return template;
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            CampaignDeliveryConsumer campaignDeliveryConsumer,
            ReceiptUpdateConsumer receiptUpdateConsumer) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        container.addMessageListener(campaignDeliveryConsumer, new ChannelTopic(CampaignService.CAMPAIGN_LAUNCH_CHANNEL));
        container.addMessageListener(receiptUpdateConsumer, new ChannelTopic(DeliveryReceiptController.RECEIPT_UPDATE_CHANNEL));

        log.info("Redis pub/sub message listener container configured");
        return container;
    }
}