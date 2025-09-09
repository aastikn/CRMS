package com.aastikn.crm_backend_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
public class CrmBackendApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmBackendApiApplication.class, args);
    }
}