import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const databaseURL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

class PrismaSeeder extends PrismaClient {
  private pool: Pool;

  constructor() {
    const pool = new Pool({
      connectionString: databaseURL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.pool = pool;
  }
}

const seeder = new PrismaSeeder();

console.log(databaseURL);

async function main() {
  await seeder.$connect();

  // Seed data here
  await seeder.category.createMany({
    data: [
      { name: 'Alimentação', type: 'SYSTEM' },
      { name: 'Restaurantes', type: 'SYSTEM' },
      { name: 'Transporte', type: 'SYSTEM' },
      { name: 'Combustível', type: 'SYSTEM' },
      { name: 'Saúde', type: 'SYSTEM' },
      { name: 'Farmácia', type: 'SYSTEM' },
      { name: 'Educação', type: 'SYSTEM' },
      { name: 'Lazer', type: 'SYSTEM' },
      { name: 'Viagem', type: 'SYSTEM' },
      { name: 'Assinaturas', type: 'SYSTEM' },
      { name: 'Compras', type: 'SYSTEM' },
      { name: 'Vestuário', type: 'SYSTEM' },
      { name: 'Casa', type: 'SYSTEM' },
      { name: 'Eletrônicos', type: 'SYSTEM' },
      { name: 'Outros', type: 'SYSTEM' },
    ],

    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(() => seeder.$disconnect());
