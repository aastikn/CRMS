// CustomerConsumer.java
package com.aastikn.crm_backend_api.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.aastikn.crm_backend_api.dto.CustomerDto;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// MODIFIED: Import MapRecord instead of ObjectRecord
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
// MODIFIED: Implement StreamListener with MapRecord type
public class CustomerConsumer implements StreamListener<String, MapRecord<String, String, String>> {

    private final CustomerRepository customerRepository;
    private final ObjectMapper objectMapper;

    @Override
    // MODIFIED: onMessage now receives a MapRecord
    public void onMessage(MapRecord<String, String, String> record) {
        try {
            // MODIFIED: Extract the JSON string from the map value using the "data" key
            String jsonData = record.getValue().get("data");

            if (jsonData == null) {
                log.warn("Received a record without a 'data' field: {}", record);
                return;
            }

            CustomerDto customerDto = objectMapper.readValue(jsonData, CustomerDto.class);

            log.info("Processing customer data: {}", customerDto.getEmail());

            Customer customer = convertToEntity(customerDto);

            if (customer.getId() == null && customerRepository.findByEmail(customer.getEmail()).isPresent()) {
                log.warn("Customer with email {} already exists, skipping", customer.getEmail());
                return;
            }

            customerRepository.save(customer);

            log.info("Successfully processed customer: {}", customerDto.getEmail());

        } catch (Exception e) {
            log.error("Error processing customer message: {}", record, e);
        }
    }

    private Customer convertToEntity(CustomerDto dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setTotalSpending(dto.getTotalSpending() != null ? dto.getTotalSpending() : 0.0);
        customer.setVisitCount(dto.getVisitCount() != null ? dto.getVisitCount() : 0);
        customer.setLastVisit(dto.getLastVisit());
        return customer;
    }
}