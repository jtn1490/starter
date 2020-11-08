import express from 'express';
import { Server } from './Server';

const app = express();
const server = new Server(app);

server.start();