"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("dotenv/config");
const PORT = Number(process.env["PORT"] ?? 3000);
app_1.app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API rodando em http://localhost:${PORT}`);
});
