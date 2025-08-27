import { z } from 'zod';

// Base schemas
export const TimeStringSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)');

export const MealTypeSchema = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);

export const UnitSchema = z.enum(['MG', 'MCG', 'G', 'IU', 'ML']);

// Complex schemas
export const DoseSchema = z.object({
  amount: z.number().positive(),
  unit: UnitSchema,
});

export const MealSchema = z.object({
  type: MealTypeSchema,
  time: TimeStringSchema,
});

export const UserProfileSchema = z.object({
  wakeTime: TimeStringSchema,
  sleepTime: TimeStringSchema,
  meals: z.array(MealSchema),
  fastingHours: z.number().min(0).max(24).optional(),
  sensitivities: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});

export const SupplementInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  dailyDoses: z.array(DoseSchema),
  withFood: z.boolean().optional(),
  timing: z.enum(['AM', 'PM']).optional(),
  notes: z.string().optional(),
});

export const SupplementGuidanceSchema = z.object({
  supplementId: z.string(),
  type: z.enum([
    'WITH_FOOD',
    'EMPTY_STOMACH',
    'MORNING',
    'EVENING',
    'AVOID_CONFLICT',
    'SPACING_REQUIRED',
  ]),
  conflictingSupplements: z.array(z.string()).optional(),
  spacingHours: z.number().optional(),
  reason: z.string(),
});

export const DoseSlotSchema = z.object({
  time: TimeStringSchema,
  supplements: z.array(
    z.object({
      supplementId: z.string(),
      dose: DoseSchema,
      note: z.string().optional(),
    })
  ),
  withMeal: z.boolean(),
  mealType: MealTypeSchema.optional(),
  warnings: z.array(z.string()).optional(),
});

export const ScheduleSchema = z.object({
  userId: z.string().optional(),
  date: z.string(),
  slots: z.array(DoseSlotSchema),
  warnings: z.array(z.string()).optional(),
});

// Request/Response schemas
export const GenerateScheduleRequestSchema = z.object({
  supplements: z.array(SupplementInputSchema),
  profile: UserProfileSchema,
});

export const GenerateScheduleResponseSchema = z.object({
  schedule: ScheduleSchema,
});

// Type exports
export type TimeString = z.infer<typeof TimeStringSchema>;
export type MealType = z.infer<typeof MealTypeSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type Dose = z.infer<typeof DoseSchema>;
export type Meal = z.infer<typeof MealSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type SupplementInput = z.infer<typeof SupplementInputSchema>;
export type SupplementGuidance = z.infer<typeof SupplementGuidanceSchema>;
export type DoseSlot = z.infer<typeof DoseSlotSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type GenerateScheduleRequest = z.infer<typeof GenerateScheduleRequestSchema>;
export type GenerateScheduleResponse = z.infer<typeof GenerateScheduleResponseSchema>;
