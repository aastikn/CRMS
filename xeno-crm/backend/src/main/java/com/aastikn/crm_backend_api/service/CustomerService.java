package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.CustomerDto;
import com.aastikn.crm_backend_api.entity.Customer;
import com.aastikn.crm_backend_api.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final MessageProducerService messageProducerService;

    // Asynchronous creation via Redis Streams
    public void createCustomerAsync(CustomerDto customerDto) {
        messageProducerService.publishCustomerEvent(customerDto);
    }

    // Asynchronous bulk creation
    public void createCustomersAsync(List<CustomerDto> customerDtos) {
        customerDtos.forEach(messageProducerService::publishCustomerEvent);
    }

    // Synchronous read operations
    public Page<CustomerDto> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable).map(this::convertToDto);
    }

    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return convertToDto(customer);
    }

    // Synchronous update and delete
    @Transactional
    public CustomerDto updateCustomer(CustomerDto customerDto) {
        Customer existingCustomer = customerRepository.findById(customerDto.getId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerDto.getId()));

        existingCustomer.setName(customerDto.getName());
        existingCustomer.setEmail(customerDto.getEmail());
        existingCustomer.setPhone(customerDto.getPhone());

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return convertToDto(updatedCustomer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    // Search functionality
    public List<CustomerDto> searchCustomers(Double minSpending, Integer maxVisits, Integer inactiveDays) {
        // This is a simplified search. A more complex implementation might use Specifications or Criteria API.
        if (minSpending != null) {
            return customerRepository.findByTotalSpendingGreaterThan(minSpending)
                    .stream().map(this::convertToDto).collect(Collectors.toList());
        }
        if (maxVisits != null) {
            return customerRepository.findByVisitCountLessThan(maxVisits)
                    .stream().map(this::convertToDto).collect(Collectors.toList());
        }
        if (inactiveDays != null) {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(inactiveDays);
            return customerRepository.findInactiveCustomers(cutoffDate)
                    .stream().map(this::convertToDto).collect(Collectors.toList());
        }
        return List.of();
    }

    private CustomerDto convertToDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setTotalSpending(customer.getTotalSpending());
        dto.setVisitCount(customer.getVisitCount());
        dto.setLastVisit(customer.getLastVisit());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());
        return dto;
    }
}