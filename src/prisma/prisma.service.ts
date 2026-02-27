import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService;
  private pool: Pool;

  constructor() {
    if (PrismaService.instance) {
      return PrismaService.instance;
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || '',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.pool = pool;
    PrismaService.instance = this;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Prisma connected to the database successfully.');
    } catch (error) {
      console.error('Error connecting to the database with Prisma:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
