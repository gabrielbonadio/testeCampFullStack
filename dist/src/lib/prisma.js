"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const prisma_1 = require("../../generated/prisma");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const url = process.env["DATABASE_URL"];
if (!url) {
    throw new Error("DATABASE_URL não definido no .env");
}
// Prisma v7 + SQLite: o datasource URL não fica no schema; o client usa driver adapter.
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: url.replace(/^file:/, ""),
});
exports.prisma = new prisma_1.PrismaClient({ adapter });
