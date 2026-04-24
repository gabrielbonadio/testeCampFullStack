"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("../../generated/prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const url = process.env["DATABASE_URL"];
if (!url) {
    throw new Error("DATABASE_URL não definido no .env");
}
// Prisma v7 + SQLite: o datasource URL não fica no schema; o client usa driver adapter.
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    db: new better_sqlite3_1.default(url.replace(/^file:/, "")),
});
exports.prisma = new client_1.PrismaClient({ adapter });
