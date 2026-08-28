import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 requires this file for CLI commands (migrate, studio, db seed) —
// the legacy package.json "prisma": { "seed": ... } field no longer works.
// Prisma 7 also stopped auto-loading .env, hence the explicit import above.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
