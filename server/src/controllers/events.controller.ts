import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import * as eventsService from '../services/events.service';

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const data = await eventsService.getAllEvents(req.query);

  res.status(200).json({
    success: true,
    message: 'Events fetched successfully',
    data
  });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventsService.getEventById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event fetched successfully',
    data: event
  });
});

export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const event = await eventsService.createEvent(req.user!.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
});

export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const event = await eventsService.updateEvent(req.params.id, req.user!.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: event
  });
});

export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  await eventsService.deleteEvent(req.params.id, req.user!.id);

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
    data: null
  });
});
