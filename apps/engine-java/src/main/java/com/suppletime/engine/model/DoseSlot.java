package com.suppletime.engine.model;

import java.util.List;

public record DoseSlot(
    String time,
    List<ScheduleItem> supplements,
    boolean withMeal,
    String mealType,
    List<String> warnings
) {}
