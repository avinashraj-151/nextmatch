import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

export default prisma
