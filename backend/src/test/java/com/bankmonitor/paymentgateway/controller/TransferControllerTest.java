package com.bankmonitor.paymentgateway.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.bankmonitor.paymentgateway.domain.Account;
import com.bankmonitor.paymentgateway.domain.Currency;
import com.bankmonitor.paymentgateway.domain.TransferStatus;
import com.bankmonitor.paymentgateway.delivery.IdempotencyKeyInterceptor;
import com.bankmonitor.paymentgateway.service.AccountQueryService;
import com.bankmonitor.paymentgateway.service.IdempotencyService;
import com.bankmonitor.paymentgateway.service.TransactionQueryService;
import com.bankmonitor.paymentgateway.service.TransferService;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TransferController.class)
@Import({com.bankmonitor.paymentgateway.config.WebMvcConfig.class, IdempotencyKeyInterceptor.class})
class TransferControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransferService transferService;

    @MockBean
    private AccountQueryService accountQueryService;

    @MockBean
    private TransactionQueryService transactionQueryService;

    @MockBean
    private IdempotencyService idempotencyService;

    @Test
    void shouldRejectMissingIdempotencyKey() throws Exception {
        mockMvc.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload()))
                .andExpect(status().isBadRequest());

        verify(transferService, never()).processTransfer(any(), any());
    }

    @Test
    void shouldRejectNegativeAmountAtTheWebBoundary() throws Exception {
        when(idempotencyService.find("key-1")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/transfers")
                        .header(TransferController.IDEMPOTENCY_KEY_HEADER, "key-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"fromAccountId":1,"toAccountId":2,"amount":-1,"currency":"EUR"}
                                """))
                .andExpect(status().isBadRequest());

        verify(transferService, never()).processTransfer(any(), any());
        verify(idempotencyService, never()).markProcessing(any());
    }

    @Test
    void shouldRejectProcessingIdempotencyKeyBeforeBusinessService() throws Exception {
        when(idempotencyService.find("key-processing"))
                .thenReturn(Optional.of(new IdempotencyService.IdempotencyRecord(
                        IdempotencyService.IdempotencyRecord.Status.PROCESSING, null)));

        mockMvc.perform(post("/api/transfers")
                        .header(TransferController.IDEMPOTENCY_KEY_HEADER, "key-processing")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload()))
                .andExpect(status().isConflict());

        verify(transferService, never()).processTransfer(any(), any());
    }

    @Test
    void shouldReturnCachedSuccessWithoutCallingBusinessService() throws Exception {
        TransferResponse cached = new TransferResponse(
                10L, 1L, 2L, new BigDecimal("10.00"), new BigDecimal("3950.00"),
                Currency.EUR, Currency.HUF, new BigDecimal("395"),
                TransferStatus.COMPLETED, OffsetDateTime.parse("2026-01-01T12:00:00Z"));
        when(idempotencyService.find("key-success"))
                .thenReturn(Optional.of(new IdempotencyService.IdempotencyRecord(
                        IdempotencyService.IdempotencyRecord.Status.SUCCESS, cached)));

        mockMvc.perform(post("/api/transfers")
                        .header(TransferController.IDEMPOTENCY_KEY_HEADER, "key-success")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload()))
                .andExpect(status().isCreated())
                .andExpect(content().json("""
                        {"id":10,"fromAccountId":1,"toAccountId":2,"amount":10.00,
                         "convertedAmount":3950.00,"currency":"EUR","targetCurrency":"HUF",
                         "exchangeRate":395,"status":"COMPLETED"}
                        """));

        verify(transferService, never()).processTransfer(any(), any());
        verify(idempotencyService, never()).markProcessing(any());
    }

    @Test
    void shouldDelegateValidTransferAfterBoundaryValidation() throws Exception {
        TransferResponse response = new TransferResponse(
                11L, 1L, 2L, new BigDecimal("10.00"), new BigDecimal("10.00"),
                Currency.EUR, Currency.EUR, BigDecimal.ONE,
                TransferStatus.COMPLETED, OffsetDateTime.parse("2026-01-01T12:00:00Z"));
        when(idempotencyService.find("key-valid")).thenReturn(Optional.empty());
        when(transferService.processTransfer(any(), eq("key-valid"))).thenReturn(response);

        mockMvc.perform(post("/api/transfers")
                        .header(TransferController.IDEMPOTENCY_KEY_HEADER, "key-valid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload()))
                .andExpect(status().isCreated())
                .andExpect(content().json("""{"id":11,"status":"COMPLETED"}"""));

        verify(idempotencyService).markProcessing("key-valid");
        verify(transferService).processTransfer(any(), eq("key-valid"));
    }

    @Test
    void shouldExposeAccountsAndTransactionsThroughTheWebBoundary() throws Exception {
        when(accountQueryService.findAll()).thenReturn(List.of(
                new Account(1L, "user-1", Currency.EUR, new BigDecimal("100.00"))));
        when(transactionQueryService.findPage(2, 10)).thenReturn(List.of());

        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(content().json("""[{"id":1,"userId":"user-1","currency":"EUR","balance":100.00}]"""));

        mockMvc.perform(get("/api/transactions?page=2&limit=10"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(accountQueryService).findAll();
        verify(transactionQueryService).findPage(2, 10);
        verifyNoInteractions(transferService);
    }

    private static String validPayload() {
        return """
                {"fromAccountId":1,"toAccountId":2,"amount":10,"currency":"EUR"}
                """;
    }
}