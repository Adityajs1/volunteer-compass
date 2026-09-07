import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: {
        include: { skill: true }
      },
      availability: true,
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Hide password hash implicitly here, though auth handles login.
  // The schema allows us to just destructure it out.
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserProfile = async (userId: string, updateData: any) => {
  // basic update
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: {
      skills: {
        include: { skill: true }
      },
    }
  });

  const { passwordHash, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const getAllUsers = async (skip = 0, take = 50) => {
  const users = await prisma.user.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      city: true,
      createdAt: true
    }
  });
  
  const total = await prisma.user.count();
  
  return { users, total };
};
