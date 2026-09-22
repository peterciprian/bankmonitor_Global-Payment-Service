package com.bankmonitor.paymentgateway.controller;

import com.bankmonitor.paymentgateway.domain.Currency;
import com.bankmonitor.paymentgateway.domain.TransferStatus;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record TransferResponse(
        Long id,
        Long fromAccountId,
        Long toAccountId,
        BigDecimal amount,
        BigDecimal convertedAmount,
        Currency currency,
        Currency targetCurrency,
        BigDecimal exchangeRate,
        TransferStatus status,
        OffsetDateTime createdAt) {
}