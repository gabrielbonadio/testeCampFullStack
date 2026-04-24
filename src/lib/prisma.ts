import "dotenv/config";

import { PrismaClient } from "../../generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env["DATABASE_URL"];
if (!url) {
  throw new Error("DATABASE_URL não definido no .env");
}

// Prisma v7 + SQLite: o datasource URL não fica no schema; o client usa driver adapter.
const adapter = new PrismaBetterSqlite3({
  url: url.replace(/^file:/, ""),
});

export const prisma = new PrismaClient({ adapter });

