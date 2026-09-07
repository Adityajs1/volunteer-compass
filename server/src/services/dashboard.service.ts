import { PrismaClient, Role, EventStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (userId: string, role: string) => {
  if (role === Role.ADMIN) {
    const totalUsers = await prisma.user.count();
    const totalEvents = await prisma.event.count();
    const activeEvents = await prisma.event.count({ where: { status: EventStatus.PUBLISHED } });
    const totalMatches = await prisma.match.count();

    return { totalUsers, totalEvents, activeEvents, totalMatches };
  } 
  
  if (role === Role.ORGANIZER) {
    const myEvents = await prisma.event.count({ where: { organizerId: userId } });
    const myActiveEvents = await prisma.event.count({ where: { organizerId: userId, status: EventStatus.PUBLISHED } });
    // Aggregation for total RSVPs on my events
    const rsvpAggregation = await prisma.rsvp.count({
      where: { event: { organizerId: userId } }
    });

    return { totalEvents: myEvents, activeEvents: myActiveEvents, totalRsvps: rsvpAggregation };
  }

  // Base behavior for VOLUNTEER
  const upcomingRsvps = await prisma.rsvp.count({
    where: { 
      userId, 
      event: { startDate: { gte: new Date() } }
    }
  });

  const totalCompletedRsvps = await prisma.rsvp.count({
    where: { 
      userId, 
      checkedIn: true 
    }
  });

  const availableMatches = await prisma.match.count({
    where: { userId, status: 'SUGGESTED' }
  });

  return { upcomingRsvps, totalCompletedRsvps, availableMatches };
};
