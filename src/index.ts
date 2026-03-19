import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config({
  path: './environments/.env',
});
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

createServer(port);
