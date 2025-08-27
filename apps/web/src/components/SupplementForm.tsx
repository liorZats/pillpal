import { useState } from 'react';
import { GenerateScheduleRequest, SupplementInput, MealType } from '@suppletime/shared-types';

type SupplementFormProps = {
  onSubmit: (request: GenerateScheduleRequest) => void;
};

export function SupplementForm({ onSubmit }: SupplementFormProps) {
  const [supplements, setSupplements] = useState<SupplementInput[]>([]);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [meals, setMeals] = useState([
    { type: 'BREAKFAST' as MealType, time: '08:00' },
    { type: 'LUNCH' as MealType, time: '13:00' },
    { type: 'DINNER' as MealType, time: '19:00' },
  ]);

  const handleAddSupplement = (supplement: SupplementInput) => {
    setSupplements([...supplements, supplement]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      supplements,
      profile: {
        wakeTime,
        sleepTime,
        meals,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wake Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sleep Time
            </label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Meals</h2>
        {meals.map((meal, index) => (
          <div key={meal.type} className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {meal.type}
              </label>
            </div>
            <div>
              <input
                type="time"
                value={meal.time}
                onChange={(e) =>
                  setMeals(
                    meals.map((m, i) =>
                      i === index ? { ...m, time: e.target.value } : m
                    )
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Supplements</h2>
        <button
          type="button"
          onClick={() =>
            handleAddSupplement({
              id: `supplement-${supplements.length + 1}`,
              name: 'New Supplement',
              dailyDoses: [{ amount: 0, unit: 'MG' }],
            })
          }
          className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Supplement
        </button>
        {supplements.map((supplement, index) => (
          <div key={supplement.id} className="mb-4 p-4 border rounded">
            <input
              type="text"
              value={supplement.name}
              onChange={(e) =>
                setSupplements(
                  supplements.map((s, i) =>
                    i === index ? { ...s, name: e.target.value } : s
                  )
                )
              }
              className="block w-full mb-2 rounded-md border-gray-300 shadow-sm"
              placeholder="Supplement name"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={supplement.dailyDoses[0].amount}
                onChange={(e) =>
                  setSupplements(
                    supplements.map((s, i) =>
                      i === index
                        ? {
                            ...s,
                            dailyDoses: [
                              { ...s.dailyDoses[0], amount: Number(e.target.value) },
                            ],
                          }
                        : s
                    )
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Amount"
              />
              <select
                value={supplement.dailyDoses[0].unit}
                onChange={(e) =>
                  setSupplements(
                    supplements.map((s, i) =>
                      i === index
                        ? {
                            ...s,
                            dailyDoses: [
                              { ...s.dailyDoses[0], unit: e.target.value as any },
                            ],
                          }
                        : s
                    )
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="MG">mg</option>
                <option value="MCG">mcg</option>
                <option value="G">g</option>
                <option value="IU">IU</option>
                <option value="ML">ml</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Generate Schedule
        </button>
      </div>
    </form>
  );
}
