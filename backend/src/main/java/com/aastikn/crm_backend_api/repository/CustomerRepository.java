package com.aastikn.crm_backend_api.repository;


import com.aastikn.crm_backend_api.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    Optional<Customer> findByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE c.totalSpending > :amount")
    List<Customer> findByTotalSpendingGreaterThan(@Param("amount") Double amount);

    @Query("SELECT c FROM Customer c WHERE c.visitCount < :visits")
    List<Customer> findByVisitCountLessThan(@Param("visits") Integer visits);

    @Query("SELECT c FROM Customer c WHERE c.lastVisit < :date")
    List<Customer> findInactiveCustomers(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.totalSpending > :amount AND c.visitCount < :visits")
    Long countBySpendingAndVisits(@Param("amount") Double amount, @Param("visits") Integer visits);

    @Query("SELECT FUNCTION('DATE', c.createdAt), COUNT(c.id) FROM Customer c WHERE c.createdAt >= :since GROUP BY FUNCTION('DATE', c.createdAt) ORDER BY FUNCTION('DATE', c.createdAt)")
    List<Object[]> countCustomersByDay(@Param("since") LocalDateTime since);
}