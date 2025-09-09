package com.aastikn.crm_backend_api.repository;


import com.aastikn.crm_backend_api.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(o.orderAmount) FROM Order o WHERE o.customer.id = :customerId")
    Double getTotalSpendingByCustomer(@Param("customerId") Long customerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.customer.id = :customerId")
    Long getOrderCountByCustomer(@Param("customerId") Long customerId);
}
