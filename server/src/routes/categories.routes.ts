import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json({ success: true, data: categories });
}));

router.get('/skills', asyncHandler(async (_req: Request, res: Response) => {
  const skills = await prisma.skill.findMany();
  res.status(200).json({ success: true, data: skills });
}));

export default router;
