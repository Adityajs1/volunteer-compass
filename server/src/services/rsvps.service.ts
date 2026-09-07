import { PrismaClient, RsvpStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export const getUserRsvps = async (userId: string) => {
  return await prisma.rsvp.findMany({
    where: { userId },
    include: {
      event: {
        select: { id: true, title: true, startDate: true, endDate: true, status: true, city: true, organizer: { select: { id: true, name: true, isVerified: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getMyHours = async (userId: string) => {
  return await prisma.rsvp.findMany({
    where: { userId, checkedIn: true },
    include: {
      event: {
        select: { id: true, title: true, startDate: true, endDate: true, organizer: { select: { id: true, name: true, isVerified: true } } }
      }
    },
    orderBy: { checkedInAt: 'desc' }
  });
};

export const checkInRsvp = async (rsvpId: string, organizerId: string) => {
  const rsvp = await prisma.rsvp.findUnique({
    where: { id: rsvpId },
    include: { event: true }
  });

  if (!rsvp) throw new ApiError(404, 'RSVP not found');
  if (rsvp.event.organizerId !== organizerId) {
    throw new ApiError(403, 'Not authorized to check-in volunteers for this event');
  }

  // Calculate hours based on event duration
  const startMs = rsvp.event.startDate.getTime();
  const endMs = rsvp.event.endDate.getTime();
  const hoursVolunteered = Math.max(0, (endMs - startMs) / (1000 * 60 * 60));

  return await prisma.rsvp.update({
    where: { id: rsvpId },
    data: {
      checkedIn: true,
      checkedInAt: new Date(),
      hoursVolunteered,
      status: 'CONFIRMED',
    },
    include: {
      event: { select: { id: true, title: true, startDate: true, endDate: true } },
      user: { select: { id: true, name: true, email: true } }
    }
  });
};

export const createRsvp = async (userId: string, eventId: string, note?: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new ApiError(404, 'Event not found');

  const existing = await prisma.rsvp.findUnique({
    where: { userId_eventId: { userId, eventId } }
  });

  if (existing) throw new ApiError(400, 'Already RSVPd to this event');

  return await prisma.rsvp.create({
    data: {
      userId,
      eventId,
      note,
      status: RsvpStatus.PENDING
    },
    include: { event: true }
  });
};

export const updateRsvpStatus = async (rsvpId: string, organizerId: string, status: RsvpStatus) => {
  const rsvp = await prisma.rsvp.findUnique({
    where: { id: rsvpId },
    include: { event: true }
  });

  if (!rsvp) throw new ApiError(404, 'RSVP not found');
  if (rsvp.event.organizerId !== organizerId) {
    throw new ApiError(403, 'Not authorized to modify this RSVP');
  }

  return await prisma.rsvp.update({
    where: { id: rsvpId },
    data: { status }
  });
};
