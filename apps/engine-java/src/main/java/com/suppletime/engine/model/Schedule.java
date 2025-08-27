package com.suppletime.engine.model;

import java.util.List;

public record Schedule(
    String userId,
    String date,
    List<DoseSlot> slots,
    List<String> warnings
) {}
