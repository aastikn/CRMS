package com.aastikn.crm_backend_api.config;

import com.aastikn.crm_backend_api.consumer.CustomerConsumer;
import com.aastikn.crm_backend_api.consumer.OrderConsumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.RedisSystemException;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;

import java.time.Duration;

@Configuration
@Slf4j // Add Slf4j for logging
public class RedisConfig {

    public static final String CUSTOMER_STREAM = "customer-stream";
    public static final String ORDER_STREAM = "order-stream";
    public static final String CONSUMER_GROUP = "crm-consumers";

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamContainer(
            RedisConnectionFactory connectionFactory,
            RedisTemplate<String, Object> redisTemplate, // Inject RedisTemplate
            CustomerConsumer customerConsumer,
            OrderConsumer orderConsumer) {

        // Use var to let the compiler infer the correct type
        var options = StreamMessageListenerContainer
                .StreamMessageListenerContainerOptions
                .builder()
                .pollTimeout(Duration.ofSeconds(1))
                .build();

        // Use var for type inference
        var container = StreamMessageListenerContainer.create(connectionFactory, options);

        // MODIFIED: Ensure the streams and consumer groups exist before starting the container.
        // The createGroup command automatically creates the stream if it doesn't exist.
        try {
            redisTemplate.opsForStream().createGroup(CUSTOMER_STREAM, ReadOffset.latest(), CONSUMER_GROUP);
        } catch (RedisSystemException e) {
            // Check if the cause is a BUSYGROUP error, which is expected if the group already exists.
            if (e.getCause() != null && e.getCause().getMessage().contains("BUSYGROUP")) {
                log.warn("Consumer group '{}' already exists for stream '{}'.", CONSUMER_GROUP, CUSTOMER_STREAM);
            } else {
                log.error("Error creating consumer group for customer-stream", e);
            }
        }
        try {
            redisTemplate.opsForStream().createGroup(ORDER_STREAM, ReadOffset.latest(), CONSUMER_GROUP);
        } catch (RedisSystemException e) {
            if (e.getCause() != null && e.getCause().getMessage().contains("BUSYGROUP")) {
                log.warn("Consumer group '{}' already exists for stream '{}'.", CONSUMER_GROUP, ORDER_STREAM);
            } else {
                log.error("Error creating consumer group for order-stream", e);
            }
        }


        container.receiveAutoAck(
                Consumer.from(CONSUMER_GROUP, "customer-consumer"),
                StreamOffset.create(CUSTOMER_STREAM, ReadOffset.lastConsumed()),
                customerConsumer
        );

        container.receiveAutoAck(
                Consumer.from(CONSUMER_GROUP, "order-consumer"),
                StreamOffset.create(ORDER_STREAM, ReadOffset.lastConsumed()),
                orderConsumer
        );

        container.start();
        return container;
    }
}
