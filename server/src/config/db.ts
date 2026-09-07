import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Prevent multiple Prisma Client instances in development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.__prisma ||
  new PrismaClient({
    log: env.isDevelopment
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
  });

if (env.isDevelopment) {
  global.__prisma = prisma;
}

export default prisma;
