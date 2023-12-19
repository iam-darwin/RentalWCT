import { PrismaClient } from '@prisma/client';

class PrismaSingleton {
  private static instance: PrismaSingleton;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PrismaSingleton {
    if (!PrismaSingleton.instance) {
        console.log("created a new instance 0")
      PrismaSingleton.instance = new PrismaSingleton();
    }
    console.log("sent back the old instane")
    return PrismaSingleton.instance;
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}


const prismaSingletonInstance = PrismaSingleton.getInstance();
export const prisma = prismaSingletonInstance.getPrismaClient();
