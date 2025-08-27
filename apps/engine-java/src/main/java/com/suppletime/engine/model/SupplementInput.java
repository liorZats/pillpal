package com.suppletime.engine.model;

import java.util.List;

public record SupplementInput(
    String id,
    String name,
    List<Dose> dailyDoses,
    Boolean withFood,
    String timing,
    String notes
) {}
