package com.suppletime.engine.model;

public record ScheduleItem(
    String supplementId,
    Dose dose,
    String note
) {}
