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

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),

  GEMINI_API_KEY: z.string().min(1),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),

  FRONTEND_URL: z.string().min(1),

  PASSWORD_RESET_TOKEN_EXPIRES: z.string().default('10min'),
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
