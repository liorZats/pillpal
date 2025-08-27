import { Schedule } from '@suppletime/shared-types';

type ScheduleTimelineProps = {
  schedule: Schedule;
};

export function ScheduleTimeline({ schedule }: ScheduleTimelineProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
      {schedule.warnings && schedule.warnings.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Warnings</h3>
          <ul className="list-disc list-inside text-sm text-yellow-700">
            {schedule.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-6">
        {schedule.slots
          .sort((a, b) => (a.time < b.time ? -1 : 1))
          .map((slot, slotIndex) => (
            <div
              key={slotIndex}
              className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full"
            >
              <div className="mb-2">
                <span className="text-lg font-medium">{slot.time}</span>
                {slot.withMeal && slot.mealType && (
                  <span className="ml-2 text-sm text-gray-500">
                    with {slot.mealType.toLowerCase()}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {slot.supplements.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div className="font-medium">
                      {item.dose.amount} {item.dose.unit.toLowerCase()}
                    </div>
                    {item.note && (
                      <div className="mt-1 text-sm text-gray-600">{item.note}</div>
                    )}
                  </div>
                ))}
              </div>
              {slot.warnings && slot.warnings.length > 0 && (
                <div className="mt-2 text-sm text-yellow-600">
                  {slot.warnings.map((warning, index) => (
                    <div key={index}>⚠️ {warning}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
