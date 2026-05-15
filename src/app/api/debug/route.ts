import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as PrismaPkg from '@prisma/client';

export async function GET() {
  return NextResponse.json({
    prismaType: typeof prisma,
    prismaIsObject: prisma && typeof prisma === 'object',
    userType: typeof (prisma as unknown as { user?: unknown }).user,
    userIsTruthy: !!(prisma as unknown as { user?: unknown }).user,
    upsertType: typeof (prisma as unknown as { user?: { upsert?: unknown } }).user?.upsert,
    pkgKeys: Object.keys(PrismaPkg).slice(0, 25),
    pkgPrismaClientType: typeof (PrismaPkg as unknown as { PrismaClient?: unknown }).PrismaClient,
    constructorName: prisma?.constructor?.name,
    ownKeys: Object.getOwnPropertyNames(prisma).slice(0, 30),
  });
}
