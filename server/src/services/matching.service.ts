import { PrismaClient, MatchStatus, EventStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { haversineKm } from './geo.service';

const prisma = new PrismaClient();

export const getUserMatches = async (userId: string) => {
  return await prisma.match.findMany({
    where: { userId },
    include: {
      event: {
        select: { id: true, title: true, startDate: true, city: true }
      }
    },
    orderBy: { score: 'desc' }
  });
};

export const updateMatchStatus = async (matchId: string, userId: string, status: MatchStatus) => {
  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) throw new ApiError(404, 'Match not found');
  if (match.userId !== userId) throw new ApiError(403, 'Not authorized to update this match');

  return await prisma.match.update({
    where: { id: matchId },
    data: { status }
  });
};

export const runMatchingForUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true, availability: true }
  });

  if (!user || user.role !== 'VOLUNTEER') return 0;

  const events = await prisma.event.findMany({
    where: { status: EventStatus.PUBLISHED, startDate: { gt: new Date() } },
    include: { skills: true }
  });

  let matchesCreated = 0;

  for (const event of events) {
    let score = 0;
    const reasons: string[] = [];

    // Skill Match (max 0.5)
    if (event.skills.length > 0 && user.skills.length > 0) {
      const userSkillIds = user.skills.map(s => s.skillId);
      const matchedSkills = event.skills.filter(s => userSkillIds.includes(s.skillId));
      if (matchedSkills.length > 0) {
        score += 0.5 * (matchedSkills.length / event.skills.length);
        reasons.push(`${matchedSkills.length} matching skills`);
      }
    } else {
      score += 0.2; // default if no specific skills requested/provided
    }

    // Location Match (max 0.3)
    if (user.latitude && user.longitude && event.latitude && event.longitude) {
      const dist = haversineKm(user.latitude, user.longitude, event.latitude, event.longitude);
      if (dist <= 10) {
        score += 0.3;
        reasons.push('Location match within 10km');
      } else if (dist <= 30) {
        score += 0.15;
        reasons.push('Location match within 30km');
      }
    } else if (event.isVirtual) {
       score += 0.3;
       reasons.push('Virtual event');
    }

    // Availability Match (max 0.2)
    if (user.availability.length > 0) {
      const eventDay = event.startDate.getDay();
      const isAvailable = user.availability.some(a => a.dayOfWeek === eventDay);
      if (isAvailable) {
        score += 0.2;
        reasons.push('Availability match');
      }
    } else {
      score += 0.1;
    }

    if (score >= 0.5) {
       await prisma.match.upsert({
         where: { userId_eventId: { userId, eventId: event.id } },
         update: { score, reasons },
         create: { userId, eventId: event.id, score, reasons, status: MatchStatus.SUGGESTED }
       });
       matchesCreated++;
    }
  }

  return matchesCreated;
};

