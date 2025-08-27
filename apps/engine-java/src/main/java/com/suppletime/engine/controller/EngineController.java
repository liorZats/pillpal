package com.suppletime.engine.controller;

import com.suppletime.engine.model.GenerateScheduleRequest;
import com.suppletime.engine.model.Schedule;
import com.suppletime.engine.service.ScheduleEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/engine")
public class EngineController {
    private final ScheduleEngine scheduleEngine;

    @Autowired
    public EngineController(ScheduleEngine scheduleEngine) {
        this.scheduleEngine = scheduleEngine;
    }

    @PostMapping("/schedule")
    public Schedule generateSchedule(@Valid @RequestBody GenerateScheduleRequest request) {
        return scheduleEngine.generateSchedule(request);
    }
}
