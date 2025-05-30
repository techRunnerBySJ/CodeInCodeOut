import pkg from '../generated/prisma/index.js';
const {PrismaClient} = pkg;
import {Prisma} from '@prisma/client';

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
}

export const dbErrorHandler = (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new Error('Unique constraint failed');
    }
  }
};