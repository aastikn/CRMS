package com.aastikn.crm_backend_api.repository;

import com.aastikn.crm_backend_api.entity.CommunicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {
}
