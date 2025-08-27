package com.suppletime.engine.service;

import com.suppletime.engine.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleEngine {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public Schedule generateSchedule(GenerateScheduleRequest request) {
        List<DoseSlot> slots = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // 1. Sort supplements by timing constraints
        Map<String, SupplementInput> supplementMap = request.supplements().stream()
            .collect(Collectors.toMap(SupplementInput::id, s -> s));

        List<SupplementInput> morningSupplements = request.supplements().stream()
            .filter(s -> "AM".equals(s.timing()))
            .collect(Collectors.toList());

        List<SupplementInput> eveningSupplements = request.supplements().stream()
            .filter(s -> "PM".equals(s.timing()))
            .collect(Collectors.toList());

        List<SupplementInput> flexibleSupplements = request.supplements().stream()
            .filter(s -> s.timing() == null)
            .collect(Collectors.toList());

        // 2. Create slots around meals
        request.profile().meals().forEach(meal -> {
            LocalTime mealTime = LocalTime.parse(meal.time());
            List<SupplementInput> withFoodSupplements = new ArrayList<>();
            
            // Assign supplements that need to be taken with food
            flexibleSupplements.stream()
                .filter(s -> Boolean.TRUE.equals(s.withFood()))
                .forEach(withFoodSupplements::add);

            if ("BREAKFAST".equals(meal.type()) && !morningSupplements.isEmpty()) {
                withFoodSupplements.addAll(morningSupplements);
            } else if ("DINNER".equals(meal.type()) && !eveningSupplements.isEmpty()) {
                withFoodSupplements.addAll(eveningSupplements);
            }

            if (!withFoodSupplements.isEmpty()) {
                slots.add(createDoseSlot(meal.time(), withFoodSupplements, true, meal.type()));
            }

            // Create slots for supplements that need to be taken on empty stomach
            if (!flexibleSupplements.isEmpty()) {
                LocalTime emptyStomachTime = mealTime.minusHours(2);
                List<SupplementInput> emptyStomachSupplements = flexibleSupplements.stream()
                    .filter(s -> Boolean.FALSE.equals(s.withFood()))
                    .collect(Collectors.toList());

                if (!emptyStomachSupplements.isEmpty()) {
                    slots.add(createDoseSlot(
                        emptyStomachTime.format(TIME_FORMATTER),
                        emptyStomachSupplements,
                        false,
                        null
                    ));
                }
            }
        });

        // 3. Add warnings for potential conflicts
        checkForConflicts(slots, warnings);

        return new Schedule(
            null, // userId will be set by the API gateway
            java.time.LocalDate.now().toString(),
            slots,
            warnings
        );
    }

    private DoseSlot createDoseSlot(String time, List<SupplementInput> supplements,
                                  boolean withMeal, String mealType) {
        return new DoseSlot(
            time,
            supplements.stream()
                .map(s -> new ScheduleItem(s.id(), s.dailyDoses().get(0), null))
                .collect(Collectors.toList()),
            withMeal,
            mealType,
            new ArrayList<>()
        );
    }

    private void checkForConflicts(List<DoseSlot> slots, List<String> warnings) {
        // Check for iron and calcium in the same slot
        slots.forEach(slot -> {
            boolean hasIron = slot.supplements().stream()
                .anyMatch(item -> item.supplementId().contains("iron"));
            boolean hasCalcium = slot.supplements().stream()
                .anyMatch(item -> item.supplementId().contains("calcium"));

            if (hasIron && hasCalcium) {
                warnings.add("Iron and calcium supplements should be taken at least 2 hours apart.");
                slot.warnings().add("Contains both iron and calcium - consider separating.");
            }
        });
    }
}
