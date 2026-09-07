import Queue from 'bull';
import { PrismaClient } from '@prisma/client';
import { getNextOccurrences } from '../utils/rrule';

const prisma = new PrismaClient();
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const recurringEventsQueue = new Queue('recurring-events', REDIS_URL);

// Job Processor
recurringEventsQueue.process(async (_job) => {
  console.log('Processing recurring events job...');
  
  try {
    const recurringEvents = await prisma.event.findMany({
      where: {
        isRecurring: true,
        rrule: { not: null },
        status: 'PUBLISHED'
      }
    });

    for (const event of recurringEvents) {
      if (!event.rrule) continue;
      
      // Determine next occurrences using our rrule utility
      const nextDates = getNextOccurrences(event.rrule, event.startDate, 3);
      
      // In a full implementation, you might spawn "child" Events here for the upcoming dates
      // or send reminders to the organizer to update details.
      console.log(`[Recurring] Event ID: ${event.id} ("${event.title}") next occurrences:`, nextDates);
    }
    
    return { success: true, processedCount: recurringEvents.length };
  } catch (error) {
    console.error('Failed to process recurring events:', error);
    throw error; // Let Bull handle the retry logic
  }
});

/**
 * Setup a repeatable cron job to run the recurring events check
 * e.g., every day at midnight.
 */
export const scheduleRecurringEventsJob = async () => {
  await recurringEventsQueue.add(
    {}, 
    { 
      repeat: { cron: '0 0 * * *' }, // Midnight daily
      jobId: 'daily-recurring-events-check'
    }
  );
};
