import { events as staticEvents } from '@/data/events';
import { getApprovedEvents } from '@/lib/db';
import Hero from '@/components/Hero';
import EventList from '@/components/EventList';
import { Event } from '@/lib/types';

export default async function Home() {
  const dbEvents: Event[] = await getApprovedEvents();
  const allEvents = [...staticEvents, ...dbEvents];

  return (
    <div>
      <Hero />
      <EventList events={allEvents} />
    </div>
  );
}
