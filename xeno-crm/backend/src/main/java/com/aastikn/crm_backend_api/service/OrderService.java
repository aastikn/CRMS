package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.OrderDto;
import com.aastikn.crm_backend_api.entity.Order;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import com.aastikn.crm_backend_api.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final MessageProducerService messageProducerService;

    private static final String ORDER_STREAM_KEY = "order:create";

    // Asynchronous creation via Redis Pub/Sub
    public void createOrderAsync(OrderDto orderDto) {
        // A quick check to ensure the customer exists before publishing the event
        if (!customerRepository.existsById(orderDto.getCustomerId())) {
            throw new RuntimeException("Attempted to create order for non-existent customer: " + orderDto.getCustomerId());
        }
        messageProducerService.addToStream(ORDER_STREAM_KEY, orderDto);
    }

    // Synchronous read operations (No changes needed here)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::convertToDto);
    }

    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToDto(order);
    }

    // DTO Conversion (No changes needed here)
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setOrderAmount(order.getOrderAmount());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus().name());
        dto.setDescription(order.getDescription());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}