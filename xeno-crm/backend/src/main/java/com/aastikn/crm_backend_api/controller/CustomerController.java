package com.aastikn.crm_backend_api.controller;

import com.aastikn.crm_backend_api.dto.ApiResponse;
import com.aastikn.crm_backend_api.dto.CustomerDto;
import com.aastikn.crm_backend_api.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "APIs for managing customers")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @Operation(summary = "Create a new customer",
            description = "Creates a new customer and publishes to message queue for async processing")
    public ResponseEntity<ApiResponse<String>> createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        customerService.createCustomerAsync(customerDto);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.success("Customer creation request accepted and will be processed asynchronously"));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple customers", description = "Bulk customer creation")
    public ResponseEntity<ApiResponse<String>> createCustomers(@Valid @RequestBody List<CustomerDto> customers) {
        customerService.createCustomersAsync(customers);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.success("Bulk customer creation request accepted"));
    }

    @GetMapping
    @Operation(summary = "Get all customers", description = "Retrieve paginated list of customers")
    public ResponseEntity<ApiResponse<Page<CustomerDto>>> getAllCustomers(Pageable pageable) {
        Page<CustomerDto> customers = customerService.getAllCustomers(pageable);
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Retrieve a specific customer by ID")
    public ResponseEntity<ApiResponse<CustomerDto>> getCustomerById(@PathVariable Long id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer", description = "Update an existing customer")
    public ResponseEntity<ApiResponse<CustomerDto>> updateCustomer(@PathVariable Long id,
                                                                   @Valid @RequestBody CustomerDto customerDto) {
        customerDto.setId(id);
        CustomerDto updated = customerService.updateCustomer(customerDto);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer", description = "Delete a customer by ID")
    public ResponseEntity<ApiResponse<String>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search customers", description = "Search customers by various criteria")
    public ResponseEntity<ApiResponse<List<CustomerDto>>> searchCustomers(
            @RequestParam(required = false) Double minSpending,
            @RequestParam(required = false) Integer maxVisits,
            @RequestParam(required = false) Integer inactiveDays) {

        List<CustomerDto> customers = customerService.searchCustomers(minSpending, maxVisits, inactiveDays);
        return ResponseEntity.ok(ApiResponse.success(customers));
    }
}