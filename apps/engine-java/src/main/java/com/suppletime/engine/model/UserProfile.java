package com.suppletime.engine.model;

import java.util.List;

public record UserProfile(
    String wakeTime,
    String sleepTime,
    List<Meal> meals,
    Integer fastingHours,
    List<String> sensitivities,
    List<String> medications
) {}
