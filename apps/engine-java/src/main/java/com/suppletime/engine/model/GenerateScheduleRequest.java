package com.suppletime.engine.model;

import java.util.List;

public record GenerateScheduleRequest(
    List<SupplementInput> supplements,
    UserProfile profile
) {}
