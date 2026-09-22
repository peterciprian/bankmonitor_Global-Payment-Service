package com.bankmonitor.paymentgateway.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class AccountTest {

    @Test
    void shouldCreditBalanceWhenAmountIsPositive() {
        Account account = new Account(1L, "user-1", Currency.EUR, new BigDecimal("100.00"));

        account.credit(new BigDecimal("25.50"));

        assertEquals(new BigDecimal("125.50"), account.getBalance());
    }

    @Test
    void shouldDebitBalanceWhenAmountIsValidAndFundsAreAvailable() {
        Account account = new Account(1L, "user-1", Currency.EUR, new BigDecimal("100.00"));

        account.debit(new BigDecimal("40.25"));

        assertEquals(new BigDecimal("59.75"), account.getBalance());
    }

    @Test
    void shouldRejectNegativeOrZeroAmounts() {
        Account account = new Account(1L, "user-1", Currency.EUR, new BigDecimal("100.00"));

        assertThrows(IllegalArgumentException.class, () -> account.credit(BigDecimal.ZERO));
        assertThrows(IllegalArgumentException.class, () -> account.debit(new BigDecimal("-1.00")));
    }

    @Test
    void shouldThrowWhenBalanceIsLowerThanDebitAmount() {
        Account account = new Account(1L, "user-1", Currency.EUR, new BigDecimal("50.00"));

        InsufficientFundsException exception = assertThrows(
                InsufficientFundsException.class,
                () -> account.debit(new BigDecimal("75.00")));

        assertEquals("Insufficient funds for debit operation on account 1", exception.getMessage());
    }
}
