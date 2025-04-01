import { config } from 'dotenv';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Load environment variables from .env file
config({ path: '.env' });

// Mock `import.meta.env` for testing purposes
global.importMetaEnv = {
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:5000', // Mock default URL
};

// Jest does not have `import.meta`, so we define it
global.importMeta = { env: global.importMetaEnv };

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
