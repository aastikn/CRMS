package com.aastikn.crm_backend_api.repository;

import com.aastikn.crm_backend_api.entity.CommunicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {

    @Modifying
    @Query("UPDATE CommunicationLog cl SET cl.status = :status WHERE cl.id IN :ids")
    void updateStatusForIds(@Param("status") CommunicationLog.Status status, @Param("ids") List<Long> ids);

    @Query("SELECT cl.campaign.id, COUNT(cl.id) FROM CommunicationLog cl WHERE cl.id IN :ids GROUP BY cl.campaign.id")
    List<Object[]> countByCampaignId(@Param("ids") List<Long> ids);
}
