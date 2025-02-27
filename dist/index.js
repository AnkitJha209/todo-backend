"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const express_1 = __importDefault(require("express"));
const client = new client_1.PrismaClient();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.JWT_SECRET);
// async function createUser(){
// await client.user.create({
//     data: {
//         username: "Ankitjha",
//         password: "jhaankit209.",
//         age: 21,
//         city: 'Delhi'
//     }
// })
// await client.user.delete({
//     where: {
//          id: 1
//     }
// })
// const user = await client.user.findFirst({
//     where: {
//          id: 1
//     },
//     // if u want sepcific details for any row
//     // then u can use select
//     select:{
//         username: true,
//         password: true,
//         // now it will only provide the username and password of the user
//     }
// })
// await client.user.update({
//     where: {
//          id: 1
//     },
//    data: {
//     username: "ankitjha209."
//    }
// })
// console.log(user)
// }
// createUser();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, age, city } = req.body;
        if (!username || !password || !age || !city) {
            res.status(404).json({
                success: false,
                message: "All the things are mandatory"
            });
            return;
        }
        const userExist = yield client.user.findFirst({
            where: {
                username
            }
        });
        if (userExist) {
            res.status(401).json({
                success: false,
                message: "User already exist"
            });
            return;
        }
        const hashPass = yield argon2_1.default.hash(password);
        const response = yield client.user.create({
            data: {
                username,
                password: hashPass,
                age,
                city
            }
        });
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            response
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(404).json({
                success: false,
                message: "All the things are mandatory"
            });
            return;
        }
        const userExist = yield client.user.findFirst({
            where: {
                username
            }
        });
        if (!userExist) {
            res.status(401).json({
                success: false,
                message: "User does not exist"
            });
            return;
        }
        const dbPass = userExist === null || userExist === void 0 ? void 0 : userExist.password;
        if (yield argon2_1.default.verify(password, dbPass)) {
            const payload = {
                id: userExist.id
            };
            // jwt.sign(payload, process.env.JWT_SECRET)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}));
app.listen(3000, () => {
    console.log(`Server running on Port: 3000`);
});
