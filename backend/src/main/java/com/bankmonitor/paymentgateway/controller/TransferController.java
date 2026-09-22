package com.bankmonitor.paymentgateway.controller;

import com.bankmonitor.paymentgateway.service.AccountQueryService;
import com.bankmonitor.paymentgateway.service.IdempotencyService;
import com.bankmonitor.paymentgateway.service.TransactionQueryService;
import com.bankmonitor.paymentgateway.service.TransferService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TransferController {

    public static final String IDEMPOTENCY_KEY_HEADER = "X-Idempotency-Key";

    private final TransferService transferService;
    private final AccountQueryService accountQueryService;
    private final TransactionQueryService transactionQueryService;
    private final IdempotencyService idempotencyService;

    public TransferController(
            TransferService transferService,
            AccountQueryService accountQueryService,
            TransactionQueryService transactionQueryService,
            IdempotencyService idempotencyService) {
        this.transferService = transferService;
        this.accountQueryService = accountQueryService;
        this.transactionQueryService = transactionQueryService;
        this.idempotencyService = idempotencyService;
    }

    @PostMapping("/transfers")
    public ResponseEntity<TransferResponse> createTransfer(
            @Valid @RequestBody TransferRequest request,
            @RequestHeader(IDEMPOTENCY_KEY_HEADER) String idempotencyKey) {
        idempotencyService.markProcessing(idempotencyKey);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transferService.processTransfer(request, idempotencyKey));
    }

    @GetMapping("/accounts")
    public List<AccountResponse> getAccounts() {
        return accountQueryService.findAll().stream().map(AccountResponse::from).toList();
    }

    @GetMapping("/transactions")
    public List<TransactionResponse> getTransactions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return transactionQueryService.findPage(page, limit);
    }
}