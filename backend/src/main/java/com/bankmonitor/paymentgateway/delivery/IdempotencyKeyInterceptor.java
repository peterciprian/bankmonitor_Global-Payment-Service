package com.bankmonitor.paymentgateway.delivery;

import com.bankmonitor.paymentgateway.controller.TransferController;
import com.bankmonitor.paymentgateway.service.IdempotencyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class IdempotencyKeyInterceptor implements HandlerInterceptor {

    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper;

    public IdempotencyKeyInterceptor(IdempotencyService idempotencyService, ObjectMapper objectMapper) {
        this.idempotencyService = idempotencyService;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())
                || !"/api/transfers".equals(request.getRequestURI())) {
            return true;
        }

        String key = request.getHeader(TransferController.IDEMPOTENCY_KEY_HEADER);
        if (key == null || key.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "X-Idempotency-Key is required.");
            return false;
        }

        var record = idempotencyService.find(key.trim());
        if (record.isPresent() && record.get().status()
                == IdempotencyService.IdempotencyRecord.Status.PROCESSING) {
            response.sendError(HttpServletResponse.SC_CONFLICT,
                    "A request with this idempotency key is already processing.");
            return false;
        }

        if (record.isPresent() && record.get().status()
                == IdempotencyService.IdempotencyRecord.Status.SUCCESS) {
            response.setStatus(HttpServletResponse.SC_CREATED);
            response.setContentType("application/json");
            objectMapper.writeValue(response.getWriter(), record.get().cachedResponse());
            return false;
        }

        return true;
    }
}