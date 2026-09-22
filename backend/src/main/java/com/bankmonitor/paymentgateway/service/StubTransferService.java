package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.controller.TransferRequest;
import com.bankmonitor.paymentgateway.controller.TransferResponse;
import org.springframework.stereotype.Service;

@Service
public class StubTransferService implements TransferService {

    @Override
    public TransferResponse processTransfer(TransferRequest request, String idempotencyKey) {
        throw new UnsupportedOperationException("Transfer business logic is not implemented yet");
    }
}