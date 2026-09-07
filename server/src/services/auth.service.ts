import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  const passwordHash = await bcryptjs.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role || 'VOLUNTEER',
      bio: data.bio || null,
      city: data.city || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      city: true,
      bio: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id);
  return { user, token };
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isPasswordValid = await bcryptjs.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = generateToken(user.id);

  const { passwordHash, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
};

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as any,
  });
};
