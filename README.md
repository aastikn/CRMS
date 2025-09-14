# Xeno-CRM API Documentation

This document provides a list of `curl` commands to test the backend API routes for the Xeno-CRM application.

The base URL is assumed to be `http://localhost:8080/api/v1` as configured in `xeno-crm/backend/src/main/resources/application.yml`.

**Note:** For endpoints that require an ID (like `/{id}`), `1` is used as a placeholder. You will need to replace this with a valid ID from your database.

---

## **Customer Management (`/api/v1/customers`)**

### 1. Create a new customer
This sends a request to create a single customer. The operation is asynchronous.
```bash
curl -X POST http://localhost:8080/api/v1/customers \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+11234567890"
}'
```

### 2. Create multiple customers (bulk)
This sends a request to create a list of customers in bulk.
```bash
curl -X POST http://localhost:8080/api/v1/customers/bulk \
-H "Content-Type: application/json" \
-d \
"[
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+19876543210"
  },
  {
    "name": "Peter Pan",
    "email": "peter.pan@example.com",
    "phone": "+15555555555"
  }
]"
```

### 3. Get all customers (paginated)
This retrieves a paginated list of all customers. You can change the `page` and `size` parameters.
```bash
curl -X GET "http://localhost:8080/api/v1/customers?page=0&size=10"
```

### 4. Get a specific customer by ID
This retrieves a single customer by their unique ID.
```bash
curl -X GET http://localhost:8080/api/v1/customers/1
```

### 5. Update an existing customer
This updates the details of an existing customer.
```bash
curl -X PUT http://localhost:8080/api/v1/customers/1 \
-H "Content-Type: application/json" \
-d '{
  "name": "Johnathan Doe",
  "email": "john.doe.updated@example.com",
  "phone": "+11234567899"
}'
```

### 6. Delete a customer by ID
This deletes a customer from the database.
```bash
curl -X DELETE http://localhost:8080/api/v1/customers/1
```

### 7. Search customers
These examples show how to use the search functionality based on different criteria.

*   **By minimum total spending:**
    ```bash
    curl -X GET "http://localhost:8080/api/v1/customers/search?minSpending=100.50"
    ```

*   **By maximum number of visits:**
    ```bash
    curl -X GET "http://localhost:8080/api/v1/customers/search?maxVisits=5"
    ```

*   **By days since last visit (inactive customers):**
    ```bash
    curl -X GET "http://localhost:8080/api/v1/customers/search?inactiveDays=30"
    ```

---

## **Order Management (`/api/v1/orders`)**

### 1. Create a new order
This sends a request to create a new order for an existing customer. The operation is asynchronous.
```bash
curl -X POST http://localhost:8080/api/v1/orders \
-H "Content-Type: application/json" \
-d '{
  "customerId": 1,
  "orderAmount": 99.99,
  "orderDate": "2025-09-11T10:00:00",
  "description": "A test order from Postman"
}'
```

### 2. Get all orders (paginated)
This retrieves a paginated list of all orders.
```bash
curl -X GET "http://localhost:8080/api/v1/orders?page=0&size=10"
```

### 3. Get a specific order by ID
This retrieves a single order by its unique ID.
```bash
curl -X GET http://localhost:8080/api/v1/orders/1
```
