package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.controller.TransferRequest;
import com.bankmonitor.paymentgateway.controller.TransferResponse;

public interface TransferService {

    TransferResponse processTransfer(TransferRequest request, String idempotencyKey);
}