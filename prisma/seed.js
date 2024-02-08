// const {PrismaClient} = require("@prisma/client");
import { PrismaClient } from '@prisma/client'
const scrypt = require("../util/scrypt");
const prisma = new PrismaClient();

const main = async () => {
    let salt;
    // 1人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "taro"},
        update: {},
        create: {
            name: "taro",
            password: scrypt.calcHash("yamada", salt),
        }
    });
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });