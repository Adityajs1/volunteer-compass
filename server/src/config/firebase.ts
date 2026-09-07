import admin from 'firebase-admin';
import { env } from './env';

const isFirebaseConfigured =
  env.firebase.projectId &&
  env.firebase.clientEmail &&
  env.firebase.privateKey &&
  !env.firebase.privateKey.includes('YOUR_PRIVATE_KEY_HERE');

// Only initialize if Firebase credentials are provided and not placeholders
if (isFirebaseConfigured && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });

  console.log('✅ Firebase Admin initialized');
} else if (!admin.apps.length) {
  console.warn(
    '⚠️  Firebase credentials not set — Firebase features will be unavailable'
  );
}

export default admin;
