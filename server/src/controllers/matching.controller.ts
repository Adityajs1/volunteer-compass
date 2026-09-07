import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import * as matchingService from '../services/matching.service';

export const listMatches = asyncHandler(async (req: AuthRequest, res: Response) => {
  const matches = await matchingService.getUserMatches(req.user!.id);
  
  res.status(200).json({
    success: true,
    message: 'Matches fetched successfully',
    data: matches
  });
});

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, message: 'Status is required' });
    return;
  }

  const match = await matchingService.updateMatchStatus(req.params.id, req.user!.id, status);

  res.status(200).json({
    success: true,
    message: 'Match status updated successfully',
    data: match
  });
});
