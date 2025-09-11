package com.aastikn.crm_backend_api.config;

import com.aastikn.crm_backend_api.consumer.CustomerConsumer;
import com.aastikn.crm_backend_api.consumer.OrderConsumer;
import io.lettuce.core.RedisBusyException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.RedisSystemException;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.Subscription;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class RedisStreamConfig {

    private final CustomerConsumer customerConsumer;
    private final OrderConsumer orderConsumer;
    private final RedisTemplate<String, Object> redisTemplate; // Injected RedisTemplate

    @Bean
    public StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamMessageListenerContainer(RedisConnectionFactory redisConnectionFactory) {
        StreamMessageListenerContainer.StreamMessageListenerContainerOptions<String, MapRecord<String, String, String>> options =
                StreamMessageListenerContainer.StreamMessageListenerContainerOptions.builder()
                        .pollTimeout(Duration.ofSeconds(1))
                        .build();

        StreamMessageListenerContainer<String, MapRecord<String, String, String>> container =
                StreamMessageListenerContainer.create(redisConnectionFactory, options);

        container.start();
        return container;
    }

    @Bean(destroyMethod = "cancel")
    public Subscription customerSubscription(StreamMessageListenerContainer<String, MapRecord<String, String, String>> container) {
        createGroupIfNeeded("customer:create", "crm-group");
        return container.receive(
                Consumer.from("crm-group", "customer-consumer"),
                StreamOffset.create("customer:create", ReadOffset.lastConsumed()),
                customerConsumer
        );
    }

    @Bean(destroyMethod = "cancel")
    public Subscription orderSubscription(StreamMessageListenerContainer<String, MapRecord<String, String, String>> container) {
        createGroupIfNeeded("order:create", "crm-group");
        return container.receive(
                Consumer.from("crm-group", "order-consumer"),
                StreamOffset.create("order:create", ReadOffset.lastConsumed()),
                orderConsumer
        );
    }

    private void createGroupIfNeeded(String streamKey, String groupName) {
        try {
            // Use RedisTemplate to properly manage connection from the pool
            redisTemplate.execute((RedisCallback<Object>) connection ->
                    connection.streamCommands().xGroupCreate(streamKey.getBytes(), groupName, ReadOffset.latest(), true));
        } catch (RedisSystemException e) {
            if (e.getCause() instanceof RedisBusyException) {
                log.info("Redis group '{}' already exists for stream '{}'.", groupName, streamKey);
            } else {
                log.error("Error creating Redis group: {}", e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error("An unexpected error occurred while creating Redis group for stream '{}'", streamKey, e);
        }
    }
}