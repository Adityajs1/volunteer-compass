import http from 'http';
import app from './app';
import { env } from './config/env';
import prisma from './config/db';
import redis from './config/redis';
import './config/firebase'; // initialise Firebase Admin on boot
import { initSocket } from './socket';
import { initializeEmailService } from './services/email.service';

const httpServer = http.createServer(app);

// Attach Socket.io
initSocket(httpServer);

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Connect Redis (non-fatal — server runs without it)
    if (env.redis.enabled) {
      try {
        await redis.connect();
      } catch (err) {
        console.warn('⚠️  Redis unavailable — caching and jobs disabled');
      }
    } else {
      console.warn('⚠️  Redis not configured — caching and jobs disabled');
    }

    // Initialize Email
    await initializeEmailService();

    // Start HTTP server
    httpServer.listen(env.port, () => {
      console.log(`\n🚀 Volunteer Compass API`);
      console.log(`   Environment : ${env.nodeEnv}`);
      console.log(`   HTTP server : http://localhost:${env.port}`);
      console.log(`   Health check: http://localhost:${env.port}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful Shutdown 
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  httpServer.close(async () => {
    await prisma.$disconnect();
    try {
      await redis.quit();
    } catch {
      // Redis may not have been connected — safe to ignore
    }
    console.log('✅ Server shut down cleanly');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Log unhandled promise rejections but don't exit — let the server keep running
// (Transient errors from ioredis retries, etc. should not kill the process)
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled rejection (non-fatal):', reason);
});

startServer();
