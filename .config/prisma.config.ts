import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.resolve("src", "database"),
  migrations: {
    path: path.resolve("src", "database", "migrations"),
  },
});
