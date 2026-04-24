"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_1 = require("./users.service");
const errors_1 = require("../../shared/errors");
class UsersController {
    usersService;
    constructor(usersService = new users_service_1.UsersService()) {
        this.usersService = usersService;
    }
    create = async (req, res) => {
        try {
            const { cpf, rg, name, age, email, login, password } = req.body ?? {};
            if (typeof cpf !== "string" ||
                typeof rg !== "string" ||
                typeof name !== "string" ||
                typeof email !== "string" ||
                typeof login !== "string" ||
                typeof password !== "string") {
                return res.status(400).json({ message: "Campos obrigatórios ausentes" });
            }
            const parsedAge = Number(age);
            if (!Number.isInteger(parsedAge) || parsedAge < 0) {
                return res.status(400).json({ message: "age deve ser um inteiro >= 0" });
            }
            const user = await this.usersService.create({
                cpf,
                rg,
                name,
                age: parsedAge,
                email,
                login,
                password,
            });
            return res.status(201).json(user);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
    update = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(400).json({ message: "id é obrigatório" });
            const body = (req.body ?? {});
            const nextData = {};
            if (typeof body.cpf === "string")
                nextData.cpf = body.cpf;
            if (typeof body.rg === "string")
                nextData.rg = body.rg;
            if (typeof body.name === "string")
                nextData.name = body.name;
            if (typeof body.email === "string")
                nextData.email = body.email;
            if (typeof body.login === "string")
                nextData.login = body.login;
            if (typeof body.password === "string")
                nextData.password = body.password;
            if (body.age !== undefined) {
                const parsedAge = Number(body.age);
                if (!Number.isInteger(parsedAge) || parsedAge < 0) {
                    return res.status(400).json({ message: "age deve ser um inteiro >= 0" });
                }
                nextData.age = parsedAge;
            }
            const user = await this.usersService.update(id, nextData);
            return res.status(200).json(user);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(400).json({ message: "id é obrigatório" });
            const result = await this.usersService.softDelete(id);
            return res.status(200).json(result);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
    list = async (_req, res) => {
        try {
            const users = await this.usersService.list();
            return res.status(200).json(users);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
}
exports.UsersController = UsersController;
