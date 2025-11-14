import { config } from 'dotenv';

config({ path: `src/.env.${process.env.NODE_ENV || 'example'}` });

export const { PORT, NODE_ENV } = process.env;
