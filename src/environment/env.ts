import { config } from 'dotenv';

config({ path: `src/.env.${process.env.NODE_ENV || 'dev'}.local` });

export const { PORT, NODE_ENV } = process.env;
