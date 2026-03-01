import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z
    .string()
    .min(1)
    .transform((v) => parseInt(v, 10)),
  POSTGRES_DB: z.string().min(1),

  APP_PORT: z
    .string()
    .default('3000')
    .transform((v) => parseInt(v, 10)),
  APP_ENVIRONMENT: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  APP_JWT_SECRET: z.string().min(1),
  APP_JWT_EXPIRES_IN: z.string().default('1h'),
  APP_JWT_REFRESH_SECRET: z.string().min(1),
  APP_JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  GEMINI_API_KEY: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

let env: Env;
let databaseURL: string;

envSchema
  .parseAsync(process.env)
  .then((parsedEnv) => {
    env = parsedEnv;
    databaseURL = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
  })
  .catch((e) => {
    console.error('❌ Variáveis de ambiente inválidas:', e);
    process.exit(1);
  });

export { env, databaseURL };
