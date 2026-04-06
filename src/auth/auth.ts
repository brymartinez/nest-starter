import { betterAuth } from 'better-auth';

import { buildAuthConfig } from './auth.config';

export const auth = betterAuth(buildAuthConfig(process.env));
