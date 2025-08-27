import { useState } from 'react';
import { GenerateScheduleRequest, Schedule } from '@suppletime/shared-types';
import axios from 'axios';
import { SupplementForm } from '../components/SupplementForm';
import { ScheduleTimeline } from '../components/ScheduleTimeline';

export default function Home() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const handleSubmit = async (request: GenerateScheduleRequest) => {
    try {
      const response = await axios.post<{ schedule: Schedule }>(
        '/api/schedule/generate',
        request
      );
      setSchedule(response.data.schedule);
    } catch (error) {
      console.error('Failed to generate schedule:', error);
      // Add error handling UI here
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Supplement Schedule Generator
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <SupplementForm onSubmit={handleSubmit} />
            </div>
            {schedule && (
              <div>
                <ScheduleTimeline schedule={schedule} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
