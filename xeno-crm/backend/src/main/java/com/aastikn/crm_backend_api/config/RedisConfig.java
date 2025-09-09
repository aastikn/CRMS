package com.aastikn.crm_backend_api.config;

import com.aastikn.crm_backend_api.consumer.CustomerConsumer;
import com.aastikn.crm_backend_api.consumer.OrderConsumer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.Subscription;

import java.time.Duration;

@Configuration
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
    public StreamMessageListenerContainer<String, MapRecord<String, String,String>> streamContainer(
            RedisConnectionFactory connectionFactory,
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
