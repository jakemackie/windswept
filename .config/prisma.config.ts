import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.resolve("prisma"),
  migrations: {
    path: path.resolve("prisma", "migrations"),
  },
});
