import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import * as dashboardService from '../services/dashboard.service';

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await dashboardService.getDashboardStats(req.user!.id, req.user!.role);
  
  res.status(200).json({
    success: true,
    message: 'Dashboard stats fetched successfully',
    data: stats
  });
});
