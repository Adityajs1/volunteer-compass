import Queue from 'bull';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const matchNotifyQueue = new Queue('match-notify', REDIS_URL);

export interface MatchNotifyJobData {
  matchId: string;
}

// Job Processor
matchNotifyQueue.process(async (job) => {
  const { matchId } = job.data as MatchNotifyJobData;
  console.log(`Processing match notification for matchId: ${matchId}`);

  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user: true,
        event: true
      }
    });

    if (!match) {
      throw new Error(`Match ${matchId} not found`);
    }

    // Creating an in-app Notification record
    await prisma.notification.create({
      data: {
        userId: match.userId,
        type: 'MATCH_SUGGESTION',
        title: 'New Volunteer Match!',
        body: `We found a great event for you: ${match.event.title}`,
        metadata: { eventId: match.eventId, matchId: match.id }
      }
    });

    // TODO: Send Email via nodemailer or Push Notification via Firebase depending on user preferences here

    console.log(`Notification successfully created for user ${match.userId}`);
    return { success: true, matchId };

  } catch (error) {
    console.error(`Failed to process match notification (Job ID: ${job.id}):`, error);
    throw error; // Triggers Bull retry logic
  }
});
