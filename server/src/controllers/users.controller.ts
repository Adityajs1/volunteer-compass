import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import * as usersService from '../services/users.service';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.getUserProfile(req.user!.id);
  
  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: user
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Disallow role elevation via profile update
  const { role, isVerified, email, passwordHash, ...safeUpdateData } = req.body;
  
  const user = await usersService.updateUserProfile(req.user!.id, safeUpdateData);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const data = await usersService.getAllUsers(skip, limit);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data
  });
});
