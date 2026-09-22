package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.controller.TransferResponse;
import java.util.Optional;

public interface IdempotencyService {

    Optional<IdempotencyRecord> find(String key);

    void markProcessing(String key);

    record IdempotencyRecord(Status status, TransferResponse cachedResponse) {
        public enum Status {
            NEW,
            PROCESSING,
            SUCCESS,
            FAILED
        }
    }
}