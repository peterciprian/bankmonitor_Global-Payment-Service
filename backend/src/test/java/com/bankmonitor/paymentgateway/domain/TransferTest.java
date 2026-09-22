package com.bankmonitor.paymentgateway.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class TransferTest {

    private final Account source = new Account(1L, "source", Currency.EUR, new BigDecimal("100.00"));
    private final Account target = new Account(2L, "target", Currency.EUR, new BigDecimal("50.00"));

    @Test
    void shouldStartInPendingState() {
        Transfer transfer = new Transfer(source, target, new BigDecimal("10.00"), Currency.EUR);

        assertEquals(TransferStatus.PENDING, transfer.getStatus());
    }

    @Test
    void shouldTransitionToCompleted() {
        Transfer transfer = new Transfer(source, target, new BigDecimal("10.00"), Currency.EUR);

        transfer.markCompleted();

        assertEquals(TransferStatus.COMPLETED, transfer.getStatus());
    }

    @Test
    void shouldTransitionToFailed() {
        Transfer transfer = new Transfer(source, target, new BigDecimal("10.00"), Currency.EUR);

        transfer.markFailed();

        assertEquals(TransferStatus.FAILED, transfer.getStatus());
    }

    @Test
    void shouldRejectZeroAndNegativeAmounts() {
        assertThrows(IllegalArgumentException.class,
                () -> new Transfer(source, target, BigDecimal.ZERO, Currency.EUR));
        assertThrows(IllegalArgumentException.class,
                () -> new Transfer(source, target, new BigDecimal("-1.00"), Currency.EUR));
    }
}