import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    },
  },
});
