package com.aastikn.crm_backend_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for invalid JWT tokens.
 * Returns HTTP 401 Unauthorized.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidTokenException extends RuntimeException {

    /**
     * Constructs a new InvalidTokenException with the specified detail message.
     * @param message the detail message.
     */
    public InvalidTokenException(String message) {
        super(message);
    }

    /**
     * Constructs a new InvalidTokenException with the specified detail message and cause.
     * @param message the detail message.
     * @param cause the cause.
     */
    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
