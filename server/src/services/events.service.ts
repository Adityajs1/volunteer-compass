import { PrismaClient, EventStatus, Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { findNearbyEvents } from './geo.service';

const prisma = new PrismaClient();

export const getAllEvents = async (filters: any) => {
  const { status, city, categoryId, lat, lng, radiusKm = 50, skip = 0, take = 20 } = filters;
  
  if (lat && lng) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseFloat(radiusKm);
    
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      return await findNearbyEvents(latNum, lngNum, radiusNum, Number(take));
    }
  }

  const where: Prisma.EventWhereInput = {};
  if (status) where.status = status as EventStatus;
  else where.status = EventStatus.PUBLISHED; // default view
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (categoryId) {
    where.categories = { some: { categoryId: categoryId } };
  }

  const events = await prisma.event.findMany({
    where,
    skip: Number(skip),
    take: Number(take),
    orderBy: { startDate: 'asc' },
    include: {
      organizer: { select: { id: true, name: true, avatarUrl: true } },
      categories: { include: { category: true } },
      skills: { include: { skill: true } },
      _count: { select: { rsvps: true } }
    }
  });

  const total = await prisma.event.count({ where });

  return { events, total };
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, name: true, avatarUrl: true, bio: true } },
      categories: { include: { category: true } },
      skills: { include: { skill: true } }
    }
  });

  if (!event) throw new ApiError(404, 'Event not found');
  return event;
};

export const createEvent = async (organizerId: string, eventData: any) => {
  const { skills, categories, startDate, endDate, ...restData } = eventData;
  
  const event = await prisma.event.create({
    data: {
      ...restData,
      organizerId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: EventStatus.PUBLISHED,
    }
  });

  if (categories && categories.length > 0) {
    await prisma.eventCategory.createMany({
      data: categories.map((c: string) => ({ eventId: event.id, categoryId: c }))
    });
  }

  if (skills && skills.length > 0) {
    const skillRecords = await Promise.all(
      skills.map(async (skillName: string) => {
        return await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName }
        });
      })
    );

    await prisma.eventSkill.createMany({
      data: skillRecords.map(s => ({ eventId: event.id, skillId: s.id }))
    });
  }

  return getEventById(event.id);
};

export const updateEvent = async (id: string, organizerId: string, updateData: any) => {
  const existingEvent = await prisma.event.findUnique({ where: { id } });
  
  if (!existingEvent) throw new ApiError(404, 'Event not found');
  if (existingEvent.organizerId !== organizerId) throw new ApiError(403, 'Not authorized to edit this event');

  const { skills, categories, startDate, endDate, ...restData } = updateData;

  const dataToUpdate: any = { ...restData };
  if (startDate) dataToUpdate.startDate = new Date(startDate);
  if (endDate) dataToUpdate.endDate = new Date(endDate);

  await prisma.event.update({
    where: { id },
    data: dataToUpdate
  });

  // Sync categories if provided
  if (categories) {
    await prisma.eventCategory.deleteMany({ where: { eventId: id } });
    if (categories.length > 0) {
      await prisma.eventCategory.createMany({
        data: categories.map((c: string) => ({ eventId: id, categoryId: c }))
      });
    }
  }

  // Sync skills if provided
  if (skills) {
    await prisma.eventSkill.deleteMany({ where: { eventId: id } });
    if (skills.length > 0) {
      const skillRecords = await Promise.all(
        skills.map(async (skillName: string) => {
          return await prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName }
          });
        })
      );

      await prisma.eventSkill.createMany({
        data: skillRecords.map(s => ({ eventId: id, skillId: s.id }))
      });
    }
  }

  return getEventById(id);
};

export const deleteEvent = async (id: string, organizerId: string) => {
  const existingEvent = await prisma.event.findUnique({ where: { id } });
  
  if (!existingEvent) throw new ApiError(404, 'Event not found');
  // Allow admins or the owner to delete
  if (existingEvent.organizerId !== organizerId) {
    // Optionally check if user is Admin, but we'll enforce that at the route layer.
    throw new ApiError(403, 'Not authorized to delete this event');
  }

  await prisma.event.delete({ where: { id } });
  return true;
};

export const searchNearbyEvents = async (lat: number, lng: number, radiusKm: number, limit: number) => {
  return await findNearbyEvents(lat, lng, radiusKm, limit);
};

