package com.aastikn.crm_backend_api.repository;

import com.aastikn.crm_backend_api.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    @Query("SELECT c FROM Campaign c LEFT JOIN FETCH c.segment ORDER BY c.createdAt DESC")
    List<Campaign> findAllWithSegment();

    @Modifying
    @Query("UPDATE Campaign c SET c.sentCount = c.sentCount + :sent, c.failedCount = c.failedCount + :failed WHERE c.id = :id")
    void updateCounts(@Param("id") Long id, @Param("sent") int sent, @Param("failed") int failed);
}
