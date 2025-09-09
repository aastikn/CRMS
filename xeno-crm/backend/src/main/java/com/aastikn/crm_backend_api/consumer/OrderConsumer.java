// OrderConsumer.java
package com.aastikn.crm_backend_api.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.aastikn.crm_backend_api.dto.OrderDto;
import com.aastikn.crm_backend_api.entity.Order;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.OrderRepository;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// MODIFIED: Import MapRecord instead of ObjectRecord
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
// MODIFIED: Implement StreamListener with MapRecord type
public class OrderConsumer implements StreamListener<String, MapRecord<String, String, String>> {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    // MODIFIED: onMessage now receives a MapRecord
    public void onMessage(MapRecord<String, String, String> record) {
        try {
            // MODIFIED: Extract the JSON string from the map value using the "data" key
            String jsonData = record.getValue().get("data");

            if (jsonData == null) {
                log.warn("Received an order record without a 'data' field: {}", record);
                return;
            }

            OrderDto orderDto = objectMapper.readValue(jsonData, OrderDto.class);

            log.info("Processing order for customer ID: {}", orderDto.getCustomerId());

            Customer customer = customerRepository.findById(orderDto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found: " + orderDto.getCustomerId()));

            Order order = convertToEntity(orderDto, customer);

            orderRepository.save(order);

            updateCustomerStats(customer, orderDto.getOrderAmount());

            log.info("Successfully processed order for customer: {}", customer.getEmail());

        } catch (Exception e) {
            log.error("Error processing order message: {}", record, e);
        }
    }

    private Order convertToEntity(OrderDto dto, Customer customer) {
        Order order = new Order();
        order.setId(dto.getId());
        order.setCustomer(customer);
        order.setOrderAmount(dto.getOrderAmount());
        order.setOrderDate(dto.getOrderDate());
        order.setDescription(dto.getDescription());

        if (dto.getStatus() != null) {
            try {
                order.setStatus(Order.OrderStatus.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                order.setStatus(Order.OrderStatus.PENDING);
            }
        }

        return order;
    }

    private void updateCustomerStats(Customer customer, Double orderAmount) {
        customer.setTotalSpending(customer.getTotalSpending() + orderAmount);
        customer.setVisitCount(customer.getVisitCount() + 1);
        customer.setLastVisit(java.time.LocalDateTime.now());
        customerRepository.save(customer);
    }
}