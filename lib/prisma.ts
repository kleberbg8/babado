import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma2 = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma: PrismaClientSingleton =
  globalForPrisma2.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma2.prisma = prisma
